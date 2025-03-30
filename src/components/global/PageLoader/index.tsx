import React from 'react'
import Spinner from '../Spinner/index'
const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <Spinner size={20} color="#000000" />
      <div className="ml-2 text-1xl font-poppins font-bold">events</div>
    </div>
  )
}

export default PageLoader
