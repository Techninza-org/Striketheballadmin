import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({ title }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const authToken = Cookies.get("authToken");
  const base64Url = authToken.split(".")[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64URL to Base64
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const payload = JSON.parse(jsonPayload);
        const email = payload.email;
        const name = payload.name;


  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("storeId");
    Cookies.remove("accessTo");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          {/* <img
					src="https://flowbite.com/docs/images/logo.svg"
					className="h-8"
					alt="Flowbite Logo"
				/> */}
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {title}
          </span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={toggleDropdown}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            type="button"
          >
            <span className="sr-only">Open user menu</span>
            {/* <img
              className="w-8 h-8 rounded-full"
              src="./profile.png"
              alt="user photo"
            /> */}
            <div className="rounded-full bg-white w-8 h-8 grid place-content-center">
              <div className="font-medium truncate text-black ">{email[0].toUpperCase()}</div>
            </div>
          </button>
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-10 top-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 z-50">
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div className="font-medium truncate">{email}</div>
              </div>
              {/* <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
              </ul> */}
              <div className="py-2">
                <p
                  onClick={handleLogout}
                  className="block px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Log out
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
