// Function to create HTML elements for each product
function createProductElement(product) {
  const productDiv = document.createElement('div');
  productDiv.className = 'product';
  productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.image}" alt="${product.title}">
      <p>Price: ${product.price}</p>
      <p>Category: ${product.category_title}</p>
  `;
  return productDiv;
}

// Function to render products on the webpage
function renderProducts(products) {
  const container = document.getElementById('products-container');
  products.forEach(product => {
      container.appendChild(createProductElement(product));
  });
}

// Function to fetch product data from the server
async function fetchProducts(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      renderProducts(data.items); // Use data.items instead of data
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Event listener for DOMContentLoaded to start fetching products
document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
  fetchProducts(url);
});

