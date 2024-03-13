import React, {useEffect} from 'react';
import './App.css';
import Auth from "./components/auth/Auth";
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import {AuthProvider, useAuth} from "./components/auth/AuthContext";
import {ProductTypeContextProvider} from "./components/product-type/ProductTypeContext";
import CreateProductType from "./components/product-type/CreateProductType";
import {ProductType} from "./components/product-type/ProductType";
import {checkAndRefreshToken} from "./utils/auth";
import {EditProductType} from "./components/product-type/EditProductType";
import {Product} from "./components/product/Product";
import {ProductContextProvider} from "./components/product/ProductContext";
import {CreateProduct} from "./components/product/CreateProduct";
import {EditProduct} from "./components/product/EditProduct";
import {SupplierContextProvider} from "./components/supplier/SupplierContext";
import {Supplier} from "./components/supplier/Supplier";
import {CreateSupplier} from "./components/supplier/CreateSupplier";
import {EditSupplier} from "./components/supplier/EditSupplier";
import {Stockpile} from "./components/stockpile/Stockpile";
import {StoreContextProvider} from "./components/stockpile/StockpileContext";
import {CreateStore} from "./components/stockpile/CreateStockpile";
import {EditStore} from "./components/stockpile/EditStockpile";
import {OrderContextProvider} from "./components/order/OrderContext";
import {Order} from "./components/order/Order";
import {CreateOrder} from "./components/order/CreateOrder";
import {ExcelPage} from "./components/excel/ExcelPage";
import {ProfilePage} from "./components/profile/ProfilePage";

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <ProductTypeContextProvider>
                    <ProductContextProvider>
                        <SupplierContextProvider>
                            <StoreContextProvider>
                                <OrderContextProvider>
                                    <BrowserRouter>
                                        <Routes>
                                            <Route path="/auth" element={<Auth/>}/>
                                            <Route
                                                path="/*"
                                                element={<ProtectedRouteWrapper/>}
                                            />
                                        </Routes>
                                    </BrowserRouter>
                                </OrderContextProvider>
                            </StoreContextProvider>
                        </SupplierContextProvider>
                    </ProductContextProvider>
                </ProductTypeContextProvider>
            </AuthProvider>
        </div>
    );
}

const ProtectedRouteWrapper: React.FC = () => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkAndRefreshToken(navigate);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth', {replace: true});
        } else if (window.location.pathname === '/') {
            navigate('/type', {replace: true});
        }
    }, [isAuthenticated, navigate]);

    return <ProtectedRoute/>;
};

const ProtectedRoute: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/type" element={<ProductType/>}/>
                <Route path="/create-type" element={<CreateProductType/>}/>
                <Route path="/edit-type/:productTypeId" element={<EditProductType/>}/>
                <Route path="/product" element={<Product/>}/>
                <Route path="/create-product" element={<CreateProduct/>}/>
                <Route path="/edit-product/:productId" element={<EditProduct/>}/>
                <Route path="/supplier" element={<Supplier/>}/>
                <Route path="/create-supplier" element={<CreateSupplier/>}/>
                <Route path="/edit-supplier/:supplierId" element={<EditSupplier/>}/>
                <Route path="/store" element={<Stockpile/>}/>
                <Route path="/create-store" element={<CreateStore/>}/>
                <Route path="/edit-store/:storeId" element={<EditStore/>}/>
                <Route path="/order" element={<Order/>}/>
                <Route path="/create-order" element={<CreateOrder/>}/>
                <Route path="/order-excel" element={<ExcelPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
            </Routes>
        </>
    );
};

export default App;
