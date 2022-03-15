/**
 * @name 全局状态
 * @description 包含 一些全局状态和函数，因实际情况下过多的引入状态管理可能导致代码维护难度增加，因而在各个页面也未添加model状态管理，这里仅仅将一些通用的比如登录等方法进行抽取。
 * @copyright tujindong
 */
import { postAction } from '@/request/manage'
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
    namespace: 'GLOBAL',

    state: [],

    effects: {
        *login({ payload }, { call, put }) {
            const res = yield postAction('/login/', payload);
            if (res.code === 200) {
                message.success("登录成功！")
                yield put(routerRedux.push('/'))
            }
        },
    },
};