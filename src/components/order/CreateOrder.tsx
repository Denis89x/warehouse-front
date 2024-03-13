import React, {useEffect, useState} from "react";
import './Order.css'
import '../General.css'
import axios from "axios";
import {getToken} from "../../utils/auth";
import {Link, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import {ModalProduct} from '../modal-window/ModalProduct';
import "react-datepicker/dist/react-datepicker.css";
import {useOrderContext} from "./OrderContext";
import {useStoreContext} from "../stockpile/StockpileContext";
import {useSupplierContext} from "../supplier/SupplierContext";
import {useProductContext} from "../product/ProductContext";
import ErrorFieldHandler from "../error/ErrorFieldHandler";
import {Header} from "../header/Header";

interface OrderFormData {
    orderType: string;
    orderDate: string;
    storeId: number;
    supplierId: number;
    orderCompositionRequestList: {
        productId: number;
        quantity: number;
    }[];
}

interface Violation {
    fieldName: string;
    message: string;
}

export const CreateOrder = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);
    const {updateOrder} = useOrderContext();
    const {updateProduct} = useProductContext();
    const {store} = useStoreContext();
    const {supplier} = useSupplierContext();
    const [orderType, setOrderType] = useState<string>("Поступление");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [storeId, setStoreId] = useState<number | undefined>(store[0]?.storeId);
    const [supplierId, setSupplierId] = useState<number | undefined>(supplier[0]?.supplierId);
    const [orderCompositionRequestList, setOrderCompositionRequestList] = useState<{
        productId: number;
        quantity: number;
    }[]>([]);
    const [orderFormData, setOrderFormData] = useState<OrderFormData>({
        orderType: orderType,
        orderDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        storeId: storeId || 0,
        supplierId: supplierId || 0,
        orderCompositionRequestList: [],
    });

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleSelectSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSupplierId = parseInt(e.target.value); // Преобразуем значение в число
        setOrderFormData({...orderFormData, supplierId: selectedSupplierId});
    };

    const handleSelectStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStoreId = parseInt(e.target.value); // Преобразуем значение в число
        setOrderFormData({...orderFormData, storeId: selectedStoreId});
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);

        const formattedDate = date ? date.toISOString().split('T')[0] : '';
        setOrderFormData({...orderFormData, orderDate: formattedDate});
    };

    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    useEffect(() => {
        setStoreId(store[0]?.storeId);
    }, [store]);

    useEffect(() => {
        setSupplierId(supplier[0]?.supplierId);
    }, [supplier]);

    useEffect(() => {
        setOrderType(orderType);
    }, [orderType]);

    const handleAddProductToOrder = (productId: number, quantity: number) => {
        const productData = {
            productId: productId,
            quantity: quantity
        };
        setOrderCompositionRequestList([...orderCompositionRequestList, productData]);
        setModalVisible(false);
    };

    const handleCreateProduct = async () => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log('formData:', orderFormData)

            const formData: OrderFormData = {
                orderType: orderType,
                orderDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
                storeId: orderFormData.storeId,
                supplierId: orderFormData.supplierId,
                orderCompositionRequestList: orderCompositionRequestList,
            };

            console.log('formData:', formData)

            const response = await axios.post('http://localhost:8080/api/v1/orders', formData, {
                headers,
            });

            if (response.status === 201) {
                updateOrder();
                updateProduct();
                navigate("/order");
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
                    <Link to={"/order"}>
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
                                <Link to={"/order"}>
                                    Order
                                </Link>
                                &gt; New
                            </p>
                            <div className={"link-btn"}>
                                <h3>New Order</h3>
                                <button onClick={handleCreateProduct} type={"button"} className={"button"}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className={"crud-form crud-form-select crud-order-type"}>
                            <label htmlFor="productType">Order Type</label>
                            <select
                                id={"orderType"}
                                onChange={(e) => setOrderType(e.target.value)}
                                value={orderType}
                            >
                                <option value="Поступление">Поступление</option>
                                <option value="Выбытие">Выбытие</option>
                            </select>
                        </div>
                        <div className={"crud-form crud-form-date"}>
                            <label htmlFor="date">Date</label>
                            <DatePicker
                                className={"crud-form-date"}
                                id={"date"}
                                selected={selectedDate}
                                onChange={date => handleDateChange(date)}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div className={"crud-form crud-form-select"}>
                            <label htmlFor="store">Store</label>
                            <select
                                id={"store"}
                                onChange={handleSelectStoreChange}
                            >
                                {store.map(store => (
                                    <option key={store.storeId} value={store.storeId}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={"crud-form crud-form-select"}>
                            <label htmlFor="supplier">Supplier</label>
                            <select
                                id={"supplier"}
                                onChange={handleSelectSupplierChange}
                            >
                                {
                                    supplier.map(supplier => (
                                        <option key={supplier.supplierId} value={supplier.supplierId}>
                                            {supplier.title}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className={"order-footer"}>
                            {modalVisible && (
                                <ModalProduct modalVisible={modalVisible} setModalVisible={setModalVisible}
                                              handleAddProductToOrder={handleAddProductToOrder}/>
                            )}
                            <div className={"order-product"}>
                                {orderCompositionRequestList.map((product, index) => (
                                    <p key={index}>Product ID: {product.productId}, Quantity: {product.quantity}</p>
                                ))}
                            </div>
                            <div className={"order-btn"}>
                                <button onClick={handleOpenModal} className={"button"} type={"button"}>
                                    Select Product
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
