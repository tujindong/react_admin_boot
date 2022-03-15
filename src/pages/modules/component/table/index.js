import { useRef } from "react";
import { ProTable } from "@/components";
import { Button, Divider, Popconfirm, Dropdown, Menu, Badge } from "antd";
import { getAction } from '@/request/manage';
import AddEdit from "./components/addEdit";

const Index = (props) => {
    const addEditRef = useRef();
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

    return (
        <>
            <ProTable
                rowKey="id"
                ref={proTableRef}
                title="高级表格"
                description="无需编写额外代码，简单配置即可生成简单的增删改查页面"
                request={(params) => {
                    return new Promise((resolve, reject) => {
                        getAction("/api/test", { ...params }).then(res => {
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
                        formItemProps: {
                            placeholder: "请输入编号搜索"
                        }
                    },
                    {
                        dataIndex: "title",
                        title: "名称",
                        width: 150,
                        sorter: true
                    },
                    {
                        dataIndex: "description",
                        title: "描述",
                        width: 150,
                    },
                    {
                        dataIndex: "callNo",
                        title: "服务调用次数",
                        width: 100,
                        render: (text) => `${text} 万`,
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
                                <a
                                    onClick={() => {
                                        addEditRef.current.edit(record);
                                    }}
                                >
                                    编辑
                                </a>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title={"确认删除该项吗？"}
                                    onConfirm={() => {
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
                                                <a onClick={() => { }}>查看</a>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <a onClick={() => { }}>指派</a>
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
                toolBarRender={(actions, { selectedRowKeys, selectedRows }) => (
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                addEditRef.current.add();
                            }}
                        >
                            新增
                        </Button>
                    </>
                )}
            />
            <AddEdit
                ref={addEditRef}
                onOk={() => {
                    proTableRef.current.reload();
                }}
            />
        </>
    );
};
export default Index;
