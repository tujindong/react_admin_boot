import styled from 'styled-components';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd'
const { confirm } = Modal;
const Div = styled.div`
    .header-collapsed.header {
        width: calc(100% - 80px);
    }
    .header{
        position: fixed;
        top: 0;
        height: 60px;
        padding: 0 12px 0 0;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        width: calc(100% - 200px);
        transition:all .2s;
        z-index: 100;
        display: flex;
        .left-area{
            width: 60px;
            .trigger {
                font-size: 20px;
                line-height: 60px;
                width: 60px;
                cursor: pointer;
                transition: all 0.3s, padding 0s;
                padding: 0 24px;
                flex: 1 1 0%;
                &:hover {
                    background: #e6f7ff;
                }
            }
        }
        .right-area{
            margin-left: auto;
            display: flex;
            align-items: center;
            .item-action{
                font-size: 14px;
                display: flex;
                align-items: center;
                height: 48px;
                padding: 0 8px;
                cursor: pointer;
                transition: all 0.3s;
                > span {
                vertical-align: middle;
                }
                &:hover {
                    background: rgba(0,0,0,.05);
                }
            }
        }
    }
`;
const GlobalHeader = (props) => {
    const { isCollapsed } = props;
    const loginOut = () => {
        console.log('退出登录~~~')
        confirm({
            title: '提示',
            icon: <QuestionCircleOutlined />,
            content: '真的要注销登录吗 ?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random > 0.5 ? resolve : reject, 1000)
                }).catch(() => console.log('Oops errors!'))
            },
            onCancel() { }
        })
    }
    /**
     * renderParts
     */
    const renderLeftDom = () => {
        return (
            <div className="left-area">
                <div className="trigger" onClick={props.onCollapse}>
                    {isCollapsed ?
                        <MenuUnfoldOutlined /> :
                        <MenuFoldOutlined />
                    }
                </div>
            </div>
        )

    }
    const renderRightDom = () => {
        return (
            <div className="right-area">
                <span
                    className="item-action"
                    onClick={() => {
                        window.open('https://pro.ant.design/docs/getting-started');
                    }}
                >
                    <QuestionCircleOutlined />
                </span>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item key="center">
                            <UserOutlined />
                            个人中心
                        </Menu.Item>
                    </Menu>
                }>
                    <span className="item-action">欢迎您，XX用户</span>
                </Dropdown>
                <span className="item-action" onClick={loginOut}>
                    <LogoutOutlined />
                    &nbsp;退出登录
                </span>
            </div>
        )
    }

    return (
        <Div>
            <div className={!isCollapsed ? "header" : "header-collapsed header"}>
                {renderLeftDom()}
                {renderRightDom()}
            </div>
        </Div>

    )
}
export default GlobalHeader;