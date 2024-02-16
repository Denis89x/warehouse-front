import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getToken} from "../../utils/auth";
import axios from "axios";

interface Product {
    productId: number;
    title: string;
    date: number[];
    cost: number;
    presence: number;
    description: string;
    productTypeResponse: {
        productTypeId: number;
        name: string;
    };
}

interface ProductContextProps {
    field: string;
}

export const ProductSearch: React.FC<ProductContextProps> = ({field}) => {
    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        updateProduct();
    }, []);

    const updateProduct = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log(`field: ${field}`)

            const response = await axios.get(`http://localhost:8080/api/v1/products/search/${field}`, {
                headers,
            });

            setProduct(response.data as Product[]);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const formatDateFromArray = (dateArray: number[]) => {
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString();
    };

    return (
        <div className={"crud-table"}>
            <h2>Products</h2>
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
                    {product.map((product, index) => (
                        <tr key={index}>
                            <td>
                                {product.title}
                            </td>
                            <td>{formatDateFromArray(product.date)}</td>
                            <td>{product.cost}</td>
                            <td>{product.presence}</td>
                            <td>{product.description}</td>
                            <td>{product.productTypeResponse.name}</td>
                            <td>
                                <div className={"crud-actions actions-table"}>
                                    <div>
                                        <Link to={`/edit-product/${product.productId}`}>
                                            <button className={"button"}>Edit</button>
                                        </Link>
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