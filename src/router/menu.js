/**
 * 这块是模拟后端菜单分级，后续将会在后端返回
 * componentPath：src目录下页面组件的相对路径
 * icon：一般取 antd/icon图标库里面 图标名称，为空则不渲染icon。推荐在一级带子级的菜单添加icon，其他的尽量不用加
 */
//系统固有菜单，或者一些无权限菜单
const staticMenuData = [
    {
        componentPath: 'views/home/home',
        id: '1',
        key: '1',
        path: '/',
        name: 'home',
        redirect: null,
        icon: '',
        keepAlive: false,
        sort: 1,
        title: '首页'
    },
    {
        componentPath: 'views/exception/404',
        id: '2',
        key: '2',
        path: '/404',
        name: '404',
        redirect: null,
        icon: '',
        keepAlive: false,
        title: '404',
        sort: 2,
        isHideInMenu: true,
        isHideLayout: true,
    },
    {
        componentPath: 'views/user/login',
        id: '3',
        key: '3',
        path: '/login',
        name: 'login',
        redirect: null,
        icon: '',
        keepAlive: false,
        title: '登录',
        sort: 3,
        isHideInMenu: true,
        isHideLayout: true,
    },
]

//权限菜单 理论上是后台配置的 
//注意：菜单path的命名方法请严格按照层级依次命名如： '/demo' > '/demo/demoList' > '/demo/demoList/xxxx' (通用的约定，主要为了实现主页面tab切换页面，左侧menu被选中的子项父级展开效果，也是为了阅读层级清晰明了)
const dynamicMenuData = [
    {
        componentPath: 'layouts/RouteView',
        id: '4',
        key: '4',
        path: '/component',
        name: 'component',
        redirect: null,
        icon: 'PieChartOutlined',
        keepAlive: false,
        title: '组件管理',
        children: [
            {
                componentPath: 'modules/component/table',
                id: '4-1',
                key: '4-1',
                path: '/component/table',
                name: 'component-table',
                redirect: null,
                icon: '',
                keepAlive: false,
                title: '高级表格',
            },
            {
                componentPath: 'modules/component/searchSelect',
                id: '4-2',
                key: '4-2',
                path: '/component/searchSelect',
                name: 'component-searchSelect',
                redirect: null,
                icon: '',
                keepAlive: false,
                title: '远程搜索',
            },
        ]
    },
    {
        componentPath: 'layouts/RouteView',
        id: '5',
        key: '5',
        path: '/system',
        name: 'system',
        redirect: null,
        icon: 'SettingOutlined',
        keepAlive: false,
        title: '系统管理',
        children: [
            {
                componentPath: 'modules/system/permission/permission',
                id: '5-1',
                key: '5-1',
                path: '/system/permission',
                name: 'system-permission',
                redirect: null,
                icon: '',
                keepAlive: false,
                title: '菜单管理',
            }
        ]
    },
]

const menuData = [...staticMenuData, ...dynamicMenuData]

export {
    staticMenuData,
    dynamicMenuData,
    menuData,
}