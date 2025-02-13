import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const CallsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storeId = Cookies.get("storeId");

  const fetchStores = async () => {
	try {
	  const authToken = Cookies.get("authToken");

	  const response = await axios.get(
		`${import.meta.env.VITE_BASE_URL}/admin/calls`,
		{
		  headers: {
			Authorization: `Bearer ${authToken}`,
			"Content-Type": "application/json",
		  },
		}
	  );

	  if (response.data.valid) {
		setStores(response.data.calls);
		setFilteredStores(response.data.calls);
	  }
	} catch (error) {
	  setError(error.response?.data?.error || error.message);
	} finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = stores.filter(
      (store) =>
        store.caller_no.toLowerCase().includes(term) ||
        store.customer.name.toLowerCase().includes(term) ||
        store.phone.toLowerCase().includes(term)
    );
    setFilteredStores(filtered);
  };

  async function handleDelete(id) {
    console.log(id);
    const authToken = Cookies.get("authToken");

    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/customer/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
	
	if (response.data.valid) {
		fetchStores();
	}else{
		setError(response.data.message);
	}
  }

  if (loading) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Calls</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search calls..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
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
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Call Time
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Duration
              </th>  */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredStores.map((call) => (
              <motion.tr
                key={call.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {call.customer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {call.customer.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{call.caller_no}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{call.call_start_time}</div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{call.duration}</div>
                </td>  */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-red-400 hover:text-red-300">
                    Remarks
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CallsTable;
