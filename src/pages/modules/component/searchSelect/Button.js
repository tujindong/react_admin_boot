// Button.jsx
import React from 'react';

const Button = ({ onClickButton, children }) => {
    return (
        <>
            <button onClick={onClickButton}>{children}</button>
            <span>{Math.random()}</span>
        </>
    );
};

export default React.memo(Button);
