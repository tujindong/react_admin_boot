import React from 'react';
import { Table, Card, Tooltip, message } from 'antd';
import TableForm from './TableForm';
import { isEqual, debounce } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ColumnsSetting from './columnsSetting';
import ExportExcel from 'js-export-excel';
import { ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const Layout = styled.div`
	.mb20 {
		margin-bottom: 20px;
	}
	.table-title {
		color: #555555;
		font-weight: 500;
		font-size: 15px;
		.table-title-description {
			display: inline-block;
			margin-left: 15px;
			cursor: pointer;
		}
	}
	.copyStyle {
		display: inline-block;
		cursor: pointer;
		&:hover {
			.ant-typography-copy {
				visibility: visible !important;
			}
		}
		.ant-typography-copy {
			visibility: hidden !important;
		}
	}
	.table-operation {
		cursor: pointer;
		margin-left: 20px;
		display: inline-block;
	}
	/* 多行文本省略 */
	.tabel-more-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-word;
		white-space: normal;
	}
	.ant-table-thead > tr > th {
		white-space: nowrap;
	}
	.ant-table-row td {
		white-space: nowrap;
	}
	.ant-table-scroll {
		overflow-x: auto;
	}

	tbody {
		/* overflow: hidden !important;
        height: 200px !important;
        background-color: red !important; */
	}
`;

/**
 * @name 标准列表页组件
 *
 * @description 包含 搜素表单 列表分页 工具条  这三部分生成
 * @copyright tujindong
 *
 * ProTable 封装了分页和搜索表单的 table组件
 */
class ProTable extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = debounce(this.fetchData, 30, { leading: true, trailing: false, maxWait: 300 });
    }

    state = {
        // table密度
        density: 'default', // default | middle | small
        tableHeight: window.innerHeight,
        // data
        dataSource: [],
        total: 0,
        loading: false,
        // pagination
        pagination: {
            page: 1,
            page_size: 10
        },
        // rowSelection
        selectedRowKeys: [],
        selectedRows: [],
        // form
        searchFormValue: { FIRST_TIME_LOADING_TAG: true },
        forceUpdate: false
    };

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        this.setState({ tableColumns: this.props.columns });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            !isEqual(prevState.pagination, this.state.pagination) ||
            !isEqual(prevState.searchFormValue, this.state.searchFormValue) ||
            (!isEqual(prevState.forceUpdate, this.state.forceUpdate) && this.state.forceUpdate === true)
        ) {
            this.fetchData();
        }
    }

    //设置初始化选中值
    setInitialSelectionRowKeys = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    //设置分页
    setPagination = (page, page_size) => {
        this.setState({ pagination: { page, page_size } });
    };

    //请求列表数据
    fetchData = async (params = {}) => {
        let { request } = this.props;
        const { searchFormValue, pagination } = this.state;
        // 如果没有request，模拟请求
        if (!request) return;
        this.setState({ loading: true });
        try {
            const data = await request({ ...searchFormValue, ...pagination, ...params });
            // 如果查总条数 小于 page*page_size
            if (data.total < ((pagination.page - 1) * pagination.page_size + 1) && data.total !== 0) {
                this.setState(prevState => {
                    return {
                        pagination: {
                            page: prevState.pagination.page - 1,
                            page_size: prevState.pagination.page_size
                        }
                    }
                }, () => {
                    this.fetchData()
                })
            }
            this.setState({ dataSource: data.data, total: data.total, loading: false, forceUpdate: false });
        } catch (error) {
            console.warn(error);
            message.warn(error.msg);
            this.setState({ dataSource: [], loading: false, forceUpdate: false });
        }
    };

    //设置搜索表单数据
    setSearchFormValues = (values) => {
        this.setState({ searchFormValue: values });
    };

    //重置表格选择
    resetRowSelection = () => {
        this.setState({ selectedRowKeys: [], selectedRows: [] });
    };

    getSearchFormValue = () => {
        const { searchFormValue, pagination } = this.state;
        return { params: { ...searchFormValue, ...pagination }, searchFormValue, pagination };
    };

    reload = () => {
        this.fetchData();
        this.resetRowSelection();
    };

    reset = () => {
        if (this.formRef && this.formRef.reset) {
            this.setState({ forceUpdate: true });
            this.formRef.reset();
            this.resetRowSelection();
        }
    };

    export = (fileName = '导出文件') => {
        //前端文件导出的办法，仅仅导出选中项
        const { selectedRows } = this.state;
        if (!selectedRows.length) {
            message.info('请先选择导出项');
            return;
        }
        const { columns } = this.props;
        const validColumns = columns.filter((item) => !!item.dataIndex);
        const maps = {};
        validColumns.forEach((item) => {
            let key = item.type === 'select' ? `${item.dataIndex}_name` : item.dataIndex;
            maps[key] = item.title;
        });
        const sheetData = selectedRows.map((item) => {
            const newItem = {};
            Object.keys(item).forEach((key) => {
                if (maps[key]) newItem[maps[key]] = item[key];
            });
            return newItem;
        });
        const sheetHeader = sheetData.length ? Object.keys(sheetData[0]).map((item) => item) : [];
        const options = {
            fileName,
            datas: [
                {
                    sheetName: 'sheet',
                    sheetHeader,
                    sheetData
                }
            ]
        };
        const exportExcel = new ExportExcel(options);
        exportExcel.saveExcel();
    };

    import = () => {
        //导入方法 待完善
        console.log('文件导入');
    };

    //列排序以及界面增删显示
    handleColumnsChange = (val) => {
        const { columns } = this.props;
        const tableColumns = [];
        for (let i of columns) {
            for (let j of val) {
                if (i.dataIndex === j) {
                    tableColumns.push(i);
                }
            }
        }
        // /约定/ 此处应该 只有columns最后operate项不可 编辑
        const extraColumns = columns.filter(item => !item.dataIndex);
        this.setState({ tableColumns: [...tableColumns, ...extraColumns] });
    };

    render() {
        // const tableDensityList = [
        // 	{ value: 'default', label: '默认' },
        // 	{ value: 'middle', label: '中等' },
        // 	{ value: 'small', label: '紧凑' }
        // ];
        const {
            pagination,
            total,
            dataSource,
            selectedRowKeys,
            selectedRows,
            loading,
            tableColumns = [],
            density
        } = this.state;
        const {
            title = '高级表格',
            description = '',
            request,
            toolBarRender,
            beforeSearchSubmit = (v) => v,
            rowSelection,
            pagination: tablePaginationConfig,
            rowKey,
            columns,
            columnsSettingDisabled = false,
            density: densityDisabled,
            ...other
        } = this.props;

        const filterColumns = columns.filter((o) => o.type && !o.hideInSearch);

        return (
            <Layout>
                <div className="filter-wrap mb20" hidden={filterColumns.length === 0}>
                    <Card bordered={false}>
                        <TableForm
                            wrappedComponentRef={(ref) => (this.formRef = ref)}
                            onSubmit={(values) => {
                                this.setPagination(1, pagination.page_size);
                                this.resetRowSelection();
                                this.setSearchFormValues(beforeSearchSubmit(values));
                            }}
                            filterForm={filterColumns}
                        />
                    </Card>
                </div>
                <Card bordered={false}>
                    {toolBarRender && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="table-title">
                                <span style={{ fontWeight: 'bold' }}>{title}</span>
                                {description && (
                                    <span className="table-title-description">
                                        <Tooltip placement="right" title={description}>
                                            {/* ant design 3.X版本 */}
                                            {/* <Icon style={{ color: '#666666' }} type="question-circle" theme="filled" /> */}
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    </span>
                                )}
                            </div>
                            {
                                <div style={{ textAlign: 'right' }} className="mb20">
                                    {toolBarRender(this, { selectedRowKeys, selectedRows, dataSource })}
                                    <Tooltip title="刷新">
                                        <div className="table-operation" onClick={() => this.reset()}>
                                            {/* ant design 3.X版本 */}
                                            {/* <Icon type="reload" /> */}
                                            <ReloadOutlined />
                                        </div>
                                    </Tooltip>
                                    {!columnsSettingDisabled && (
                                        <Tooltip title="列设置">
                                            <div className="table-operation">
                                                <ColumnsSetting
                                                    columns={columns}
                                                    columnsChange={this.handleColumnsChange}
                                                />
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            }
                        </div>
                    )}

                    {/* {selectedRowKeys.length > 0 && `已选中${selectedRowKeys.length}项`} */}
                    <Table
                        {...other}
                        size={densityDisabled || density}
                        loading={loading}
                        rowKey={rowKey}
                        dataSource={dataSource}
                        columns={tableColumns.filter((o) => !o.hideInTable).map((o) => {
                            if (!o.render) {
                                if (
                                    o.type === 'select' &&
                                    !o.render &&
                                    o.formItemProps &&
                                    Array.isArray(o.formItemProps.options)
                                ) {
                                    o.render = (text) => {
                                        try {
                                            const target = o.formItemProps.options.find((item) => item.value === text);
                                            return (target ? target.label : text) || '-';
                                        } catch (e) {
                                            return text || '-';
                                        }
                                    };
                                } else {
                                    o.render = (text) => (
                                        <div
                                            onClick={() => {
                                                if (!o.isCopy) return;
                                                let inputDom = document.createElement('input');
                                                document.body.appendChild(inputDom);
                                                inputDom.value = text;
                                                inputDom.select(); // 选中
                                                document.execCommand('copy', false);
                                                inputDom.remove(); //移除
                                                message.success('复制成功');
                                            }}
                                        >
                                            {text || '-'}
                                        </div>
                                    );
                                }
                            }
                            if (o.ellipsis) {
                                o.ellipsis = false;
                                let render = o.render;
                                o.render = (text, record, index) => (
                                    <div className="tabel-more-ellipsis">
                                        <Tooltip placement="topLeft" title={render(text, record, index)}>
                                            {render(text, record, index)}
                                        </Tooltip>
                                    </div>
                                );
                            }
                            return o;
                        })}
                        pagination={{
                            ...tablePaginationConfig,
                            total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            current: pagination.page,
                            pageSize: pagination.page_size,
                            showTotal: (total, range) => `共${total}条`,
                            onChange: (page, page_size) => {
                                this.setPagination(page, page_size);
                            },
                            onShowSizeChange: (current, pageSize) => {
                                this.setPagination(current, pageSize);
                            }
                        }}
                        rowSelection={
                            rowSelection ? (
                                {
                                    selectedRowKeys,
                                    ...rowSelection,
                                    onChange: (selectedRowKeys, selectedRows) => {
                                        if (rowSelection && rowSelection.onChange) {
                                            rowSelection.onChange(selectedRowKeys, selectedRows);
                                        }
                                        this.setState({ selectedRowKeys, selectedRows });
                                    },
                                    getCheckboxProps: (record) => {
                                        if (rowSelection && rowSelection.getCheckboxProps) {
                                            return rowSelection.getCheckboxProps(record, {
                                                selectedRowKeys,
                                                selectedRows,
                                                dataSource
                                            });
                                        }
                                        return undefined;
                                    }
                                }
                            ) : (
                                undefined
                            )
                        }
                    />
                </Card>
            </Layout>
        );
    }
}

