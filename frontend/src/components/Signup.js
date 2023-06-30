import axios from 'axios';
import React, { useState, useEffect } from 'react'
import BtnPrimary from './BtnPrimary';
import BtnSecondary from './BtnSecondary';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
// import '../image/welcome.svg'

function Signup() {

    let [name, setName] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [verifiedCode, setverifiedCode] = useState('')
    let [show, setShow] = useState(false);
    let navigate = useNavigate()

    useEffect(() => {
        document.title = 'SignUp';
      }, []);
    

    let handleClose = () => {
        setShow(false)
    };
    // let handleShow = () => {
    //     setShow(true)
    // };

    let sendVerificationCode = async () => {
        setShow(true)
        if (name === '' && email === '' && password === '') {
            alert("All the fields are mandatory")
        } else {
            try {
                await axios.post(`https://capstone-project-management-be.onrender.com/unverifiedAccounts`, {
                    name,
                    email,
                    password
                })
            } catch (err) {
                console.log(err)
            }
        }
    }

    let handleSignup = async () => {
        setShow(true)
        try {
            let res = await axios.post(`https://capstone-project-management-be.onrender.com/signup`, {
                name,
                email,
                password,
                verifiedCode
            })
            if (res.status === 200) {
                // alert(res.data.message)
                navigate('/login')
            }
            else if (res.status === 400) {
                console.log(res.data.message)
            }
            else {
                console.log(res.data.message)
            }
        }
        catch (error) {
            console.log(error)
            console.log(error.response.message)
        }
}

return (
    <div style={{ backgroundColor: "#F7F9FB", height: "100vh", overflow: "hidden" }} className='d-flex flex-column w-100'>
        <div className='d-flex align-items-center w-100'>
            <div className='card rounded-0 border-0 d-flex justify-content-center align-items-center w-50' style={{ backgroundColor: "#F7F9FB" }}>
                <Form className='w-50'>
                    <Form.Group className="text-md mb-3 mx-5">
                        <Form.Label><strong>Name</strong></Form.Label>
                        <Form.Control type="text" className='focus-ring focus-ring-light rounded-0' placeholder="Enter Name" onChange={(e) => setName(e.target.value)} style={{ borderStyle: "solid", borderWidth: "0px 0px 3px 0px", borderColor: "black", backgroundColor: "#F7F9FB" }} />
                    </Form.Group>
                    <Form.Group className="text-md mb-3 mx-5">
                        <Form.Label><strong>Email</strong></Form.Label>
                        <Form.Control type="email" className='focus-ring focus-ring-light rounded-0' placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} style={{ borderStyle: "solid", borderWidth: "0px 0px 3px 0px", borderColor: "black", backgroundColor: "#F7F9FB" }} />
                    </Form.Group>
                    <Form.Group className="text-md mb-3 mx-5">
                        <Form.Label><strong>Password</strong></Form.Label>
                        <Form.Control type="password" className='focus-ring focus-ring-light rounded-0' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} style={{ borderStyle: "solid", borderWidth: "0px 0px 3px 0px", borderColor: "black", backgroundColor: "#F7F9FB" }} />
                    </Form.Group>
                    <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                        <BtnPrimary onClick={() => sendVerificationCode()} >Signup</BtnPrimary>
                    </div>
                    <Link to={'/login'} style={{ textDecoration: "none" }}>
                        <h6 className=' mt-3 text-center text-dark'><em>Have an account already</em></h6>
                    </Link>
                </Form>
            </div>
            <Modal show={show} backdrop="static" className='d-flex justify-content-center'>
                <div className='m-5 p-3'>
                    <Modal.Title className='m-3'>Email Verification</Modal.Title>
                    <Modal.Body>
                        <p>Enter your verification code</p>
                        <input type="text" placeholder="OTP" className='ml-2 pl-5 border rounded-2 border-dark' onChange={(e) => setverifiedCode(e.target.value)}></input>
                    </Modal.Body>
                    <Modal.Footer className='border-0 d-flex justify-content-center'>
                        <BtnSecondary variant="secondary" onClick={() => handleClose()}>Close</BtnSecondary>
                        <BtnPrimary variant="primary" onClick={() => handleSignup()}>Verify</BtnPrimary>
                    </Modal.Footer>
                </div>
            </Modal>
            <div className='d-flex align-items-end mr-5 pl-5 w-50 mt-5 ' style={{ borderStyle: "double", borderWidth: "0px 0px 0px 7px", borderColor: "#6366F1" }}>
                <div style={{ backgroundImage: `url("https://i.ibb.co/HgDg7RZ/welcome.jpg")`, backgroundSize: "cover", backgroundRepeat: "no-repeat", width: "95vh", height: "90vh", }} className='d-flex justify-content-end align-items-center ml-5 mt-3'>
                </div>
            </div>
        </div>
    </div >
)
}

export default Signup
