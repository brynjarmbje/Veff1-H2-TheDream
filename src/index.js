// index.js
import { fetchProductData } from "./lib/api.js";

const url = "https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products";
fetchProductData(url).then((products) => console.log(products));
