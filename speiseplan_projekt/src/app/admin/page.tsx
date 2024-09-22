'use client';

import CreateMealModal from '@/components/CreateMealModal';
import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';

interface Menu {
  totalQuantity: number;
  mealName: string;
  mealDescription: string;
  mealImage: string;
  mealType: string;
  mealId: string;
  totalPrice: number;
}

export default function Admin() {
  const [currentPath, setCurrentPath] = useState('/');
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCreateMealModalOpen, setIsCreateMealModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    fetchMenuItems();
  }, []);

  async function fetchMenuItems () {
    /**
     * Fetch all orders from the database.
     */
    try {
      const response = await fetch('/api/nextWeek');
      if (response.ok) {
        const data = await response.json();
        if (data.orders) {
          setMenuItems(data.orders);
        } else {
          setError('Keine Bestellungen gefunden');
        }
      } else {
        setError('Fehler beim Abrufen der Menüpunkte');
      }
    } catch (error) {
      setError('Fehler beim Abrufen der Menüpunkte');
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    let calculatedTotalPrice = 0;
    let calculatedTotalAmount = 0;
    menuItems.forEach((item) => {
      calculatedTotalPrice += item.totalPrice;
      calculatedTotalAmount += item.totalQuantity;
    });
    console.log(menuItems);
    setTotalPrice(calculatedTotalPrice);
    setTotalAmount(calculatedTotalAmount);
  }, [menuItems]);

  const openCreateMealModal = () => {
    setIsCreateMealModalOpen(true);
  };

  const closeCreateMealModal = () => {
    setIsCreateMealModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="flex-grow">
        <nav className="mx-auto p-4">
          <div className="flex flex-wrap items-center justify-center mx-auto p-4">
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 rounded-lg border" id="navbar-sticky">
              <ul className="flex flex-col md:p-2 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white text-xl">
                <li>
                  <CreateMealModal isOpen={isCreateMealModalOpen} onClose={closeCreateMealModal} />
                  <button onClick={openCreateMealModal}>
                    Neues Gericht erstellen
                  </button>
                </li>
                <li>
                  <a href="/admin" className={`block py-2 px-3 rounded hover:text-dark-green-500 md:bg-transparent md:p-0 ${currentPath === '/admin' ? 'text-green-500' : 'text-black'}`}>
                    Wochenübersicht
                  </a>
                </li>
                <li>
                  <a href="/admin/create-menu" className={`block py-2 px-3 rounded hover:text-dark-green-500 md:bg-transparent md:p-0 ${currentPath === '/admin/create-menu' ? 'text-green-500' : 'text-black'}`}>
                    Menü erstellen
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="relative overflow-x-auto max-w-screen-lg mx-auto p-4">
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}
          <div className="shadow overflow-x-auto sm:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Bild</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Beschreibung</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Typ</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Menge</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider sm:px-6">Preis</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((menuItem) => (
                  <tr key={menuItem.mealId}>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <img className="h-10 w-10 rounded-full" src={menuItem.mealImage} alt={menuItem.mealName} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">{menuItem.mealName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">{menuItem.mealDescription}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                      <div className="text-sm text-gray-900">{menuItem.mealType}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                      {menuItem.totalQuantity}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                      {menuItem.totalPrice.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6"></td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6"></td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6"></td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6"></td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">
                    {totalAmount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-l font-medium text-gray-900 sm:px-6">
                    {totalPrice.toFixed(2)} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
