import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function EditCustomerModal({ cust_id, onClose }) {
  const [customer, setCustomer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getCustomer() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customer/${cust_id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setCustomer(response.data.customer);
      } else {
        setError("Invalid customer data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError("Failed to fetch customer data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (cust_id) {
      getCustomer();
    }
  }, [cust_id]);

    async function handleUpdateCustmer() {
        try {
            const response = await axios.put(
              `${import.meta.env.VITE_BASE_URL}/customer/${cust_id}`,
              {
                name: customer.name,
                email: customer.email
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.data.valid) {
              setCustomer(response.data.customer);
              onClose();
            } else {
              setError("Invalid customer data");
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            setError("Failed to fetch customer data");
          } finally {
            setIsLoading(false);
          }
    }


  if (!cust_id) return null; 

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[40vw]">
        <h1 className="text-xl font-bold mb-4 text-center">Customer Details</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="justify-between flex mb-4"> 
              <p className="font-bold">Customer Name</p>
              <input type="text" className="border-b-2 border-black pb-1 outline-none" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})}/>
            </div>
            <div className="justify-between flex">
              <p className="font-bold">Email</p>
              <input type="text" className="border-b-2 border-black pb-1 outline-none" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} />
            </div>
            
          </>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={() => handleUpdateCustmer()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}