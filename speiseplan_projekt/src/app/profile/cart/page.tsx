'use client';
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import generatePDF from "@/lib/generatePDF"

interface MenuItem {
  _id: string;
  id: number;
  Name: string;
  Beschreibung: string;
  price: number;
  quantity: number;
  link_fur_image: string;
  type: string;
  day: string;
  date: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const rawDataFromLocalStorage = localStorage.getItem("cartItems");
      if (!rawDataFromLocalStorage) {
        console.warn("Keine Elemente im Local Storage gefunden");
        setLoading(false); 
        return [];
      }
  
      try {
        const parsedData: MenuItem[] = JSON.parse(rawDataFromLocalStorage);
        setCartItems(parsedData);
        setLoading(false); 
      } catch (error) {
        console.error("Fehler beim Parsen der Daten aus dem Local Storage:", error);
        setLoading(false); 
      }
    };
  
    loadFromLocalStorage();
  }, []);
  console.log(cartItems)
  const removeItemFromCart = (idToRemove: number) => {
    const updatedCartItems = cartItems.filter((item: MenuItem) => item.id !== idToRemove);
  
    setCartItems(updatedCartItems);
    
    const rawDataFromLocalStorage = localStorage.getItem('cartItems');
    if (rawDataFromLocalStorage) {
      try {
        const rawData: MenuItem[] = JSON.parse(rawDataFromLocalStorage);
        
        const updatedRawData = rawData.filter(item => item.id !== idToRemove);
  
        localStorage.setItem('cartItems', JSON.stringify(updatedRawData));
      } catch (error) {
        console.error('Fehler beim Parsen der Daten aus dem Local Storage:', error);
      }
    }
  };
  const increaseQuantity = (id: number) => {
    const updatedCartItems = cartItems.map((item: MenuItem) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };
  
  const decreaseQuantity = (id: number) => {
    const updatedCartItems = cartItems.map((item: MenuItem) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.price * item.quantity;
    }
    return parseFloat(totalPrice.toFixed(2)); 
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [cartItems]);
  const clearCart = () => {
    // Leere den Warenkorb im Zustand
    setCartItems([]);
    
    // Entferne den Warenkorb-Eintrag aus dem Local Storage
    localStorage.removeItem('cartItems');
    window.location.reload();
  };
  const handleContinue = async () => {
    try {
      const ordered_meals_id = cartItems.map(item => ({
        type: item.id,
        quantity: item.quantity,
        date: item.date,
        day: item.day
      }));
      const res = await fetch("../api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ordered_meals_id}),
      });
      const pdfBlob = await generatePDF(cartItems);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'bestelluebersicht.pdf');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); 

      clearCart();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <section className="py-5 sm:py-7">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2">
            {loading ? 'Loading...' : `${cartItems.length || 0} Item(s) in Cart`}
          </h2>
        </div>
      </section>

      {!loading && cartItems.length > 0 && (
  <section className="py-10">
  <div className="container max-w-screen-xl mx-auto px-4">
    <div className="flex flex-col md:flex-row gap-4">
      <main className="md:w-3/4">
        <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
          {cartItems.map((cartItem) => (
            <div key={cartItem.id}>
              <div className="flex items-center border-b border-gray-200 py-4">
                <div className="flex-none w-24 mr-4">
                  <img src={cartItem.link_fur_image} alt={cartItem.Name} className="w-full" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{cartItem.Name}</h3>
                  <div className="flex items-center mt-2">
                    <button onClick={() =>decreaseQuantity(cartItem.id)} className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md mr-2">-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() =>increaseQuantity(cartItem.id)} className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md ml-2">+</button>
                  </div>
                  <div>{cartItem.date}</div>
                </div>
                <div className="flex-none">
                  <p className="font-semibold">{(cartItem.price! * cartItem.quantity).toFixed(2)} €</p>
                  <button onClick={() => removeItemFromCart(cartItem.id)} className="text-red-500">Löschen</button>

                </div>
              </div>
            </div>
          ))}
        </article>
      </main>
      <aside className="md:w-1/4">
        <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
          <ul className="mb-5">
            <li className="flex justify-between text-gray-600  mb-1">
              <span>Gesamt Preis</span>
              <span>{totalPrice} €</span>
            </li>
            <li className="flex justify-between text-gray-600  mb-1">
              <span>Anzahl:</span>
              <span className="text-green-500">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Item(s)
              </span>
            </li>
          </ul>

          <button onClick={() => handleContinue()} className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer">
            Weiter
          </button>

          <button  onClick={() => clearCart()}className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100">
            Warenkorb leeren
            </button>
          </article>
        </aside>
      </div>
    </div>
  </section>
      )}
    </div>
    
  );
};

export default Cart;
