import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io5'
import {RiTwitterXLine} from 'react-icons/ri'

const Topbar = () => {
  return (
    <>
    <div className='bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white  shadow-md' >

        <div className='container mx-auto flex justify-between items-centerpy-3 py-4'>
            <div className='items-center space-x-4 hidden md:flex '>
                <a href="#" className='hover:text-gray-300 h-5 w-5'> 
                    <TbBrandMeta />
                </a>
                <a href="#" className='hover:text-gray-300 h-5 w-5'> 
                    <IoLogoInstagram />
                </a>
                <a href="#" className='hover:text-gray-300 h-4 w-4' > 
                    <RiTwitterXLine />
                </a>
            </div>

            <div className='text-sm text-center flex-grow'>
                <span>We ship worldwide-Fast and reliable shipping</span>
            </div>

            <div className='text-sm hidden md:flex'>
                <a href="tell:123" className='hover:text-gray-300'>1234123400</a>
            </div>
        </div>
    </div>
    </>
  )
}

export default Topbar