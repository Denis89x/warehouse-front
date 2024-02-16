import React, {useState} from "react";
import './Stockpile.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Header} from "../header/Header";
import {Link, useNavigate} from "react-router-dom";
import {useStoreContext} from "./StockpileContext";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface StoreFormData {
    name: string;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const CreateStore = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);
    const { updateStore } = useStoreContext();

    const [storeFormData, setStoreFormData] = useState<StoreFormData>({
        name: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof StoreFormData) => {
        setStoreFormData({...storeFormData, [field]: e.target.value});
    };

    const handleCreateStore = async () => {
        try {
            const token = getToken();

            console.log(`token: ${token}`)

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log(`data: ${storeFormData}`)

            const response = await axios.post('http://localhost:8080/api/v1/stores', storeFormData, {
                headers,
            });

            if (response.status === 201) {
                updateStore();
                navigate("/store");
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
                    <Link to={"/store"}>
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
                <div className={"form store-form"}>
                    <form action="">
                        <div className={"link-header"}>
                            <p>
                                <Link to={"/store"}>
                                    Store
                                </Link>
                                 &gt; New
                            </p>
                            <div className={"link-btn"}>
                                <h3>New Store</h3>
                                <button onClick={handleCreateStore} type={"button"} className={"button"}>Save</button>
                            </div>
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="name">Name</label>
                            <input
                                id={"name"}
                                type="text"
                                required
                                placeholder={"Name"}
                                value={storeFormData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};