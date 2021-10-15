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
        const fieldList = ["user"];
        form.setFieldsValue(pick(record, fieldList));
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                const params = { ...record, ...values };
                setSubmitLoading(true);
                setTimeout(() => {
                    console.log("新增编辑的表单数据", params);
                    props.onOk && props.onOk();
                    setSubmitLoading(false);
                    setVisible(false);
                }, 800);
            })
            .catch((err) => {});
    };

    const renderFormDom = () => {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 18 },
            },
        };
        return (
            <Form {...formItemLayout} form={form}>
                <Form.Item
                    label="username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        );
    };

    return (
        <Modal
            width={500}
            title={`${record?.id ? "编辑" : "新增"}`}
            visible={visible}
            okText="确定"
            cancelText="取消"
            onOk={handleOk}
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
