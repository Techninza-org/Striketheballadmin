import {
	BarChart2,
	DollarSignIcon,
	Package,
	ShoppingBag,
	User2Icon,
	Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import SideNav from "./SideNav";

const GENERAL_SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
	{ name: "Stores", icon: Users, color: "#EC4899", href: "/stores" },
	{ name: "Employees", icon: ShoppingBag, color: "#8B5CF6", href: "/employees" },
	{ name: "Packages", icon: Package, color: "#8B5CF6", href: "/packages" },
	{ name: "Bookings", icon: DollarSignIcon, color: "#EC4899", href: "/bookings" },
	{ name: "Customers", icon: User2Icon, color: "#EC4899", href: "/customers" },
	{ name: "Logs", icon: User2Icon, color: "#EC4899", href: "/logs" },
];

const STORE_SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
	{ name: "Bookings", icon: DollarSignIcon, color: "#EC4899", href: "/store-bookings" },
	{ name: "Customers", icon: User2Icon, color: "#EC4899", href: "/customers" },
	{ name: "Logs", icon: User2Icon, color: "#EC4899", href: "/store-logs" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [storeId, setStoreId] = useState(Cookies.get("storeId")); 
	useEffect(() => {
		const interval = setInterval(() => {
			const currentStoreId = Cookies.get("storeId");
			if (currentStoreId !== storeId) {
				setStoreId(currentStoreId); 
			}
		}, 500); 

		return () => clearInterval(interval);
	}, [storeId]);

	const sidebarItems = storeId ? STORE_SIDEBAR_ITEMS : GENERAL_SIDEBAR_ITEMS;

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<SideNav links={sidebarItems} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
		</motion.div>
	);
};

export default Sidebar;
