
import { routerRedux, Switch, Route } from 'dva/router';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import BasicLayout from "@/layouts/BasicLayout";
import { menuData } from "./menu"
import { transformTreeToFlat, asyncImportComponent } from './routerUtils'

const { ConnectedRouter } = routerRedux;


const RouterConfig = ({ history, app }) => {
    /**
     * 一级菜单 component命名控制字段为 layouts，就不计入路由组件中
     */
    const routes = transformTreeToFlat(menuData).filter(item => !(item.componentPath.indexOf('layouts') > -1)).map(item => {
        return {
            ...item,
            component: () => import(`@/pages/${item.componentPath}`)
        }
    })
    const basicRoute = routes.filter(item => item.isHideInMenu)
    const layoutRoute = routes.filter(item => !item.isHideInMenu)
    return (
        <ConfigProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    {basicRoute.map(route => <Route path={route.path} key={route.name} exact component={asyncImportComponent(route.component)} ></Route>)}
                    <BasicLayout menuData={menuData} routes={routes} history={history}>
                        {layoutRoute.map(route => <Route path={route.path} key={route.name} exact component={asyncImportComponent(route.component)} ></Route>)}
                    </BasicLayout>
                </Switch>
            </ConnectedRouter>
        </ConfigProvider>
    );
}

export default RouterConfig;