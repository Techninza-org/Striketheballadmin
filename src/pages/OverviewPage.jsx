import {
  BarChart2,
  DollarSign,
  DownloadIcon,
  IndianRupee,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import axios from "axios";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { unparse } from "papaparse";

const OverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stores, setStores] = useState("");
  const [employees, setEmployees] = useState("");
  const [packages, setPackages] = useState("");
  const [bookings, setBookings] = useState("");
  const [customers, setCustomers] = useState("");
  const [todayLeads, setTodayLeads] = useState("");
  const [monthLeads, setMonthLeads] = useState("");
  const [todayCallBacks, setTodayCallBacks] = useState("");
  const [sources, setSources] = useState([]);
  const [stages, setStages] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const storeId = Cookies.get("storeId");

  const getAllData = async () => {
    try {
      setSelectedDate("");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/dashboard-details`
      );

      if (response.data.valid) {
        setStores(response.data.stores);
        setEmployees(response.data.employees);
        setPackages(response.data.packages);
        setBookings(response.data.bookings);
        setCustomers(response.data.customers);
        setTodayLeads(response.data.todayLeads);
        setMonthLeads(response.data.monthLeads);
        setSources(response.data.sources);
        setStages(response.data.stages);
        setTodayCallBacks(response.data.todayFollowUps);
        setRevenue(response.data.revenue);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStores = async (date) => {
    try {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];

      if (storeId) {
        const authToken = Cookies.get("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/emp/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.valid) {
          setStores(response.data.stores);
          setEmployees(response.data.employees);
          setPackages(response.data.packages);
          setBookings(response.data.bookings);
        }
      } else {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/auth/dashboard-details?date=${formattedDate}`
        );

        if (response.data.valid) {
          setStores(response.data.stores);
          setEmployees(response.data.employees);
          setPackages(response.data.packages);
          setBookings(response.data.bookings);
          setCustomers(response.data.customers);
          setTodayLeads(response.data.todayLeads);
          setMonthLeads(response.data.monthLeads);
          setSources(response.data.sources);
          setStages(response.data.stages);
          setTodayCallBacks(response.data.todayFollowUps);
          setRevenue(response.data.revenue);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function downloadData() {
    try {
      let download = [];
      if (selectedDate !== "") {
        const revenueMap = {};
        revenue.forEach((rev) => {
          revenueMap[`${rev.storeName} Revenue`] = rev.month;
        });
        download.push({
          Month: selectedDate.getMonth() + 1 + "-" + selectedDate.getFullYear(),
          "Total Stores": stores,
          "Total Employees": employees,
          "Total Packages": packages,
          "Total Bookings": bookings,
          "Total Customers": customers,
          "Month Leads": monthLeads,
          ...revenueMap,
        });
      }
      if (selectedDate === "") {
        const revenueMap = {};
        revenue.forEach((rev) => {
          revenueMap[`${rev.storeName} Revenue`] = rev.total;
        });

        download.push({
          Month: "All",
          "Total Stores": stores,
          "Total Employees": employees,
          "Total Packages": packages,
          "Total Bookings": bookings,
          "Total Customers": customers,
          ...revenueMap,
        });
      }

      const csv = unparse(download);

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllData();
    // fetchStores(selectedDate);
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="mb-4 font-semibold flex gap-5 justify-end">
          <button
            className={`bg-blue-900 p-2 rounded-md text-white`}
            onClick={downloadData}
          >
            <DownloadIcon />
          </button>

          <button
            className={`ml-2 rounded-md p-2 cursor-pointer bg-opacity-50 ${
              selectedDate ? "bg-blue-200" : "bg-blue-800"
            }`}
            onClick={() => getAllData()}
          >
            All
          </button>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => fetchStores(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            placeholderText="Select Month"
            className="w-full p-2 border bg-blue-800 cursor-pointer bg-opacity-50 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <a href="/bookings">
            <StatCard
              name="Total Bookings"
              icon={ShoppingBag}
              value={bookings}
              color="#EC4899"
            />
          </a>

          <a href="/packages">
            <StatCard
              name="Total Packages"
              icon={BarChart2}
              value={packages}
              color="#10B981"
            />
          </a>
          {!storeId && (
            <a href="/stores">
              <StatCard
                name="Total Stores"
                icon={Zap}
                value={stores}
                color="#6366F1"
              />
            </a>
          )}
          {!storeId && (
            <a href="/employees">
              <StatCard
                name="Total Employees"
                icon={Users}
                value={employees}
                color="#8B5CF6"
              />
            </a>
          )}
          {!storeId && (
            <a href="/customers">
              <StatCard
                name="Total Customers"
                icon={Users}
                value={customers}
                color="#8B5CF6"
              />
            </a>
          )}
          {!storeId && (
            <StatCard
              name="Today Leads"
              icon={Users}
              value={todayLeads}
              color="#8B5CF6"
            />
          )}
          {!storeId && (
            <StatCard
              name="Month Leads"
              icon={Users}
              value={monthLeads}
              color="#8B5CF6"
            />
          )}
          {!storeId && (
            <a href="/customers?filter=today">
              <StatCard
                name="Today CallBacks"
                icon={Users}
                value={todayCallBacks}
                color="#8B5CF6"
              />
            </a>
          )}
          {stages.map((stage) => (
            <a href={`/customers?stage=${stage.name}`} key={stage.name}>
            <StatCard
              name={stage.name}
              icon={Users}
              value={stage.leadsCount}
              color="#8B5CF6"
            />
          </a>
          ))}
          {sources.map((source) => (
            <a href={`/customers?source=${source.name}`} key={source.name}>
            <StatCard
              key={source.name}
              name={source.name}
              icon={Users}
              value={source.leadsCount}
              color="#8B5CF6"
            />
            </a>
          ))}
          {revenue.map((rev) => (
            <StatCard
              key={rev.storeId}
              name={rev.storeName}
              icon={IndianRupee}
              value={`${rev.total}`}
              color="#10B981"
            />
          ))}
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your charts here */}
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
