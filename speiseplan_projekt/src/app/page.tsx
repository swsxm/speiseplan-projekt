import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import {
  Salad,
  CheckCircle,
  Leaf,
} from 'lucide-react'

const perks = [
  {
    name: 'Gesund',
    Icon: Salad,
    description: 'Tauche ein in die Welt des Genusses mit köstlichem und gesundem Essen.',
  },
  {
    name: 'Qualitativ',
    Icon: CheckCircle,
    description: 'Entdecke Produkte von höchster Qualität, die deinen Geschmackssinn verwöhnen.',
  },
  {
    name: 'Nachhaltig',
    Icon: Leaf,
    description: 'Erlebe die Frische! Unsere Produkte stammen aus nachhaltigem Anbau und sind gut für dich und die Umwelt.',
  },
];


const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='max-w-[1640px] mx-auto p-4'>
        <div className='max-h-[500px] relative'>
          {/* Overlay */}
          <div className='absolute w-full h-full text-gray-200 max-h-[500px] bg-black/40 flex flex-col justify-center'>
            <h1 className='px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>
              Discover. <span className='text-lime-500'>Order.</span>
            </h1>
            <h1 className='px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>
              {' '}
              <span className='text-lime-500'>Taste.</span> Savor.
            </h1>
          </div>
          <img
            className='w-full max-h-[500px] object-cover'
            src='https://images.pexels.com/photos/2741448/pexels-photo-2741448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='/'
          />
        </div>
      </div>
      <section className='mt-4 max-w-[1640px] mx-auto p-4'>
        
      <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
      {perks.map((perk) => (
        <div
          key={perk.name}
          className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
          <div className='md:flex-shrink-0 flex justify-center'>
            <div className='h-20 w-20 md:h-30 md:w-30 flex items-center justify-center rounded-full bg-green-100 text-green-900'>
              {<perk.Icon className='' />}
            </div>
          </div>

          <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
            <h3 className='px-4 text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold'>
              {perk.name}
            </h3>
            <p className='mt-3 text-sm md:text-base text-muted-foreground'>
              {perk.description}
            </p>
          </div>
        </div>
      ))}
</div>
<h1 className='px-4 text-4xl sm:text-1xl md:text-3xl lg:text-5xl font-bold text-center mt-8'>Bestseller</h1>
<div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
      {/* Card */}
      <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Egg Toast</p>
          <p className='px-2'>Leckers Spiegelei mit Toast</p>
        </div>
        <img
        className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
          src='https://images.unsplash.com/photo-1613769049987-b31b641f25b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGJyZWFrZmFzdHxlbnwwfDB8MHx8&auto=format&fit=crop&w=800&q=60'
          alt='/'
        />
      </div>
      {/* Card */}
      <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Rib King</p>
          <p className='px-2'>Spare Ribs mit Pommes</p>
        </div>
        <img
        className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
          src='https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGJicXxlbnwwfDB8MHx8&auto=format&fit=crop&w=800&q=60'
          alt='/'
        />
      </div>
      {/* Card */}
      <div className='rounded-xl relative'>
        {/* Overlay */}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
          <p className='font-bold text-2xl px-2 pt-4'>Schoko Traum</p>
          <p className='px-2'>Erdbeeren mit Schoko Glassur</p>
        </div>
        <img
        className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
          src='https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGRlc3NlcnR8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
          alt='/'
        />
      </div>
    </div>   
       
      </section>
      <Footer/>
    </div>
    
  );
};

export default Home;