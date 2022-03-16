import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef, memo } from "react";
import { Table, Card, Tooltip, message } from "antd";
import SearchForm from "./searchForm";
import PropTypes from "prop-types";
import styled from "styled-components";
import ColumnsSetting from "./columnsSetting";
import ExportExcel from "js-export-excel";
import { isEqual, debounce } from "lodash";
import { ReloadOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const Div = styled.div`
    .filter-wrap{
        margin-bottom: 10px;
        .ant-card-body{
            padding-bottom: 0;
        }
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
        .table-title-selection{
            display: inline-block;
            margin-left: 15px;
            font-size: 14px;
            color: #555555;
            transition: all 0.3s;
            .selection-num{
                display: inline-block;
                color: #ff4d4f;
                margin: 0 2px;
            }
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
`;

/**
 * @name 标准列表页组件
 *
 * @description 包含 搜素表单 列表分页 工具条  这三部分生成
 * @copyright tujindong
 *
 * ProTable 封装了分页和搜索表单的 table组件
 */

const ProTable = forwardRef((props, ref) => {

    //自定义先前状态钩子
    const usePrevState = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        })
        return ref.current;
    }

    const [dataSource, setDataSource] = useState([]);
    const [tableColumns, setTableColumns] = useState(props.columns || []);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageNo: 1, pageSize: 10 });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchFormValue, setSearchFormValue] = useState({});

    const prevPagination = usePrevState(pagination);
    const prevSearchFormValue = usePrevState(searchFormValue);

    const tableFormRef = useRef();

    useImperativeHandle(ref, () => ({
        fetchSearchData: (params) => {
            setSearchFormValue((prevState) => {
                return { ...prevState, ...params }
            })
        },

        reload: () => {
            fetchData();
            resetRowSelection();
        },
    }));

    useEffect(() => {
        // console.log('prevPagination', prevPagination, 'pagination', pagination)
        // console.log('prevSearchFormValue', prevSearchFormValue, 'searchFormValue', searchFormValue)
        if (!isEqual(prevPagination, pagination) || !isEqual(prevSearchFormValue, searchFormValue)) {
            fetchData();
        }
    }, [searchFormValue, pagination]);

    //设置分页
    const setPaginationMethod = (pageNo, pageSize) => {
        setPagination({ pageNo, pageSize });
    };

    //请求列表数据
    const fetchData = debounce(
        async (params = {}) => {
            let { request } = props;
            if (!request) return;
            setLoading(true);
            try {
                const data = await request({
                    ...searchFormValue,
                    ...pagination,
                    ...params,
                });
                // 如果查总条数 小于 pageNo*pageSize
                if (data.total < (pagination.pageNo - 1) * pagination.pageSize + 1 && data.total !== 0) {
                    setPaginationMethod(
                        (prevState) => {
                            return {
                                pagination: {
                                    pageNo: prevState.pagination.pageNo - 1,
                                    pageSize: prevState.pagination.pageSize,
                                },
                            };
                        },
                        () => {
                            fetchData();
                        }
                    );
                }
                setDataSource(data.data);
                setTotal(data.total);
                setLoading(false);
            } catch (error) {
                console.warn(error);
                message.warn(error.msg);
                setDataSource([]);
                setLoading(false);
            }
        },
        30,
        { leading: true, trailing: false, maxWait: 300 }
    );

    //设置搜索表单数据
    const setSearchFormValues = (values) => {
        setSearchFormValue(values);
    };

    //重置表格选择
    const resetRowSelection = () => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    // eslint-disable-next-line
    const getSearchFormValue = () => {
        return {
            params: { ...searchFormValue, ...pagination },
            searchFormValue,
            pagination,
        };
    };

    const reset = () => {
        tableFormRef.current.reset();
        resetRowSelection();
    };

    // eslint-disable-next-line
    const exportFile = (fileName = "导出文件") => {
        //前端文件导出的办法，仅仅导出选中项
        if (!selectedRows.length) {
            message.info("请先选择导出项");
            return;
        }
        const validColumns = columns.filter((item) => !!item.dataIndex);
        const maps = {};
        validColumns.forEach((item) => {
            let key = item.type === "select" ? `${item.dataIndex}_name` : item.dataIndex;
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
                    sheetName: "sheet",
                    sheetHeader,
                    sheetData,
                },
            ],
        };
        const exportExcel = new ExportExcel(options);
        exportExcel.saveExcel();
    };

    // eslint-disable-next-line
    const importFile = () => {
        //导入方法 待完善
        console.log("文件导入");
    };

    //列排序以及界面增删显示
    const handleColumnsChange = (val) => {
        const { columns } = props;
        const tableColumns = [];
        for (let i of columns) {
            for (let j of val) {
                if (i.dataIndex === j) {
                    tableColumns.push(i);
                }
            }
        }
        const extraColumns = columns.filter((item) => !item.dataIndex);
        setTableColumns([...tableColumns, ...extraColumns]);
    };

    const {
        title = "高级表格",
        description = "",
        request,
        toolBarRender,
        beforeSearchSubmit = (v) => v,
        rowSelection,
        pagination: tablePaginationConfig,
        rowKey,
        columns,
        columnsSettingDisabled = false,
        ...other
    } = props;
    const filterColumns = columns.filter((o) => o.type && !o.hideInSearch);

    return (
        <Div>
            <div className="filter-wrap" hidden={filterColumns.length === 0}>
                <Card bordered={false}>
                    <SearchForm
                        ref={tableFormRef}
                        onSubmit={(values) => {
                            setPaginationMethod(1, pagination.pageSize);
                            resetRowSelection();
                            setSearchFormValues(beforeSearchSubmit(values));
                        }}
                        filterForm={filterColumns}
                    />
                </Card>
            </div>
            <Card bordered={false}>
                {toolBarRender && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div className="table-title">
                            <span style={{ fontWeight: "bold" }}>{title}</span>
                            {description && (
                                <span className="table-title-description">
                                    <Tooltip placement="right" title={description}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </span>
                            )}
                            {selectedRowKeys.length > 0 && (
                                <span className="table-title-selection">已选中<span className="selection-num">{selectedRowKeys.length}</span>项</span>
                            )}
                        </div>
                        {
                            <div style={{ textAlign: "right" }} className="mb20">
                                {toolBarRender(this, {
                                    selectedRowKeys,
                                    selectedRows,
                                    dataSource,
                                })}
                                <Tooltip title="刷新">
                                    <div className="table-operation" onClick={() => reset()}>
                                        <ReloadOutlined />
                                    </div>
                                </Tooltip>
                                {!columnsSettingDisabled && (
                                    <Tooltip title="列设置">
                                        <div className="table-operation">
                                            <ColumnsSetting columns={columns} columnsChange={handleColumnsChange} />
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
                        }
                    </div>
                )}

                <Table
                    {...other}
                    size={'default'}
                    loading={loading}
                    rowKey={rowKey}
                    dataSource={dataSource}
                    columns={tableColumns
                        .filter((o) => !o.hideInTable)
                        .map((o) => {
                            if (!o.render) {
                                if (o.type === "select" && !o.render && o.formItemProps && Array.isArray(o.formItemProps.options)) {
                                    o.render = (text) => {
                                        try {
                                            const target = o.formItemProps.options.find((item) => item.value === text);
                                            return (target ? target.label : text) || "-";
                                        } catch (e) {
                                            return text || "-";
                                        }
                                    };
                                } else {
                                    o.render = (text) => (
                                        <div
                                            onClick={() => {
                                                if (!o.isCopy) return;
                                                let inputDom = document.createElement("input");
                                                document.body.appendChild(inputDom);
                                                inputDom.value = text;
                                                inputDom.select(); // 选中
                                                document.execCommand("copy", false);
                                                inputDom.remove(); //移除
                                                message.success("复制成功");
                                            }}
                                        >
                                            {text || "-"}
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
                        current: pagination.pageNo,
                        pageSize: pagination.pageSize,
                        showTotal: (total, range) => `共${total}条`,
                        onChange: (pageNo, pageSize) => {
                            setPaginationMethod(pageNo, pageSize);
                        },
                        onShowSizeChange: (current, pageSize) => {
                            setPaginationMethod(current, pageSize);
                        },
                    }}
                    rowSelection={
                        rowSelection
                            ? {
                                selectedRowKeys,
                                ...rowSelection,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    if (rowSelection && rowSelection.onChange) {
                                        rowSelection.onChange(selectedRowKeys, selectedRows);
                                    }
                                    setSelectedRowKeys(selectedRowKeys);
                                    setSelectedRows(selectedRows);
                                },
                                getCheckboxProps: (record) => {
                                    if (rowSelection && rowSelection.getCheckboxProps) {
                                        return rowSelection.getCheckboxProps(record, {
                                            selectedRowKeys,
                                            selectedRows,
                                            dataSource,
                                        });
                                    }
                                    return undefined;
                                },
                            }
                            : undefined
                    }
                />
            </Card>
        </Div>
    );
});
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
     * (params?: {pageSize: number;pageNo: number;[key: string]: any;}) => Promise<RequestData<T>>
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
     * (values) => ({...values, current: values.pageNo})
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
    columns: PropTypes.array.isRequired,
};

export default memo(ProTable);
