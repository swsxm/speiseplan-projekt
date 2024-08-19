"use client"
import Navbar from '@/components/Navbar';
import Modal from "@/components/Modal";
import Link from "next/link";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button
} from "@nextui-org/react";
import { SlArrowDown } from "react-icons/sl";
import { MdOutlineShoppingCart } from "react-icons/md";
import { format, startOfWeek, addDays, isAfter, isFriday } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Speiseplan() {
  interface MenuItem {
    _id: string;
    id: number;
    Name: string;
    Beschreibung: string;
    price: number;
    link_fur_image: string;
    type: string;
    day: string;
    date: string;
    quantity: number;
  }

  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [selectedTag, setSelectedTag] = useState("Montag");
  const [selectedWeekKey, setSelectedWeekKey] = useState("currentWeek");

  const currentDate = new Date();
  
  const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const nextWeekStart = addDays(currentWeekStart, 7);

  // Generate weekdays and dates for current and next weeks
  const generateWeekDays = (weekStart: Date) => {
    return Array.from({ length: 6 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        weekday: format(day, 'EEEE', { locale: de }),
        date: format(day, 'yyyy-MM-dd')
      };
    });
  };

  const currentWeek = generateWeekDays(currentWeekStart);
  const nextWeek = generateWeekDays(nextWeekStart);

  const selectedWeek = selectedWeekKey === "currentWeek" ? currentWeek : nextWeek;

  // Load menu data for the selected date
  const loadMenuData = async (date: string) => {
    setMenuData([]);
    try {
      const res = await fetch("api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      if (data.message != "Plan not found") {
        setMenuData(data.flat());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const selectedDay = selectedWeek.find(day => day.weekday === selectedTag);
    if (selectedDay) {
      loadMenuData(selectedDay.date);
    }
  }, [selectedTag, selectedWeekKey]);

  const openModal = (item: MenuItem) => {
    item.day = selectedTag;
    item.date = selectedWeek.find(day => day.weekday === selectedTag)?.date || '';
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Check if it's Friday after 18:00
  const isBeforeFriday18 = isFriday(currentDate) ? currentDate.getHours() < 18 : !isAfter(currentDate, addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 4));

  return (
    <div>
      <Navbar />

      {/* Dropdown for day selection */}
      <div className='flex justify-center'>
        <Dropdown className='bg-green-300 rounded-lg p-3'>
          <DropdownTrigger className='p-3 flex items-center'>
            <Button className="capitalize flex items-center text-2xl">
              {selectedTag} <SlArrowDown size={13} className='ml-2' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Dropdown menu with description"
            selectionMode="single"
            selectedKeys={[selectedTag]}
            className="rounded-lg p-3 text-lg"
          >
            <DropdownSection title="Aktuelle Woche" showDivider>
              {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'].map(day => (
                <DropdownItem 
                  key={day}  
                  onClick={() => {
                    setSelectedTag(day);
                    setSelectedWeekKey("currentWeek");
                  }}
                  className='hover:bg-gray-200'
                >
                  {day}
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection title="Kommende Woche">
              {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'].map(day => (
                <DropdownItem 
                  key={`nextWeek_${day}`} 
                  onClick={() => {
                    setSelectedTag(day);
                    setSelectedWeekKey("nextWeek");
                  }}
                  className='hover:bg-gray-200'
                >
                  {day}
                </DropdownItem>
              ))}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Modal for item details */}
      {isModalOpen && selectedItem && (
        <Modal param1={selectedItem} closeModal={closeModal} />
      )}

      {/* Menu items display */}
      <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-2 gap-6'>
        {menuData.map((item, index) => (
          <div key={index} className='relative rounded-xl'>
            <img
              className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
              src={item.link_fur_image}
              alt='/'
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col justify-between'>
              <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between">
                  <p className='font-bold text-2xl'>{item.Name}</p>
                  <p className='text-sm'>{item.type}</p>
                </div>
                <p className='text-sm px-2 text-center flex-grow flex items-center justify-center'>
                  {item.Beschreibung}
                </p>
              </div>
              {selectedWeekKey === "nextWeek" && (
                <button
                  className='bg-green-400 text-white rounded-full w-12 h-12 flex items-center justify-center absolute bottom-2 left-2'
                  onClick={() => openModal(item)}
                >
                  <MdOutlineShoppingCart size={24} />
                </button>
              )}
              <p className='absolute bottom-2 right-2 text-2xl'>{item.price}€</p>
            </div>
          </div>
        ))}
      </div>

      {/* Breakfast card */}
      <div className='max-w-[820px] mx-auto p-4 py-12 grid md:grid-cols-1 gap-6 justify-center'>
        <div className='rounded-xl relative'>
          <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
            <p className='font-bold text-2xl px-2 pt-4'>Frühstück</p>
            <p className='px-2'>Leckeres Frühstück mit verschiedenen Auswahlmöglichkeiten</p>
            <p className='absolute top-2 right-2 text-gray-300'>Frühstück</p>
            {selectedWeekKey === "nextWeek" && userName && isBeforeFriday18 && (
              <Link href={`/Speiseplan/?modal=true&menudata=${JSON.stringify([selectedTag, selectedWeek.find(day => day.weekday === selectedTag)?.date, "Frühstück"])}&breakfast=true`}>
                <button className='absolute bottom-2 left-2 text-white p-20 text-4xl transparent-button'>
                  <MdOutlineShoppingCart />
                </button>
              </Link>
            )}
          </div>
          <img
            className='max-h-full md:max-h-[200px] w-full object-cover rounded-xl'
            src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt='/'
          />
        </div>
      </div>
    </div>
  );
}
