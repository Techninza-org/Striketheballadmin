import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ITEMS_PER_PAGE = 10; // Number of items per page

const PRODUCT_DATA = [
	{ id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200, date: "2023-12-01" },
	{ id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800, date: "2023-12-05" },
	{ id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650, date: "2023-11-28" },
	{ id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950, date: "2023-12-10" },
	{ id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 6, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 7, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 8, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 9, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 10, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 11, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 12, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 13, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 14, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 15, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 16, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	{ id: 17, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720, date: "2023-11-25" },
	// Add more dummy data here if needed
];

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);
	const [currentPage, setCurrentPage] = useState(1);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		filterProducts(term, startDate, endDate);
	};

	const filterProducts = (term, start, end) => {
		const filtered = PRODUCT_DATA.filter((product) => {
			const isInDateRange = !start || !end || 
				(new Date(product.date) >= new Date(start) && new Date(product.date) <= new Date(end));
			const matchesSearch =
				product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
			return isInDateRange && matchesSearch;
		});
		setFilteredProducts(filtered);
		setCurrentPage(1); // Reset to first page on filter
	};

	const handleDateChange = (start, end) => {
		setStartDate(start);
		setEndDate(end);
		filterProducts(searchTerm, start, end);
	};

	// Pagination logic
	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const goToPage = (page) => setCurrentPage(page);

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Product List</h2>
				<div className="flex gap-4 items-center">
					<div className="flex items-center gap-2">
						<DatePicker
							selected={startDate}
							onChange={(date) => handleDateChange(date, endDate)}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							placeholderText="Start Date"
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<DatePicker
							selected={endDate}
							onChange={(date) => handleDateChange(startDate, date)}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							placeholderText="End Date"
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							onChange={handleSearch}
							value={searchTerm}
						/>
						<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-700">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Category
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Price
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Stock
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Sales
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-700">
						{currentProducts.map((product) => (
							<motion.tr
								key={product.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
									<img
										src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
										alt="Product img"
										className="size-10 rounded-full"
									/>
									{product.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price.toFixed(2)}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.sales}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.date}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									<button className="text-indigo-400 hover:text-indigo-300 mr-2">
										<Edit size={18} />
									</button>
									<button className="text-red-400 hover:text-red-300">
										<Trash2 size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination controls */}
			<div className="flex justify-between items-center mt-4">
				<span className="text-gray-400">
					Page {currentPage} of {totalPages}
				</span>
				<div>
				<button
					className="hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg"
					disabled={currentPage === 1}
					onClick={() => goToPage(currentPage - 1)}
				>
					<ChevronLeft />
				</button>
				<button
					className="hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg"
					disabled={currentPage === totalPages}
					onClick={() => goToPage(currentPage + 1)}
				>
					<ChevronRight />
				</button>
				</div>
			</div>
		</motion.div>
	);
};

export default ProductsTable;
