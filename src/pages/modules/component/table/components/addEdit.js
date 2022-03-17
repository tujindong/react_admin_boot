import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Form, Input, Select } from "antd";
import { pick } from "lodash";
import { postAction, putAction } from '@/request/manage';
import { message } from "antd";

const AddEdit = (props, ref) => {
    const { mapSource } = props;
    const [form] = Form.useForm();
    const { Option } = Select;

    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        add: () => {
            addEdit({ modalType: '新增' });
        },
        edit: (record) => {
            addEdit({ ...record, modalType: '编辑' });
        },
        view: (record) => {
            addEdit({ ...record, modalType: '查看' })
        }
    }));

    const addEdit = (record) => {
        form.resetFields();
        setVisible(true);
        setRecord(record);
        if (JSON.stringify(record) != "{}") initFormData(record);
    };

    const initFormData = (record) => {
        const fieldList = ["no", "title", "description", "status"];
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
                    <Input placeholder="请输入编号" disabled={record.modalType == '查看'} />
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
                    <Input placeholder="请输入名称" disabled={record.modalType == '查看'} />
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
                    <Input placeholder="请输入描述" disabled={record.modalType == '查看'} />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "请选择状态",
                        },
                    ]}
                    initialValue={0}
                >
                    <Select placeholder="请选择状态" disabled={record.modalType == '查看'}>
                        {mapSource.statusMaps.map((item, index) => (
                            <Option key={index} value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        );
    };

    return (
        <Modal
            width={700}
            title={record.modalType}
            visible={visible}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                form.validateFields()
                    .then(async (values) => {
                        const params = { ...record, ...values };
                        setSubmitLoading(true);
                        const action = record?.id ?
                            putAction('/api/table/crud', params) :
                            postAction('/api/table/crud', params)
                        action.then(res => {
                            message.success(res.message);
                            props.onOk && props.onOk();
                            setSubmitLoading(false);
                            setVisible(false);
                        })
                    })
                    .catch((err) => { });
            }}
            okButtonProps={{ loading: submitLoading }}
            onCancel={() => {
                setVisible(false);
            }}
            destroyOnClose
        >
            {renderFormDom()}
        </Modal>
    );
};

export default forwardRef(AddEdit);
