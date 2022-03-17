import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { ProTable } from "@/components";
import { Modal, Divider, Popconfirm, message } from "antd";
import { getAction, postAction, deleteAction } from '@/request/manage';

const Recycle = (props, ref) => {
    const proTableRef = useRef();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => {
            show();
        },
    }));

    const show = () => {
        setVisible(true)
    }

    return (
        <Modal
            width={1000}
            title={"回收站"}
            visible={visible}
            okText="确定"
            cancelText="取消"
            onOk={() => {

            }}
            onCancel={() => {
                setVisible(false);
            }}
            footer={null}
            destroyOnClose
        >
            <ProTable
                rowKey="id"
                ref={proTableRef}
                request={(params) => {
                    return new Promise((resolve, reject) => {
                        getAction("/api/table/crud", { ...params, delFlag: 1 }).then(res => {
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
                        width: 100,
                        isCopy: true,
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
                        width: 200,
                        render: text => `${text} 万`,
                    },
                    {
                        title: "操作",
                        width: 100,
                        render: (text, record) => (
                            <div>
                                <a onClick={() => {
                                    postAction("/api/table/recovery", { id: record.id }).then(res => {
                                        message.success(res.message)
                                        proTableRef.current.reload();
                                        props.onOk && props.onOk();
                                    })
                                }}>
                                    恢复
                                </a>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title={"确认彻底删除该项吗？"}
                                    onConfirm={() => {
                                        deleteAction("/api/table/delete", { id: record.id }).then(res => {
                                            message.success(res.message);
                                            proTableRef.current.reload();
                                        })
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <a style={{ color: "red" }}>彻底删除</a>
                                </Popconfirm>
                            </div>
                        ),
                    },
                ]}
            />
        </Modal>
    )
}

export default forwardRef(Recycle);