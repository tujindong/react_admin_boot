import { useRef } from "react";
import { ProTable } from "@/components";
import { Button, Divider, Popconfirm, Dropdown, Menu, Badge, message } from "antd";
import { getAction, deleteAction } from '@/request/manage';
import AddEdit from "./components/addEdit"; //新增编辑查看 组件
import Recycle from "./components/recycle"; //回收站 组件

const Index = (props) => {
    const addEditRef = useRef();
    const recycleRef = useRef();
    const proTableRef = useRef();
    const statusMaps = [
        {
            value: 0,
            label: "关闭",
            status: 'default'
        },
        {
            value: 1,
            label: "运行中",
            status: 'processing'
        },
        {
            value: 2,
            label: "已上线",
            status: 'success'
        },
        {
            value: 3,
            label: "异常",
            status: 'error'
        },
    ]

    /**
     * render Dom
     */
    const renderListDom = () => {
        return (
            <ProTable
                rowKey="id"
                ref={proTableRef}
                title="CRUD表格"
                description="无需编写额外代码，简单配置即可生成简单的增删改查页面"
                request={(params) => {
                    return new Promise((resolve, reject) => {
                        getAction("/api/table/crud", { ...params }).then(res => {
                            resolve({
                                data: res.result.records,
                                total: res.result.total
                            })
                        })
                    });
                }}
                columns={[
                    {
                        dataIndex: "no",
                        title: "编号",
                        type: "input",
                        width: 100,
                        isCopy: true,
                        formItemProps: {
                            placeholder: "请输入编号搜索"
                        }
                    },
                    {
                        dataIndex: "title",
                        title: "名称",
                        width: 200
                    },
                    {
                        dataIndex: "description",
                        title: "描述",
                        width: 200,
                        ellipsis: true,
                    },
                    {
                        title: '服务调用次数',
                        dataIndex: 'callNo',
                        sorter: true,
                        width: 200,
                        render: text => `${text} 万`,
                    },
                    {
                        dataIndex: "status",
                        title: "状态",
                        width: 100,
                        type: "select",
                        formItemProps: {
                            placeholder: "请选择状态搜索",
                            options: statusMaps,
                        },
                        render: (text) => {
                            const target = statusMaps.find(item => item.value == text)
                            return target ? <Badge status={target.status} text={target.label} /> : '-'
                        }
                    },
                    {
                        title: "操作",
                        width: 100,
                        render: (text, record) => (
                            <div>
                                <a onClick={() => { addEditRef.current.edit(record); }}>
                                    编辑
                                </a>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title={"确认删除该项吗？"}
                                    onConfirm={() => {
                                        deleteAction("/api/table/crud", { id: record.id }).then(res => {
                                            message.success(res.message);
                                            proTableRef.current.reload();
                                        })
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <a style={{ color: "red" }}>删除</a>
                                </Popconfirm>
                                <Divider type="vertical" />
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="1">
                                                <a onClick={() => {
                                                    addEditRef.current.view(record);
                                                }}>查看</a>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                >
                                    <a onClick={(e) => e.preventDefault()}>更多</a>
                                </Dropdown>
                            </div>
                        ),
                    },
                ]}
                toolBarRender={({ selectedRowKeys, selectedRows }) => (
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                addEditRef.current.add();
                            }}
                        >
                            新增
                        </Button>
                        {!!selectedRowKeys.length && (
                            <Popconfirm
                                title={`确认删除选中的${selectedRowKeys.length}项吗？`}
                                onConfirm={() => {
                                    deleteAction("/api/table/batchDelete", { ids: selectedRowKeys.join(",") }).then(res => {
                                        message.success(res.message);
                                        proTableRef.current.reload();
                                    })
                                }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button style={{ marginLeft: '10px' }}>
                                    批量删除
                                </Button>
                            </Popconfirm>
                        )}
                        <Button
                            style={{ marginLeft: '10px' }}
                            onClick={() => {
                                recycleRef.current.show()
                            }}
                        >
                            回收站
                        </Button>
                    </>
                )}
                onChange={(pagination, filters, sorter) => {
                    //排序
                    proTableRef.current.fetchSearchData({
                        sorter: sorter.order ? `${sorter.field}_${sorter.order}` : ''
                    })
                }}
                rowSelection={{}}
            />
        )
    }

    const renderAddEditDom = () => {
        return (
            <AddEdit
                ref={addEditRef}
                mapSource={{ statusMaps }}
                onOk={() => {
                    proTableRef.current.reload();
                }}
            />
        )
    }

    const renderRecycleDom = () => {
        return (
            <Recycle
                ref={recycleRef}
                onOk={() => {
                    proTableRef.current.reload();
                }}
            />
        )
    }

    return (
        <>
            {renderListDom()}
            {renderAddEditDom()}
            {renderRecycleDom()}
        </>
    );
};
export default Index;
