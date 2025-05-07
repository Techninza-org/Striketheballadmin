import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

export default function BookingDetailModal({ isOpen, onClose, bookingId }) {
  const [booking, setBooking] = useState({});
  async function getBooking() {
    try {
      const authToken = Cookies.get("authToken");
      const storeId = Cookies.get("storeId");
      if (storeId) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/emp/booking/details/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.valid) {
          setBooking(response.data.booking);
        }
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/booking/details/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.valid) {
          setBooking(response.data.booking);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function markPayment() {
    try{
      const authToken = Cookies.get("authToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/booking/payment/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        getBooking();
      }
    }catch(err){
      alert("Error marking payment");
      console.log(err);
    }  
  }

  async function handleSubmitOvers() {
    console.log(bookingId, "id");
    const oversPlayed = document.querySelector(
      'input[name="oversplayed"]'
    ).value;
    if (oversPlayed === "") {
      alert("Please enter overs played");
      return;
    }
    try {
      const authToken = Cookies.get("authToken");
      const storeId = Cookies.get("storeId");
      if(storeId) {
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/emp/booking/${bookingId}`,
          {
            playedOvers: Number(oversPlayed),
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.valid) {
          document.querySelector('input[name="oversplayed"]').value = "";
          window.location.reload();
        }
      }else {
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/admin/booking/${bookingId}`,
          {
            playedOvers: Number(oversPlayed),
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.valid) {
          document.querySelector('input[name="oversplayed"]').value = "";
          window.location.reload();
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBooking();
  }, [bookingId]);

  const handleCheck = (e) => {
    if (parseInt(e.target.value) > booking.oversLeft) {
      e.target.value = booking.oversLeft;
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[40vw]">
        <h1 className="text-xl font-bold mb-4 text-center">Booking Details</h1>
        <div className="justify-between flex">
          <p className="font-bold">Customer</p>
          <p>
            {booking?.customer?.name}, {booking?.customer?.phone}
          </p>
        </div>
        <div className="justify-between flex">
          <p className="font-bold">Payment Status</p>
          <p>{booking?.paid === true ? 'PAID' : 'UNPAID'}</p>
        </div>
        <div className="justify-between flex">
          <p className="font-bold">Total Overs</p>
          <p>{booking?.overs}</p>
        </div>
        <div className="justify-between flex">
          <p className="font-bold">Overs Left</p>
          <p>{booking?.oversLeft}</p>
        </div>
        {booking.paid === false &&  <div className="mt-4 flex justify-between">
         <button className="bg-green-600 text-white rounded-lg p-3" onClick={() => markPayment()}>Mark Payment As Done</button>
        </div>}
        <div className="mt-4 flex justify-between">
          <label htmlFor="oversplayed" className="font-bold uppercase">
            Overs Played
          </label>
          <input
            type="text"
            name="oversplayed"
            onChange={(e) => handleCheck(e)}
            placeholder="Enter Overs Played"
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
            onClick={() => handleSubmitOvers()}
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
