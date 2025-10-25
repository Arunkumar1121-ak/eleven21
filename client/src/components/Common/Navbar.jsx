import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [draweropen, setDraweropen] = React.useState(false);
  const toggleCartDrawer = () => {
    setDraweropen(!draweropen);
  };

  const [navDraweropen, setNavDraweropen] = useState(false);
  const toggleNavDrawer = () => {
    setNavDraweropen(!navDraweropen);
  };

  const { cart } = useSelector((state) => state.cart);
  const {user} =useSelector((state)=>state.auth)
  const cartItemcount =
  cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;


  return (
    <>
      <nav className="container mx-auto py-4 px-6 flex justify-between items-center">
        {/*Leftside logo*/}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Eleven21
          </Link>
        </div>

        {/*Center Navigation Links*/}

        <div className="hidden md:flex space-x-6 ">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:to-black text-sm font-medium uppercase"
          >
            Men
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 ">
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:to-black text-sm font-medium uppercase"
          >
            women
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 ">
          <Link
            to="/collections/all?category=Top wear"
            className="text-gray-700 hover:to-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>
        </div>
        <div className="hidden md:flex space-x-6 ">
          <Link
            to="/collections/all?category=Bottom wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom wear
          </Link>
        </div>
        {/*Rightside icons*/}

        <div className="flex items-center space-x-4 ">
          {user && user.role === "admin" && (<Link
            to="/admin"
            className="block bg-black rounded px-2 text-sm text-white"
          >
            Admin
          </Link>)}
          
          <Link to="/profile" className="hover:text-black ">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            className="relative hover:text-black"
            onClick={toggleCartDrawer}
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemcount > 0 && (
              <span className="absolute -top-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemcount}
              </span>
            )}
          </button>
          {/*Search icon*/}
          <div className="overflow-hidden">
            <Searchbar />
          </div>
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/*cart drawer*/}
      <CartDrawer draweropen={draweropen} toggleCartDrawer={toggleCartDrawer} />

      {/*Mobile nav Links */}

      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-1/2 md:w-1/3 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDraweropen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 " />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              onClick={toggleNavDrawer}
              to="/collections/all?gender=Men"
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              onClick={toggleNavDrawer}
              to="/collections/all?gender=Women"
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              onClick={toggleNavDrawer}
              to="/collections/all?category=Top wear"
              className="block text-gray-600 hover:text-black"
            >
              Top wear
            </Link>
            <Link
              onClick={toggleNavDrawer}
              to="/collections/all?category=Bottomwear"
              className="block text-gray-600 hover:text-black"
            >
              Bottom wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
