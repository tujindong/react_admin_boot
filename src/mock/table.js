import Mock from 'mockjs';
import { urlToJson } from '@/utils/utils';
const mock = Mock.mock;
Mock.setup({
    timeout: 400
})

const tableList = [];

for (let i = 0; i < 46; i += 1) {
    tableList.push({
        id: i,
        disabled: i % 6 === 0,
        no: `code${i}`,
        title: `一个任务名称${i}`,
        callNo: Math.floor(Math.random() * 1000),
        owner: '李结衣',
        description: '这是一段描述',
        status: Math.floor(Math.random() * 10) % 4,
        updateTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        progress: Math.ceil(Math.random() * 100),
    });
}

//查询分页列表
mock(
    RegExp('/api/tablelist' + ".*"), 'get', (options) => {
        let newTableList = [...tableList];
        const params = urlToJson(options.url);

        // mock 分页
        const pageNo = params.pageNo;
        const pageSize = params.pageSize;
        newTableList = tableList.slice((pageNo - 1) * pageSize, pageNo * pageSize);

        //排序
        if (params.sorter) {
            const s = params.sorter.split('_');
            newTableList = tableList.sort((prev, next) => {
                if (s[1] === 'descend') {
                    return next[s[0]] - prev[s[0]];
                }
                return prev[s[0]] - next[s[0]];
            });
            console.log('newTableList', newTableList)
        }

        // mock 查询
        if (params.no || params.status) {
            if (params.no) {
                newTableList = tableList.filter(item => item.no.indexOf(params.no) > -1)
            } else if (params.status) {
                newTableList = tableList.filter(item => String(item.status).indexOf(params.status) > -1)
            } else {
                newTableList = tableList.filter(item => item.status.indexOf(params.status) > -1 && String(item.status).indexOf(params.status) > -1)
            }
        } else {
            newTableList = [...tableList]
        }

        console.log('options', options, 'params', params, 'tableList', tableList)
        return {
            code: 200,
            result: {
                records: newTableList,
                total: newTableList.length
            }
        }
    }
)


