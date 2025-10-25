import React from 'react'
import { 
  HiOutlineCreditCard, 
  HiOutlineShoppingBag, 
  HiArrowPathRoundedSquare 
} from 'react-icons/hi2'   // use "hi2" for v2 icons

const FeaturedSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
        
        {/* Feature 1 */}
        <div className='flex flex-col text-center'>
          <div className='p-4 rounded-full mb-4 bg-gray-100 w-fit mx-auto'>
            <HiOutlineShoppingBag className='text-3xl text-gray-700' />
          </div>
          <h1 className='tracking-tighter mb-2 font-semibold'>Free International Shipping</h1>
          <p className='text-gray-600 text-sm tracking-tighter'>On all orders over $100</p>
        </div>

        {/* Feature 2 */}
        <div className='flex flex-col text-center'>
          <div className='p-4 rounded-full mb-4 bg-gray-100 w-fit mx-auto'>
            <HiArrowPathRoundedSquare className='text-3xl text-gray-700' />
          </div>
          <h1 className='tracking-tighter mb-2 font-semibold'>46 Days Return</h1>
          <p className='text-gray-600 text-sm tracking-tighter'>Money back guarantee</p>
        </div>

        {/* Feature 3 */}
        <div className='flex flex-col text-center'>
          <div className='p-4 rounded-full mb-4 bg-gray-100 w-fit mx-auto'>
            <HiOutlineCreditCard className='text-3xl text-gray-700' />
          </div>
          <h1 className='tracking-tighter mb-2 font-semibold'>Secure Checkout</h1>
          <p className='text-gray-600 text-sm tracking-tighter'>100% secured checkout policy</p>
        </div>

      </div>
    </section>
  )
}

export default FeaturedSection
