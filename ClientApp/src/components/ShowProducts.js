import React, { useEffect, useState } from "react";

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
            {(products != null) ? products.map(product => (product != null) ? <h3>{product.productName}</h3> : <></>) : <div>Loading...</div>}
            {(pageNumber > 0) ? <button onClick={decrease}>Previous Page</button> : <></>}
            {(hasMorePages) ? <button onClick={increase}>Next Page</button> : <></>}
        </main>
    );
}

export default ShowProducts;