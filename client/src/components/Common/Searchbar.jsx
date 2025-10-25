import React from "react";
import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productsSlice";



const Searchbar = () => {
  const [Searchitem, setSearchitem] = useState("");
  const [isopen, setisopen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setisopen(!isopen);
   };


  const handlesearch = (e) => {
      e.preventDefault();
      dispatch(setFilters({search: Searchitem}));
      dispatch(fetchProductsByFilters({search: Searchitem}));
      navigate(`/collections/all?search=${Searchitem}`);
      setisopen(false)
    }


  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isopen ? "absolute top-0 left-0 w-full bg-white h-24 z-50 " : "w-auto"  }`}
    >
     { isopen ? (
        <form onSubmit={handlesearch} className="relative flex items-center justify-center w-full">
      <div className="relative w-1/2">

      <input type="text" onChange={(e)=> setSearchitem(e.target.value)} placeholder="Search if you want..." className="bg-gray-100 px-4 py-2 pr-12 pl-2 rounded-lg focus:outline-none w-full placeholder:text-gray-700 " />
      {/*search icon */}
        <button type="submit" className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
        <HiMagnifyingGlass className="h-6 w-6"/>
        </button>
      {/*Clode btn */}
        <button type="button" onClick={handleSearchToggle} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 z-10">
        <HiMiniXMark className="h-6 w-6"/>
        </button>

      </div>

     </form>) : (
        <button onClick={handleSearchToggle}>
        <HiMagnifyingGlass className="h-6 w-6" />
        </button>
     )}
    </div>

  );
};

export default Searchbar;

