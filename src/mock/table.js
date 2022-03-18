import Mock from 'mockjs';
import { urlToJson, randomUUID } from '@/utils/utils';
const mock = Mock.mock;
Mock.setup({
    timeout: 400
})

const tableList = [];

for (let i = 0; i < 46; i += 1) {
    tableList.push({
        id: randomUUID(),
        disabled: i % 6 === 0,
        no: `code${i + 1}`,
        title: `一个任务名称${i + 1}`,
        callNo: i + 1,
        owner: '李结衣',
        description: '这是一段描述',
        status: Math.floor(Math.random() * 10) % 4,
        updateTime: new Date(`2022-01-${Math.floor(i / 2) + 1}`),
        createTime: new Date(`2022-01-${Math.floor(i / 2) + 1}`),
        progress: Math.ceil(Math.random() * 100),
        delFlag: '0'
    });
}

//mock 查询分页列表
mock(
    RegExp('/api/table/crud' + ".*"), 'get', (options) => {
        const params = urlToJson(options.url);
        let valideTableList = tableList.filter(item => item.delFlag === '0')
        let newTableList = [...valideTableList];

        // mock 查询
        if (params.no || params.status) {
            if (params.no) {
                valideTableList = valideTableList.filter(item => item.no.indexOf(params.no) > -1)
            } else if (params.status) {
                valideTableList = valideTableList.filter(item => String(item.status).indexOf(params.status) > -1)
            } else {
                valideTableList = valideTableList.filter(item => item.status.indexOf(params.status) > -1 && String(item.status).indexOf(params.status) > -1)
            }
        } else {
            valideTableList = [...tableList.filter(item => item.delFlag === '0')]
        }

        //排序
        if (params.sorter) {
            const s = params.sorter.split('_');
            valideTableList = valideTableList.sort((prev, next) => {
                if (s[1] === 'descend') {
                    return next[s[0]] - prev[s[0]];
                }
                return prev[s[0]] - next[s[0]];
            });
        }

        //mock 删除
        if (params.delFlag === '1') {
            valideTableList = [...tableList.filter(item => item.delFlag === '1')];
        }

        // mock 分页
        const pageNo = params.pageNo;
        const pageSize = params.pageSize;
        newTableList = valideTableList.slice((pageNo - 1) * pageSize, pageNo * pageSize);

        // console.log(
        //     'options', options,
        //     'params', params,
        //     'tableList', tableList,
        //     'newTableList', newTableList,
        //     'valideTableList', valideTableList
        // )
        return {
            code: 200,
            result: {
                records: newTableList,
                total: valideTableList.length
            }
        }
    }
)

//mock 新增
mock(
    RegExp('/api/table/crud' + ".*"), 'post', (options) => {
        const params = JSON.parse(options.body)
        const { no = 0, title = "未命名", description = "未命名", status = 0 } = params;
        tableList.unshift({
            id: randomUUID(),
            no,
            title,
            callNo: tableList.length,
            owner: '李结衣',
            description,
            status,
            updateTime: new Date(),
            createTime: new Date(),
            progress: Math.ceil(Math.random() * 100),
            delFlag: '0',
        })
        return {
            code: 200,
            message: '添加成功',
            result: {}
        }
    }
)

//mock 编辑
mock(
    RegExp('/api/table/crud' + ".*"), 'put', (options) => {
        const params = JSON.parse(options.body)
        const targetIndex = tableList.findIndex(item => item.id === params.id);
        tableList.splice(targetIndex, 1, params);
        return {
            code: 200,
            message: '修改成功',
            result: {}
        }
    }
)

//mock 逻辑删除
mock(
    RegExp('/api/table/crud' + ".*"), 'delete', (options) => {
        const params = JSON.parse(options.body);
        const targetItem = tableList.find(item => item.id === params.id);
        targetItem.delFlag = '1';
        return {
            code: 200,
            message: '删除成功，可在回收站恢复数据',
            result: {}
        }
    }
)

//mock 物理删除 
mock(
    RegExp('/api/table/delete' + ".*"), 'delete', (options) => {
        const params = JSON.parse(options.body);
        const targetIndex = tableList.findIndex(item => item.id === params.id);
        tableList.splice(targetIndex, 1);
        return {
            code: 200,
            message: '彻底删除成功',
            result: {}
        }
    }
)

//mock 批量删除
mock(
    RegExp('/api/table/batchDelete' + ".*"), 'delete', (options) => {
        const params = JSON.parse(options.body);
        const idList = params.ids.split(",")
        for (let i of tableList) {
            for (let j of idList) {
                if (i.id == j) {
                    i.delFlag = '1'
                }
            }
        }
        return {
            code: 200,
            message: '批量删除成功',
            result: {}
        }
    }
)

//mock 恢复
mock(
    RegExp('/api/table/recovery' + ".*"), 'post', (options) => {
        const params = JSON.parse(options.body);
        const targetItem = tableList.find(item => item.id === params.id);
        targetItem.delFlag = '0';
        return {
            code: 200,
            message: '恢复成功',
            result: {}
        }
    }
)

