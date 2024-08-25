"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function registerForm() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  /**
   * Register logic
   */
    e.preventDefault();
    // Check password safety  
    if (!name || !email || !password || !id) {
      setError("All fields are necessary.");
      return;
    }
    try {
      // Create User
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          id,
          password,
        }),
      });
      const status = await res.json();
      console.log(status.status);
      if (status.status === 201) {
        const form = e.currentTarget;
        if (form instanceof HTMLFormElement) {
          form.reset();
        }
        router.push("/");
      } else if (status.status === 400) {
        setError(status.error);
      } else {
        console.log(status.status);
        setError("Error");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="shadow-lg p-8 rounded-lg border-t-4 border-green-400 w-full max-w-md">
          <h1 className="text-xl font-bold my-4">Registrieren</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="py-2 px-3 border rounded"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="py-2 px-3 border rounded"
            />
            <input
              onChange={(e) => setId(e.target.value)}
              type="number"
              placeholder="Mitarbeiter-Nummer"
              className="py-2 px-3 border rounded"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Passwort"
              className="py-2 px-3 border rounded"
            />
            <button className="bg-green-600 text-white font-bold cursor-pointer py-2 px-6 rounded">
              Register
            </button>

            {error && (
              <div className="bg-red-500 text-white p-2 rounded-md mt-2 overflow-auto h-20">
                {error}
              </div>
            )}

            <Link className="text-sm mt-4 text-right" href={"/login"}>
              Haben Sie bereits einen Account? <span className="underline">Anmelden</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
