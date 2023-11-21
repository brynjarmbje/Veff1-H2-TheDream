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
async function fetchProducts() {
  let products = [];
  // Base URL of the API without the endpoint path
  const baseUrl = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';
  const endpoint = 'products'; // Endpoint for the products
  let url = baseUrl + endpoint;

  // Loop to fetch all products across pages
  while (url) {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          products = products.concat(data.items);

          // Prepare the URL for the next request
          if (data._links.next) {
              const nextUrl = data._links.next.href;
              const nextPathAndQuery = nextUrl.split('/products')[1];
              url = baseUrl + endpoint + nextPathAndQuery;
          } else {
              url = null; // No more products to fetch
          }
      } catch (error) {
          console.error('Error fetching data:', error);
          url = null; // Stop the loop in case of an error
      }
  }

  // Render all fetched products on the page
  renderProducts(products);
}

// Function to fetch featured product data from the server
async function fetchFeaturedProducts() {
  try {
      const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6';
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      renderFeaturedProducts(data.items);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to render featured products
function renderFeaturedProducts(products) {
  const container = document.getElementById('featured-products-container');
  container.innerHTML = ''; // Clear existing content
  products.forEach(product => {
      container.appendChild(createProductElement(product));
  });
}

// Event listener for DOMContentLoaded to start fetching products
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  if (productId) {
      // We're on a product detail page
      displayProductDetails(productId);
  } else {
      // We're on the main products listing page
      const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
      fetchProducts(url);
      fetchFeaturedProducts(url);
  }
});

