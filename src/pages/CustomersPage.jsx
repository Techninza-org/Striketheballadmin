import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import StoresTable from "../components/users/StoresTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomersTable from "../components/users/CustomersTable";

const CustomersPage = () => {
	const [stores, setStores] = useState('');
	const fetchStores = async () => {
		try {
		//   const authToken = Cookies.get("authToken");
	
		  const response = await axios.get(
			`${import.meta.env.VITE_BASE_URL}/customer`,
			// {
			//   headers: {
			// 	Authorization: `Bearer ${authToken}`,
			// 	"Content-Type": "application/json",
			//   },
			// }
		  );
	
		  if (response.data.valid) {
			setStores(response.data.customers.length);
		  }
		} catch (error) {
			console.log(error);
		} 
	  };
	
	  useEffect(() => {
		fetchStores();
	  }, []);
	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Customers' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Customers'
						icon={UsersIcon}
						value={stores}
						color='#6366F1'
					/>
				</motion.div>

				<div className="flex justify-end">
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/add-customer">New Customer</a>
				</div>

				<CustomersTable />
			</main>
		</div>
	);
};
export default CustomersPage;
