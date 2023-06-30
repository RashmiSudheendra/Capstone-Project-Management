import React from 'react'
import BtnPrimary from './BtnPrimary'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const Navbar = () => {

  let token = sessionStorage.getItem('token')
  let data = jwtDecode(token);
  // console.log(data)

  let navigate = useNavigate();
  let name = data.name
  let logo = name.split(" ")
  console.log(logo)
  let init = Array.from(logo[0])[0]
  console.log(init)


  return (
      <div className='bg-white shadow h-17'>
        <div className='mx-3' style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
          <div className='text-center text-dark'>
          <h1 className='mb-0'>{init}{logo[1]}{logo[2]}</h1>
          <h6>{name}</h6>
          </div>
          <BtnPrimary onClick={() => {
            sessionStorage.clear();
            navigate('/login')
          }}>
            Log Out
          </BtnPrimary>
        </div>
      </div>
  )
}

export default Navbar