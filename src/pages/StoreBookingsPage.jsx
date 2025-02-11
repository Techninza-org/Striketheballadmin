import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import EmployeeTable from "../components/users/EmployeeTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import BookingsTable from "../components/users/BookingsTable";

const StoreBookingsPage = () => {
    const [emp, setEmp] = useState('');
	const [bookings, setBookings] = useState([]);
	const [status, setStatus] = useState('');
    const fetchBookings = async () => {
        try {
          const authToken = Cookies.get("authToken");
    
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/emp/booking`,
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

	  const fetchBookingsByStatusEmp = async (status) => {
		try {
			const authToken = Cookies.get("authToken");
	
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/emp/booking/status/${status}`,
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

	  const handleStatusChange = (e) => {
		const status = e.target.value;
		setStatus(status);
			
		if (status === 'all') {
			fetchBookings(); 
		} else {
			fetchBookingsByStatusEmp(status); 
		}
	}
    
      useEffect(() => {
		fetchBookings();
      }, []);


	
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
							name="status"
							value={status}
							onChange={handleStatusChange}
							required
							className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
							<option value="all">All</option>
							<option value="0">Pending</option>
							<option value="1">Completed</option>
						</select>
					</div>
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/store-add-booking">New Booking</a>
				</div>
				<BookingsTable bookings={bookings} />
			</main>
		</div>
	);
};
export default StoreBookingsPage;
