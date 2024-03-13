import React, {useState} from "react";
import {useOrderContext} from "../order/OrderContext";
import {getToken} from "../../utils/auth";
import axios from "axios";

export const OrderExcel = () => {
    const {order} = useOrderContext();
    const [orderId, setOrderId] = useState<number | undefined>(order[0]?.orderId);

    const handleSelectOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectOrderId = parseInt(e.target.value);
        setOrderId(selectOrderId);
    };

    const handleExcel = async (orderId: number) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            console.log(`orderId: ${orderId}`)

            const response = await axios.get(`http://localhost:8080/api/v1/orders/excel-order/${orderId}`, {
                headers,
                responseType: 'blob',
            });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Order.xlsx');
                document.body.appendChild(link);

                link.click();

                window.URL.revokeObjectURL(url);
            } else {
                console.error('Failed');
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    const handleExcelClick = async () => {
        setOrderId(order[0].orderId)
        await handleExcel(orderId as number);
    };

    return (
        <div className="fetch-orders-by-supplier">
            <p>Fetch by order number</p>
                <select
                    id={"order"}
                    onChange={handleSelectOrderChange}
                >
                    {
                        order.map(order => (
                            <option key={order.orderId} value={order.orderId}>
                                {order.orderId}
                            </option>
                        ))
                    }
                </select>
                <button className="button order-excel-btn" type="button" onClick={handleExcelClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152V6.5q0 .213-.143.357Q19.713 7 19.5 7t-.357-.143T19 6.5v-.885q0-.23-.192-.423Q18.615 5 18.385 5H5.615q-.23 0-.423.192Q5 5.385 5 5.615v12.77q0 .23.192.423q.193.192.423.192h12.77q.23 0 .423-.192q.192-.193.192-.423V17.5q0-.213.143-.357T19.5 17q.213 0 .357.143q.143.144.143.357v.885q0 .69-.462 1.152q-.463.463-1.153.463zm13.464-7.5H9.885q-.214 0-.357-.143q-.143-.144-.143-.357t.143-.357q.143-.143.357-.143h9.194l-2.721-2.765q-.14-.14-.144-.332q-.002-.191.144-.338q.14-.14.344-.14t.344.14l3.389 3.37q.13.13.183.267q.053.136.053.298t-.053.298q-.053.137-.183.267l-3.389 3.389q-.14.14-.341.134q-.201-.007-.347-.153q-.14-.14-.14-.335t.14-.335z"></path>
                    </svg>
                </button>
        </div>
    );
};