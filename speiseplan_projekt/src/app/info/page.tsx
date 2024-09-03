import React from 'react';
import Navbar from "@/components/Navbar"
export default function Info() {
  return (
    <div>
      <Navbar/>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1> This page is under maintenance. </h1> 
      </div>
    </div>
  );
}
