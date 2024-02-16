import React, {useState} from 'react';
import {getToken} from "../../utils/auth";
import axios from "axios";
import {useOrderContext} from "./OrderContext";
import {useProductContext} from "../product/ProductContext";
import {DateFilter} from "../filter/DateFilter";
import '../General.css'
import './Order.css'

export const FetchOrder = () => {
    const {order, updateOrder, searchOrder} = useOrderContext();
    const {updateProduct} = useProductContext();
    const [field, setField] = useState("");

    const handleDelete = async (orderId: number) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.delete(`http://localhost:8080/api/v1/orders/${orderId}`, {
                headers,
            });

            if (response.status === 200) {
                console.log("status 200")
                updateOrder();
                updateProduct();
            } else {
                console.error('Failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleExcel = async () => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/orders/excel`, {
                headers,
                responseType: 'blob',
            });

            if (response.status === 200) {
                console.log("status 200");

                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Order.xlsx');
                document.body.appendChild(link);

                link.click();

                // Очистите URL после скачивания файла
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    const formatDateFromArray = (dateArray: number[]) => {
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    const handleRefresh = async () => {
        await updateOrder();
    }

    const handleSearch = async () => {
        await searchOrder(field);
    }

    return (
        <div className={"crud-table"}>
            <h2>Orders</h2>
            <div className="crud-actions-container">
                <div className="crud-query-actions">
                    <form className="search-bar" onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}>
                        <input
                            type="text"
                            name="field"
                            placeholder="Search..."
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                        />
                        <button type="button" onClick={handleSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989q-.975.35-1.96.35q-2.402 0-4.066-1.663q-1.664-1.664-1.664-4.065T5.47 5.436q1.663-1.667 4.064-1.667q2.402 0 4.068 1.664q1.666 1.664 1.666 4.067q0 1.042-.369 2.017q-.37.975-.97 1.668l6.262 6.261zM9.538 14.23q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361q0-1.99-1.37-3.36q-1.37-1.37-3.36-1.37q-1.99 0-3.361 1.37q-1.37 1.37-1.37 3.36q0 1.99 1.37 3.36q1.37 1.37 3.36 1.37"></path>
                            </svg>
                        </button>
                    </form>
                    <button
                        className="button refresh-btn"
                        type="button"
                        onClick={handleRefresh}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                        </svg>
                    </button>
                    <button
                        className="button refresh-btn"
                        type="button"
                        onClick={handleExcel}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={4}>
                                <path strokeLinejoin="round"
                                      d="M8 15V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v36a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9"></path>
                                <path d="M31 15h3m-6 8h6m-6 8h6"></path>
                                <path strokeLinejoin="round" d="M4 15h18v18H4zm6 6l6 6m0-6l-6 6"></path>
                            </g>
                        </svg>
                    </button>
                </div>
                <DateFilter/>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Order Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Store Name</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.map((order, index) => (
                        <tr key={index}>
                            <td>{order.orderType}</td>
                            <td>{formatDateFromArray(order.orderDate)}</td>
                            <td>{order.amount}</td>
                            <td>{order.storeName}</td>
                            <td className={"order-products-list"}>{
                                order.orderCompositionResponses.map((product, index) => (
                                    <span key={index}>
                                        {product.productName}: {product.quantity}{index !== order.orderCompositionResponses.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td>
                                <div className={"crud-actions actions-table"}>
                                    <div>
                                        <button onClick={() => handleDelete(order.orderId)}
                                                type={"button"}
                                                className={"button"}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
