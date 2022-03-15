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
            let isUnmount = false;
            async function fetchComponent() {
                try {
                    const { default: importComponent } = await importComp()
                    if (!isUnmount) {
                        setComponent(() => importComponent)
                    }
                } catch (e) {
                    props.history.replace('/404')
                }
            }
            fetchComponent()
            return () => isUnmount = true;
            // eslint-disable-next-line
        }, [])
        return (
            Component ? <Component {...props} /> : <div>加载中...</div>
        )
    }
    return AsyncComponent
}