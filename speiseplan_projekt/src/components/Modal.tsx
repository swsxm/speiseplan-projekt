import React, { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  day: string;
  date: string;
  quantity: number;
}

interface ModalProps {
  param1: MenuItem | null;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ param1, closeModal }) => {
  const [itemAdded, setItemAdded] = useState(false);

  function addToCart() {
    if (param1) {
      const itemWithQuantity: MenuItem = { ...param1, quantity: 1 };
      const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const isItemInCart = currentCart.some((item: MenuItem) => item._id === itemWithQuantity._id);
      
      if (!isItemInCart) {
        const updatedCart = [...currentCart, itemWithQuantity];
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        setItemAdded(true); 
        closeModal();
      } else {
        setItemAdded(true); 
      }
    }
  };
  
  if (!param1) return null; 
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative z-50">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{param1.name}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">{param1.description}</p>
            <p className="text-lg text-gray-500">{param1.type}</p>
            <p className="text-lg text-gray-500">{param1.date}</p>
            <p className="text-lg text-gray-500">{param1.day}</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{param1.price}€</h3>
          <div className="flex justify-center mt-4">
            <span className="close absolute top-0 right-0 m-2 text-gray-600 cursor-pointer" onClick={closeModal}>&times;</span>
          </div>
          {itemAdded && <p className="text-red-500">Ausgewähltes Menü ist bereits im Einkaufswagen</p>}
          {/* Button */}
          {!itemAdded && <button className="bg-green-400 text-white rounded-md w-full py-2 mt-4" onClick={addToCart}>Warenkorb hinzufügen</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
