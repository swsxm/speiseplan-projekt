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


export default function Speiseplan() {
    interface MenuItem {
        _id: string;
        id: number;
        Name: string;
        Beschreibung: string;
        price: number;
        link_fur_image: string;
        type: string;
      }

  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);


  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [menuData, setMenuData] = React.useState<MenuItem[]>([]); // State für Menüdaten



  //Berechnen der aktuellen und der Nächsten Woche
  //Datum der Wochen werden in Arrays gespeichert
  var currentDate = new Date();
  var currentDayNumber = currentDate.getDay();
  var startOfCurrentWeek = new Date(currentDate);
  startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - currentDayNumber + (currentDayNumber === 0 ? -6 : 1)); // Setze den Starttag auf Montag der aktuellen Woche
  var startOfNextWeek = new Date(startOfCurrentWeek);
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

  interface WeekDay {
    weekday: string;
    date: string;
  }
  const currentWeek: WeekDay[] = [];
  const nextWeek: WeekDay [] = [];
 
  for (var i = 0; i < 6; i++) {
      var day = new Date(startOfCurrentWeek);
      day.setDate(day.getDate() + i);
      var formattedDate = day.toISOString().slice(0, 10);
      currentWeek.push({ weekday: day.toLocaleDateString('de-DE', { weekday: 'long' }), date: formattedDate }); // Füge den Wochentag und das Datum hinzu
      var day = new Date(startOfNextWeek);
      day.setDate(day.getDate() + i);
      var formattedDate = day.toISOString().slice(0, 10);
      nextWeek.push({ weekday: day.toLocaleDateString('de-DE', { weekday: 'long' }), date: formattedDate }); // Füge den Wochentag und das Datum hinzu
  }

  const [selectedTag, setSelectedTag] = React.useState("Montag"); // State für ausgewählten Tag
  const [selectedWeekKey, setselectedWeekKey] = React.useState("currentWeek"); // State für ausgewählte Woche
  
  var selectedWeek = nextWeek;
  if(selectedWeekKey == "currentWeek"){
     selectedWeek = currentWeek;
  }


  

  // Funktion zum Laden der Menüdaten
  const loadMenuData = async (date : string) => {
    try {
      const res = await fetch("api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "date": date }),
      });
      const data = await res.json();
      // Die Daten haben eine verschachtelte Struktur, also müssen wir sie entpacken
      const flattenedData = data.flat(); // Entpacke die verschachtelten Arrays
      setMenuData(flattenedData); // Menüdaten setzen, sobald sie geladen sind
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    for (let i = 0; i < selectedWeek.length; i++) {
      if (selectedWeek[i].weekday === selectedTag) {
        const dateOfCurrentWeek = selectedWeek[i].date;
        const isoDate = new Date(dateOfCurrentWeek).toISOString().slice(0, 10);
        loadMenuData(isoDate); // Menüdaten für den ausgewählten Tag laden
        break;
      }
    }
  }, [selectedTag,selectedWeekKey]); // Wird ausgeführt, wenn selectedTag sich ändert
  // Voreinstellung für selectedTag, falls es undefined ist
  const selectedTagDisplay = selectedTag ? selectedTag.replaceAll("_", " ") : "";
  
  // Funktion, um das Datum für den ausgewählten Wochentag zu erhalten
  const getDateForSelectedTag = () => {
    for (let i = 0; i < selectedWeek.length; i++) {
      if (selectedWeek[i].weekday === selectedTag) {
        return selectedWeek[i].date; // Gib das Datum für den ausgewählten Tag zurück
      }
    }
  };
  const selectedDate = getDateForSelectedTag();

  //Funktion um zu prüfen ob es feritag 18 uhr ist
  const getFriday18 = () => {
    if(currentDate.getDay() == 5){
      if(currentDate.getHours()>=18){
        return false;
      }
    }else if(currentDate.getDay() > 5){
      return false;
    }
    return true;
  }
  const Friday18 = getFriday18();
  
  console.log(currentDate.getDay());
  console.log(menuData)
  return (
    <div>
      <Navbar />

        {/* Dropdown für die Auswahl des Wochentags */}
        <div className='flex justify-center'>
          <Dropdown>
            <DropdownTrigger className='p-3 flex items-center'>
              <Button 
                className="capitalize flex items-center text-2xl"
              >
                {selectedTagDisplay} <SlArrowDown size={13} className='ml-2'/>
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Dropdown menu with description"
              //disallowEmptySelection
              selectionMode="single"
              selectedKeys={[selectedTag]} // Verwenden Sie den ausgewählten Tag als selectedKeys
              
              className="bg-white rounded-lg p-3 text-lg"
            >
              <DropdownSection title="Aktuelle Woche"  showDivider>
              
              {/* Dropdown-Elemente für die Wochentage */}
              {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'].map(day => (
                <DropdownItem key={day}  onClick={() => {
                  setSelectedTag(day); // Setze den ausgewählten Tag
                  setselectedWeekKey("currentWeek");//Setze ausgewählte Woche auf currentWeek
                }}className='hover:bg-gray-200 '>
                  {day}
                </DropdownItem>
              ))}
              </DropdownSection>
              <DropdownSection title="Kommende Woche" >
              
              {/* Dropdown-Elemente für die Wochentage */}
              {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'].map(day => (
                <DropdownItem key={`nextWeek_${day}`} onClick={() => {
                  setSelectedTag(day); // Setze den ausgewählten Tag
                  setselectedWeekKey("nextWeek");//Setze ausgewählte Woche auf nextWeek
                }}className='hover:bg-gray-200'>
                  {day}
                </DropdownItem>
              ))}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
        {isModalOpen && selectedItem && (
    <Modal param1={selectedItem} closeModal={closeModal} />
)}
      <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-2 gap-6'>
        {/* Karten für die Menüpunkte des ausgewählten Tags */}
        {menuData.map((item, index) => (
  <div key={index} className='rounded-xl relative'>
    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col overflow-hidden'>
      <p className='font-bold text-2xl mb-2 overflow-hidden'>{item.Name}</p>
      <p className='text-sm overflow-hidden px-2'>{item.Beschreibung}</p>
      <p className='absolute top-2 right-2  text-gray-300'>{item.type}</p>
      {/* Button */}
      <button onClick={() => openModal(item)}>Öffne Modal mit Parametern</button>
      {/* Render Modal */}
      
      <p className='absolute buttom-2 right-2 text-2xl pt-5 pr-5 mt-20'>{item.price}€</p>
    </div>
    {/* Image */}
    <img
      className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl'
      src={item.link_fur_image}
      alt='/'
    />
  </div>
))}
       
      </div>
      <div className='max-w-[820px] mx-auto p-4 py-12 grid md:grid-cols-1 gap-6 justify-center'>
        <div key="breakfast" className='rounded-xl relative'>
          <div className='absolute w-full h-full bg-black/50 rounded-xl text-white'>
              <p className='font-bold text-2xl px-2 pt-4'>Frühstück</p>
              <p className='px-2'>Leckeres Frühstück mit verschiedenen Auswahlmöglichkeiten</p>
              <p className='absolute top-2 right-2  text-gray-300'>Frühstück</p>
              {(selectedWeekKey == "nextWeek")   && userName  && Friday18 && (
              <Link href={`/Speiseplan/?modal=true&menudata=${JSON.stringify([selectedTag, selectedDate, "Frühstück"])}&breakfast=true`}>
                <button className='absolute buttom-2 left-2  text-white p-20 text-4xl transparent-button'><MdOutlineShoppingCart /></button>
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