import React from "react";

function ProductContainer({id, name, description, price}) {
    return (
        <>
            <h3>{name}</h3>
            <h4>ProductId: {id}</h4>
            <h4>Description: {description}</h4>
            <h4>Price: {price}</h4>
        </>
    );
}

export default ProductContainer;