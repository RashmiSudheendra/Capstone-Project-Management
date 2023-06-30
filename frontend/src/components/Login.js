import React, { useState, useEffect } from 'react'
// import Button from 'react-bootstrap/Button';
import BtnPrimary from './BtnPrimary'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Welcome() {


    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let navigate = useNavigate()

    useEffect(() => {
        document.title = 'LogIn';
      }, []);

    let handlelogin = async () => {
        if (email===''&&password==='') {
            alert('Enter Credentials')
        }
        else if(email===''){
            alert('Enter Email - Id')
        }
        else if (password==='') {
            alert('Enter Password')
        }
        else {
            try {
                let res = await axios.post('https://capstone-project-management-be.onrender.com/login', {
                    email,
                    password
                })
                console.log(res)
                if (res.status === 200) {
                    sessionStorage.setItem('token', res.data.token)
                    navigate('/project')
                }
                else {
                    alert('Invalid Credentials')
                }
            }
            catch (error) {
                console.log(error)
                alert('Invalid Credentials')
                // alert(error.response.data.message)
            }
        }
    }

    return (
        <div style={{ backgroundColor: "#F7F9FB", height: "100vh", overflow: "hidden" }} className='d-flex flex-column'>
            <div className='d-flex align-items-center'>
                <div className='d-flex align-items-end ml-5 pr-5' style={{ borderStyle: "double", borderWidth: "0px 5px 0px 0px", borderColor: "#FFBB15" }}>
                    <div style={{ backgroundImage: `url("https://i.ibb.co/wwjcsjG/1687777235026-1.png")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", width: "110vh", height: "60vh", }} className='d-flex justify-content-end align-items-center ml-5'>
                    </div>
                </div>
                <div className='card rounded-0 border-0 d-flex justify-content-center align-items-center' style={{ backgroundColor: "#F7F9FB", width: "100rem", height: "46.6rem", }}>
                    <Form className='w-50'>
                        <Form.Group className="text-md mb-3 mx-5">
                            <Form.Label><strong>Email</strong></Form.Label>
                            <Form.Control type="email" className='focus-ring focus-ring-light rounded-0' placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} style={{ borderStyle: "solid", borderWidth: "0px 0px 3px 0px", borderColor: "black", backgroundColor: "#F7F9FB" }} />
                        </Form.Group>
                        <Form.Group className="text-md mb-3 mx-5">
                            <Form.Label><strong>Password</strong></Form.Label>
                            <Form.Control type="password" className='focus-ring focus-ring-light rounded-0' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} style={{ borderStyle: "solid", borderWidth: "0px 0px 3px 0px", borderColor: "black", backgroundColor: "#F7F9FB" }} />
                        </Form.Group>
                        <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                            <BtnPrimary onClick={() => handlelogin()}>Login</BtnPrimary>
                            <Link to={'/signup'}>
                                <BtnPrimary>
                                    New user
                                </BtnPrimary>
                            </Link>
                        </div>
                    </Form>
                </div>
                {/* <div className='bg-warning' style={{ width: "25rem", height: "46.6rem" }}>
        </div> */}
            </div>
            {/* <div className='card bg-dark rounded-0 border-0' style={{ width: "96rem", height: "6rem" }}> */}
            {/* </div> */}
        </div>
    )
}

export default Welcome
