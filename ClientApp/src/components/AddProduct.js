import React, { useState } from "react";

function AddProduct() {

    const [formData, setFormData] = useState({});
    const [submitSuccessful, setSubmitSuccessful] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/product', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                document.getElementById('productForm').reset();
                setSubmitSuccessful(true);
            } else {
                setSubmitSuccessful(false);
                console.error('Error, make sure to use a unique ID and correct data type for parameters', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const handleInputChange = (event) => {
        const { target } = event;
        const { name, value } = target;
    
        setFormData({
          ...formData, // Keep existing form data
          [name]: value // Update form data for the input field that changed
        });
      }

    return (
        <>
            <form id="productForm" onSubmit={handleSubmit}>
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
            {submitSuccessful ? <></> : <h4>Error, make sure to use a unique ID and correct data type for parameters!</h4>}
        </>
    );
}

export default AddProduct;