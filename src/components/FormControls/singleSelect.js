import { Select } from 'antd';
import React from 'react'

const SingleSelect = (props, ref) => {
    const Option = Select.Option;
    let {
        value,
        onChange = () => { },
        formItemProps: {
            placeholder = '请选择',
            options = [],
        } = {}
    } = props
    options = typeof options === 'function' ? options() : options
    return (
        <Select
            style={{ width: "100%" }}
            allowClear
            placeholder={placeholder}
            value={value}
            onChange={(e) => { onChange(e) }}
        >
            {options && options.map(item => (<Option value={item.value} key={item.value}>{item.label}</Option>))}
        </Select>
    )
}

export default React.forwardRef(SingleSelect);