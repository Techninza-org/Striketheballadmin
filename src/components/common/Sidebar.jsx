import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { BarChart2, Users, ShoppingBag, Package, DollarSignIcon, User2Icon, PhoneCall, Book, Power, Store, PersonStanding, BarChart3, EyeOff } from "lucide-react";
import SideNav from "./SideNav"; 

const GENERAL_SIDEBAR_ITEMS = [
    { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
    { name: "Customers", icon: Users, color: "#6366f1", href: "/customers" },
    { name: "Clients", icon: Users, color: "#6366f1", href: "/clients" },
    { name: "Bookings", icon: DollarSignIcon, color: "#8B5CF6", href: "/bookings" },
    { name: "Manage Leads", icon: BarChart3, color: "#6366f1", href: "/manage-leads" },
    { name: "Calls", icon: PhoneCall, color: "#8B5CF6", href: "/calls" },
    { name: "Logs", icon: Book, color: "#EC4899", href: "/logs" },
    { name: "Stores", icon: Store, color: "#EC4899", href: "/stores" },
    { name: "Packages", icon: Package, color: "#EC4899", href: "/packages" },
    { name: "Employees", icon: User2Icon, color: "#8B5CF6", href: "/employees" },
    { name: "Passwords", icon: EyeOff, color: "#8B5CF6", href: "/password" },
    { name: "Subadmins", icon: PersonStanding, color: "#6366f1", href: "/subadmins" },
   
    
];

const STORE_SIDEBAR_ITEMS = [
    { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
    { name: "Bookings", icon: DollarSignIcon, color: "#EC4899", href: "/store-bookings" },
    { name: "Customers", icon: Users, color: "#8B5CF6", href: "/customers" },
    { name: "Logs", icon: Book, color: "#EC4899", href: "/store-logs" },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [storeId, setStoreId] = useState(Cookies.get("storeId"));
    const [accessTo, setAccessTo] = useState([]);
	const isSubadmin = Boolean(Cookies.get("accessTo"));

    useEffect(() => {
        const interval = setInterval(() => {
            const currentStoreId = Cookies.get("storeId");
            if (currentStoreId !== storeId) {
                setStoreId(currentStoreId);
            }
            const accessToCookie = Cookies.get("accessTo");
            if (accessToCookie) {
                const accessArray = Object.keys(JSON.parse(accessToCookie)).filter(
                    (route) => JSON.parse(accessToCookie)[route]
                );
                setAccessTo(accessArray);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [storeId]);
	let sidebarItems = [];
	if (isSubadmin) {
		sidebarItems = GENERAL_SIDEBAR_ITEMS.filter((item) => {
			if (item.name === "Overview") return true;
			const routeKey = item.href.replace("/", "");
			return accessTo.includes(routeKey);
		});
	} else {
		sidebarItems = storeId ? STORE_SIDEBAR_ITEMS : GENERAL_SIDEBAR_ITEMS;
	}

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen ? "w-64" : "w-20"
            }`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <SideNav
                links={sidebarItems}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </motion.div>
    );
};

export default Sidebar;
