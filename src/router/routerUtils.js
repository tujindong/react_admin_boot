import React, { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
/**
 * 处理树状结构菜单
 */
export const transformTreeToFlat = (tree, result = []) => {
    cloneDeep(tree).forEach(node => {
        result.push(node)
        node.children && transformTreeToFlat(node.children, result)
    })
    return result.map(item => {
        item.children && delete item.children
        return { ...item }
    });
}

/**
 * 动态加载组件方法
 */
export const asyncImportComponent = (importComp) => {
    function AsyncComponent(props) {
        const [Component, setComponent] = useState(null)
        useEffect(() => {
            async function fetchComponent() {
                try {
                    const { default: importComponent } = await importComp()
                    setComponent(() => importComponent)
                } catch (e) {
                    props.history.replace('/404')
                }
            }
            fetchComponent()
            // eslint-disable-next-line
        }, [])
        return (
            Component ? <Component {...props} /> : <div>加载中...</div>
        )
    }
    return AsyncComponent
}