import React from "react";

const footer = () => {
  return (
    <footer className="rounded-lg shadow m-4 max-w-[1640px] mx-auto p-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src="https://cdn.freelogodesign.org/files/7f75b6d80de74507ad816d7d6a76e572/thumb/logo_200x200.png?v=0" className="h-8" alt="Kantinerado Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Kantinerado</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-black">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Über uns</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Lizensen</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Kontakt</a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-black sm:text-center ">© 2024 <a href="/" className="hover:underline">Kantinerado™</a>. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default footer;