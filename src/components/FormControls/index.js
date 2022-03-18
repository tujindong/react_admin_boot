import React from "react";
import SingleInput from "./singleInput"; //单行输入
import SingleSelect from "./singleSelect"; //单项选择
import RangePickerSelect from './rangePickerSelect'; //时间范围选择
import MultiSelect from './multiSelect'; //多项选择
import DatePicker from './datePicker'; //日期选择
import Cascader from './cascader'; //级联选择

const ControlUI = new Map();

ControlUI.set("input", SingleInput);
ControlUI.set("select", SingleSelect);
ControlUI.set("rangePickerSelect", RangePickerSelect);
ControlUI.set("multiSelect", MultiSelect);
ControlUI.set("datePicker", DatePicker);
ControlUI.set("cascader", Cascader);

export default class ControlFactory {
    static getControlComponent(uiCode, args) {
        if (ControlUI.has(uiCode)) {
            return React.createElement(ControlUI.get(uiCode), { ...args });
        } else {
            return (<>开发中</>)
        }
    }
}