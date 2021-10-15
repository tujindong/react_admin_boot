import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Modal, Form, Radio, Input, TreeSelect } from "antd";
import { pick } from "lodash";

const AddEdit = (props, ref) => {
    const { dynamicMenuData } = props;
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

    const processTreeData = (arr) => {
        const fn = (arr) => {
            arr.forEach((item) => {
                item.value = item.key
                item.children ? fn(item.children) : null
            });
        };
        fn(arr)
    };

    const addEdit = (record) => {
        form.resetFields();
        form.setFieldsValue({ menuType: 0 })
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
            .catch((err) => { });
    };

    const renderFormDom = () => {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 18 },
            },
        };
        const menuTypeList = [
            { value: 0, label: "一级菜单" },
            { value: 1, label: "子菜单" },
        ];
        processTreeData(dynamicMenuData)
        return (
            <Form {...formItemLayout} form={form}>
                <Form.Item label="菜单类型" name="menuType" rules={[]}>
                    <Radio.Group>
                        {menuTypeList.map((item, index) => (
                            <Radio value={item.value} key={index}>
                                {item.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="上级菜单" name="parentKey" rules={[]}>
                    <TreeSelect treeData={dynamicMenuData} placeholder="请选择上级菜单" />
                </Form.Item>
            </Form>
        );
    };

    return (
        <Modal
            width={800}
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
