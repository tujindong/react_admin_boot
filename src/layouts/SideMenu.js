import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import logo from '@/assets/image/logo.svg'
import styled from 'styled-components';
import { Link } from 'dva/router';
import { intersection } from 'lodash';
import { transUrlToList } from '@/utils/utils'

const Div = styled.div`
    .logo {
        display: flex;
        justify-content: center;
        height: 64px;
        position: relative;
        line-height: 64px;
        transition: all 0.2s;
        background: #002140;
        overflow: hidden;
        img {
            display: inline-block;
            vertical-align: middle;
            height: 32px;
        }
        h1 {
            color: white;
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            margin: 0 0 0 12px;
            font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
        }
    }
    .sider {
        min-height: 100vh;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
        position: relative;
        z-index: 10;
        &.sider-fixed{
            position: fixed;
            top: 0;
            left: 0;
        }
        &.ligth {
            background-color: white;
            .logo {
                background: white;
                h1 {
                    color: #002140;
                }
            }
        }
    }
`;

const { Sider } = Layout;
const { SubMenu, Item } = Menu;
const SideMenu = (props) => {
    const { menuData, isCollapsed, location, initialState } = props
    const [selectedMenuKeys, setSelectedMenuKeys] = useState(initialState.tabList[0].path)
    const [openKeys, setOpenKeys] = useState([])

    //根据hash路由切换菜单
    useEffect(() => {
        setSelectedMenuKeys(location.pathname)
        setOpenKeys(transUrlToList(location.pathname))
    }, [location.pathname])

    //获取菜单子节点
    const getNavMenuItems = (menuData) => {
        if (!menuData) return [];
        const validMenuData = menuData
            .filter(item => item.title && !item.isHideInMenu)
            .map(item => {
                return generateSubMenuOrMenuItem(item)
            })
        return validMenuData;
    }

    //生成subMenu 或者 menu
    const generateSubMenuOrMenuItem = (item) => {
        if (item.children && item.children.some(child => child.title)) {
            const childrenItems = getNavMenuItems(item.children)
            if (childrenItems && childrenItems.length) {
                return (
                    <SubMenu
                        key={item.path}
                        icon={item.icon ? React.createElement(require('@ant-design/icons')[item.icon]) : null}
                        title={item.title}
                    >
                        {childrenItems}
                    </SubMenu>
                )
            }
            return null
        } else {
            return (
                <Item key={item.path}>
                    <Link to={item.path}>{item.title}</Link>
                </Item>
            )
        }
    }

    //点击菜单展开，其他菜单项关闭
    const handleMenuOpen = (openKeys) => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const IsMoreThanOneOpenKeysInMainMenu = intersection(openKeys, menuData.map(item => item.path)).length > 1
        setOpenKeys(() => IsMoreThanOneOpenKeysInMainMenu ? [lastOpenKey] : [...openKeys])
    }

    /**
     * renderParts
     */
    const renderLogoDom = () => {
        return (
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="logo" />
                    {!isCollapsed && <h1>智博天下</h1>}
                </Link>
            </div>
        )
    }

    const renderMenuDom = () => {
        return (
            <Menu
                selectedKeys={selectedMenuKeys}
                openKeys={openKeys}
                mode="inline"
                theme="dark"
                onClick={(e) => {
                    props.handleMenuChange(e)
                }}
                onOpenChange={handleMenuOpen}
            >
                {getNavMenuItems(menuData)}
            </Menu>
        )
    }

    return (
        <Div>
            <Sider collapsed={isCollapsed} width={200} className="sider sider-fixed">
                {renderLogoDom()}
                {renderMenuDom()}
            </Sider>
        </Div>

    )
}
export default SideMenu;