import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import axios from 'axios';
import { DeleteIcon } from 'lucide-react';

export default function ManageLeads() {
    const [stages, setStages] = useState([]);
    const [sources, setSources] = useState([]);
    // const authToken = Cookies.get("authToken");
    const fixedStages = [
        'New',
        'Converted',
        'Promising',
        'Appointment Scheduled',
    ]

    const fixedSources = [
        'WhatsApp',
        'IVR',
        'Walk In'
    ]
    
    async function getStages(){
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/lead/stage`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response.data.valid){
        setStages(response.data.stages);
      }
    }
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

    const addStage = async () => {
        try{
            const stage = document.querySelector('input[name="stage"]').value;
            if(stage.length < 2){
                alert('Stage name must be at least 2 characters');
            }
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/lead/stage`,
                {
                    name: stage
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if(response.data.valid){
                getStages();
                document.querySelector('input[name="stage"]').value = '';
            }
        }catch(err){
            return next(err);
        }
    }
    const addSource = async () => {
        try{
            const source = document.querySelector('input[name="source"]').value;
            if(source.length < 2){
                alert('Source name must be at least 2 characters');
            }
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/lead/source`,
                {
                    name: source
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if(response.data.valid){
                getSources();
                document.querySelector('input[name="source"]').value = '';  
            }
        }catch(err){
            return next(err);
        }
    }

    const deleteStage = async (id) => {
        try{
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/lead/stage/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if(response.data.valid){
                getStages();
            }
        }catch(err){
            return next(err)
        }
    }
    const deleteSource = async (id) => {
        try{
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/lead/source/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if(response.data.valid){
                getSources();
            }
        }catch(err){
            return next(err)
        }
    }

    useEffect(() => {
        getStages();
        getSources();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
			<Header title='Manage Leads' />
			<main className='max-w-5xl mx-auto py-6 px-4 lg:px-8'>
                <div className='flex justify-between'>
                <div>
                    <h2 className='font-bold uppercase'>Stages</h2>
                    <div className='mt-4'>
                        <input type="text" name='stage' placeholder="Stage name" className='p-2 text-black rounded-md'/>
                        <button className='ml-4 rounded-md p-2 text-black bg-blue-300' onClick={addStage}>Add Stage</button>
                    </div>
                    <div className='mt-6'>
                        <ul className='list-disc'>
                            {stages.map((stage, index) => (
                                <div className='flex justify-between'>
                                    <li key={index} className='my-2'>{stage.name}</li>
                                    {fixedStages.includes(stage.name) ? null : (
                                        <button className='ml-2 rounded-md p-2 text-red-500 ' onClick={() => deleteStage(stage.id)}><DeleteIcon /></button>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <h2 className='font-bold uppercase'>Sources</h2>
                    <div className='mt-4'>
                        <input type="text" name='source' placeholder="Source name" className='p-2 text-black rounded-md'/>
                        <button className='ml-4 rounded-md p-2 text-black bg-blue-300' onClick={addSource}>Add Source</button>
                    </div>
                    <div className='mt-6'>
                        <ul className='list-disc gap-2'>
                            {sources.map((source, index) => (
                                <div className='flex justify-between'>
                                    <li key={index} className='my-2'>{source.name}</li>
                                    {fixedSources.includes(source.name) ? null : (
                                    <button className='ml-2 rounded-md p-2 text-red-500 ' onClick={() => deleteSource(source.id)}><DeleteIcon /></button>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                </div>
			</main>
		</div>
    )
}