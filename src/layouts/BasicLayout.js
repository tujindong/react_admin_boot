
import { useState, useEffect } from 'react';
import { Layout, Tabs } from 'antd';
import styled from 'styled-components';
import SideMenu from './SideMenu';
import GlobalHeader from './GlobalHeader';
const Div = styled.div`
    .fixed-sider{
        padding-left: 200px;
        transition:all .2s;
    }
    .fixed-sider-collapsed{
        padding-left: 80px;
        transition:all .2s;
    }
    /* tabs的样式都写在这里面 */
    .globalTabs {
        border-top: 1px solid #f0f0f0;
        &.tabs-fixedHeader{
            padding-top: 94px;
        }
        .ant-tabs {
            line-height: 1.2;
            .ant-tabs-nav {
                margin-bottom: 0;
                .ant-tabs-nav-wrap {
                    line-height: 1.2;
                    .ant-tabs-nav-list {
                        .ant-tabs-tab {
                            height: 34px;
                            line-height: 34px;
                            font-size: 12px;
                            .ant-tabs-tab-remove{
                                display: none;
                            }
                            &.ant-tabs-tab-active{
                                .ant-tabs-tab-remove{
                                    display: inline-block;
                                }
                            }
                            &:hover{
                                transition: all 0.2s;
                                padding: 0 20px;
                                .ant-tabs-tab-remove{
                                    display: inline-block;
                                }
                            }
                        }
                    }
                }
            }
        }
        .ant-tabs-nav {
            z-index: 9;
            position: fixed;
            width: 100%;
            top: 60px;
        }
        .router-wrap{
            padding: 10px;
        }
    }
   
`;

const { TabPane } = Tabs;
const { Content } = Layout;

const BasicLayout = (props) => {
    const { routes, history } = props;
    const initialState = {
        tabList: [{
            closable: false,
            title: "首页",
            path: "/",
        }]
    }
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [tabList, setTabList] = useState(initialState.tabList)
    const [activeTabKey, setActiveTabKey] = useState(initialState.tabList[0].path)

    useEffect(() => {
        handleMenuChange(history.location.pathname)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!routes.some(item => item.path === history.location.pathname)) history.replace('/404')
    }, [history.location.pathname])

    //点击左侧菜单
    const handleMenuChange = (pathname) => {
        setActiveTabKey(pathname)
        routes.forEach(item => {
            if (item.path === pathname) {
                if (!tabList.map(item => item.path).includes(item.path)) {
                    tabList.push(item)
                }
            }
        })
    }

    //点击tab标签关闭
    const handleTabsRemove = (targetKey) => {
        const targetIndex = tabList.findIndex(item => item.path === targetKey)
        const targetTab = tabList[targetIndex - 1];
        const newTabList = tabList.filter(item => item.path !== targetKey)
        setTabList(newTabList)
        if (activeTabKey === targetKey) {
            setActiveTabKey(targetTab.path)
            history.push(targetTab.path)
        }
    }

    /**
     * renderParts
     * @returns 
     */
    const renderContentDom = () => {
        return (
            <Content className="globalTabs tabs-fixedHeader">
                <Tabs
                    activeKey={activeTabKey}
                    tabBarStyle={{ background: '#fff' }}
                    tabPosition="top"
                    tabBarGutter={-1}
                    hideAdd
                    type="editable-card"
                    onChange={(e) => {
                        history.push(e)
                        setActiveTabKey(e)
                    }}
                    onEdit={(targetKey, action) => handleTabsRemove(targetKey)}
                >
                    {tabList.map((item) => (
                        <TabPane tab={item.title} key={item.path} closable={item.closable}>
                            <div className="router-wrap">
                                {props.children}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </Content>
        )
    }

    const renderHeaderDom = () => {
        return (
            <GlobalHeader
                isCollapsed={isCollapsed}
                onCollapse={() => {
                    setIsCollapsed(prevState => !prevState)
                }}
            />
        )
    }

    const renderSiderDom = () => {
        return (
            <SideMenu
                isCollapsed={isCollapsed}
                initialState={initialState}
                handleMenuChange={(e) => handleMenuChange(e.key)}
                {...props}
            />
        )
    }

    return (
        <Div>
            <Layout>
                {renderSiderDom()}
                <Layout className={!isCollapsed ? "fixed-sider" : "fixed-sider-collapsed"}>
                    {renderHeaderDom()}
                    {renderContentDom()}
                </Layout>
            </Layout>
        </Div>
    )
}

export default BasicLayout