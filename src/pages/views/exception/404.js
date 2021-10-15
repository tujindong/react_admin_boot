import {Result, Button} from 'antd'

const Index404 = props => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起，您访问的页面不存在."
            extra={<Button onClick={ ()=> { props.history.goBack() } } type="primary">返回上一页</Button>}
        />
    )
}
export default Index404;