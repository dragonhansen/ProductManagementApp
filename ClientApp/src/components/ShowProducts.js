import React, { useEffect, useState } from "react";

function ShowProducts() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('product')
            .then((results) => {
                return results.json();
            })
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    return(
        <main>
            <h1>This page shows products</h1>
            {(products != null) ? products.map(product => <h3>{product.productName}</h3>) : <div>Loading...</div>}
        </main>
    );
}

export default ShowProducts;