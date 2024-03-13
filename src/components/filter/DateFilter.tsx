import DatePicker from "react-datepicker";
import React, {useState} from "react";
import './DateFilter.css'
import {useOrderContext} from "../order/OrderContext";

export const DateFilter = () => {
    const {filterOrder} =  useOrderContext();

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());

    const handleStartDate = (date: Date | null) => {
        setSelectedStartDate(date);
    };

    const handleEndDate = (date: Date | null) => {
        setSelectedEndDate(date)
    }

    const handleFilter = async () => {
        if (selectedStartDate && selectedEndDate) {
            const startDateFormatted = formatDate(selectedStartDate);
            const endDateFormatted = formatDate(selectedEndDate);
            await filterOrder(startDateFormatted, endDateFormatted);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth returns zero-based month index
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="date-filter-container">
            <div className={"crud-form-date-filter"}>
                <label htmlFor="startDate">Start date</label>
                <DatePicker
                    id={"startDate"}
                    selected={selectedStartDate}
                    onChange={date => handleStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                />
            </div>
            <div className={"crud-form-date-filter"}>
                <label htmlFor="endDate">End date</label>
                <DatePicker
                    id={"endDate"}
                    selected={selectedEndDate}
                    onChange={date => handleEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                />
            </div>
            <button className="button" onClick={handleFilter} type="button">
                Filtrate
            </button>
        </div>
    );
};