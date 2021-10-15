import React, { Component } from 'react';
import { SearchSelect } from "@/components";

class SearchSelectComp extends Component {

    render() {
        const {
            value,
            onChange,
            formItemProps: {
                placeholder = '请输入',
                resetFields = { value: "name", label: "name" },
                searchParams = 'name',
                url = ''
            } = {}
        } = this.props
        return (
            <SearchSelect
                value={value}
                onChange={onChange}
                url={url}
                searchParams={searchParams}
                resetFields={resetFields}
                placeholder={placeholder}
            />
        )
    }

}

export default SearchSelectComp;