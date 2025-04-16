import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PasswordTable from "../components/users/PasswordTable";

const PasswordPage = () => {
    
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Update Password' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>	
				</motion.div>

				<PasswordTable />

				
			</main>
		</div>
	);
};
export default PasswordPage;
