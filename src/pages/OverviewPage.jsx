import {
  BarChart2,
  DollarSign,
  DownloadIcon,
  Edit,
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
import BookingsTable from "../components/users/BookingsTable";
import BookingDetailModal from "../components/users/BookingDetailModal";
import { Link } from "react-router-dom";

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
  const [callbacks, setCallbacks] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const storeId = Cookies.get("storeId");

  const openEditBookingModal = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

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

  async function getTodayCallbacks(){
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/today-callbacks`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(response.data.valid){
      setCallbacks(response.data.customers);
    }
  }
  async function getTodayBookings(){
    const authToken = Cookies.get("authToken");
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/admin/bookings/today`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if(response.data.valid){
      setTodayBookings(response.data.bookings);
    }
  }

  useEffect(() => {
    getAllData();
    getTodayCallbacks();
    getTodayBookings();
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
          <a href="/admin/bookings">
            <StatCard
              name="Total Bookings"
              icon={ShoppingBag}
              value={bookings}
              color="#EC4899"
            />
          </a>

          <a href="/admin/packages">
            <StatCard
              name="Total Packages"
              icon={BarChart2}
              value={packages}
              color="#10B981"
            />
          </a>
          {!storeId && (
            <a href="/admin/stores">
              <StatCard
                name="Total Stores"
                icon={Zap}
                value={stores}
                color="#6366F1"
              />
            </a>
          )}
          {!storeId && (
            <a href="/admin/employees">
              <StatCard
                name="Total Employees"
                icon={Users}
                value={employees}
                color="#8B5CF6"
              />
            </a>
          )}
          {!storeId && (
            <a href="/admin/customers">
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
            <a href="/admin/customers?filter=today">
              <StatCard
                name="Today CallBacks"
                icon={Users}
                value={todayCallBacks}
                color="#8B5CF6"
              />
            </a>
          )}
          {stages.map((stage) => (
            <a href={`/admin/customers?stage=${stage.name}`} key={stage.name}>
            <StatCard
              name={stage.name}
              icon={Users}
              value={stage.leadsCount}
              color="#8B5CF6"
            />
          </a>
          ))}
          {sources.map((source) => (
            <a href={`/admin/customers?source=${source.name}`} key={source.name}>
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

      <BookingDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        bookingId={selectedBookingId}
      />



     <div className="mx-10 mb-10">
     <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 overflow-x-auto">
     <h2 className="text-xl font-semibold text-gray-100 mb-3">Today Bookings</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Booking Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Overs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Overs Left
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {todayBookings?.map((booking) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {booking.customer?.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {booking.customer?.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking.store?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking.customer?.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking.bookingType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking?.package?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{booking?.overs}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {booking?.oversLeft}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{booking?.price}</div>
                </td>
                {booking.oversLeft > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-gray-300 cursor-pointer"
                      onClick={() => openEditBookingModal(booking?.id)}
                    >
                      <Edit />
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>


      <div className="mx-10 mb-10">
     <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 overflow-x-auto">
     <h2 className="text-xl font-semibold text-gray-100 mb-3">Today Callbacks</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              {!storeId && 
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
              }
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {callbacks?.map((store) => (
              <motion.tr
                key={store.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {store.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {store.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{store.phone}</div>
                </td>
                {!storeId && 
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* <button className="text-blue-200 hover:text-blue-300 mr-6" onClick={() => openModal(store.id)}>
                    Edit
                  </button> */}
                  <Link to={`/admin/followup/${store.id}`} >
                    <button className=" bg-white rounded-md p-2 text-black">
                    Follow Up
                    </button>
                  </Link>
                  <Link to={`/admin/bookings?customer=${store.id}`} >
                    <button className="  ml-4 bg-white rounded-md p-2 text-black">
                    Bookings
                    </button>
                  </Link>
                  <Link to={`/admin/logs?customer=${store.id}`} >
                    <button className="  ml-4 bg-white rounded-md p-2 text-black">
                    Logs
                    </button>
                  </Link>
                </td>
                }
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
     </div>
    </div>
  );
};

export default OverviewPage;
