import React from 'react'
import { Input } from 'antd';

const SingleInput = (props, ref) => {
    const {
        value,
        onChange,
        formItemProps: {
            placeholder = '请输入'
        } = {}
    } = props
    return (
        <Input
            style={{ width: "100%" }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }} />
    )
}

export default React.forwardRef(SingleInput);