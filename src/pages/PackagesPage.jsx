import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import StoresTable from "../components/users/StoresTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PackagesTable from "../components/users/PackagesTable";

const PackagesPage = () => {
	const [stores, setStores] = useState('');
	const fetchStores = async () => {
		try {
		  const authToken = Cookies.get("authToken");
	
		  const response = await axios.get(
			`${import.meta.env.VITE_BASE_URL}/admin/package`,
			{
			  headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			  },
			}
		  );
	
		  if (response.data.valid) {
			setStores(response.data.packages.length);
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
			<Header title='Packages' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Packages'
						icon={UsersIcon}
						value={stores}
						color='#6366F1'
					/>
					{/* <StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' /> */}
				</motion.div>

				{/* <div className="flex justify-end">
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/add-package">New Package</a>
				</div> */}

				<PackagesTable />

				{/* USER CHARTS */}
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div> */}
			</main>
		</div>
	);
};
export default PackagesPage;
