import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getToken} from '../../utils/auth';
import axios from 'axios';

interface Order {
    orderId: number;
    orderType: string;
    orderDate: number[];
    amount: number;
    storeName: string;
    orderCompositionResponses: {
        productName: string;
        quantity: number;
    }[];
}

interface OrderContextProps {
    order: Order[];
    updateOrder: () => void;
    searchOrder: (field: string) => void;
    filterOrder: (startDate: string, endDate: string) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useProductTypeContext must be used within a ProductTypeContextProvider');
    }
    return context;
};

interface OrderContextProviderProps {
    children: ReactNode;
}

export const OrderContextProvider: React.FC<OrderContextProviderProps> = ({children}) => {
    const [order, setOrder] = useState<Order[]>([]);

    const updateOrder = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get('http://localhost:8080/api/v1/orders', {
                headers,
            });

            setOrder(response.data as Order[]); // Обновление данных
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const searchOrder = async (field: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/orders/search/${field}`, {
                headers,
            });

            if (response.status === 200) {
                setOrder(response.data as Order[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    const filterOrder = async (startDate: string, endDate: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/orders/filter?startDate=${startDate}&endDate=${endDate}`, {
                headers,
            });

            if (response.status === 200) {
                setOrder(response.data as Order[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    }

    useEffect(() => {
        updateOrder();
    }, []);

    return (
        <OrderContext.Provider value={{order, updateOrder, searchOrder, filterOrder}}>
            {children}
        </OrderContext.Provider>
    );
};