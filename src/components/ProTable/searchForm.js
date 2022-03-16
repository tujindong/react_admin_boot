import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Form, Button, Row, Col } from 'antd'
import styled from 'styled-components';
import FilterControl from './filterControl'
const Layout = styled.div`
    height: 100%;
    background: #ffffff;
    .collapse {
        color: #4569d4;
        text-decoration: none;
        transition: opacity .2s;
        outline: none;
        cursor: pointer;
        display: inline-block;
        margin-left: 16px;
    }
    .table-form-anticon{
        margin-left: 0.5em;
        transition: all 0.3s ease 0s;
        transform: rotate(0);
        display: inline-block;
        color: inherit;
        font-style: normal;
        line-height: 0;
        text-align: center;
        text-transform: none;
        vertical-align: -.125em;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }
`;

const collapseNum = 3; // 展开收起的数量
const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 18 },
    },
}
const TableForm = (props, ref) => {

    const { filterForm } = props

    const [isCollapse, setIsCollapse] = useState(true) //  默认 收起

    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        reset: () => { reset() }
    }))

    const submit = () => {
        const values = form.getFieldsValue()
        if (props.onSubmit) {
            props.onSubmit(values)
        }
    }

    const reset = () => {
        form.resetFields()
        submit()
    }

    return (
        <Layout>
            <Form
                onFinish={() => {
                    submit()
                }}
                {...formItemLayout}
                form={form}
            >
                <Row gutter={[24, 24]} type="flex" align="middle">
                    {/* xs sm md lg xl  xxl */}
                    {/* filterForm的长度超过2个，则展开 收起 */}
                    {filterForm.map((item, index) => (
                        (((index + 1) > collapseNum && !isCollapse) || (index + 1) <= collapseNum) && <Col xxl={6} xl={8} md={12} xs={24} key={index}>
                            <Form.Item style={{ width: '100%' }}
                                label={item.formItemProps?.labelTitle || item.title}
                                initialValue={item.initialValue}
                                name={item.key}>
                                {FilterControl.getControlComponent(item.type, { ...item })}
                            </Form.Item>
                        </Col>

                    ))}
                    {filterForm.length > 0 && (
                        <Col xxl={6} xl={8} md={12} xs={24}>
                            <div style={{ marginLeft: '27px', marginBottom: '24px', padding: "0 20px 0 0" }}>
                                <Button htmlType="submit" type="primary" style={{ marginLeft: 8 }}>查询</Button>
                                <Button onClick={() => { reset() }} style={{ marginLeft: 8 }}>重置</Button>
                                {filterForm.length > collapseNum && <div className="collapse" onClick={() => {
                                    setIsCollapse(prvState => !prvState)
                                }}>
                                    {isCollapse ? '展开' : '收起'}
                                    <span className="table-form-anticon">
                                        <svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                                        </svg>
                                    </span>
                                </div>}
                            </div>
                        </Col>
                    )}
                </Row>
            </Form>
        </Layout>
    )
}

export default forwardRef(TableForm)
