import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
// import ProductsTable from "../components/products/ProductsTable";
import { useState } from "react";

const PostProductsPage = () => {
	const [formData, setFormData] = useState({
		productName: "",
		category: "",
		price: "",
		stock: "",
		description: "",
		image: null,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here (e.g., API call)
		console.log(formData);
		alert("Product submitted successfully!");
	};

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Products" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* STATS */}
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name="Total Products" icon={Package} value={1234} color="#6366F1" />
					<StatCard name="Top Selling" icon={TrendingUp} value={89} color="#10B981" />
					<StatCard name="Low Stock" icon={AlertTriangle} value={23} color="#F59E0B" />
					<StatCard name="Total Revenue" icon={DollarSign} value={"$543,210"} color="#EF4444" />
				</motion.div>

				{/* <ProductsTable /> */}

				{/* FORM */}
				<motion.div
					className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Product</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Product Name */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Product Name</label>
							<input
								type="text"
								name="productName"
								value={formData.productName}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter product name"
							/>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
							<input
								type="text"
								name="category"
								value={formData.category}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter category"
							/>
						</div>

						{/* Price */}
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

						{/* Stock */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Stock</label>
							<input
								type="number"
								name="stock"
								value={formData.stock}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter stock quantity"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter product description"
								rows={4}
							></textarea>
						</div>

						{/* Image Upload */}
						<div>
							<label className="block text-sm font-medium text-gray-200 mb-2">Upload Image</label>
							<input
								type="file"
								name="image"
								onChange={handleImageChange}
								accept="image/*"
								required
								className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
							>
								Submit
							</button>
						</div>
					</form>
				</motion.div>
			</main>
		</div>
	);
};

export default PostProductsPage;
