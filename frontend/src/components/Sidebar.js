import React, { useCallback, useEffect, useState } from 'react'
import AddProjectModal from './AddProjectModal'
import axios from 'axios'
import { Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode';


const Sidebar = () => {

  let token = sessionStorage.getItem('token')
  let data = jwtDecode(token);

  const [isModalOpen, setModalState] = useState(false)
  const [projects, setProjects] = useState([])
  const [paramsWindow, setParamsWindow] = useState(window.location.pathname.slice(1))
  useEffect(() => {
  })

  const handleLocation = (e) => {
    setParamsWindow(new URL(e.currentTarget.href).pathname.slice(1))
  }

  const openModal = useCallback(() => {
    setModalState(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalState(false)
  }, [])

  const projectData = () => {
    axios.get('https://capstone-project-management-be.onrender.com/projects/')
      .then((res) => {
        // console.log(res)
        let info = res.data
        // console.log(data.id)
        let userData = info.filter((e)=>e.userId===data.id)
        // console.log(userData)
        setProjects(userData)
      })
  }

  useEffect(() => {
    projectData()
    document.addEventListener('projectUpdate', ({ detail }) => {
      projectData()
    })
    return () => {
      document.removeEventListener('projectUpdate', {}, false)
    }
  });



  return (
    <div className=''>
      <div className="px-4 mb-3 flex items-center">
        <span className=' m-3'>Projects</span>
        <button onClick={openModal} className='bg-dark rounded-full p-[2px] focus:outline-none focus:ring focus:ring-black focus:ring-offset-1'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-light -600">
            <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <ul className='border-r border-gray-300 pr-2'>
        {projects.map((project, index) => (
          <Link key={index} to={`/project/${project._id}`} style={{textDecoration:"none"}} onClick={(e) => handleLocation(e)}>
            <li style={{}} className={`px-3 py-1.5 mb-1 text-black font-medium text-base capitalize select-none hover:text-black rounded transition-colors hover:bg-zinc-200  ${paramsWindow === project._id && 'text-indigo-600 bg-indigo-200/80'}`}>
              {project.title}
            </li>
          </Link>
        ))}
      </ul>
      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  )
}

export default Sidebar