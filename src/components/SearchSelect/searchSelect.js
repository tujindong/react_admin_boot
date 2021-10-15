import React, { Component } from "react";
import { Select } from "antd";
import { getAction } from "@/request/manage";
import debounce from "lodash/debounce";
/**
 * 通用远程搜索组件
 * props:
 *  url: 【String】 搜索链接地址
 *  resetField： 【Object】 用于重置请求后字段名称，示例 {value: 'id', label: 'name'}
 *  searchParams: 【String】 select搜索框的搜索字段
 *  initialParams: 【Object】初始化搜索字段
 */
const { Option } = Select;
class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: undefined,
            loading: true,
        };
        this.fetchData = debounce(this.fetchData, 30, { leading: true, trailing: false, maxWait: 300 });
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('prevProps', prevProps, 'prevState', prevState, 'state', this.state)
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    };

    fetchData = (value = "") => {
        const { url = "", resetFields = { value: "id", label: "name" }, searchParams = "name", initialParams = {} } = this.props;
        const params = {
            page: 1,
            page_size: 30,
            ...initialParams
        };
        if (value) params[searchParams] = value;
        getAction(url, params)
            .then((res) => {
                const result = res.data;
                const data = result.map((item) => {
                    return { value: item[resetFields.value], label: item[resetFields.label] };
                });
                this.setState({ data });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    handleSearch = (value) => {
        this.setState({ loading: true });
        this.fetchData(value);
    };

    render() {
        const { value, onChange, placeholder, disabled = false } = this.props;
        const { loading, data } = this.state;
        return (
            <Select
                showSearch
                value={value}
                placeholder={placeholder}
                style={{ width: "100%" }}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={(e) => {
                    onChange(e);
                }}
                loading={loading}
                disabled={disabled}
                notFoundContent={"暂无数据"}
            >
                {data.map((item, index) => (
                    <Option key={index} value={item.value}>
                        {item.label}
                    </Option>
                ))}
            </Select>
        );
    }
}

export default SearchInput;
