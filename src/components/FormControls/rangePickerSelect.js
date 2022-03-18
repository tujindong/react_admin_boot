import { DatePicker } from 'antd'
import React from 'react'
import moment from 'moment';

const { RangePicker } = DatePicker;

const RangePickerSelect = (props, ref) => {
    const {
        value,
        onChange,
        formItemProps: {
            placeholder = '请输入'
        } = {},
        ...other
    } = props
    const transformTimeToDate = (values) => {
        if (Array.isArray(values) && values.length === 2) {
            return values.map(item => item && moment(item))
        }
        return values
    }


    return (
        <RangePicker
            showTime
            allowClear
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
            placeholder={placeholder}
            value={transformTimeToDate(value)}
            onChange={(e, s) => { onChange(s) }}
            {...other}
        />
    )
}

export default React.forwardRef(RangePickerSelect);