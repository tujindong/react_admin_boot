import dva from 'dva';
import '@/assets/css/index.less';
import '@/mock';
const createHashHistory = require('history').createHashHistory

//1. 初始化
const app = dva({
    history: createHashHistory(),
});

//2. 路由
app.router(require('@/router/router').default);

//2. 注册全局model
app.model(require('@/models/global').default);

//3. 启动 
app.start('#root');

export default {
    app,
    store: app._store,
    dispatch: app._store.dispatch
};
