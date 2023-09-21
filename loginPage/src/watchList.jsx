import React, { useState, useEffect } from 'react';
import maindata from '../../backend/routes/data/instrument.json';
import tradingsymbols from '../../backend/routes/data/instrumentTradingSymbol.json';
import instruments from '../../backend/routes/data/instrument.json';
import CustomCombobox from './basic components/AutoCompleteInput';

const WatchList = (props) => {
  const [data, setData] = useState([]);
  const [tokendata, setTokendata] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('watchlistData'));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  useEffect(() => {
    if (tokendata !== undefined && name !== undefined) {
      const updatedData = [...data, { token: tokendata, ltp: 0, name: name }];
      setData(updatedData);
      localStorage.setItem('watchlistData', JSON.stringify(updatedData));
      props.add(updatedData);
    }
  }, [tokendata, name]);

  const token = (selected) => {
    instruments.forEach((item) => {
      if (item.tradingsymbol === selected.replace(/\s/g, '')) {
        setTokendata(item.instrument_token);
        return;
      }
    });
  };

  const handleClick = (selected) => {
    if (!data.some(item => item.name === selected.name)) {
      if (selected.name.includes("CE") || selected.name.includes("PE") || selected.name.includes("FUT")) {
        setName(selected.name);
        token(selected.name);
      }
    }
  };

  const resetData = () => {
    setData([]);
    localStorage.removeItem('watchlistData');
  };

  const ceData = data.filter(value => !value.name.includes("PE"));
  const peData = data.filter(value => value.name.includes("PE"));

  return (
    <div className='w-full h-screen '>
      <div className='mb-4 '>
        <CustomCombobox options={tradingsymbols} atm={props.atm} onChange={handleClick} />
        {/* <button className='ml-4 bg-blue-500 text-white py-2 px-4 rounded' onClick={resetData}>
          Reset
        </button> */}
      </div>
      <div className='border-b-2      overflow-y-scroll h-1/2'>
  <h2 className='p-2 m-4   inline-block rounded-full over    bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] border  "> Dark'>
    CE Section
  </h2>
 

  {ceData.map((value, index) => (
    <div
      key={index}
      className='flex w-full justify-between  text-white   h-12 '
    >
      <div className='  w-full  flex items-center justify-center border-b-2 border-gray-600'>
        {value.name}
      </div>
      <div className='  w-full flex justify-center text-green-400 font-semibold  border-b-2 border-gray-600'>
        {value.ltp}
      </div>
    </div>
  ))}
  
 
</div>
<div className='border-b-2      overflow-y-scroll h-1/2'>
  <h2 className='p-2 m-4 inline-block rounded-full over    bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] border  "> Dark'>
    PE Section
  </h2>
 

  {peData.map((value, index) => (
    <div
      key={index}
      className='flex w-full justify-between  text-white   h-12 '
    >
      <div className='  w-full  flex items-center justify-center border-b-2 border-gray-600'>
        {value.name}
      </div>
      <div className='  w-full flex justify-center text-green-400 font-semibold  border-b-2 border-gray-600'>
        {value.ltp}
      </div>
    </div>
  ))}
  
 
</div>


    </div>
  );
};

export default WatchList;
