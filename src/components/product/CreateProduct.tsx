import React, {useEffect, useState} from "react";
import './Product.css'
import '../General.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Header} from "../header/Header";
import {Link, useNavigate} from "react-router-dom";
import {useProductContext} from "./ProductContext";
import {useProductTypeContext} from "../product-type/ProductTypeContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface ProductFormData {
    title: string;
    date: string;
    cost: number;
    description: string;
    productTypeId: number;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const CreateProduct = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);
    const {updateProduct} = useProductContext();
    const {productTypes} = useProductTypeContext();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [productTypeId, setProductTypeId] = useState<number | undefined>(productTypes[0]?.productTypeId);

    const [productFormData, setProductFormData] = useState<ProductFormData>({
        title: '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] + `T12:30:00` : '',
        cost: 0,
        description: '',
        productTypeId: productTypeId || 0,
    });

    useEffect(() => {
        setProductTypeId(productTypes[0]?.productTypeId);
    }, [productTypes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProductFormData) => {
        setProductFormData({...productFormData, [field]: e.target.value});
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProductTypeId = parseInt(e.target.value);
        setProductFormData({...productFormData, productTypeId: selectedProductTypeId});
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);

        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        console.log(`formattedDate: ${formattedDate}`)
        setProductFormData({...productFormData, date: formattedDate + `T12:30:00`});
    };

    const handleCreateProduct = async () => {
        try {
            const token = getToken();

            console.log(`token: ${token}`)

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log(`data: ${productFormData.date}`)

            const response = await axios.post('http://localhost:8080/api/v1/products', productFormData, {
                headers,
            });

            if (response.status === 201) {
                updateProduct();
                navigate("/product");
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
                                &gt; New
                            </p>
                            <div className={"link-btn"}>
                                <h3>New Product</h3>
                                <button onClick={handleCreateProduct} type={"button"} className={"button"}>
                                    Save
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
                                onChange={(e) => handleInputChange(e, 'description')}
                            />
                        </div>
                        <div className={"crud-form crud-form-select"}>
                            <label htmlFor="productType">Product Type</label>
                            <select
                                id={"productType"}
                                onChange={handleSelectChange}
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