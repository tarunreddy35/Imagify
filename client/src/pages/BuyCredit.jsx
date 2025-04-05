import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import { loadStripe } from '@stripe/stripe-js';

//const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

//const baseUrl = import.meta.env.VITE_BACKEND_URL


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)



const BuyCredit = () => {

  const {user, token} = useContext(AppContext);

  const handlePurchase = async (price, credits) => {
    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: price, credits }),
      });
      const data = await res.json();

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
    }
  }

  return (
    <motion.div
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6' >OUR PLANS</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10' >Choose the paln</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left' >
        {plans.map((item, index)=>(
          <div key={index}
          className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all'>
            <img width={40} src={assets.logo_icon} alt=''/>
            <p className='mt-3 mb-1 font-semibold' >{item.id}</p>
            <p className='text-sm' >{item.desc}</p>
            <p className='mt-6' >
              <span className='text-3xl font-medium'>${item.price}</span>/{item.credits} credits</p>
              <button className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'  onClick={() => handlePurchase(item.price, item.credits)} >{user ? 'Purchase':'Get Started' }</button>

          </div>
        ))}
      </div>
    </motion.div>

  )
}

export default BuyCredit