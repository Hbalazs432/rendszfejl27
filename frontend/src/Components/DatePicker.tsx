import React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Dayjs} from 'dayjs';
import { useState } from 'react';



function Datepicker() {
  const [startDate, setstartDate] = useState<Dayjs | null>(null);
  const [endDate, setendDate] = useState<Dayjs | null>(null);
  

  const handleDateChange = (newDate: Dayjs | null) => {
    setstartDate(newDate);
    setendDate(newDate);
    const formatDatum = (date: Dayjs | null): string => {
      return date ? date.format("YYYY-MMMM-DD") : "";
    };
    console.log(formatDatum(newDate));
  };

    return (
    <div>
        
    <div className='bg-slate-300 py-10 justify-center items-center flex'>
        <DatePicker
            label="Igénylés idejének kezdete"
            value={startDate}
            onChange={handleDateChange}
          />
          <DatePicker
            label="Igénylés idejének vége"
            value={endDate}
            onChange={handleDateChange}
          />
    </div>
    </div>
    
  )
}

export default Datepicker