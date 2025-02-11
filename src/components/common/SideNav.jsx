import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
	BarChart2,
	BookImageIcon,
	DollarSign,
	DollarSignIcon,
	Menu,
	Package,
	Settings,
	ShoppingBag,
	ShoppingCart,
	TrendingUp,
	User2Icon,
	Users,
} from "lucide-react";
import { useState } from "react";

export default function SideNav({ links, isSidebarOpen, setIsSidebarOpen }) {
    const location = useLocation();
  return (
    <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
      <div className="flex gap-10 items-center ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>
        {isSidebarOpen && (
          <img src="logo.png" alt="Logo" width={120} height={40} />
        )}
      </div>

      <nav className="mt-8 flex-grow">
        {links.map((item) => (
          <Link key={item.href} to={item.href}>
            <motion.div
              className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                location.pathname === item.href
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon
                size={20}
                style={{ color: item.color, minWidth: "20px" }}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
