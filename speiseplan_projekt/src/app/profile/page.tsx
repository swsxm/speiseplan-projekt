'use client'
import { useRouter } from 'next/navigation'; 
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";



function Profile() { 
  
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [personalNumber, setPersonalNumber] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/profile_info', {
          method: 'GET',
        }); 
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setPersonalNumber(data.id);
      } catch (error) {
        console.error('Error fetching user details:', error); 
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        await window.location.reload();
        router.replace('/');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="shadow-lg p-8 rounded-lg border-t-4 border-green-400">
          <h1 className="text-xl font-bold my-4">Account Detail Information</h1>
          
          <div className="flex flex-col gap-2">
            <div>
              <strong>Name:</strong> {name}
            </div>
            <div>
              <strong>Email:</strong> {email}
            </div>
            <div>
              <strong>Employee Number:</strong> {personalNumber}
            </div>
            <button
              className="bg-red-500 text-white font-bold cursor-pointer py-2 px-6 rounded"
              onClick={handleLogout}
            >
              Abmelden
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Profile; 
