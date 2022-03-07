import { useRef, useState } from "react";
import { ProTable } from "@/components";
import { Button, Divider, Popconfirm, Dropdown, Menu } from "antd";
import { dynamicMenuData } from "@/router/menu"; //这个是接口返回的
import AddEdit from "./components/addEdit";

const DemoList = (props) => {
    const addEditRef = useRef();
    const proTableRef = useRef();

    return (
        <>
            <ProTable
                ref={proTableRef}
                title="菜单管理"
                request={() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({
                                total: 10,
                                data: dynamicMenuData,
                            });
                        }, 1000);
                    });
                }}
                columns={[
                    {
                        dataIndex: "title",
                        title: "菜单名称",
                    },
                    {
                        dataIndex: "icon",
                        title: "图标",
                    },
                    {
                        dataIndex: "componentPath",
                        title: "组件路径",
                    },
                    {
                        dataIndex: "path",
                        title: "菜单路径",
                    },
                    {
                        dataIndex: "sort",
                        title: "排序",
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
                                                <a onClick={() => { }}>添加下级</a>
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
                rowSelection={{}}
            />
            <AddEdit
                ref={addEditRef}
                dynamicMenuData={dynamicMenuData}
                onOk={() => {
                    proTableRef.current.reload();
                }}
            />
        </>
    );
};
export default DemoList;
