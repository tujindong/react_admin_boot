import { Form, Input, Button } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import styled from 'styled-components';
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import md5 from 'md5'
const Div = styled.div`
    padding-top: 200px;
    .form-wrap{
        width: 20%;
        margin: 0 auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 1px;
    }
`
const Login = (props) => {

    //这块先借用隐号平台登录
    const submitFormData = (values) => {
        const customer = "C1";
        const timestamp = (new Date()).getTime();
        const seq = Math.floor(Math.random() * 1000);
        const params = {
            ...values,
            customer,
            seq,
            timestamp,
            digest: md5(`${customer}@${timestamp}@${seq}@E416D0F85DC0CB67C85E070A32D9F0123AFF4762`)
        }
        props.dispatch({
            type: 'GLOBAL/login',
            payload: {
                ...params,
            },
        });
    };

    /**
     * renderParts
     */
    const renderFormDom = () => {
        const [form] = Form.useForm();
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        }
        return (
            <div className="form-wrap">
                <Form
                    {...formItemLayout}
                    form={form}
                    onFinish={submitFormData}
                >
                    <Form.Item
                        label=""
                        name="account"
                        rules={[{ required: true, message: '请输入企业名称!' }]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#cccccc' }} />} placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        label=""
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#cccccc' }} />} placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        label=""
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password prefix={<SafetyCertificateOutlined style={{ color: '#cccccc' }} />} placeholder="请输入密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        )
    }

    return (
        <Div>
            {renderFormDom()}
        </Div>
    )
}

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps)(Login);