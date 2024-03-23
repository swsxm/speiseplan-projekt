import React from 'react';

interface MenuItem {
  _id: string;
  id: number;
  Name: string;
  Beschreibung: string;
  price: number;
  link_fur_image: string;
  type: string;
}

interface ModalProps {
  param1: MenuItem | null; // Define prop type as MenuItem or null
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ param1, closeModal }) => {
  if (!param1) return null; // Render nothing if param1 is null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white relative z-50">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">{param1.Beschreibung}</p>
          </div>
          <div className="flex justify-center mt-4">
            <span className="close absolute top-0 right-0 m-2 text-gray-600 cursor-pointer" onClick={closeModal}>&times;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
