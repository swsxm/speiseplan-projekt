"use client";
import CreateMealModal from '@/components/CreateMealModal';
import Navbar from "@/components/Navbar"
import Link from 'next/link'
import { useState, useEffect } from 'react';

interface Menu {
  id: number;
  price: number;
  url: string;
  name: string;
  type: string;
  anzahl: number;
}

export default function Admin() {
  const [currentPath, setCurrentPath] = useState('/');
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCreateMealModalOpen, setIsCreateMealModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/nextWeek');
      const data = await response.json();
      if (data.orders) {
        setMenuItems(data.orders);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    let totalPrice = 0;
    let totalAmount = 0;
    menuItems.forEach((item) => {
      totalPrice += item.price;
      totalAmount += item.anzahl;
    });
    setTotalPrice(totalPrice);
    setTotalAmount(totalAmount);
  }, [menuItems]);

  const openCreateMealModal = () => {
    setIsCreateMealModalOpen(true);
  };

  const closeCreateMealModal = () => {
    setIsCreateMealModalOpen(false);
  };
  return (
    <div className="">

      <Navbar />
      <nav className="mx-auto p-4">
        <div className="flex flex-wrap items-center justify-center mx-auto p-4">
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 rounded-lg border" id="navbar-sticky">
            <ul className="flex flex-col  md:p-2 mt-4 font-medium border rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white text-xl">
              <li>
                <CreateMealModal isOpen={isCreateMealModalOpen} onClose={closeCreateMealModal} />
                <button onClick={openCreateMealModal}>Neues Gericht erstellen</button>
              </li>
              <li>
                <a href="/admin" className={`block py-2 px-3 rounded hover:text-dark-green-500 md:bg-transparent md:p-0 ${currentPath === '/admin' ? 'text-green-500' : 'text-black'}`}>
                  Wochenübersicht
                </a>
              </li>
              <li>
                <a href="/admin/create-menu" className={`block py-2 px-3 rounded hover:text-dark-green-500 md:bg-transparent md:p-0 ${currentPath === '/admin/create-menu' ? 'text-green-500' : 'text-black'}`}>
                  Menu erstellen
                </a>
              </li>

             
            </ul>
          </div>
        </div>
      </nav>


      <div className="relative overflow-x-auto max-w-screen-lg mx-auto">
        <div className="shadow overflow-x-auto sm:rounded-lg max-w-[1640px] mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6"
                >
                  Menu-ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6"
                >
                  TYP
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6"
                >
                  Menge
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6"
                >
                  Preis
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((menuItem: any) => (
                <tr key={menuItem.id}>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={menuItem.url}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {menuItem.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <div className="text-sm text-gray-900">{menuItem.name}</div>

                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">

                    <div className="text-sm text-gray-900">{menuItem.type}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                    {menuItem.anzahl}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                    {menuItem.price} €
                  </td>

                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">


                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">

                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">

                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">
                  {totalAmount}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-l font-medium text-gray-900 sm:px-6">
                  {totalPrice} €
                </td>

              </tr>
            </tfoot>
          </table>
        </div>
      </div>




    </div>
  );
}