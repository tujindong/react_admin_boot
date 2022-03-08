import { useRef } from "react";
import { ProTable } from "@/components";
import { Button, Divider, Popconfirm, Dropdown, Menu } from "antd";
import { getAction } from '@/request/manage';
import AddEdit from "./components/addEdit";

const Index = (props) => {
    const addEditRef = useRef();
    const proTableRef = useRef();

    return (
        <>
            <ProTable
                rowKey="id"
                ref={proTableRef}
                title="高级表格"
                description="无需编写额外代码，简单配置即可生成简单的增删改查页面"
                request={() => {
                    return new Promise((resolve, reject) => {
                        getAction("/api/test", {}).then(res => {
                            resolve({
                                data: res.result.records,
                                total: res.result.total
                            })
                        })
                    });
                }}
                columns={[
                    {
                        dataIndex: "name",
                        title: "姓名",
                        type: "input",
                    },
                    {
                        dataIndex: "sex",
                        title: "性别",
                        type: "select",
                        formItemProps: {
                            options: [
                                {
                                    value: false,
                                    label: "女",
                                },
                                {
                                    value: true,
                                    label: "男",
                                },
                            ],
                        },
                    },
                    {
                        dataIndex: "age",
                        title: "年龄",
                        type: "input",
                    },
                    {
                        dataIndex: "birthday",
                        title: "生日",
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
                                        console.log("删除的操作项！");
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
