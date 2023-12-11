import React, { Component } from "react";

class ProductContainer extends Component {
    render() {
        if(this.props.name == null) {
            return <></>;
        }
        return (
            <>
                <h3>{this.props.name}</h3>
                <h4>Product ID: {this.props.id}</h4>
                <h4>Description: {this.props.description}</h4>
                <h4>Price: {this.props.price}</h4>
            </>
        );
    }
}

export default ProductContainer;