import React, { useEffect, useState } from 'react'
import "./Cart.css"

const CartTime = ({startDay,startHour,startMinutes,endDay,endHour,endMinutes}) => {
  const [days, setDays] = useState(startDay);
  const [hours, setHours] = useState(startHour);
  const [minutes, setMinutes] = useState(startMinutes);

  const calculateRemainingTime = () => {
    const totalSeconds =
      (endDay - startDay) * 24 * 60 * 60 +
      (endHour - startHour) * 60 * 60 +
      (endMinutes - startMinutes) * 60;

    const interval = setInterval(() => {
      if (totalSeconds > 0) {
        const remainingSeconds = totalSeconds - 1;
        setDays(Math.floor(remainingSeconds / (24 * 60 * 60)));
        setHours(Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60)));
        setMinutes(Math.floor((remainingSeconds % (60 * 60)) / 60));
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    return calculateRemainingTime();
  }, []);

  return (
    <div className='utc-date'>
      <p className='utc-date1'>
        {days}D {"  "} {hours}H {"  "} {minutes}M
      </p>
    </div>
  );
};

export default CartTime