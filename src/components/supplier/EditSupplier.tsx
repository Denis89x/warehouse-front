import React, {useEffect, useState} from "react";
import '../General.css'
import './Supplier.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Header} from "../header/Header";
import {Link, useNavigate, useParams} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import {useSupplierContext} from "./SupplierContext";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface SupplierFormData {
    title: string;
    surname: string;
    address: string;
    phoneNumber: string;
}

interface EditSupplierParams {
    supplierId: string;

    [key: string]: string | undefined;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const EditSupplier: React.FC = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);
    const {updateSupplier} = useSupplierContext();
    const {supplierId} = useParams<EditSupplierParams>();

    const [supplierFormData, setSupplierFormData] = useState<SupplierFormData>({
        title: '',
        surname: '',
        address: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                const response = await axios.get(`http://localhost:8080/api/v1/suppliers/${supplierId}`, {
                    headers,
                });
                const data = response.data;
                setSupplierFormData({
                    title: data.title,
                    surname: data.surname,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                });
            } catch (error) {
                console.error('Error fetching supplier data:', error);
            }
        };
        fetchData();
    }, [supplierId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SupplierFormData) => {
        setSupplierFormData({...supplierFormData, [field]: e.target.value});
    };

    const handleEditSupplier = async () => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.patch(`http://localhost:8080/api/v1/suppliers/${supplierId}`, supplierFormData, {
                headers,
            });

            if (response.status === 200) {
                updateSupplier();
                navigate("/supplier")
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
                    <Link to={"/supplier"}>
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
                <div className={"form supplier-form"}>
                    <form action="">
                        <div className={"link-header"}>
                            <p>
                                <Link to={"/supplier"}>
                                    Supplier
                                </Link>
                                &gt; Edit
                            </p>
                            <div className={"link-btn"}>
                                <h3>Edit Supplier</h3>
                                <button onClick={handleEditSupplier} type={"button"} className={"button"}>
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
                                value={supplierFormData.title}
                                onChange={(e) => handleInputChange(e, 'title')}
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="surname">Surname</label>
                            <input
                                id={"surname"}
                                type="text"
                                required
                                placeholder={"Surname"}
                                value={supplierFormData.surname}
                                onChange={(e) => handleInputChange(e, 'surname')}
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="address">Address</label>
                            <input
                                id={"address"}
                                type="text"
                                required
                                placeholder={"Address"}
                                value={supplierFormData.address}
                                onChange={(e) => handleInputChange(e, 'address')}
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="phone-number">Phone number</label>
                            <input
                                id={"phone-number"}
                                type="text"
                                required
                                placeholder={"Phone number"}
                                value={supplierFormData.phoneNumber}
                                onChange={(e) => handleInputChange(e, 'phoneNumber')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};