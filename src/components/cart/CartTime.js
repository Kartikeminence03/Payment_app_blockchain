import React, { useEffect, useState } from 'react';
import './Cart.css';

const CartTime = ({ startDay, startHour, startMinutes, endDay, endHour, endMinutes }) => {
  const calculateRemainingTime = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime.totalSeconds > 0) {
          const remainingSeconds = prevTime.totalSeconds - 1;
          return {
            totalSeconds: remainingSeconds,
            days: Math.floor(remainingSeconds / (24 * 60 * 60)),
            hours: Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60)),
            minutes: Math.floor((remainingSeconds % (60 * 60)) / 60),
          };
        } else {
          clearInterval(interval);
          return prevTime;
        }
      });
    }, 1000);

    // Return a cleanup function to clear the interval
    return () => clearInterval(interval);
  };

  const [timeRemaining, setTimeRemaining] = useState(() => {
    const totalSeconds =
      (endDay - startDay) * 24 * 60 * 60 +
      (endHour - startHour) * 60 * 60 +
      (endMinutes - startMinutes) * 60;

    return {
      totalSeconds,
      days: Math.floor(totalSeconds / (24 * 60 * 60)),
      hours: Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60)),
      minutes: Math.floor((totalSeconds % (60 * 60)) / 60),
    };
  });

  useEffect(() => {
    const cleanupFunction = calculateRemainingTime();

    return () => cleanupFunction();
  }, []);

  return (
    <div className='utc-date'>
      <p className='utc-date1'>
        {timeRemaining.days}D {'  '} {timeRemaining.hours}H {'  '} {timeRemaining.minutes}M
      </p>
    </div>
  );
};

export default CartTime;
