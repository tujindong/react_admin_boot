import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Form, Input } from "antd";
import { pick } from "lodash";

const AddEdit = (props, ref) => {
    const [form] = Form.useForm();

    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        add: () => {
            addEdit({});
        },
        edit: (record) => {
            addEdit(record);
        },
    }));

    const addEdit = (record) => {
        form.resetFields();
        setVisible(true);
        setRecord(record);
        if (JSON.stringify(record) != "{}") initFormData(record);
    };

    const initFormData = (record) => {
        const fieldList = ["no", "title", "description"];
        form.setFieldsValue(pick(record, fieldList));
    };

    const renderFormDom = () => {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 22 },
            },
        };
        return (
            <Form {...formItemLayout} form={form}>
                <Form.Item
                    label="编号"
                    name="no"
                    rules={[
                        {
                            required: true,
                            message: "请输入编号",
                        },
                    ]}
                >
                    <Input placeholder="请输入编号" />
                </Form.Item>
                <Form.Item
                    label="名称"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "请输入名称",
                        },
                    ]}
                >
                    <Input placeholder="请输入名称" />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "请输入描述",
                        },
                    ]}
                >
                    <Input placeholder="请输入描述" />
                </Form.Item>
            </Form>
        );
    };

    return (
        <Modal
            width={700}
            title={`${record?.id ? "编辑" : "新增"}`}
            visible={visible}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                form.validateFields()
                    .then(async (values) => {
                        const params = { ...record, ...values };
                        setSubmitLoading(true);
                        setTimeout(() => {
                            props.onOk && props.onOk();
                            setSubmitLoading(false);
                            setVisible(false);
                        }, 800);
                    })
                    .catch((err) => { });
            }}
            okButtonProps={{ loading: submitLoading }}
            onCancel={() => {
                setVisible(false);
            }}
        >
            {renderFormDom()}
        </Modal>
    );
};

export default forwardRef(AddEdit);
