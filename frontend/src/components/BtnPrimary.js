import React from 'react'
import { Button } from 'react-bootstrap';

const BtnPrimary = (props) => {
    return (
        <Button {...props} className=" m-2 text-white bg-black text-sm px-4 py-2 border border-dark rounded-md transition-colors focus:outline-none focus:ring focus:ring-gray -300 focus:ring-offset-1">
            {props.children}
        </Button>
    )
}

export default BtnPrimary;