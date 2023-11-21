// Function to create HTML elements for each product
function createProductElement(product) {
  const productArticle = document.createElement('article');
  productArticle.className = 'product';

  // Create an anchor element
  const productLink = document.createElement('a');
  // Set the href attribute to the product detail page URL
  // Include a query parameter with the product's unique identifier (e.g., product.id)
  productLink.href = `sidur/product.html?productId=${product.id}`; // Example URL

  // Set the innerHTML of the anchor
  productLink.innerHTML = `
      <div class="rammis"><img src="${product.image}" alt="${product.title}"></div>
      <h2>${product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Category: ${product.category_title}</p>
  `;

  // Append the anchor to the article
  productArticle.appendChild(productLink);

  return productArticle;
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
// document.addEventListener('DOMContentLoaded', () => {
//   const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
//   fetchProducts(url);
//   fetchFeaturedProducts(url); // Fetch only 6 newest products for featured section

// });

// Detect the current page and execute the appropriate function

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  if (productId) {
      // We're on a product detail page
      displayProductDetails(productId);
  } else {
      // We're on the main products listing page
      const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
      fetchProducts();
      fetchFeaturedProducts();
  }
});


// Function to fetch and display a single product's details
async function displayProductDetails(productId) {
  const url = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products/${productId}`;
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const product = await response.json();

      // Update the product details in HTML
      document.getElementById('product-image').src = product.image;
      document.getElementById('product-image').alt = product.title;
      document.getElementById('product-title').textContent = product.title;
      document.getElementById('product-category').textContent = `Flokkur: ${product.category_title}`;
      document.getElementById('product-price').textContent = `Verð: ${product.price} kr.-`;
      document.getElementById('product-description').textContent = product.description;
      document.getElementById('more-from-category').textContent = `Meira úr ${product.category_title}`;
  } catch (error) {
      console.error('Error fetching product details:', error);
  }
}