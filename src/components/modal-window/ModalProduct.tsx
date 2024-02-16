import React, {useEffect, useState} from 'react';
import './Modal.css';
import '../General.css'
import {useProductContext} from "../product/ProductContext";

interface ModalProductProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddProductToOrder: (productId: number, quantity: number) => void;
}

export const ModalProduct: React.FC<ModalProductProps> = ({modalVisible, setModalVisible, handleAddProductToOrder}) => {

    const {product} = useProductContext();

    const [selectedProductId, setSelectedProductId] = useState<number | undefined>(product[0]?.productId);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

    const handleAddProduct = () => {
        if (selectedProductId && selectedQuantity > 0) {
            handleAddProductToOrder(selectedProductId, selectedQuantity);
        }
    };

    const handleSelectChange = (productId: number) => {
        setSelectedProductId(productId);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        setSelectedProductId(product[0]?.productId);
    }, [product]);

    return (
        <>
            <div className="modal" style={{display: modalVisible ? 'block' : 'none'}}>
                <div className="modal-content">
                    <div className={"modal-header"}>
                        <h3>Add Product</h3>
                        <span onClick={handleCloseModal}>&times;</span>
                    </div>
                    <div className={"crud-form crud-form-select modal-select"}>
                        <label htmlFor="productType">Product Type</label>
                        <select
                            id={"productType"}
                            value={selectedProductId}
                            onChange={(e) => handleSelectChange(Number(e.target.value))}
                        >
                            {product.map(product => (
                                <option
                                    key={product.productId}
                                    value={product.productId}
                                >
                                    {product.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={"crud-form modal-select"}>
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            id={"quantity"}
                            type="text"
                            required
                            placeholder={"Quantity"}
                            value={selectedQuantity}
                            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                        />
                    </div>
                    <button type={"button"} className={"button modal-btn"} onClick={handleAddProduct}>
                        Add
                    </button>
                </div>
            </div>
        </>
    );
};
