import { useEffect } from 'react';
import styled from 'styled-components';
const Div = styled.div`
    width: 100%;
    height: 100%;
    .name{
        padding-top: 200px;
        margin-left: -100px;
        font-size: 26px;
        text-align: center;
        color: #dddddd;
    }
`;

const Home = (props) => {

    useEffect(() => {

    })

    return (
        <Div>
            <div className='name'>react-admin-boot</div>
        </Div>
    )
}
export default Home;