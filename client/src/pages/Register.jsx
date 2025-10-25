import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from '../assets/login.jpg';
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";



const Rigister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[name, setName]=useState('')
   const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId, loading} = useSelector((state)=>state.auth);
  const {cart} = useSelector((state)=>state.cart);

  //Get redirect parameter and check if it's checout or something

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(()=>{
    if (user){
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({guestId, user })).then(()=>{
          navigate(isCheckoutRedirect ? "/checkout" : "/")
        });
      } else {
        navigate(isCheckoutRedirect ? "checkout" : "/")
      }
    }
  },[user, guestId, cart, navigate, isCheckoutRedirect, dispatch])


  

  const handleSubmit = (e)=>{
    e.preventDefault();
   dispatch(registerUser({name, email, password}))
  }
  return (
    <div className="flex ">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleSubmit}
          action=""
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Eleven21</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 ">Welcome</h2>
          <p className="text-center mb-6">
            Enter your name and password to Login
          </p>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2 ">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2 ">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold ">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="
          enter your password"
            />
          </div>

          <button className="w-full text-white p-2 bg-black rounded-lg font-semibold hover:bg-gray-800 transition">
           {loading ? "loading..." : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            If u already have an a account{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
      <div className="h-full flex flex-col justify-center items-center ">
        <img src={login}  alt="Login to Account"  className="object-cover h-[750px] w-full "/>

      </div>
      </div>
    </div>
  );
};

export default Rigister;
