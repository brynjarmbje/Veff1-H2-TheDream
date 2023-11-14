// https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products

// JavaScript code for fetching and displaying products
fetch('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('products-container');
    console.log(data);
    data.items.forEach(product => {
      const productElement = document.createElement('div');

      productElement.className = 'product-item';

      // Add content to productElement, e.g., product.title, product.price
      // ...
      container.appendChild(productElement);
    });
  })
  .catch(error => console.error('Error:', error));// JavaScript code for fetching and displaying products