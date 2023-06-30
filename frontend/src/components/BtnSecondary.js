import React from 'react'
import { Button } from 'react-bootstrap';

const BtnSecondary = (props) => {
    return (
        <Button {...props} className='text-dark bg-white border border-indigo-500 text-md px-4 py-2 rounded-md hover:bg-indigo-500 hover:text-indigo-50 transition-colors focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-offset-1'>{props.children}</Button>
    )
}

export default BtnSecondary