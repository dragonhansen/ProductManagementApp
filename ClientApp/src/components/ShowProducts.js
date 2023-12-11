import React, { useEffect, useState } from "react";
import ProductContainer from "./ProductContainer";

function ShowProducts() {

    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [sortingOrder, setSortingOrder] = useState("ProductID");
    const [fetchDataError, setFetchDataError] = useState(false);
    const [filter, setFilter] = useState("ProductPrice");
    const [filterMinValue, setFilterMinValue] = useState(-1);
    const [filterMaxValue, setFilterMaxValue] = useState(-1);

    const handleFilterChange = (setFunction) => (event) => {
        setPageNumber(0);
        if (event.target.value === "") {
            setFunction(-1);
            return;
        }
        setFunction(event.target.value);
    }

    useEffect(() => {
        fetch(`product/${sortingOrder}/${pageNumber}/${filter}/${filterMinValue}/${filterMaxValue}`)
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
    }, [pageNumber, sortingOrder, filter, filterMinValue, filterMaxValue])

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
            <button onClick={() => setSortingOrder("ProductPrice")}>Price: 0-9</button>
            <button onClick={() => setSortingOrder("ProductName")}>Name: A-Z</button>
            <button onClick={() => setSortingOrder("ProductID")}>Id: 0-9</button>
            <form>
                <h4>Min :</h4>
                <input onChange={handleFilterChange(setFilterMinValue)}/>
                <h4>Max : </h4>
                <input onChange={handleFilterChange(setFilterMaxValue)}/>
            </form>
            {(filter === "ProductPrice") ? <button onClick={() => setFilter("ProductID")}>Filter by id</button> : <button onClick={() => setFilter("ProductPrice")}>Filter by id</button>}
        </>
    );
}

export default ShowProducts;