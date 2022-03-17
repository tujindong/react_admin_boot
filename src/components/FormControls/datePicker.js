import React from 'react'
import { DatePicker } from 'antd';

const datePicker = (props, ref) => {
    const { value, onChange, ...other } = props
    return (
        <DatePicker
            style={{ width: '100%' }}
            allowClear={true}
            onChange={(date, dateString) => {
                onChange && onChange(dateString);
            }}
            {...other}
        />
    )
}

export default React.forwardRef(datePicker);