import axios from "axios";
import { GET_ERRORS, BROWSE_PRODUCTS } from "./types";



export const browseProductsAction = (criteria, callback) => dispatch => {

    dispatch(publishError({ response : { data: {} }}));

    axios
    .get("/api/products/getproducts", { params:{ ...criteria} })
    .then(res => {
        const products = res.data;
        dispatch(setBrowseProducts(products));
        if(callback){
            callback();
        }
    })
    .catch(err => {
        dispatch(publishError(err));
    });
};

export const setBrowseProducts = (products) => {
    return {
        type: BROWSE_PRODUCTS,
        payload: products
    };
}


//// act on error
export const publishError = (err) => {
    let payload_obj = null;
    payload_obj = err.response.data;

    return {
            type: GET_ERRORS,
            payload: payload_obj
        };
};