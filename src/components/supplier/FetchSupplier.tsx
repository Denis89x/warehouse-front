import React, {useState} from 'react';
import {getToken} from "../../utils/auth";
import axios from "axios";
import {Link} from "react-router-dom";
import {useSupplierContext} from "./SupplierContext";

export const FetchSupplier = () => {
    const {supplier, updateSupplier, searchSupplier} = useSupplierContext();
    const [field, setField] = useState("");

    const handleDelete = async (supplierId: number) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.delete(`http://localhost:8080/api/v1/suppliers/${supplierId}`, {
                headers,
            });

            if (response.status === 200) {
                console.log("status 200")
                updateSupplier();
            } else {
                console.error('Failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleRefresh = async () => {
        await updateSupplier();
    }

    const handleSearch = async () => {
        await searchSupplier(field);
    }

    return (
        <div className={"crud-table"}>
            <h2>Suppliers</h2>
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
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Surname</th>
                        <th>Address</th>
                        <th>Phone number</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        supplier.map((type, index) => (
                            <tr key={index}>
                                <td>{type.title}</td>
                                <td>{type.surname}</td>
                                <td>{type.address}</td>
                                <td>{type.phoneNumber}</td>
                                <td className="action-td">
                                    <div className={"crud-actions actions-table"}>
                                        <div>
                                            <Link to={`/edit-supplier/${type.supplierId}`}>
                                                <button className={"button"}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                                         viewBox="0 0 24 24">
                                                        <g fill="none" stroke="currentColor" strokeLinecap="round"
                                                           strokeLinejoin="round" strokeWidth={2}>
                                                            <path
                                                                d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path>
                                                            <path
                                                                d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </Link>
                                            <button onClick={() => handleDelete(type.supplierId)}
                                                    type={"button"}
                                                    className={"button right-btn"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                                     viewBox="0 0 24 24">
                                                    <g fill="none">
                                                        <path
                                                            d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                                        <path fill="currentColor"
                                                              d="M20 5a1 1 0 1 1 0 2h-1l-.003.071l-.933 13.071A2 2 0 0 1 16.069 22H7.93a2 2 0 0 1-1.995-1.858l-.933-13.07A1.017 1.017 0 0 1 5 7H4a1 1 0 0 1 0-2zm-3.003 2H7.003l.928 13h8.138zM14 2a1 1 0 1 1 0 2h-4a1 1 0 0 1 0-2z"></path>
                                                    </g>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
