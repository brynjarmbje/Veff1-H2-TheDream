// index.js
import { fetchProductData } from './lib/api';

const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
fetchProductData(url).then((products) => console.log(products));

function renderProducts(products) {
  // Assuming you have a div in your HTML with id="products-container"
  const container = document.getElementById('products-container');

  products.forEach(product => {
      // Create elements for each product
      const productDiv = document.createElement('div');
      productDiv.className = 'product';

      const title = document.createElement('h2');
      title.textContent = product.title;

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.title;

      const price = document.createElement('p');
      price.textContent = `Price: ${product.price}`;

      const category = document.createElement('p');
      category.textContent = `Category: ${product.category_title}`;

      // Append the elements to the product div
      productDiv.appendChild(title);
      productDiv.appendChild(image);
      productDiv.appendChild(price);
      productDiv.appendChild(category);

      // Append the product div to the container
      container.appendChild(productDiv);
  });
}

// Fetch and render products
fetchProductData(url).then(products => renderProducts(products));