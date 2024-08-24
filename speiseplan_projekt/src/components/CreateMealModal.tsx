import React, { useState } from 'react';
import { showError } from '@/lib/validationHelpers';

interface CreateMealModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Modal to create a new valid meal
 */
function createMealModal({ isOpen, onClose }: CreateMealModalProps) {
    const [mealName, setMealName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [type, setType] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!mealName || !price || !type || !description || !imageLink) {
            setErrorMessage('Bitte füllen Sie alle erforderlichen Felder aus.');
            return;
        }
        const newMeal = {
            Name: mealName,
            Beschreibung: description,
            price: price,
            link_fur_image: imageLink,
            type: type
        };
        try {
            const res = await fetch("../api/createMeal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newMeal }),
            });
        
            const data = await res.json();
            showError(data)
        } catch (error) {
            console.error(error);
        }

        setMealName('');
        setDescription('');
        setPrice('');
        setImageLink('');
        setType('');
        setErrorMessage('');

        onClose();
    };

    /**
     * Event is triggerd on every price change (input field)
     */
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrice(value);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                                            Neues Gericht erstellen
                                        </h3>
                                        {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                placeholder="Gerichtsname"
                                                value={mealName}
                                                onChange={(e) => setMealName(e.target.value)}
                                                className="block w-full mb-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <textarea
                                                placeholder="Beschreibung"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                maxLength={100}
                                                className="block w-full mb-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Preis"
                                                value={price}
                                                onChange={handlePriceChange}
                                                className="block w-full mb-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Link für Bild"
                                                value={imageLink}
                                                onChange={(e) => setImageLink(e.target.value)}
                                                className="block w-full mb-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="block w-full mb-4 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Typ auswählen</option>
                                                <option value="Menu1">Menu1</option>
                                                <option value="Menu2">Menu2</option>
                                                <option value="Suppe">Suppe</option>
                                                <option value="Nachtisch">Nachtisch</option>
                                            </select>
                                            <div className="flex justify-end">
                                                <button onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 mr-2">Abbrechen</button>
                                                <button onClick={handleSubmit} className="bg-black text-white py-2 px-4 rounded hover:bg-green-500">Gericht erstellen</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default createMealModal;