import { useState, useEffect } from 'react';
import { Table, Form, Card } from 'antd';
import styled from 'styled-components';
import FormControls from '@/components/FormControls';
import { randomUUID } from '@/utils/utils';
const Div = styled.div`
`;

const Index = (props) => {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([
        {
            id: randomUUID(),
            name: ''
        }
    ]);

    useEffect(() => {

    })



    const columns = [
        {
            title: (<div><span style={{ color: 'red' }}>*</span>姓名</div>),
            dataIndex: 'name',
            width: 150,
            render: (text, record, index) => {
                const formItemProps = {
                    placeholder: '请输入姓名',
                    disabled: false
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
    ]

    return (
        <Div>
            <Card size="small" title="携带前端表单校验的多行可编辑表格">
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
        </Div>
    )
}
export default Index;