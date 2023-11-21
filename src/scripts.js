// Function to create HTML elements for each product
function createProductElement(product) {
  const productArticle = document.createElement('article');
  productArticle.className = 'product';

  // Create an anchor element
  const productLink = document.createElement('a');
  // Set the href attribute to the product detail page URL
  // Include a query parameter with the product's unique identifier (e.g., product.id)
  productLink.href = `/sidur/product.html?productId=${product.id}`; // Example URL

  // Set the innerHTML of the anchor
  productLink.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
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
      fetchProducts(url);
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
      
      fetchSimilarProducts(product.category_id);
  } catch (error) {
      console.error('Error fetching product details:', error);
  }
}

async function fetchSimilarProducts(categoryId) {
  // Adjust the limit if needed to fetch more products for better randomness
  const url = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=10&category=${categoryId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    let data = await response.json();
    let shuffledProducts = shuffleArray(data.items);
    let selectedProducts = shuffledProducts.slice(0, 3);
    renderSimilarProducts(selectedProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
  }
}

function renderSimilarProducts(products) {
  const container = document.getElementById('similar-products-container');
  container.innerHTML = ''; // Clear existing content
  products.forEach(product => {
      container.appendChild(createProductElement(product));
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}
