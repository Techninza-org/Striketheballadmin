import { DownloadIcon, Upload, UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
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
	const [file, setFile] = useState(null);

	const handleUpload = async () => {
		if (!file) return alert('Please select a file first');
	
		const formData = new FormData();
		formData.append('file', file);
	
		try {
			const authToken = Cookies.get("authToken");
		  const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/upload-sheet`, formData, {
			headers: { 
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'multipart/form-data' 
			},
		  });
	
		  if(res.data.valid) {
			alert('Upload successful');
		  }
		} catch (err) {
		  console.error(err);
		  alert('Upload failed');
		}
	  };
	
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

				
				<div className="flex justify-end items-start gap-10 p-4">
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      {/* Download Button */}
      <a href="/strike sample.csv" download>
        <button className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 p-2 rounded-md text-white transition">
          <DownloadIcon />
          <span className="hidden sm:inline">Sample</span>
        </button>
      </a>

      {/* File Upload Input */}
      <input
        type="file"
        accept=".csv"
        className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Upload Button */}
      <button
        className="flex items-center gap-1 bg-blue-900 hover:bg-blue-800 p-2 rounded-md text-white transition"
        onClick={handleUpload}
      >
        <Upload />
        <span className="hidden sm:inline">Upload</span>
      </button>
    </div>
  </div>

  {/* New Customer Button */}
  <a
    className="bg-white hover:bg-gray-100 text-blue-800 border border-blue-800 p-2 rounded-md font-bold transition"
    href="/add-customer"
  >
    New Customer
  </a>
</div>

				<CustomersTable />
			</main>
		</div>
	);
};
export default CustomersPage;
