const Home = (props) => {
    const array = []
    for (let i = 0; i < 50; i++) {
        array.push({})
    }
    return (
        <div>
            {array.map((item, index) => (
                <p key={index}>这是首页</p>
            ))}
        </div>
    )
}
export default Home;