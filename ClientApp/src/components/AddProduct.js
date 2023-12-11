import React, { useState, useRef } from "react";

function AddProduct() {

    const [formData, setFormData] = useState({});
    const [submitSuccessful, setSubmitSuccessful] = useState(true);
    const formRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('product', {
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
        const { target } = event;
        const { name, value } = target;
    
        setFormData({
          ...formData,
          [name]: value
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
                <button type="submit">Add product</button>
            </form> 
            {submitSuccessful ? <></> : <div>Error: make sure to use a unique ID and correct data types for parameters!</div>}
        </>
    );
}

export default AddProduct;