import React, { Component, useRef, useState, useMemo, useEffect } from "react";
import { Select, Spin } from "antd";
import { getAction } from "@/request/manage";
import debounce from "lodash/debounce";
/**
 * 通用远程搜索组件
 * props:
 *  url: 【String】 搜索链接地址
 *  resetFields： 【Object】 用于重置请求后字段名称，示例 {value: 'id', label: 'name'}
 *  searchParams: 【String】 select搜索框的搜索字段
 *  initialParams: 【Object】初始化搜索字段
 */
/**
例子：
{
    title: "企业账户",
    dataIndex: "acc_id",
    width: 150,
    isCopy: true,
    ellipsis: true,
    type: "searchSelect",
    formItemProps: {
        url: "/ajax/v1.0/get_customer/",
        placeholder: "请输入企业账户或名称搜索",
        resetFields: {
            value: "identify",
            label: "acc_name",
        },
        searchParams: "acc_name",
    },
    render: (text, record) => (
        <span>{record.acc_id_name}</span>
    ),
} 
**/
const { Option } = Select;
const SearchInput = props => {
    const {
        url = '',
        initialParams = {},
        value,
        onChange,
        placeholder,
        resetFields = { value: "id", label: "name" },
        searchParams = "name",
        disabled = false,
        onSelect,
        debounceTimeout = 800,
        ...other
    } = props

    const fetchRef = useRef(0);

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getOptionData(value)
    }, [])

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            getOptionData(value)
        };
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout]);

    const getOptionData = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        const params = {
            page: 1,
            page_size: 20,
            ...initialParams
        };
        if (value) params[searchParams] = value;
        getAction(url, params).then((res) => {
            const result = res.data;
            const data = result.map((item) => {
                return {
                    ...item,
                    value: item[resetFields.value],
                    label: item[resetFields.label],
                };
            });
            if (fetchId !== fetchRef.current) {
                return;
            }
            setOptions(data);
        }).finally(() => {
            setFetching(false);
        });
    }

    return (
        <Select
            showSearch
            value={value}
            placeholder={placeholder}
            style={{ width: "100%" }}
            filterOption={false}
            onSearch={debounceFetcher}
            onChange={(e) => {
                onChange && onChange(e);
            }}
            onSelect={(e, v) => {
                onSelect && onSelect(v)
            }}
            loading={fetching}
            disabled={disabled}
            notFoundContent={"暂无数据"}
            {...other}
        >
            {options.map((item, index) => (
                <Option key={index} value={item.value} data_source={item}>
                    {item.label}
                </Option>
            ))}
        </Select>
    );
}

export default SearchInput;
