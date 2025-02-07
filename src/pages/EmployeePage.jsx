import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import EmployeeTable from "../components/users/EmployeeTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EmployeePage = () => {
    const [emp, setEmp] = useState('');
    const fetchEmployees = async () => {
        try {
          const authToken = Cookies.get("authToken");
    
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/employee`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.data.valid) {
            setEmp(response.data.employees.length);
          }
        } catch (error) {
            console.log(error);
        }
      };
    
      useEffect(() => {
        fetchEmployees();
      }, []);
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Employees' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Employees'
						icon={UsersIcon}
						value={emp}
						color='#6366F1'
					/>
					{/* <StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' /> */}
					{/* <StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/> */}
					{/* <StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' /> */}
				</motion.div>

				<div className="flex justify-end">
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/add-employee">New Employee</a>
				</div>

				<EmployeeTable />

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
export default EmployeePage;
