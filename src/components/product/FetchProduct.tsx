import React, {useState} from 'react';
import {useProductContext} from "./ProductContext";
import {getToken} from "../../utils/auth";
import axios from "axios";
import {Link} from "react-router-dom";
import '../General.css'

export const FetchProduct = () => {
    const {product, updateProduct, searchProduct} = useProductContext();
    const [field, setField] = useState("");

    const handleDelete = async (productId: number) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, {
                headers,
            });

            if (response.status === 200) {
                console.log("status 200")
                updateProduct();
            } else {
                console.error('Failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleRefresh = async () => {
        await updateProduct();
    }

    const handleSearch = async () => {
        await searchProduct(field);
    }

    const formatDateFromArray = (dateArray: number[]) => {
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    return (
        <div className={"crud-table"}>
            <h2>Products</h2>
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
                        <th>Date</th>
                        <th>Cost</th>
                        <th>Presence</th>
                        <th>Description</th>
                        <th>Product Type</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {product.map((type, index) => (
                        <tr key={index}>
                            <td>
                            {type.title}
                            </td>
                            <td>{formatDateFromArray(type.date)}</td>
                            <td>{type.cost}</td>
                            <td>{type.presence}</td>
                            <td>{type.description}</td>
                            <td>{type.productTypeResponse.name}</td>
                            <td>
                                <div className={"crud-actions actions-table"}>
                                    <div>
                                        <Link to={`/edit-product/${type.productId}`}>
                                            <button className={"button"}>Edit</button>
                                        </Link>
                                        <button onClick={() => handleDelete(type.productId)}
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
