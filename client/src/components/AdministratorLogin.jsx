import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginImage from './../assets/22.png'; 

const AdministratorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/administrator/login', { email, password })
      .then(res => {
        if (res.data.Status === "Success") {
          const userData = {
            email: res.data.email,
            name: res.data.name,
            role: res.data.role
          };
          localStorage.setItem('administrator', JSON.stringify(userData));
          navigate("/administrator-dashboard");
          setStatus("Successfully Logged In!");
        } else {
          setError("Login failed!");
        }
      })
      .catch(err => {
        console.log(err);
        setError("Error in Login!");
      });
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800' style={{ fontFamily: 'Satoshi' }} >
      <div className='flex w-4/5 max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Left Side Image */}
        <div className='hidden lg:flex w-1/2 h-auto justify-center items-center'>
          <img 
            src={loginImage} 
            alt="Login" 
            className='object-cover max-w-[750px] max-h-[750px] p-4'
          />
        </div>

        {/* Right Side Form */}
        <div className='w-full lg:w-1/2 flex justify-center items-center flex-col p-8'>
          <div className="my-5 w-full text-center">
            {status && <div className='text-center text-green-600 py-1'>{status}</div>}
            {error && <div className='text-center text-red-600 py-1'>{error}</div>}
          </div>
          <p className='font-bold text-4xl pb-8 text-blue-900'>Administrator Login</p>
          <form onSubmit={handleSubmit} className='w-full px-8'>
            <div className='pb-8'>
              <p className='font-bold text-black text-xl'>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                placeholder='Enter Email'
                className='border-gray-300 rounded-md py-2 px-3 placeholder:text-gray-600 w-full border-2 mt-2 text-start outline-none focus:outline-none focus:border-blue-600'
              />
            </div>
            <div className='pb-6'>
              <p className='font-bold text-black text-xl'>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                placeholder='Enter Password'
                className='border-gray-300 rounded-md py-2 px-3 placeholder:text-gray-600 w-full border-2 mt-2 text-start outline-none focus:outline-none focus:border-blue-600'
              />
            </div>
            <button type='submit' className='w-full rounded bg-[#6C5BD4] hover:bg-[#5544b4] text-white py-2 text-center font-semibold'>Login</button>
            <p className='py-3 text-center text-gray-600'>Need a regular account?</p>
            <Link to="/login">
              <button className='w-full mb-6 border-2 border-gray-300 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 text-center font-semibold'>User Login</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdministratorLogin;
