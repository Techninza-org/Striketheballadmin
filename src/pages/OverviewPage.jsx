import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import Cookies from "js-cookie";


const OverviewPage = () => {
	const [stores, setStores] = useState('');
	const [employees, setEmployees] = useState('');
	const [packages, setPackages] = useState('');
	const [bookings, setBookings] = useState('');
	const [customers, setCustomers] = useState('');
	const [todayLeads, setTodayLeads] = useState('');
	const [monthLeads, setMonthLeads] = useState('');
	const [todayCallBacks, setTodayCallBacks] = useState('');
	const [sources, setSources] = useState([]);
	const [stages, setStages] = useState([]);
	const storeId = Cookies.get("storeId");
	const fetchStores = async () => {
		try {
			if(storeId){
				const authToken = Cookies.get("authToken");
				const response = await axios.get(
					`${import.meta.env.VITE_BASE_URL}/emp/dashboard`,
					{
						headers: {
						  Authorization: `Bearer ${authToken}`,
						  "Content-Type": "application/json",
						},
					  }
				  );
			
				  if (response.data.valid) {
					setStores(response.data.stores);
					setEmployees(response.data.employees);
					setPackages(response.data.packages);	
					setBookings(response.data.bookings);
				  }
			}else{
		  const response = await axios.get(
			`${import.meta.env.VITE_BASE_URL}/auth/dashboard-details`
		  );
	
		  if (response.data.valid) {
			setStores(response.data.stores);
			setEmployees(response.data.employees);
			setPackages(response.data.packages);	
			setBookings(response.data.bookings);
			setCustomers(response.data.customers);
			setTodayLeads(response.data.todayLeads);
			setMonthLeads(response.data.monthLeads);
			setSources(response.data.sources);
			setStages(response.data.stages);
			setTodayCallBacks(response.data.todayCallBacks);
		  }
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
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Bookings' icon={ShoppingBag} value={bookings} color='#EC4899' />
					<StatCard name='Total Packages' icon={BarChart2} value={packages} color='#10B981' />
					{!storeId && <StatCard name='Total Stores' icon={Zap} value={stores} color='#6366F1' />}
					{!storeId && <StatCard name='Total Employees' icon={Users} value={employees} color='#8B5CF6' />}
					{!storeId && <StatCard name='Total Customers' icon={Users} value={customers} color='#8B5CF6' />}
					{!storeId && <StatCard name='Today Leads' icon={Users} value={todayLeads} color='#8B5CF6' />}
					{!storeId && <StatCard name='Month Leads' icon={Users} value={monthLeads} color='#8B5CF6' />}
					{!storeId && <StatCard name='Today CallBacks' icon={Users} value={todayCallBacks} color='#8B5CF6' />}
					{stages.map((stage) => (
						<StatCard name={stage.name} icon={Users} value={stage.leadsCount} color='#8B5CF6' />
					))}
					{sources.map((source) => (
						<StatCard name={source.name} icon={Users} value={source.leadsCount} color='#8B5CF6' />
					))}
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* <SalesOverviewChart /> */}
					{/* <CategoryDistributionChart /> */}
					{/* <SalesChannelChart /> */}
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
