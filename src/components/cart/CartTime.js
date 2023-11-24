import React, { useEffect, useState } from 'react'
import "./Cart.css"

const CartTime = ({duration}) => {
  // const [time,setTime] = useState(duration);

  // useEffect(()=>{
  //   setTimeout(()=>{
  //     setTime(time - 1000)
  //   },1000)
  // },[time]);

  // const getTmie = (millisecond)=>{
  //   let total_seconds = parseInt(Math.floor(millisecond / 1000))
  //   let total_minutes = parseInt(Math.floor(total_seconds / 60))
  //   let total_hours = parseInt(Math.floor(total_minutes / 60))
  //   let day = parseInt(Math.floor(total_hours / 60))

  //   let seconds = parseInt(total_seconds % 60)
  //   let minutes = parseInt(total_minutes % 60)
  //   let hours = parseInt(total_hours % 24)

  //   return `Days: ${day} Hours: ${hours} MINUTES: ${minutes} SECONDS: ${seconds}`
  // }

  return (
    // <div className='utc-date'>{getTmie(time)}</div>
    <div></div>
  )
}

export default CartTime