ProTable.propTypes = {
    /**
     * @description 表格标题或名称
     */
    title: PropTypes.string,
    /**
     * @description 表格描述
     */
    description: PropTypes.string,
    /**
     * @description 一个获得 dataSource 的方法
     *
     * ```js
     * //类型
     * (params?: {pageSize: number;page: number;[key: string]: any;}) => Promise<RequestData<T>>
     * ```
     */

    request: PropTypes.func.isRequired,
    /**
       * @description 工具条渲染
       * 
       * ```ts
       * toolBarRender?: (
              ref,
              rows: {
              selectedRowKeys?: (string | number)[];
              selectedRows?: T[];
              },
          ) => React.ReactNode[];
       * ```
       */
    toolBarRender: PropTypes.func,

    /**
     * @description 搜索提交前对数据加工
     *
     * ```js
     * //类型
     * (params:T)=>T
     *
     * //例子
     * (values) => ({...values, current: values.page})
     * ```
     */
    beforeSearchSubmit: PropTypes.func,

    /**
     * @description 行选择
     *
     * ```js
     * rowSelection={{}} //开启行选择
     *
     * rowSelection={{onChange: (keys,rows)=> console.log(keys,rows)}} // 获取rows
     * ```
     */
    rowSelection: PropTypes.object,

    /**
     * @description 分页属性
     *
     * ```js
     * // 不是必输的 内部自动控制
     * ```
     */
    pagination: PropTypes.object,

    /**
     * @description record主键  用法与table一致
     */
    rowKey: PropTypes.string,

    /**
     * @description 字段列表   变化比较大
     *
     * ```js
     * // 1. 增加表单生成
     * columns = [{
     *     title: '',
     *
     *     // 输入type 和 dataIndex后就会自动生成表单搜索项
     *     dataIndex: 'school_name',
     *     type: 'input',  // type 可选类型  'input' | 'select'
     *
     *     // 表单属性控制项
     *     initialValue,
     *     formItemProps: {
     *         // select 属性多一个 options
     *         options: {value, object}[]
     *         placeholder: '',
     *         ...
     *     }
     * }]
     *
     * // 2. hideInTable 控制字段是否显示  默认false   true: 隐藏  false: 显示
     * columns=[{
     *     title: '',
     *     hideInTable: boolean | (values: searchFormValue) => boolean
     * }]
     *
     * // 3. hideInSearch 控制表单显示  默认false   true: 隐藏  false: 显示
     * columns=[{
     *     title: '',
     *     hideInSearch:  PropTypes.bool
     * }]
     * ```
     */
    columns: PropTypes.array.isRequired
};

export default ProTable;
