import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

export default function SubadminAccessModal({ isOpen, onClose, subadminId }) {
  const [subadmin, setSubadmin] = useState({});
  const [routes, setRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const handleChange = (event) => {
    const { value, checked } = event.target;
    setSelectedRoutes((prev) =>
      checked ? [...prev, value] : prev.filter((route) => route !== value)
    );
  };

  const getSubadmin = useCallback(async () => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/employee/${subadminId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        const employee = response.data.employee;
        const accessTo = employee.accessTo || {};
        const accessRoutes = Object.keys(accessTo).filter(
          (route) => accessTo[route]
        );

        setSelectedRoutes(accessRoutes);
        setSubadmin(employee);
      }
    } catch (error) {
      console.error("Error fetching subadmin:", error);
    }
  }, [subadminId]);

  const getAccessRoutes = useCallback(async () => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/access`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setRoutes(response.data.routes || []);
      }
    } catch (error) {
      console.error("Error fetching access routes:", error);
    }
  }, []);

  const updateAccesRoutesForSubadmin = async () => {
    try {
      const routesJsonObject = selectedRoutes.reduce((acc, route) => {
        acc[route] = true;
        return acc;
      }, {});

      const authToken = Cookies.get("authToken");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/subadmin/${subadminId}`,
        { accessTo: routesJsonObject },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.valid) {
        onClose(); // Close modal after successful update
      }
    } catch (error) {
      console.error("Error updating access routes:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedRoutes([]); 
      getSubadmin();
      getAccessRoutes();
    }
  }, [isOpen, subadminId, getSubadmin, getAccessRoutes]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[40vw]">
        <h1 className="text-xl font-bold mb-4 text-center">Subadmin Access</h1>

        <div className="flex justify-between mb-2">
          <p className="font-bold">Name:</p>
          <p>{typeof subadmin.name === "string" ? subadmin.name : "N/A"}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {routes.map((route) => {
            if (typeof route === "object") {
              return Object.keys(route).map((key) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    name="routes"
                    value={key}
                    onChange={handleChange}
                    checked={selectedRoutes.includes(key)}
                  />
                  <span className="ml-2 capitalize">{key}</span>
                </label>
              ));
            } else {
              return (
                <label key={route} className="flex items-center">
                  <input
                    type="checkbox"
                    name="routes"
                    value={route}
                    onChange={handleChange}
                    checked={selectedRoutes.includes(route)}
                  />
                  <span className="ml-2 capitalize">{route}</span>
                </label>
              );
            }
          })}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
          <button
            onClick={updateAccesRoutesForSubadmin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
