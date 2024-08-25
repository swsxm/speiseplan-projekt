import React from "react";

const Footer = () => {
  return (
    <footer className="rounded-lg shadow m-4 max-w-[1640px] mx-auto p-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
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

export default Footer;