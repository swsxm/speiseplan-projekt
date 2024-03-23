import React, { useState } from 'react';

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
}

interface ModalProps {
  param1: MenuItem | null; // Define prop type as MenuItem or null
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ param1, closeModal }) => {
    const [itemAdded, setItemAdded] = useState(false); // Zustand, um zu überprüfen, ob das Element bereits hinzugefügt wurde
    const [isItemInCart, setIsItemInCart] = useState(false); // Zustand, um zu überprüfen, ob das Element bereits im Warenkorb ist
  
    const addToCart = () => {
      if (param1) {
        // Aktuelle Liste aus dem Local Storage abrufen
        const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]'); // Standardwert als leeres Array, falls cartItems nicht vorhanden ist oder kein gültiges JSON enthält
        
        // Check if the item is already in the cart
        const isItemInCart = currentCart.some((item: MenuItem) => item._id === param1._id);
        
        if (!isItemInCart) {
          // Neue Element zur Liste hinzufügen
          const updatedCart = [...currentCart, param1];
          // Aktualisierte Liste im Local Storage speichern
          localStorage.setItem('cartItems', JSON.stringify(updatedCart));
          setItemAdded(true); 
          closeModal();
        } else {
          setIsItemInCart(true); // Setze den Zustand, um anzuzeigen, dass das Element bereits im Warenkorb ist
        }
      }
    };
  
    if (!param1) return null; // Render nothing if param1 is null
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
        <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative z-50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">{param1.Name}</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-lg text-gray-500">{param1.Beschreibung}</p>
              <p className="text-lg text-gray-500">{param1.type}</p>
              <p className="text-lg text-gray-500">{param1.date}</p>
              <p className="text-lg text-gray-500">{param1.day}</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{param1.price}€</h3>
            <div className="flex justify-center mt-4">
              <span className="close absolute top-0 right-0 m-2 text-gray-600 cursor-pointer" onClick={closeModal}>&times;</span>
            </div>
            {isItemInCart && <p className="text-red-500">Item is already in the cart</p>}
            {/* Button */}
            {!isItemInCart && <button className="bg-green-400 text-white rounded-md w-full py-2 mt-4" onClick={addToCart}>Warenkorb hinzufuegen</button>}
          </div>
        </div>
      </div>
    );
  };
  

export default Modal;
