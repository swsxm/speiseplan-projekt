'use client';
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/components/Navbar";
import { parseCookies } from 'nookies';

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
  orderMealId: string; // Stores the _id of the orderedMeals
}

function ChangeOrders() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [orderItems, setOrderItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isPastDate, setIsPastDate] = useState<boolean>(false);

  useEffect(() => {
    const cookies = parseCookies();
    const employeeId = cookies.employeeID;

    function checkIfPastDate(date: Date | null): boolean {
      if (!date) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }

    async function fetchOrderItems() {
      try {
        const res = await fetch("../api/getOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedDate, userId: employeeId }),
        });

        if (!res.ok) {
          setOrderItems([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setOrderItems(data); // Show all items initially
        } else {
          setOrderItems([]);
          console.warn('Received data is not an array:', data);
        }
        setLoading(false);
        setIsPastDate(checkIfPastDate(selectedDate));
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    fetchOrderItems();
  }, [selectedDate]);

  useEffect(() => {
    if (Array.isArray(orderItems)) {
      setTotalPrice(orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
    }
  }, [orderItems]);

  async function handleConfirmChanges() {
    if (isPastDate) return;

    try {
      const updatedMeals = orderItems.map(item => ({
        orderMealId: item.orderMealId,  // Pass the orderMealId to the backend
        quantity: item.quantity
      }));

      await fetch("../api/changeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedMeals, userId: parseCookies().employeeID, date: selectedDate }),
      });

      alert("Bestellungen wurden erfolgreich aktualisiert!");
      // Optional: Refetch the order items after confirmation to update the list
      setOrderItems(orderItems.filter(item => item.quantity > 0)); // Hide meals with 0 quantity after confirmation
    } catch (error) {
      console.error("Fehler beim Bestätigen der Änderungen:", error);
    }
  }

  function handleDecreaseQuantity(orderItem: MenuItem) {
    setOrderItems(orderItems.map(item =>
      item._id === orderItem._id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
    ));
  }

  function handleIncreaseQuantity(orderItem: MenuItem) {
    setOrderItems(orderItems.map(item =>
      item._id === orderItem._id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }

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
                              onClick={() => handleDecreaseQuantity(orderItem)}
                              className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md mr-2"
                              disabled={isPastDate}
                            >
                              -
                            </button>
                            <span>{orderItem.quantity}</span>
                            <button 
                              onClick={() => handleIncreaseQuantity(orderItem)}
                              className="px-2 py-1 bg-gray-200 text-gray-600 rounded-md ml-2"
                              disabled={isPastDate}
                            >
                              +
                            </button>
                          </div>
                          <div>{orderItem.date}</div> {/* Display the date */}
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
                    <li className="flex justify-between text-gray-600 mb-1">
                      <span>Gesamt Preis</span>
                      <span>{totalPrice} €</span>
                    </li>
                    <li className="flex justify-between text-gray-600 mb-1">
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

      {!loading && orderItems.length === 0 && (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <h3>Keine Bestellungen für das ausgewählte Datum gefunden.</h3>
          </div>
        </section>
      )}
    </div>
  );
}

export default ChangeOrders;
