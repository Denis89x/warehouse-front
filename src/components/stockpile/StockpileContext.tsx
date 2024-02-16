import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getToken} from '../../utils/auth';
import axios from 'axios';

interface Store {
    storeId: number;
    name: string;
}

interface StoreContextProps {
    store: Store[];
    updateStore: () => void;
    searchStore: (field: string) => void;
}

const StockpileContext = createContext<StoreContextProps | undefined>(undefined);

export const useStoreContext = () => {
    const context = useContext(StockpileContext);
    if (!context) {
        throw new Error('useProductTypeContext must be used within a ProductTypeContextProvider');
    }
    return context;
};

interface StoreContextProviderProps {
    children: ReactNode;
}

export const StoreContextProvider: React.FC<StoreContextProviderProps> = ({children}) => {
    const [store, setStore] = useState<Store[]>([]);

    const updateStore = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get('http://localhost:8080/api/v1/stores', {
                headers,
            });

            setStore(response.data as Store[]); // Обновление данных
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const searchStore = async (field: string) => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.get(`http://localhost:8080/api/v1/stores/search/${field}`, {
                headers,
            });

            if (response.status === 200) {
                setStore(response.data as Store[]);
            } else {
                console.error('Failed');
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    useEffect(() => {
        updateStore();
    }, []);

    return (
        <StockpileContext.Provider value={{store, updateStore, searchStore}}>
            {children}
        </StockpileContext.Provider>
    );
};