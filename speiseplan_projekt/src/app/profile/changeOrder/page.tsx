'use client';
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/components/Navbar";

interface MenuItem {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  type: string;
  day: string;
  date: string;
}

function changeOrders() {
/**
 * Change orders logic
 */
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isPastDate, setIsPastDate] = useState<boolean>(false);

  useEffect(() => {
    function checkIfPastDate(date: Date | null): boolean {
        /**
         * Check if the selected date is in the past
         */
        if (!date) return false;  // Always return a boolean value
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      }
  

    async function fetchOrderItems(date: Date | null) {
      /**
       * Fetch orders for the selected date
       */
      if (!date) return;

      try {
        const response = await fetch(`/api/orders?date=${date.toISOString()}`);
        const data: MenuItem[] = await response.json();
        setOrderItems(data);
        setLoading(false);
        setIsPastDate(checkIfPastDate(date));
      } catch (error) {
        console.error("Fehler beim Abrufen der Bestellungen:", error);
        setLoading(false);
      }
    }

    fetchOrderItems(selectedDate);
  }, [selectedDate]);

  function increaseQuantity(id: string) {
  /**
   * Increase the quantity of the item (disabled for past dates)
   */
    if (isPastDate) return; // Disable functionality for past dates

    const updatedOrderItems = orderItems.map((item: MenuItem) => {
      if (item._id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setOrderItems(updatedOrderItems);
  };

  function decreaseQuantity(id: string) {
  /**
   * Decreases the quantity of the Item (disabled for past dates)
   */
    if (isPastDate) return; // Disable functionality for past dates

    const updatedOrderItems = orderItems.map((item: MenuItem) => {
      if (item._id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setOrderItems(updatedOrderItems);
  };

  function calculateTotalPrice() {
   /**
   * Calculates the total price of all items combined
   */
    let totalPrice = 0;
    for (const item of orderItems) {
      totalPrice += item.price * item.quantity;
    }
    return parseFloat(totalPrice.toFixed(2));
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [orderItems]);

  async function handleConfirmChanges() {
  /**
   * Handle confirmation of order changes (disabled for past dates)
   */
    if (isPastDate) return; // Disable functionality for past dates

    try {
      const updatedMeals = orderItems.map(item => ({
        _id: item._id,
        quantity: item.quantity
      }));

      await fetch("/api/changeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedMeals }),
      });

      alert("Bestellungen wurden erfolgreich aktualisiert!");
    } catch (error) {
      console.log("Fehler beim Bestätigen der Änderungen:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-5 sm:py-7">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2">
            {loading ? 'Lade...' : `Bestellungen für ${selectedDate?.toLocaleDateString("de-DE")}`}
          </h2>
          <div className="mb-4">
            <DatePicker 
              selected={selectedDate} 
              onChange={(date) => setSelectedDate(date)} 
              dateFormat="dd.MM.yyyy"
              className="border rounded-md p-2"
            />
          </div>
        </div>
      </section>

      {!loading && orderItems.length > 0 && (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  {orderItems.map((orderItem) => (
                    <div key={orderItem._id}>
                      <div className="flex items-center border-b border-gray-200 py-4">
                        <div className="flex-none w-24 mr-4">
                          <img src={orderItem.image} alt={orderItem.name} className="w-full" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{orderItem.name}</h3>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => decreaseQuantity(orderItem._id)} 
                              className={`px-2 py-1 ${isPastDate ? 'bg-gray-300 text-gray-400' : 'bg-gray-200 text-gray-600'} rounded-md mr-2`}
                              disabled={isPastDate}
                            >
                              -
                            </button>
                            <span>{orderItem.quantity}</span>
                            <button 
                              onClick={() => increaseQuantity(orderItem._id)} 
                              className={`px-2 py-1 ${isPastDate ? 'bg-gray-300 text-gray-400' : 'bg-gray-200 text-gray-600'} rounded-md ml-2`}
                              disabled={isPastDate}
                            >
                              +
                            </button>
                          </div>
                          <div>{orderItem.date}</div>
                        </div>
                        <div className="flex-none">
                          <p className="font-semibold">{(orderItem.price * orderItem.quantity).toFixed(2)} €</p>
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
                        {orderItems.reduce((acc, item) => acc + item.quantity, 0)} Item(s)
                      </span>
                    </li>
                  </ul>

                  <button 
                    onClick={handleConfirmChanges} 
                    className={`px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium ${isPastDate ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'} border border-transparent rounded-md`}
                    disabled={isPastDate}
                  >
                    Änderungen bestätigen
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

export default changeOrders;
