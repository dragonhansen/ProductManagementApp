import React, { useState, useRef } from "react";

function AddAndEditProduct() {

    const [formData, setFormData] = useState({});
    const [submitSuccessful, setSubmitSuccessful] = useState(true);
    const formRef = useRef(null);
    const [submitTpye, setSubmitType] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`product/${submitTpye}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                formRef.current.reset();
                setSubmitSuccessful(true);
            } else {
                setSubmitSuccessful(false);
                console.error('Error', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const handleInputChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value
        });
      }

    return (
        <>
            <h1>On this page, you can add new products to the database</h1>
            <form onSubmit={handleSubmit} ref={formRef}>
                <h4>Product ID</h4>
                <input name="productId" onChange={handleInputChange} required/>
                <h4>Product name: </h4>
                <input name="productName" onChange={handleInputChange} required/>
                <h4>Product description: </h4>
                <input name="productDescription" onChange={handleInputChange} required/>
                <h4>Product price: </h4>
                <input name="productPrice" onChange={handleInputChange} required/>
                <div>
                    <button type="submit" onClick={() => setSubmitType("add-product")}>Add product</button>
                    <button type="submit" onClick={() => setSubmitType("edit-product")}>Edit product</button>
                </div>
            </form> 
            {(!submitSuccessful && submitTpye=== "add-product") ? <div>Error: make sure to use a unique ID and correct data types for parameters!</div> : <></>}
            {(!submitSuccessful && submitTpye === "edit-product") ? <div>Error: make sure to use an existing ID and correct data types for parameters!</div> : <></>}
        </>
    );
}

export default AddAndEditProduct;