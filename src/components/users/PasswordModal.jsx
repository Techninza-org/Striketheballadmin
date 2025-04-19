import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

export default function PasswordModal({ isOpen, onClose, empId }) {
  const [emp, setEmp] = useState({});
  const [newPassword, setNewPassword] = useState("");
  async function getEmp() {
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/employee/${empId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setEmp(response.data.employee);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChangePassword() {
    const authToken = Cookies.get("authToken");

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admin/password/employee/${empId}`,
      {
        password: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.valid) {
      alert("Password updated successfully");
      onClose();
    } else {
      alert("Failed to update password");
    }
  }

  useEffect(() => {
    getEmp();
  }, [empId]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[40vw]">
        <h1 className="text-xl font-bold mb-4 text-center">
          Employee Password Update
        </h1>
        <div className="justify-between flex">
          <p className="font-bold">Employee</p>
          <p>{emp?.name}</p>
        </div>
        <div className="justify-between flex">
          <p className="font-bold">Email</p>
          <p>{emp?.email}</p>
        </div>
        <div className="mt-4 flex justify-between">
          <label htmlFor="password" className="font-bold uppercase">
            New Password
          </label>
          <input
            type="text"
            name="password"
            onChange={(e) => setNewPassword(e.target.value)}
            id="password"
            placeholder="Enter New Password"
            className="border border-gray-300 rounded-lg p-2 w-1/3"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={() => handleChangePassword()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
