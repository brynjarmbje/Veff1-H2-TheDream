// Function to create HTML elements for each product
function createProductElement(product, url = '') {
  const productArticle = document.createElement('article');
  productArticle.className = 'product';

  // Create an anchor element
  const productLink = document.createElement('a');
  // Set the href attribute to the product detail page URL
  // Include a query parameter with the product's unique identifier (e.g., product.id)
  productLink.href = url ? `${url}${product.id}` : `sidur/product.html?productId=${product.id}`;

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
  if (container) {
    container.innerHTML = '';
    products.forEach(product => {
      container.appendChild(createProductElement(product));
    });
  } else {
    console.error('Featured products container not found');
  }
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
    const data = await response.json();
    const shuffledProducts = shuffleArray(data.items);
    const selectedProducts = shuffledProducts.slice(0, 3);
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


function renderSearchResults(products) {
  const container = document.querySelector('.product-row');
  const url = 'product.html?productId=';
  products.forEach(product => {
    const productElement = createProductElement(product, url);
    container?.appendChild(productElement);
  });
}

async function handleSearch(query) {
  const searchUrl = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?search=${encodeURIComponent(query)}`;

  const loadingElement = document.createElement('div');
  const emptyElement = document.createElement('div');
  const errorElement = document.createElement('div');
  loadingElement.classList.add('state');
  emptyElement.classList.add('hide', 'state');
  errorElement.classList.add('hide', 'state');

  const productsToClear = document.querySelectorAll('.product');
  console.log(productsToClear);
  productsToClear.forEach(product => product.remove());

  document.querySelector('main')?.appendChild(loadingElement);

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const searchResults = data.items;

    loadingElement.classList.add('hide');
    if (searchResults.length === 0) {
      emptyElement.textContent = `Engar niðurstöður fyrir leit að : ${query}`;
      emptyElement.classList.remove('hide');
    }
    else if (searchResults.length === 1) {
      window.location.href = `product.html?productId=${searchResults[0].id}`;
    } else if (searchResults.length > 1) {
      renderSearchResults(searchResults);
    }
  } catch (error) {
    console.error(`Villa kom upp við leit að : ${query}`, error);
    loadingElement.classList.add('hide');
    errorElement.textContent = `Villa kom upp við leit að : ${query}`;
    errorElement.classList.remove('hide');
  }
}

function updateURLWithSearchQuery(query) {
  const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?search=${encodeURIComponent(query)}`;
  window.history.pushState({ path: newurl }, '', newurl);
}
/*
function searchFromURL() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('search');
  if (query) {
    handleSearch(query);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  searchFromURL();
});

*/

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('[data-search]');

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value;
    if (query) {
      await handleSearch(query);
      updateURLWithSearchQuery(query);
    }
  });
}

