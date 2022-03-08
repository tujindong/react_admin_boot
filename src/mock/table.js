import Mock from 'mockjs';
const mock = Mock.mock;
Mock.setup({
    timeout: 400
})
export default mock(
    '/api/test', 'get', (options) => {
        return {
            code: 200,
            result:
                mock({
                    [`records|10`]: [{
                        'name': '@cname',
                        'sex': '@boolean',
                        'id|+1': 1,
                        'age|10-60': 0,    //10-60以内的随机数，0用来确定类型
                        'birthday': '@date("yyyy-MM-dd")',    //年月日
                        'city': '@city(true)'    //中国城市
                    }],
                    "total": "46"
                })
        }
    }
)