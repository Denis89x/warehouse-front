import React, {useEffect, useState} from "react";
import './Product.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Header} from "../header/Header";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useProductContext} from "./ProductContext";
import {useProductTypeContext} from "../product-type/ProductTypeContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface EditProductFormData {
    title: string;
    date: string;
    cost: number;
    description: string;
    productTypeId: number;
}

interface EditProductParams {
    productTypeId: string;

    [key: string]: string | undefined;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const EditProduct: React.FC = () => {
    const navigate = useNavigate();
    const {updateProduct} = useProductContext();
    const {productTypes} = useProductTypeContext();
    const {productId} = useParams<EditProductParams>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [productTypeId, setProductTypeId] = useState<number | undefined>(productTypes[0]?.productTypeId);
    const [violations, setViolations] = useState<Violation[]>([]);

    const [editProductFormData, setEditProductFormData] = useState<EditProductFormData>({
        title: '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] + `T12:30:00` : '',
        cost: 0,
        description: '',
        productTypeId: productTypeId || 0,
    });

    useEffect(() => {
        setProductTypeId(productTypes[0]?.productTypeId);
    }, [productTypes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof EditProductFormData) => {
        setEditProductFormData({...editProductFormData, [field]: e.target.value});
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProductTypeId = parseInt(e.target.value);
        setEditProductFormData({...editProductFormData, productTypeId: selectedProductTypeId});
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);

        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        console.log(`formattedDate: ${formattedDate}`)
        setEditProductFormData({...editProductFormData, date: formattedDate + `T12:30:00`});
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = await axios.get(`http://localhost:8080/api/v1/products/${productId}`, {
                    headers,
                });
                const data = response.data;
                setEditProductFormData({
                    title: data.title,
                    date: data.date,
                    cost: data.cost,
                    description: data.description,
                    productTypeId: data.productTypeResponse.productTypeId,
                });
            } catch (error) {
                console.error('Error fetching supplier data:', error);
            }
        };
        fetchData();
    }, [productTypeId]);

    const handleEditProduct = async () => {
        try {
            const token = getToken();

            console.log(`token: ${token}`)

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log(`data: ${editProductFormData.date}`)

            const response = await axios.patch(`http://localhost:8080/api/v1/products/${productId}`, editProductFormData, {
                headers,
            });

            if (response.status === 200) {
                updateProduct();
                navigate('/product');
            }
        } catch (error: any) {
            if (error.response && error.response.data.violations) {
                setViolations(error.response.data.violations);
            } else {
                setViolations([{fieldName: '', message: 'An error occurred.'}]);
            }
        }
    };

    return (
        <div className={"main-page"}>
            <Header/>
            <div className={"create-block"}>
                <div className={"back"}>
                    <Link to={"/product"}>
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
                {violations.length > 0 && <ErrorFieldHandler violations={violations} auth={false}/>}
                <div className={"form"}>
                    <form action="">
                        <div className={"link-header"}>
                            <p>
                                <Link to={"/product"}>
                                    Product
                                </Link>
                                &gt; Edit
                            </p>
                            <div className={"link-btn"}>
                                <h3>Edit Product</h3>
                                <button onClick={handleEditProduct} type={"button"} className={"button"}>
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="title">Title</label>
                            <input
                                id={"title"}
                                type="text"
                                required
                                placeholder={"Title"}
                                value={editProductFormData.title}
                                onChange={(e) => handleInputChange(e, 'title')}
                            />
                        </div>
                        <div className={"crud-form crud-form-date"}>
                            <label htmlFor="date">Date</label>
                            <DatePicker
                                className={"crud-form-date"}
                                id={"date"}
                                selected={selectedDate}
                                onChange={date => handleDateChange(date)} // Обрабатываем null
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="cost">Cost</label>
                            <input
                                id={"cost"}
                                type="text"
                                required
                                placeholder={"Cost"}
                                value={editProductFormData.cost}
                                onChange={(e) => handleInputChange(e, 'cost')}
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="description">Description</label>
                            <input
                                id={"description"}
                                type="text"
                                required
                                placeholder={"Description"}
                                value={editProductFormData.description}
                                onChange={(e) => handleInputChange(e, 'description')}
                            />
                        </div>
                        <div className={"crud-form crud-form-select"}>
                            <label htmlFor="productType">Product Type</label>
                            <select
                                id={"productType"}
                                onChange={handleSelectChange}
                                value={editProductFormData.productTypeId}
                            >
                                {productTypes.map(productType => (
                                    <option key={productType.productTypeId} value={productType.productTypeId}>
                                        {productType.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};