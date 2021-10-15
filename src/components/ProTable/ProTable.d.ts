import * as React from 'react'
import { TableProps, ColumnProps, TableRowSelection } from 'antd/lib/table/index'
import { InputProps } from 'antd/lib/input/index'
import { SelectProps } from 'antd/lib/select/index'

interface Pagination {
  page: number
  pageSize: number
  offSet: number
}
interface Actions {
  /** 刷新当前页面数据 */
  reload: () => void

  /** 重置整个表单, 并返回第一页 */
  reset: () => void

  /** 获取表单搜索条件 */
  getSearchFormValue: () => { params: searchParams; searchFormValue: { [name: string]: any }; pagination: Pagination }
}
interface Rows<T> {
  selectedRowKeys: string[] | number[]
  selectedRows: T[]
  dataSource: T[]
}
declare type toolBarRenderFn<T> = (actions: Actions, rows: Rows<T>) => React.ReactNode

/** 表单搜索参数 包含了`分页参数`与`表单参数` */
interface searchParams extends Pagination {
  [name: string]: any
}

declare type ColumnType = 'input' | 'select'
interface OptionsProps {
  /** 用于展示`Select.Option`的名字 默认`label`属性名 */
  label?: React.ReactNode

  /** 用于设置`Select.Option`的值 默认`value`属性名 */
  value?: string

  /** 其他属性 */
  [name: string]: any
}

interface formItemPropsType<T> extends InputProps, SelectProps<T> {
  /**
   * `Select`的`options`
   *
   * - 如果数据不是 `{label,value}[]` 结构的 可以填写`labelPropsName`和`valuePropsName`来自适应提供的数组
   */
  options?: OptionsProps[] | (() => OptionsProps[])

  /** 设置`options`中`label`字段的属性名 用于展示`Select.Option`的名字 */
  labelPropsName?: string

  /** 设置`options`中`value`字段的属性名 用于设置`Select.Option`的值 */
  valuePropsName?: string
}
interface ProTableColumnProps<T> extends ColumnProps<T> {
  /** 开启搜索表单, 并选择搜索表单中显示哪种组件
   *
   * **如果`type`是`select` 则必填`formItemProps`中的`options`**
   */
  type?: ColumnType

  /** 该字段的初始值 */
  initialValue?: any

  /** 字段属性 */
  formItemProps?: formItemPropsType<T>

  /** 字段在`Table`中是否显示 */
  hideInTable?: boolean | ((params: searchParams) => boolean)

  /** 搜索表单中是否显示 */
  hideInSearch?: boolean
}

interface ProTableRowSelection<T> extends TableRowSelection<T> {
  getCheckboxProps?: (record: T, rows: Rows<T>) => Object
}

interface ProTableProps<T> extends TableProps<T> {
  /** 渲染工具栏 */
  toolBarRender?: toolBarRenderFn<T>

  /** 提交表单前的数据处理 */
  beforeSearchSubmit?: (params: searchParams) => any

  /** 请求接口获取数据 */
  request: (params: searchParams) => Promise<any>

  /** 字段设置 */
  columns?: ProTableColumnProps<T>[]

  /** 行选择设置 */
  rowSelection?: ProTableRowSelection<T>

  /** 获取刷新/重置列表与获取搜索参数的对象 */
  ref?: (ref: Actions) => void
}

/**
 * # ProTable
 *
 * 封装了`分页`和`搜索表单`功能的 `table`组件
 *
 * 设计参照`@antd/design-proTable`
 *
 * 基本不用管分页和搜索相关的问题,  只需配置好就可以用
 *
 * ## 参考
 * - https://protable.ant.design/
 * - https://github.com/ant-design/pro-table
 *
 */
declare class ProTable extends React.Component<ProTableProps<T>> {
  constructor(props: ProTableProps<T>)
}
export default ProTable
