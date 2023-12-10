import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";

function ShowProducts() {

    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMorePages, setHasMorePages] = useState(false);

    useEffect(() => {
        fetch(`product/${pageNumber}`)
            .then((results) => {
                return results.json();
            })
            .then(data => {
                setProducts(data.products);
                setHasMorePages(data.hasMoreProductsToRead);
            })
            .catch(error => {
                console.log(error);
            })
    }, [pageNumber])

    const increase = () => {
        setPageNumber(pageNumber => pageNumber + 1);
      };

    const decrease = () => {
        setPageNumber(pageNumber => pageNumber - 1);
      };

    return(
        <main>
            <h1>This page shows products</h1>
            {(products != null) ? products.map(product => 
                (product != null) ? 
                <ProductContainer id={product.productId} name={product.productName} description={product.productDescription} price={product.productPrice}></ProductContainer>
                : <></>) 
            : <div>Loading...</div>}
            {(pageNumber > 0) ? <button onClick={decrease}>Previous Page</button> : <></>}
            {(hasMorePages) ? <button onClick={increase}>Next Page</button> : <></>}
        </main>
    );
}

export default ShowProducts;