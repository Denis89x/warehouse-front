import React, {useState} from "react";
import {Header} from "../header/Header";
import '../General.css'
import {OrdersDateExcelOutput} from "./OrdersDateExcelOutput";
import {OrderSupplierExcel} from "./OrderSupplierExcel";
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import {OrderExcel} from "./OrderExcel";
import {DeliveryNoteExcel} from "./DeliveryNoteExcel";
import {ProductExcel} from "./ProductExcel";
import {ProductChartExcel} from "./ProductChartExcel";

export const ExcelPage = () => {
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());

    const handleStartDate = (date: Date | null) => {
        setSelectedStartDate(date);
        setStartDate(formatDate(date as Date));
    };

    const handleEndDate = (date: Date | null) => {
        setSelectedEndDate(date)
        setEndDate(formatDate(date as Date));
    }

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(formatDate(new Date()));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    return (
        <div className="main-page">
            <Header/>
            <div className={"order-page"}>
                <div className={"back-excel"}>
                    <Link to={"/order"}>
                        <button className={"back-btn"}>
                            <div className={"back-btn-inside"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth={1.5} d="M20 12H4m0 0l6-6m-6 6l6 6"></path>
                                </svg>
                                <span>Back</span>
                            </div>
                        </button>
                    </Link>
                </div>
                <div className={"form order-form-excel"}>
                    <OrdersDateExcelOutput startDate={startDate} endDate={endDate}/>
                    <DeliveryNoteExcel startDate={startDate} endDate={endDate}/>
                    <ProductExcel startDate={startDate} endDate={endDate}/>
                    <ProductChartExcel startDate={startDate} endDate={endDate}/>
                    <OrderSupplierExcel startDate={startDate} endDate={endDate}/>
                    <OrderExcel/>
                </div>
                <div className={"orders-date"}>
                    <div className={"crud-form-date-filter"}>
                        <label htmlFor="date">Start date</label>
                        <DatePicker
                            id={"date"}
                            selected={selectedStartDate}
                            onChange={date => handleStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div className={"crud-form-date-filter"}>
                        <label htmlFor="date">End date</label>
                        <DatePicker
                            id={"date"}
                            selected={selectedEndDate}
                            onChange={date => handleEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};