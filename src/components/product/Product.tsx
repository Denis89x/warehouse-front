import '../General.css'
import './Product.css'
import {Header} from "../header/Header";
import {Link} from "react-router-dom";
import React from "react";
import {FetchProduct} from "./FetchProduct";

export const Product = () => {
    return (
        <div className={"main-page"}>
            <Header/>
            <div className={"table-div"}>
                <FetchProduct/>
                <div className={"create-type-btn"}>
                    <Link to={"/create-product"}>
                        <button className={"button"}>
                            <div className={"create-type-inside"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1"></path>
                                </svg>
                                <span>Add new Product</span>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};