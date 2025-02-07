import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import EmployeeTable from "../components/users/EmployeeTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import BookingsTable from "../components/users/BookingsTable";

const BookingPage = () => {
    const [emp, setEmp] = useState('');
	const [bookings, setBookings] = useState([]);
	const [stores, setStores] = useState([]);
	const [selectedStore, setSelectedStore] = useState('0');
    const fetchBookings = async () => {
        try {
          const authToken = Cookies.get("authToken");
    
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/booking`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.data.valid) {
            setEmp(response.data.bookings.length);
			setBookings(response.data.bookings);
          }
        } catch (error) {
            console.log(error);
        }
      };
    const fetchStores = async () => {
        try {
          const authToken = Cookies.get("authToken");
    
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/store`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.data.valid) {
            setStores(response.data.stores);
          }
        } catch (error) {
            console.log(error);
        }
      };
    
      useEffect(() => {
        fetchStores();
		fetchBookings();
      }, []);

	  const handleStoreChange = (e) => {
		const storeId = e.target.value;
		setSelectedStore(storeId);
	
		if (storeId === '0') {
			fetchBookings(); // Fetch all bookings if "All Stores" is selected
		} else {
			fetchBookingsByStore(storeId); // Pass the storeId directly
		}
	};
	
	const fetchBookingsByStore = async (storeId) => {
		try {
			const authToken = Cookies.get("authToken");
	
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/admin/booking/${storeId}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "application/json",
					},
				}
			);
	
			if (response.data.valid) {
				setBookings(response.data.bookings);
			}
		} catch (error) {
			console.log(error);
		}
	};
	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Bookings' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Bookings'
						icon={UsersIcon}
						value={emp}
						color='#6366F1'
					/>
				</motion.div>
				<div className="flex justify-between">
					<div>
						<select
							name="storeId"
							value={selectedStore}
							onChange={handleStoreChange}
							required
							className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
							<option value="0">All Stores</option>
							{stores?.map((store) => (
								<option key={store.id} value={store.id}>
									{store.name}
								</option>
							))}
						</select>
					</div>
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/add-booking">New Booking</a>
				</div>
				<BookingsTable bookings={bookings} />
			</main>
		</div>
	);
};
export default BookingPage;
