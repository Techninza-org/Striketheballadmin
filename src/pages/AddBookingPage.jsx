import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddBooking = () => {
	const [formData, setFormData] = useState({
		customerId: "",
		bookingType: "",
		storeId: "",
		overs: "",
		price: "",
        packageId: "",
	});
	const [customers, setCustomers] = useState([]);
	const [packages, setPackages] = useState([]);
	const [stores, setStores] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authToken = Cookies.get("authToken");
				const [customersResponse, storesResponse, packagesResponse] = await Promise.all([
					axios.get(`${import.meta.env.VITE_BASE_URL}/customer`, {
						headers: {
							// Authorization: `Bearer ${authToken}`,
						},
					}),
					axios.get(`${import.meta.env.VITE_BASE_URL}/admin/store`, {
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}),
					axios.get(`${import.meta.env.VITE_BASE_URL}/admin/package`, {
						headers: {
							Authorization: `Bearer ${authToken}`    ,
						},
					}),
				]);

				setCustomers(customersResponse.data.customers);
				setStores(storesResponse.data.stores);
                setPackages(packagesResponse.data.packages);
			} catch (error) {
                console.log(error);
				setError("Failed to fetch data");
			}
		};

		fetchData();
	}, []);

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

			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/admin/booking`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.valid) {
				setSuccess("Booking created successfully!");
				setFormData({
					customerId: "",
					bookingType: "",
					storeId: "",
					overs: "",
					price: "",
                    packageId: "",
				});
				navigate("/bookings");
			} else {
				setError(response.data.message);
			}
		} catch (error) {
			setError(error.response?.data?.message || "Failed to create booking");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="New Booking" />
            <div className="flex justify-end">
					<a className="bg-white text-blue-800 p-2 rounded-md mt-4 mr-4 font-bold" href="/add-customer">New Customer</a>
			</div>

			<main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Booking</h3>

					{error && <p className="text-red-500">{error}</p>}
					{success && <p className="text-green-500">{success}</p>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Customer</label>
							<select
								name="customerId"
								value={formData.customerId}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select a customer</option>
								{customers?.map((customer) => (
									<option key={customer.id} value={customer.id}>
										{customer.name}
									</option>
								))}
							</select>
						</div>

                        <div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Store</label>
							<select
								name="storeId"
								value={formData.storeId}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select a store</option>
								{stores?.map((store) => (
									<option key={store.id} value={store.id}>
										{store.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Booking Type</label>
							<select
								name="bookingType"
								value={formData.bookingType}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select booking type</option>
								<option value="Package">Package</option>
								<option value="Custom">Custom</option>
							</select>
						</div>

						{formData.bookingType === "Custom" && (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-200 mb-2">Overs</label>
									<input
										type="number"
										name="overs"
										value={formData.overs}
										onChange={handleInputChange}
										required
										className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter overs"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-200 mb-2">Price</label>
									<input
										type="number"
										name="price"
										value={formData.price}
										onChange={handleInputChange}
										required
										className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter price"
									/>
								</div>
							</>
						)}

                        {formData.bookingType === "Package" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Package</label>
                                    <select
                                        name="packageId"
                                        value={formData.packageId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a package</option>
                                        {packages?.map((pack) => (
                                            <option key={pack.id} value={pack.id}>
                                                {pack.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

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

export default AddBooking;