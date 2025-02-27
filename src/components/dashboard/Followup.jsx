import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import LeadsTable from "../users/LeadsTable";

export default function Followup() {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");

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
  async function getSources() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/lead/source`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.valid) {
      setSources(response.data.sources);
    }
  }

  async function getCustomer() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/customer/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setCustomer(response.data.customer);
      } else {
        setError("Invalid customer data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError("Failed to fetch customer data");
    } finally {
      setIsLoading(false);
    }
  }
  async function getCustomerLeads() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/lead/customer/leads/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        setLeads(response.data.leads);
      } else {
        setError("Invalid leads data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError("Failed to fetch customer data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCustomer();
    getCustomerLeads();
    getStages();
    getSources();
	getCustomerLeads();
  }, [id]);

  async function getCustomerLeads(){
	try{
		const response = await axios.get(
			`${import.meta.env.VITE_BASE_URL}/lead/customer/leads/${id}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if(response.data.valid){
			setLeads(response.data.leads);
		}else{
			setError("Invalid leads data");
		}
	}catch(error){
		console.error("Error fetching customer data:", error);
		setError("Failed to fetch customer data");
	}finally{
		setIsLoading(false);
	}
  }

  async function handleAddFollowUp(e){
	e.preventDefault();
	try{
		if(stage === ""){
			alert("Select a Stage");
			return;
		}
		if(comment === ""){
			alert("Add Comments");
			return;
		}
		const followup = await axios.post(
			`${import.meta.env.VITE_BASE_URL}/lead/lead`,
			{
				customerId: parseInt(id),
				stage: stage,
        source: source,
				comments: comment,
				callbackDate: date,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if(followup.data.valid){
			getCustomerLeads();
		}
	}catch(err){
		return next(err)
	}
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Follow Ups" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <h2 className="font-bold uppercase text-2xl">{customer.name}</h2>
        <div className="mt-10  mb-20 w-1/2">
          <div className="flex gap-8 w-full">
            <div className="">
              <select
                name="stage"
                onChange={(e)=>setStage(e.target.value)}
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
            <div className="w-[220px]">
              <select
                name="source"
                onChange={(e)=>setSource(e.target.value)}
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
            <div>
            <DatePicker
  onChange={(selectedDate) => {
    if (selectedDate) {
      // Convert to IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
      const adjustedDate = new Date(selectedDate.getTime() + istOffset);

      // adjustedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
      console.log(adjustedDate);
      setDate(adjustedDate);
    } else {
      setDate(null);
    }
  }}
  isClearable
  placeholderText="FollowUp Date"
  className="p-2 rounded-md bg-gray-700 text-white w-full"
/>
            </div>
          </div>
          <div className="grid mt-4">
            <label htmlFor="comment">Comment :</label>
            <textarea
              name="comment"
              id="comment"
              cols="20"
              rows="3"
			  onChange={(e)=>setComment(e.target.value)}
              className="mt-2 bg-gray-700 text-white w-full p-2 rounded-md"
            ></textarea>
          </div>
		  <button className="mt-4 bg-blue-500 text-white p-2 rounded-md" onClick={handleAddFollowUp}>Add Follow Up</button>
        </div>
			<LeadsTable leads={leads} />
      </main>
    </div>
  );
}
