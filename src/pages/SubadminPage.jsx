import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import EmployeeTable from "../components/users/EmployeeTable";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SubadminTable from "../components/users/SubadminTable";

const SubadminPage = () => {
    const [emp, setEmp] = useState('');
    const fetchEmployees = async () => {
        try {
          const authToken = Cookies.get("authToken");
    
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/subadmin`,
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
			<Header title='Subadmins' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Subadmins'
						icon={UsersIcon}
						value={emp}
						color='#6366F1'
					/>
				</motion.div>

				<div className="flex justify-end">
					<a className="bg-white text-blue-800 p-2 rounded-md mb-4 font-bold" href="/admin/add-subadmin">New Subadmin</a>
				</div>

				<SubadminTable />
			</main>
		</div>
	);
};
export default SubadminPage;
