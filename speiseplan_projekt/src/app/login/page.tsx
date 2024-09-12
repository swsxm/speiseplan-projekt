"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    /*
      handle login after submit
    */
    e.preventDefault();

    if (!password || !id) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        // Ensure the correct path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.replace("/");
      } else {
        setError(data.error || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="shadow-lg p-8 rounded-lg border-t-4 border-green-400">
          <h1 className="text-xl font-bold my-4">Anmelden</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              Login
            </button>

            {error && (
              <div className="bg-red-500 text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Link className="text-sm mt-4" href="/register">
                Haben Sie noch keinen Account?{" "}
                <span className="underline">Registrieren</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
