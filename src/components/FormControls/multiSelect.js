import { Select } from 'antd';
import React, { forwardRef } from 'react'

const multiSelect = (props, ref) => {
    const Option = Select.Option;
    let {
        value,
        onChange,
        formItemProps: {
            placeholder = '请输入提示内容',
            options
        } = {},
        ...other
    } = props
    options = typeof options === 'function' ? options() : options

    return (
        <Select
            mode="multiple"
            allowClear
            value={value}
            style={{ width: '100%' }}
            placeholder={placeholder}
            onChange={(e) => { onChange(e) }}
            {...other}
        >
            {options.map(item => (
                <Option
                    value={item.value}
                    key={item.value}
                >{item.label}</Option>
            ))}
        </Select>
    )
}

export default forwardRef(multiSelect);