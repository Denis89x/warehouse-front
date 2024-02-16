import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getToken} from '../../utils/auth';
import axios from 'axios';

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

export type {Product};

interface ProductContextProps {
    product: Product[];
    updateProduct: () => void;
    searchProduct: (field: string) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductTypeContext must be used within a ProductTypeContextProvider');
    }
    return context;
};

interface ProductContextProviderProps {
    children: ReactNode;
}

export const ProductContextProvider: React.FC<ProductContextProviderProps> = ({children}) => {
    const [product, setProduct] = useState<Product[]>([]);

    const updateProduct = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get('http://localhost:8080/api/v1/products', {
                headers,
            });

            setProduct(response.data as Product[]); // Обновление данных
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const searchProduct = async (field: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/products/search/${field}`, {
                headers,
            });

            if (response.status === 200) {
                setProduct(response.data as Product[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    useEffect(() => {
        updateProduct();
    }, []);

    return (
        <ProductContext.Provider value={{product, updateProduct, searchProduct}}>
            {children}
        </ProductContext.Provider>
    );
};