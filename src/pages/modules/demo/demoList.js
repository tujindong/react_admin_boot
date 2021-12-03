import { useRef, useState } from "react";
import ProTable from "@/components/ProTable/ProTable";
import { Button, Divider, Popconfirm, Dropdown, Menu } from "antd";
import AddEdit from "./components/addEdit";

const DemoList = (props) => {
    const addEditRef = useRef();
    const proTableRef = useRef();

    return (
        <>
            <ProTable
                ref={proTableRef}
                title="戏如人森"
                description="不要看我，只是个demo"
                request={() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({
                                total: 10,
                                data: [
                                    {
                                        demo: "demo数据1",
                                        demo1: "demo1",
                                        id: "demo1",
                                        key: "demo1",
                                    },
                                    {
                                        demo: "demo数据2",
                                        demo1: "demo2",
                                        id: "demo2",
                                        key: "demo2",
                                    },
                                ],
                            });
                        }, 1000);
                    });
                }}
                columns={[
                    {
                        dataIndex: "demo",
                        title: "宇宙",
                        type: "input",
                    },
                    {
                        dataIndex: "demo1",
                        title: "世界",
                        type: "select",
                        formItemProps: {
                            options: [
                                {
                                    value: "1111",
                                    label: "demo1",
                                },
                                {
                                    value: "2222",
                                    label: "demo2",
                                },
                            ],
                        },
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
export default DemoList;
