import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getToken} from '../../utils/auth';
import axios from 'axios';

interface Supplier {
    supplierId: number;
    title: string;
    surname: string;
    address: string;
    phoneNumber: string;
}

interface SupplierContextProps {
    supplier: Supplier[];
    updateSupplier: () => void;
    searchSupplier: (field: string) => void;
}

const SupplierContext = createContext<SupplierContextProps | undefined>(undefined);

export const useSupplierContext = () => {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error('useProductTypeContext must be used within a ProductTypeContextProvider');
    }
    return context;
};

interface SupplierContextProviderProps {
    children: ReactNode;
}

export const SupplierContextProvider: React.FC<SupplierContextProviderProps> = ({children}) => {
    const [supplier, setSupplier] = useState<Supplier[]>([]);

    const updateSupplier = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get('http://localhost:8080/api/v1/suppliers', {
                headers,
            });

            setSupplier(response.data as Supplier[]); // Обновление данных
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    const searchSupplier = async (field: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/suppliers/search/${field}`, {
                headers,
            });

            if (response.status === 200) {
                setSupplier(response.data as Supplier[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    useEffect(() => {
        updateSupplier();
    }, []);

    return (
        <SupplierContext.Provider value={{supplier, updateSupplier, searchSupplier}}>
            {children}
        </SupplierContext.Provider>
    );
};