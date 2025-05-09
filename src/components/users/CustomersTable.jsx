import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, DownloadIcon, RefreshCcwDotIcon, TimerResetIcon, RefreshCcw } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import EditCustomerModal from "./EditCustomerModal";
import { Link } from "react-router-dom";
import { unparse } from "papaparse";

const CustomersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storeId = Cookies.get("storeId");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [stages, setStages] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedStage, setSelectedStage] = useState("");
  



  const fetchStores = async () => {
	try {
	  const response = await axios.get(
		`${import.meta.env.VITE_BASE_URL}/customer`,
		{
		  headers: {
			"Content-Type": "application/json",
		  },
		}
	  );

	  if (response.data.valid) {
		setStores(response.data.customers);
		setFilteredStores(response.data.customers);
	  }
	} catch (error) {
	  setError(error.response?.data?.error || error.message);
	} finally {
	  setLoading(false);
	}
  };
  async function getSources(){
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/source`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(response.data.valid){
      setSources(response.data.sources);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    const stage = params.get("stage");
    const source = params.get("source");
    
    fetchStores();
    getStages();
    getSources();
    if(filter === "today"){
      getTodayCallbacks();
    }
    if(stage !== null && stage !== undefined){
      handleStageFilter(stage);
    }
    if(source !== null && source !== undefined){
      handleSourceFilter(source);
    }
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(term) ||
        store.phone.toLowerCase().includes(term) 
    );
    setFilteredStores(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStores.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  async function handleDelete(id) {
    console.log(id);
    // const authToken = Cookies.get("authToken");

    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/customer/${id}`,
      {
        headers: {
        //   Authorization: `Bearer ${authToken}`,
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

  const openModal = (id) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  if (loading) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  async function getStages() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/stage`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.valid) {
      setStages(response.data.stages);
    }
  }

  async function handleStageFilter(stage){
    if(stage === ""){
      fetchStores();
      setSelectedStage("");
    }else{
      setSelectedStage(stage);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/lead/customer/leads/stage/${stage}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setStores(response.data.customers);
        setFilteredStores(response.data.customers);
      }
  }
}
  async function handleSourceFilter(source){
    if(source === ""){
      fetchStores();
    }else{
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/lead/customer/leads/source/${source}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setStores(response.data.customers);
        setFilteredStores(response.data.customers);
      }
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
      setStores(response.data.customers);
      setFilteredStores(response.data.customers);
    }
  }

  async function downloadData(){
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/download/${selectedStage}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(response.data.valid){
      const data = response.data.customers;
      if (!data.length) return;

      // Convert JSON to CSV
      const csv = unparse(data);

      // Create a Blob and trigger download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    }
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {isModalOpen && (
        <EditCustomerModal cust_id={selectedCustomerId} onClose={closeModal} />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Customers</h2>
        <div className="flex gap-4">

          <button className="bg-blue-900 p-2 rounded-md text-white" onClick={getTodayCallbacks}>Today Callbacks</button>

        
            <div className="w-[200px]">
              <select
                name="stage"
                onChange={(e)=>handleStageFilter(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a stage</option>
                {stages?.map((stage) => (
                  <option key={stage.id} value={stage.name}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[200px]">
              <select
                name="source"
                onChange={(e)=>handleSourceFilter(e.target.value)}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a source</option>
                {sources?.map((source) => (
                  <option key={source.id} value={source.name}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <a href="/customers"><button className="bg-blue-900 p-2 rounded-md text-white" ><RefreshCcw /></button></a>
        <button className={`bg-blue-900 p-2 rounded-md text-white ${selectedStage === "" ? 'disabled:bg-gray-500 disabled:cursor-not-allowed' : ''}`} disabled={selectedStage === ""} onClick={downloadData}><DownloadIcon /></button>
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th> */}
              {!storeId && 
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
              }
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentItems.map((store) => (
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
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{store.email}</div>
                </td> */}
                {!storeId && 
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-blue-200 hover:text-blue-300 mr-6" onClick={() => openModal(store.id)}>
                    Edit
                  </button>
                  {/* <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(store.id)}>
                    Delete
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
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="flex gap-2">
          {currentPage > 3 && (
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-100"
              }`}
            >
              1
            </button>
          )}

          {currentPage > 4 && (
            <span className="px-3 py-1 text-gray-400">...</span>
          )}

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber >= currentPage - 2 &&
              pageNumber <= currentPage + 2
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          {currentPage < totalPages - 3 && (
            <span className="px-3 py-1 text-gray-400">...</span>
          )}

          {currentPage < totalPages - 2 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === totalPages
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-100"
              }`}
            >
              {totalPages}
            </button>
          )}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default CustomersTable;
