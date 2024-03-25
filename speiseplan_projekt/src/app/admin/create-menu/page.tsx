"use client";
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import CreateMealModal from '@/components/CreateMealModal';
import { FaRegPlusSquare } from "react-icons/fa";

export default function Speiseplan() {
    
    //Bekomme die Daten für die übernächste Woche und schreibe sie in NewWeek
    const currentDate = new Date();
    const currentDayNumber = currentDate.getDay();
    const startOfNewWeek = new Date(currentDate);
    startOfNewWeek.setUTCDate(startOfNewWeek.getDate() - currentDayNumber + (currentDayNumber === 0 ? -6 : 1) + 14);
    const NewWeek = [];
    //Befüllen von NewWeek
    for (let i = 0; i < 6; i++) {
        const day = new Date(startOfNewWeek);
        day.setDate(day.getDate() + i);
        const formattedDate = day.toISOString().slice(0, 10);
        NewWeek.push(formattedDate);
    }

    //Variablen
    const [currentPath, setCurrentPath] = useState('/');
    const [isCreateMealModalOpen, setIsCreateMealModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(NewWeek[0]);
    const [selectedType, setSelectedType] = useState("");
    const types = ['Menu1', 'Menu2', 'Nachtisch', 'Suppe'];
    
    // Überprüfen ob neue woche bereits besteht, wenn nicht neue erstellen
    const existNewWeek = async () => {
        try {
            const res = await fetch("../api/setNewWeek", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    
                    // Falls Daten mit der Anfrage gesendet werden müssen, können sie hier hinzugefügt werden
                })
            });
            console.log("Neue Woche erfolgreich erstellt.");
        } catch (error) {
            console.error("Fehler beim Senden der Anfrage:", error);
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
    
    interface MenuItem {
        _id: string;
        id: number;
        Name: string;
        Beschreibung: string;
        price: number;
        link_fur_image: string;
        type: string;
      }
    const [menuData, setMenuData] = React.useState<MenuItem[]>([]); // State für Menüdaten
    // Funktion zum Laden der Menüdaten
    const loadMenuData = async (type : string) => {
        try {
        const res = await fetch("../api/fetchType", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(type),
        });
        const data = await res.json();
        // Die Daten haben eine verschachtelte Struktur, also müssen wir sie entpacken
        const flattenedData = data.flat(); // Entpacke die verschachtelten Arrays
        setMenuData(flattenedData); // Menüdaten setzen, sobald sie geladen sind
        } catch (error) {
        console.log(error);
        }
    };
    const [menuInDB, setMenuInDB] = React.useState<MenuItem[]>([]); // State für Menüdaten
    // Funktion zum Laden der Menüdaten
    const loadMealInDB = async (type : string) => {
        try {
        const res = await fetch("../api/getMenuCreate", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: selectedDay,
                type: type
            }),            
        });
        const data = await res.json();
        // Die Daten haben eine verschachtelte Struktur, also müssen wir sie entpacken
        const flattenedData = data.flat(); // Entpacke die verschachtelten Arrays
        setMenuInDB(flattenedData); // Menüdaten setzen, sobald sie geladen sind
        } catch (error) {
        console.log(error);
        }
    };
    console.log(menuInDB,"Back in Page");
    const handleDaySelection = (day : string) => {
        setSelectedDay(day);
        setSelectedType("");
        setMenuData([]);
        setMenuInDB([]);
    };
    const handleTypeSelection = (type : string) =>{
        setSelectedType(type);
        loadMenuData(type);
        loadMealInDB(type);
    };

    async function handleAddToMenu(item: MenuItem) {
        try {
            const res = await fetch("../api/updateMenuItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item, selectedDay}),
            });
            const data = await res.json();
        } catch (error) {
            console.log(error);
        }
        loadMealInDB(item.type);
    }
    console.log('jaa')
    return (
        <div>
            <Navbar />
            {/*Navigation*/}
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
            {/*Auswahl der Wochentage */}
            <div className="flex justify-center mt-4 space-x-4">
                {NewWeek.map((day, index) => (
                    <button
                        onClick={() => handleDaySelection(day)}
                        key={index}
                        className={`px-4 py-2 rounded-md border ${selectedDay === day ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 focus:outline-none`}
                    >
                        {new Date(day).toLocaleDateString('de-DE', { weekday: 'long' })}
                    </button>
                ))}
            </div>
            <br />
            {/* Auswahl des types */}
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
            {/* Meal in DB */}
            <div className='max-w-[820px] mx-auto p-4 py-12 grid md:grid-cols-1 gap-6 justify-center'>
            {menuInDB.map((item, index) => (
                <div key={item._id} className='rounded-xl relative' data-testid={`assigned-meal-${index}`}> 
                {/* Overlay */}
                <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col overflow-hidden'>
                    <p className='font-bold text-2xl mb-2 overflow-hidden'>{item.Name}</p>
                    <p className='text-sm overflow-hidden px-2'>{item.Beschreibung}</p>
                    <p className='absolute top-2 right-2 text-gray-300'>{item.type}</p>
                    <p className='absolute bottom-2 right-2 text-2xl pt-5 pr-5 mt-20'>{item.price}€</p>
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
         
             <div className='max-w-[1640px] mx-auto p-4 py-12 grid md:grid-cols-2 gap-6'>
                {/* Karten für die Menüpunkte des ausgewählten Tags */}
                {menuData.map((item, index) => (
                <div key={index} className='rounded-xl relative'>
                    {/* Overlay */}
                    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white rounded-xl p-4 flex flex-col overflow-hidden'>
                    <p className='font-bold text-2xl mb-2 overflow-hidden'>{item.Name}</p>
                    <p className='text-sm overflow-hidden px-2'>{item.Beschreibung}</p>
                    <p className='absolute top-2 right-2  text-gray-300'>{item.type}</p>
                    <button className='absolute bottom-2 left-2 text-white p-2 text-4xl' onClick={() => handleAddToMenu(item)}><FaRegPlusSquare /></button>
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
        </div>
    );
}