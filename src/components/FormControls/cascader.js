import React from 'react'
import { Cascader } from 'antd';

const CascaderIndex = (props, ref) => {
    let {
        value,
        onChange = () => { },
        formItemProps: {
            placeholder = '请选择',
            options = [],
        } = {},
        ...other
    } = props
    return (
        <Cascader
            value={value}
            options={options}
            placeholder={placeholder}
            onChange={(e) => {
                onChange(e)
            }}
            {...other}
        />
    )
}

export default React.forwardRef(CascaderIndex);