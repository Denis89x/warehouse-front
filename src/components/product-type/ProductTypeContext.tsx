import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getToken} from '../../utils/auth';
import axios from 'axios';

interface ProductType {
    productTypeId: number;
    name: string;
}

interface ProductTypeContextProps {
    productTypes: ProductType[];
    updateProductTypes: () => void;
    searchProductType: (field: string) => void;
}

const ProductTypeContext = createContext<ProductTypeContextProps | undefined>(undefined);

export const useProductTypeContext = () => {
    const context = useContext(ProductTypeContext);
    if (!context) {
        throw new Error('useProductTypeContext must be used within a ProductTypeContextProvider');
    }
    return context;
};

interface ProductTypeContextProviderProps {
    children: ReactNode;
}

export const ProductTypeContextProvider: React.FC<ProductTypeContextProviderProps> = ({children}) => {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    const updateProductTypes = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get('http://localhost:8080/api/v1/types', {
                headers,
            });

            setProductTypes(response.data as ProductType[]); // Обновление данных
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const searchProductType = async (field: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/types/search/${field}`, {
                headers,
            });

            if (response.status === 200) {
                setProductTypes(response.data as ProductType[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    useEffect(() => {
        updateProductTypes();
    }, []);

    return (
        <ProductTypeContext.Provider value={{productTypes, updateProductTypes, searchProductType}}>
            {children}
        </ProductTypeContext.Provider>
    );
};