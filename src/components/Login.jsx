import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import well from '../assets/well.png'
import axios from "axios";
import { FaBullseye, FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaEye, FaEyeSlash, FaRegCircleXmark, FaRegEye } from "react-icons/fa6";
import { SiTruenas } from "react-icons/si";
import { useAuthStore } from "../store";






const Login = ({oldUser, setOldUser}) => {
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const handleLogin = useAuthStore((state) => state.authenticate);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.post("https://yourlinkapp.vercel.app/api/signin", {
        email,
        password: phone, // Sending phone as password
      });
      // Store user data in localStorage
      localStorage.setItem("userdata", JSON.stringify(response.data.user));
      handleLogin();
      console.log(localStorage.getItem("userdata"));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Validate email and password (password must have at least 8 characters, including a capital letter, a small letter, a symbol, and a number)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(phone);
    
    setIsDisable(!(emailValid && passwordValid));
  }, [email, phone]);

  return (
        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full  xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <img src={well} className="w-full  sm:block md:hidden lg:hidden" alt="wheel" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Login to play!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please sign in to your account
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                {/* Email field */}
                <div className="relative w-full">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <div className="flex items-center">
                <input
                  className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                  type="mail"
                  placeholder="mail@xyz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaCheckCircle className="text-xl text-green-500 absolute right-3" />
              </div>
            </div>
                
                {/* Phone number */}
                <div className="relative w-full">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <div className="flex items-center">
                <input
                  className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                  type={isPasswordVisible?"text":"password"}
                  placeholder="XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {isPasswordVisible?<FaEye className="text-xl text-green-500 absolute right-3" onClick={()=>setIsPasswordVisible(!isPasswordVisible)} />:<FaEyeSlash className="text-xl text-green-500 absolute right-3" onClick={()=>setIsPasswordVisible(!isPasswordVisible)} />}
              </div>
            </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                disabled={isDisable || isLoading}
                  type="submit"
                  className={`w-full flex justify-center ${isDisable || isLoading ?"bg-gray-400":"bg-gradient-to-r from-green-500 to-green-300  hover:bg-gradient-to-l hover:from-green-500 hover:to-green-600 cursor-pointer"} text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg transition ease-in duration-500`}
                >
                  Sign in{isLoading && <span className="loading loading-spinner"></span>}
                </button>
              <p className="mt-2 text-sm text-gray-500">
                Don't have an account? <span onClick={()=> setOldUser(!oldUser)} className="text-green-600 cursor-pointer">Register here</span>
              </p>
              </div>
            </form>
          </div>
        </div>
  );
};


const Register = ({oldUser, setOldUser}) => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [phone, setPhone] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();  
  const handleLogin = useAuthStore((state) => state.authenticate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.post("https://yourlinkapp.vercel.app/api/signup", {
        name: username,
        email,
        password: phone, // Sending phone as password
      });
      // Store user data in localStorage
      localStorage.setItem("userdata", JSON.stringify(response.data.user));     
      handleLogin();
      console.log(localStorage.getItem("userdata"));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    // Validate email, username, and password (password must have at least 8 characters, including a capital letter, a small letter, a symbol, and a number)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const usernameValid = username?.length > 0;
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(phone);    
    setIsDisable(!(emailValid && usernameValid && passwordValid));
  }, [email, username, phone]);

  return (
        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full  xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <img src={well} className="w-full  sm:block md:hidden lg:hidden" alt="wheel" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Register to play!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please create your new account
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="relative">

                {/* Username field */}
                <div className="relative w-full">
  <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
    Username
  </label>
  <div className="flex items-center">
    <input
      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
      type="text"
      placeholder="input your username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <FaCheckCircle className="text-xl text-green-500 absolute right-3" />
  </div>
</div>


                {/* Email field */}
                <div className="relative w-full">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <div className="flex items-center">
                <input
                  className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                  type="mail"
                  placeholder="mail@xyz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FaCheckCircle className="text-xl text-green-500 absolute right-3" />
              </div>
            </div>
                
                {/* Phone number */}
                <div className="relative w-full">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <div className="flex items-center">
                <input
                  className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                  type={isPasswordVisible?"text":"password"}
                  placeholder="XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {isPasswordVisible?<FaEye className="text-xl text-green-500 absolute right-3" onClick={()=>setIsPasswordVisible(!isPasswordVisible)} />:<FaEyeSlash className="text-xl text-green-500 absolute right-3" onClick={()=>setIsPasswordVisible(!isPasswordVisible)} />}
              </div>
            </div>
              </div>

              {/* Submit button */}
              <div>
              <button
                disabled={isDisable || isLoading}
                  type="submit"
                  className={`w-full flex justify-center ${isDisable || isLoading ?"bg-gray-400":"bg-gradient-to-r from-green-500 to-green-300  hover:bg-gradient-to-l hover:from-green-500 hover:to-green-600 cursor-pointer"} text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg transition ease-in duration-500`}
                >
                  Register{isLoading && <span className="loading loading-spinner"></span>}
                </button>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account? <span onClick={()=> setOldUser(!oldUser)} className="text-green-600 cursor-pointer">Login here</span>
              </p>
              </div>
            </form>
          </div>
        </div>
  );
};

const AuthScreen = () => {
  const [oldUser, setOldUser] = useState(false)
  
  return (
    <div className="relative min-h-screen flex ">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative">
          <div className="absolute bg-gradient-to-b from-green-600 to-green-400 opacity-75 inset-0 z-0"></div>
          <div className="w-full  max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Spin The Wheel
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
             <img src={well} className="sm:w-28 md:w-112 lg:w-60" alt="wheel" />
            </div>
          </div>
        </div>
        {oldUser?<Login oldUser={oldUser} setOldUser={setOldUser} />:<Register oldUser={oldUser} setOldUser={setOldUser} />}
      </div>
    </div>
  );
};

export default AuthScreen;
