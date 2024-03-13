import React, {useEffect, useState} from "react";
import './ProductType.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Header} from "../header/Header";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useProductTypeContext} from "./ProductTypeContext";
import {useProductContext} from "../product/ProductContext";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface ProductTypeFormData {
    name: string;
}

interface EditProductTypeParams {
    productTypeId: string;

    [key: string]: string | undefined;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const EditProductType: React.FC = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);
    const {updateProductTypes} = useProductTypeContext();
    const {updateProduct} = useProductContext();
    const {productTypeId} = useParams<EditProductTypeParams>();

    const [productTypeFormData, setProductTypeFormData] = useState<ProductTypeFormData>({
        name: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProductTypeFormData) => {
        setProductTypeFormData({...productTypeFormData, [field]: e.target.value});
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = await axios.get(`http://localhost:8080/api/v1/types/${productTypeId}`, {
                    headers,
                });

                const data = response.data;

                setProductTypeFormData({
                    name: data.name,
                });

            } catch (error) {
                console.error('Error fetching supplier data:', error);
            }
        };
        fetchData();
    }, [productTypeId]);

    const handleEditProductType = async () => {
        try {
            const token = getToken();


            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.patch(`http://localhost:8080/api/v1/types/${productTypeId}`, productTypeFormData, {
                headers,
            });

            if (response.status === 200) {
                updateProductTypes();
                updateProduct();
                navigate("/type")
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
                    <Link to={"/type"}>
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
                                <Link to={"/type"}>
                                    Product Type
                                </Link>
                                &gt; Edit
                            </p>
                            <div className={"link-btn"}>
                                <h3>Edit Product Type</h3>
                                <button onClick={handleEditProductType} type={"button"} className={"button"}>
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="name">Name</label>
                            <input
                                id={"name"}
                                type="text"
                                required
                                placeholder={"Name"}
                                value={productTypeFormData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};