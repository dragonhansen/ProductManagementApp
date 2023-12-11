import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";

function ShowProducts() {

    const Sorting = {
        Price: 0,
        Alphabetically: 1,
        Id: 2
    }

    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [sorting, setSorting] = useState(Sorting.Id);

    useEffect(() => {
        fetch(`product/${sorting}/${pageNumber}`)
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
    }, [pageNumber, sorting])

    const increase = () => {
        setPageNumber(pageNumber => pageNumber + 1);
      };

    const decrease = () => {
        setPageNumber(pageNumber => pageNumber - 1);
      };

    return(
        <>
            <h1>This page shows products</h1>
            {(products != null) ? products.map(product => 
                (product != null) ? 
                <ProductContainer id={product.productId} name={product.productName} description={product.productDescription} price={product.productPrice}></ProductContainer>
                : <></>) 
            : <div>Loading...</div>}
            {(pageNumber > 0) ? <button onClick={decrease}>Previous Page</button> : <></>}
            {(hasMorePages) ? <button onClick={increase}>Next Page</button> : <></>}
            <button onClick={() => setSorting(Sorting.Price)}>Price: 0-9</button>
            <button onClick={() => setSorting(Sorting.Alphabetically)}>Name: A-Z</button>
            <button onClick={() => setSorting(Sorting.Id)}>Id: 0-9</button>
        </>
    );
}

export default ShowProducts;