import Mock from 'mockjs';
import { getQueryVariable } from '@/utils/utils';
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
        owner: '李结衣',
        description: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updateTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        progress: Math.ceil(Math.random() * 100),
    });
}

export default mock(
    RegExp('/api/test' + ".*"), 'get', (options) => {
        const pageNo = getQueryVariable('pageNo', options.url);
        const pageSize = getQueryVariable('pageSize', options.url);
        const newTableList = tableList.slice((pageNo - 1) * pageSize, pageNo * pageSize)
        console.log('options', options, 'pageNo', pageNo, 'pageSize', pageSize)
        return {
            code: 200,
            result: {
                records: newTableList,
                total: tableList.length
            }
        }
    }
)