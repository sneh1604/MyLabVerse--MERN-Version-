import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImage from './../assets/22.png'; // Ensure to have this image in your assets folder
import { API_BASE_URL } from '../config/api-config'; // Import the API base URL

const SignUp = () => {
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [status, setStatus]=useState("");
    const [error, setError]=useState("");
    const navigate = useNavigate();



const handleSubmit=(e)=>{
    e.preventDefault();
    axios.post(`${API_BASE_URL}/register`, {name, email, password})
    .then(res =>{
        console.log("Response", res)
        navigate("/login")
        setStatus("SuccessFully Registered!")
    }).catch(err => {
        console.log(err)
        setError("Error in Registering!")
    })
}
    
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 to-purple-800' style={{ fontFamily: 'Satoshi' }} >
        <div className='flex w-4/5 max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='hidden lg:flex w-1/2 h-auto justify-center items-center'>
                     <img 
                       src={loginImage} 
                       alt="Login" 
                       className='object-cover max-w-[750px] max-h-[750px] p-4' // Adjusted max width and height
                     />
                   </div>
                   <div className='w-full lg:w-1/2 flex justify-center items-center flex-col p-8'>
          <div className="my-5 w-full text-center">
            {status && <div className='text-center text-green-600 py-1'>{status}</div>}
            {error && <div className='text-center text-red-600 py-1'>{error}</div>}
          </div>
          <p className='font-bold text-4xl pb-8 text-blue-900'>Register</p>

        <form onSubmit={handleSubmit} className='w-full px-8'>
            <div className='pb-6'>
                <p className='font-bold text-black text-xl'>Name</p>
                <input value={name} onChange={(e)=>setName(e.target.value)} type='text' placeholder='Enter Name' className='border-gray-300 rounded-md py-2 px-3 placeholder:text-gray-600 w-full border-2 mt-2 text-start outline-none focus:outline-none focus:border-blue-600'/>
            </div>
            <div className='pb-6'>
                <p className='font-bold text-black text-xl'>Email</p>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Enter Email' className='border-gray-300 rounded-md py-2 px-3 placeholder:text-gray-600 w-full border-2 mt-2 text-start outline-none focus:outline-none focus:border-blue-600'/>
            </div>
            <div className='pb-6'>
                <p className='font-bold text-black text-xl'>Password</p>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Enter Password' className='border-gray-300 rounded-md py-2 px-3 placeholder:text-gray-600 w-full border-2 mt-2 text-start outline-none focus:outline-none focus:border-blue-600'/>
            </div>
            <button type='submit' className='w-full rounded bg-[#6C5BD4] hover:bg-[#5544b4] text-white py-2 text-center font-semibold'>Register</button>
            <p className='py-3 text-center text-gray-600'>Already Have an Account ?</p>
            <Link to="/login" >
                <button className='w-full mb-6 border-2 border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 text-center font-semibold'>Login</button>
            </Link>
        </form>
    </div>
    </div>
    </div>
  )
}

export default SignUp