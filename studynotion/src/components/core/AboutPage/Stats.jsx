import React from 'react'

const StatsData = [
    { 
    count: "5K", 
    label: "Active Students" 
   },
   { 
    count: "10+", 
    label: "Mentors"
   },
   { 
    count: "200+", 
    label: "Courses" 
   },
   { 
    count: "50+", 
    label: "Awards" 
},
]

const Stats = () => {
  return (
    <div className='bg-richblack-700 w-[100vw] mt-[100px]'>

       <div className='relative w-11/12 justify-between mx-auto text-white max-w-maxContent gap-10 mt-[20px] items-center'>
         <div className='grid lg:grid-cols-4  sm:grid-cols-2 text-center'>
                 {
                    StatsData.map((data, index) =>(
                        <div className='flex flex-col' key = {index}>
                           <h1 className='text-richblack-25 pt-6 font-bold text-3xl'>{data.count}</h1>
                           <p className='text-richblack-400 opacity-80 pb-6 text-md'>{data.label}</p>
                        </div>
                    ))
                 }
         </div>
       </div>
    </div>
  )
}

export default Stats
