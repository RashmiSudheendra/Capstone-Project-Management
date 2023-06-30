import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Toaster } from "react-hot-toast";
import jwtDecode from 'jwt-decode';

const AppLayout = ({ children }) => {

    let token = sessionStorage.getItem('token')
    let data = jwtDecode(token);

    let name = data.name
    let logo = name.split(" ")
    console.log(logo)
    let init = Array.from(logo[0])[0]

    useEffect(() => {
        document.title = `${init}${logo[1]}`;
    }, [init, logo]);

    return (
        <div className='bg-white'>
            <Navbar />
            <div className=' w-screen flex container mx-auto' style={{ height: 'calc(100vh - 56px)' }}>
                <div className="w-[220px]">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    <div className="flex">
                        {children}
                    </div>
                </div>
            </div>
            <Toaster
                position="top-right"
                gutter={8}
            />
        </div>
    )
}

export default AppLayout