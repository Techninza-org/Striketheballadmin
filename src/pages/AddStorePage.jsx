import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CreateStorePage = () => {
	const [imageUrl, setImageUrl] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		phone: "",
		storeLocation: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
	
		const formData2 = new FormData();
		formData2.append("file", file); 
	
		try {
		  setUploading(true);
	
		  const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, formData2, {
			  headers: {
				  "Content-Type": "multipart/form-data",
			  }
		  })
		  const data = res.data;
		  setImageUrl(data.file);
		  setFormData({ ...formData, image: data.file });
		} catch (err) {
		  console.error("Upload failed:", err);
		} finally {
		  setUploading(false);
		}
	  };

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

			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/store`, formData, {
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				}
			});

            if(response.data.valid){
                setSuccess("Store created successfully!");
                setFormData({ name: "", address: "", phone: "", storeLocation: "" });
                navigate("/stores");
            }else{
                setError(response.data.message);
            }
            
		} catch (error) {
			setError(error.response?.data?.message || "Failed to create store");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveImage = () => {
		setImageUrl(null);
		setFormData({ ...formData, image: "" });
	  };


	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="New Store" />

			<main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Store</h3>

					{error && <p className="text-red-500">{error}</p>}
					{success && <p className="text-green-500">{success}</p>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Store Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter store name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
							<input
								type="text"
								name="address"
								value={formData.address}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter store address"
							/>
						</div>

						<div className="pb-8">
							<label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
							<input
								type="text"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter phone number"
							/>
						</div>

						{/* <div className="pb-8">
							<label className="block text-sm font-medium text-gray-200 mb-2">Store Location</label>
							<input
								type="text"
								name="storeLocation"
								value={formData.storeLocation}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter store location"
							/>
						</div> */}

						{!imageUrl ? (
    					    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow">
    					      {uploading ? "Uploading..." : "Upload Image"}
    					      <input
    					        type="file"
    					        accept="image/*"
    					        onChange={handleFileChange}
    					        className="hidden"
    					        disabled={uploading}
    					      />
    					    </label>
    					  ) : (
    					    <div className="relative inline-block">
    					      <img src={`${import.meta.env.VITE_BASE_URL}/${imageUrl}`} alt="Uploaded" className="max-w-xs rounded shadow-md" />
    					      <button
    					        onClick={handleRemoveImage}
    					        className="absolute top-1 right-1 bg-white text-red-500 border border-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
    					      >
    					        &times;
    					      </button>
    					    </div>
    					  )}

						<div className="pt-4">
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

export default CreateStorePage;
