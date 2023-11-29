import React from 'react'
import "./Cart.css"

const CartTime = ({startTime,endTime}) => {
  // const [time,setTime] = useState(duration);
  // console.log(startTime,endTime,"====....");
  let bigToNumST = Number(startTime);
  let bigToNumED = Number(endTime);
  let stt = new Date(bigToNumST*1000)
  let edt = new Date(bigToNumED*1000)
  console.log(stt,"===>>>Start Time");
  console.log(edt,"===>>>End Time");

  return (
    // <div className='utc-date'>{getTmie(time)}</div>
    // <div>{stt}</div>
    <>
    </>
  )
}

export default CartTime