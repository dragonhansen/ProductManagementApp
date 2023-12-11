import React from "react";

function AddProduct() {

    return (
        <form action={"product"} method="post">
            <h4>Product ID</h4>
            <input name="productId" required/>
            <h4>Product name: </h4>
            <input name="productName" required/>
            <h4>Product description: </h4>
            <input name="productDescription" required/>
            <h4>Product price: </h4>
            <input name="productPrice" required/>
            <button type="submit">Add product</button>
        </form> 
    );
}

export default AddProduct;