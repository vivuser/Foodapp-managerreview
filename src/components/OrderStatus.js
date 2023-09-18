import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderStatus = () => {
    const [orderStatus, setOrderStatus] = useState(null);
    const { dbId } = useParams();

    useEffect(() => {
        getOrderStatus(dbId);


    },[dbId])

    console.log(dbId, 'ooooo')


    async function getOrderStatus(dbId){
        try{
        const response = await fetch(`http://localhost:8080/order-status/${dbId}`,
        {
            headers:{
              Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrderStatus(data);
        console.log('Order status: ', orderStatus.status);
    }   catch (error) {
        console.error('Error fetching order status:', error);
    }
}


  return (
        <div>
            {orderStatus !== null? (
                <div className='justify-content text-center m-10'>
                <p className='font-bold bg-green-200 w-80 p-4 m-4'>Order status: {orderStatus.status}</p>
                <p className='text-lg font-serif font-bold'>Ordered Items</p>
                <ul className='font-serif font-sm'>
                {orderStatus.order.map((item, index)=>(
                   <li key={index} className='text-left'>
                    <span className='mr-8'>{item.item.name}</span> ₹{item.item.price/100}</li>
                ))}
                </ul>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </div>
  );
};

export default OrderStatus;