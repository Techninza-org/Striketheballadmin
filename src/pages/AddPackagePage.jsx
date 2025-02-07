import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddPackage = () => {
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		title: "",
		description: "",
		overs: ""
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const authToken = Cookies.get("authToken");

			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/package`, formData, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

            if(response.data.valid){
                setSuccess("Package created successfully!");
                setFormData({ name: "", price: "", title: "", description: "", overs: "" });
                navigate("/packages");
            }else{
                setError(response.data.message);
            }
            
		} catch (error) {
			setError(error.response?.data?.message || "Failed to create package");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="New Package" />

			<main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Package</h3>

					{error && <p className="text-red-500">{error}</p>}
					{success && <p className="text-green-500">{success}</p>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Package Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter package name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Price</label>
							<input
								type="text"
								name="price"
								value={formData.price}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter package price"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Overs</label>
							<input
								type="text"
								name="overs"
								value={formData.overs}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter package overs"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Title</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
							<input
								type="text"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter package description"
							/>
						</div>

						<div>
							<button
								type="submit"
								className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
								disabled={loading}
							>
								{loading ? "Submitting..." : "Submit"}
							</button>
						</div>
					</form>
				</motion.div>
			</main>
		</div>
	);
};

export default AddPackage;
