import { useState } from 'react';
import { Table, Form, Card, Divider, message, Button, Modal } from 'antd';
import styled from 'styled-components';
import FormControls from '@/components/FormControls';
import { randomUUID } from '@/utils/utils';
const Div = styled.div`
    .ant-form-item-explain{
        position: absolute;
        background: rgba(0,0,0,.65);
        color: #ffffff;
        bottom: 48px;
        left: 50%;
        width: max-content;
        max-width: 250px;
        margin-left: -50px;
        border-radius: 3px;
        line-height: 24px;
        padding: 4px 8px;
        &:after{
            position: absolute;
            display: block;
            content: '';
            border-bottom: 6px solid transparent;
            border-top: 6px solid rgba(0,0,0,.65);
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            left: 50%;
            bottom: -12px;
            margin-left: -3px;
            transition: all 0.3s;
        }
        .ant-form-item-explain-error{
            color: #ffffff;
            font-size: 12px;
            padding: 0;
            margin: 0;
        }
    }
`;

const Index = (props) => {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([
        {
            id: randomUUID(),
            key: randomUUID(),
            name: '',
            gender: undefined,
            birthday: '',

        }
    ]);
    const [visible, setVisible] = useState();

    const handleCellChange = (value, key, dataIndex) => {
        const newDataSource = [...dataSource]
        const target = newDataSource.find(item => item.key === key);
        if (target) {
            target[dataIndex] = value
        }
        setDataSource(newDataSource)
    }

    const handleRowAdd = async (index) => {
        try {
            await form.validateFields();
            const newRow = {
                id: randomUUID(),
                key: randomUUID(),
                name: '',
                gender: undefined,
                birthday: '',
            }
            setDataSource([...dataSource, newRow])
        } catch (errInfo) {
            // console.log('Validate Failed:', errInfo);
        }
    }

    const handleRowRemove = (record) => {
        if (dataSource.length <= 1) {
            message.warning('最后一行，不可以删除了')
            return
        }
        const newDataSource = dataSource.filter(item => item.key !== record.key)
        setDataSource(newDataSource)
    }

    const columns = [
        {
            title: (<div><span style={{ color: 'red' }}>*</span>姓名</div>),
            dataIndex: 'name',
            width: 150,
            render: (text, record) => {
                const formItemProps = {
                    placeholder: '请输入姓名',
                }
                const onChange = (e) => {
                    handleCellChange(e, record.key, 'name')
                }
                return (
                    <Form.Item
                        name={`name^${record.key}`}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: formItemProps.placeholder,
                            },
                        ]}
                        initialValue={text}
                    >
                        {FormControls.getControlComponent("input", { formItemProps, onChange })}
                    </Form.Item>
                )
            }
        },
        {
            title: (<div><span style={{ color: 'red' }}>*</span>性别</div>),
            dataIndex: 'gender',
            width: 150,
            render: (text, record) => {
                const formItemProps = {
                    placeholder: '请输入性别',
                    options: [
                        { value: 'female', label: '女' },
                        { value: 'male', label: '男' },
                    ]
                }
                const onChange = (e) => {
                    handleCellChange(e, record.key, 'gender')
                }
                return (
                    <Form.Item
                        name={`gender^${record.key}`}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: formItemProps.placeholder,
                            },
                        ]}
                        initialValue={text}
                    >
                        {FormControls.getControlComponent("select", { formItemProps, onChange })}
                    </Form.Item>
                )
            }
        },
        {
            title: (<div><span style={{ color: 'red' }}>*</span>出生日期</div>),
            dataIndex: 'birthday',
            width: 150,
            render: (text, record) => {
                const formItemProps = {
                    placeholder: '请选择出生日期',
                }
                const onChange = (e) => {
                    handleCellChange(e, record.key, 'birthday')
                }
                return (
                    <Form.Item
                        name={`birthday^${record.key}`}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: formItemProps.placeholder,
                            },
                        ]}
                        initialValue={text}
                    >
                        {FormControls.getControlComponent("datePicker", { formItemProps, onChange })}
                    </Form.Item>
                )
            }
        },
        {
            title: (<div>地址</div>),
            dataIndex: 'address',
            width: 150,
            render: (text, record) => {
                const formItemProps = {
                    placeholder: '请选择地址',
                    options: [
                        {
                            value: 'anhui',
                            label: '安徽',
                            children: [
                                {
                                    value: 'hefei',
                                    label: '合肥',
                                    children: [
                                        {
                                            value: 'shushan',
                                            label: '蜀山',
                                        },
                                    ],
                                },
                                {
                                    value: 'wuhu',
                                    label: '芜湖',
                                },
                                {
                                    value: 'bengbu',
                                    label: '蚌埠',
                                },
                            ],
                        },
                    ]
                }
                const onChange = (e) => {
                    handleCellChange(e, record.key, 'address')
                }
                return (
                    <Form.Item
                        name={`address^${record.key}`}
                        style={{ margin: 0 }}
                        rules={[]}
                        initialValue={text}
                    >
                        {FormControls.getControlComponent("cascader", { formItemProps, onChange })}
                    </Form.Item>
                )
            }
        },
        {
            title: '操作',
            width: 100,
            dataIndex: 'operation',
            align: 'center',
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <>
                        <a onClick={() => { handleRowAdd(index) }}>
                            添加
                        </a>
                        <Divider type="vertical" />
                        <a style={{ color: 'red' }} onClick={() => { handleRowRemove(record) }}>
                            删除
                        </a>
                    </>
                )
            },
        },
    ]

    return (
        <Div>
            <Card
                size="small"
                title="携带前端表单校验的多行可编辑表格"
                extra={
                    <Button type='link' onClick={() => { setVisible(true) }}>表单数据</Button>
                }
            >
                <Form form={form} component={false}>
                    <Table
                        rowKey="id"
                        size="small"
                        bordered={false}
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </Form>
            </Card>

            <Modal
                title="表单JSON数据"
                visible={visible}
                footer={null}
                onCancel={() => { setVisible(false) }}
            >
                <pre>{JSON.stringify(dataSource, null, 2)}</pre>
            </Modal>
        </Div>
    )
}
export default Index;