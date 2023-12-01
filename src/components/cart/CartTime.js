import React from 'react'
import "./Cart.css"

const CartTime = ({startDay,startHour,startMinutes,endDay,endHour,endMinutes}) => {
  // const [time,setTime] = useState(duration);
  // console.log(startTime,endTime,"====....");

  // console.log(startDay,startHour,startMinutes,"===>>>Start Time");
  // console.log(endDay,endHour,endMinutes,"===>>>End Time");

  return (
    <div className='utc-date'>{startDay}D  {"  "} {startHour}H  {"  "} {startMinutes}M</div>
    // <div>{stt}</div>
    // <>
    // </>
  )
}

export default CartTime