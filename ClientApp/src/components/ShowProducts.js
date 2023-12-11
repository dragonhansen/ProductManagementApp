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
    const [fetchDataError, setFetchDataError] = useState(false);

    useEffect(() => {
        fetch(`product/${sorting}/${pageNumber}`)
            .then((result) => {
                return result.json();
            })
            .then(data => {
                setProducts(data.products);
                setHasMorePages(data.hasMoreProductsToRead);
                setFetchDataError(false);
            })
            .catch(error => {
                setFetchDataError(true);
                console.error('Error: ', error);
            })
    }, [pageNumber, sorting])

    return(
        <>
            <h1>This page shows products</h1>
            {fetchDataError ? <div>An error occurred while retrieving data from server</div> : <></> }
            {(products != null) ? products.map((product, index) => 
                (product != null) ? 
                <ProductContainer key={index} id={product.productId} name={product.productName} description={product.productDescription} price={product.productPrice}></ProductContainer>
                : <ProductContainer key={index}></ProductContainer>) 
            : <div>Loading...</div>}
            {(pageNumber > 0) ? <button onClick={() => setPageNumber(pageNumber - 1)}>Previous Page</button> : <></>}
            {(hasMorePages) ? <button onClick={() => setPageNumber(pageNumber + 1)}>Next Page</button> : <></>}
            <button onClick={() => setSorting(Sorting.Price)}>Price: 0-9</button>
            <button onClick={() => setSorting(Sorting.Alphabetically)}>Name: A-Z</button>
            <button onClick={() => setSorting(Sorting.Id)}>Id: 0-9</button>
        </>
    );
}

export default ShowProducts;