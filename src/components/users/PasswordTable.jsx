import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import PasswordModal from "./PasswordModal";

const PasswordTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const openPasswordModal = (id) => {
    setSelectedEmpId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmpId(null);
  };

  const fetchEmployees = async () => {
	try {
	  const authToken = Cookies.get("authToken");

	  const response = await axios.get(
		`${import.meta.env.VITE_BASE_URL}/admin/employee/all`,
		{
		  headers: {
			Authorization: `Bearer ${authToken}`,
			"Content-Type": "application/json",
		  },
		}
	  );

	  if (response.data.valid) {
		setStores(response.data.employees);
		setFilteredStores(response.data.employees);
	  }
	} catch (error) {
	  setError(error.response?.data?.message || error.message);
	} finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(term) ||
        store.email.toLowerCase().includes(term) ||
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
      <PasswordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        empId={selectedEmpId}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Employees</h2>
        {/* <div className="relative">
          <input
            type="text"
            placeholder="Search employees..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Store Id
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
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

                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{store.storeId}</div>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{store.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{store.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-white bg-danger" onClick={() => openPasswordModal(store.id)}>
                    Change Password
                  </button>
                </td>
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

export default PasswordTable;
