"use client";

import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CreateMealModal from '@/components/CreateMealModal';
import { FaRegPlusSquare } from "react-icons/fa";
import { startOfWeek, addDays, format } from 'date-fns';

export default function speiseplan() {
  const currentDate = new Date();
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const startOfNewWeek = addDays(startOfCurrentWeek, 14);
  const newWeek = [];

  for (let i = 0; i < 6; i++) {
    const day = addDays(startOfNewWeek, i);
    const formattedDate = format(day, 'yyyy-MM-dd');
    newWeek.push(formattedDate);
  }

  const [currentPath, setCurrentPath] = useState('/');
  const [isCreateMealModalOpen, setIsCreateMealModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(newWeek[0]);
  const [selectedType, setSelectedType] = useState('');
  const types = ['Menu1', 'Menu2', 'Nachtisch', 'Suppe'];

  async function existNewWeek() {
    /*  
      Check if the new week already exists in DB, if not create one
    */
    try {
      await fetch('../api/setNewWeek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Fehler beim Erstellen der neuen Woche:', error);
    }
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    existNewWeek();
  }, []);

  const openCreateMealModal = () => {
    setIsCreateMealModalOpen(true);
  };

  const closeCreateMealModal = () => {
    setIsCreateMealModalOpen(false);
  };

  interface menuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    type: string;
  }

  function convertToMenuItem (data: any[]): menuItem[]{
    return data.map(item => ({
      _id: item._id,
      name: item.Name,
      description: item.Beschreibung,
      price: item.price,
      imageUrl: item.link_fur_image,
      type: item.type,
    }));
  };

  const [menuData, setMenuData] = useState<menuItem[]>([]);
  const [menuInDB, setMenuInDB] = useState<menuItem[]>([]);

  async function loadMenuData(type: string){
    try {
      const res = await fetch('../api/fetchType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      const data: menuItem[] = await res.json();
      console.log('Menü-Daten geladen:', data);
      setMenuData(data);
    } catch (error) {
      console.error('Fehler beim Laden der Menüdaten:', error);
    }
  };

  async function loadMealInDB(type: string) {
    /*
      Loading the menus that are already set for the chosen day
    */
    try {
      const res = await fetch('../api/getMenuCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDay,
          type: type,
        }),
      });

      const rawData = await res.json();
      const data = convertToMenuItem(rawData);
      if (Array.isArray(data)) {
        setMenuInDB(data);
      } else {
        console.error('Erwartete ein Array, erhielt aber:', data);
        setMenuInDB([]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der gespeicherten Menüs:', error);
    }
  };

  const handleDaySelection = (day: string) => {
    setSelectedDay(day);
    setSelectedType('');
    setMenuData([]);
    setMenuInDB([]);
  };

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
    loadMenuData(type);
    loadMealInDB(type);
  };

  async function handleAddToMenu (item: menuItem) {
    /*
      Updating menuItem in db
    */
    try {
      await fetch('../api/updateMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item,
          itemToUpdate: menuInDB,
          selectedDay,
          selectedType,
        }),
      });
      await loadMealInDB(item.type);
    } catch (error) {
      console.error('Fehler beim Hinzufügen zum Menü:', error);
    }
  };

  useEffect(() => {
    menuInDB.forEach(item => {
      console.log(item.imageUrl);
    });
    if (!Array.isArray(menuInDB)) {
      console.error('menuInDB ist kein Array:', menuInDB);
    }
  }, [menuInDB]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <nav className="mx-auto p-4">
        <div className="flex flex-wrap items-center justify-center mx-auto p-4">
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-2 mt-4 font-medium border rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white text-xl">
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
      <div className="flex justify-center mt-4 space-x-4">
        {newWeek.map((day, index) => (
          <button
            onClick={() => handleDaySelection(day)}
            key={index}
            className={`px-4 py-2 rounded-md border ${selectedDay === day ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 focus:outline-none`}
          >
            {format(new Date(day), 'dd.MM')} 
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {types.map((type, index) => (
          <button
            key={index}
            onClick={() => handleTypeSelection(type)}
            className={`px-6 py-3 rounded-md border ${selectedType === type ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 focus:outline-none`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="max-w-[820px] mx-auto p-4 py-12 grid md:grid-cols-1 gap-6 justify-center">
        {menuInDB.length === 0 ? (
          <p>Keine Menüs gefunden</p>
        ) : (
          menuInDB.map(item => (
            <div key={item._id} className="rounded-xl relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col overflow-hidden">
                <p className="font-bold text-2xl mb-2 overflow-hidden">{item.name}</p>
                <p className="text-sm overflow-hidden px-2">{item.description}</p>
                <p className="absolute top-2 right-2 text-gray-300">{item.type}</p>
                <p className="absolute bottom-2 right-2 text-2xl pt-5 pr-5 mt-20">{item.price}€</p>
              </div>
              <img
                className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
                src={item.imageUrl}
                alt={item.name}
              />
            </div>
          ))
        )}
      </div>
      <div className="max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-2 gap-6">
        {menuData.length === 0 ? (
          <p>Keine neuen Menüs verfügbar</p>
        ) : (
          menuData.map(item => (
            <div key={item._id} className="rounded-xl relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col overflow-hidden">
                <p className="font-bold text-2xl mb-2 overflow-hidden">{item.name}</p>
                <p className="text-sm overflow-hidden px-2">{item.description}</p>
                <p className="absolute top-2 right-2 text-gray-300">{item.type}</p>
                <button className="absolute bottom-2 left-2 text-white p-2 text-4xl" onClick={() => handleAddToMenu(item)}>
                  <FaRegPlusSquare />
                </button>
                <p className="absolute bottom-2 right-2 text-2xl pt-5 pr-5">{item.price}€</p>
              </div>
              <img
                className="max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl"
                src={item.imageUrl}
                alt={item.name}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
