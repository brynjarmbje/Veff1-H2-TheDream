// Virkni til þess að búa til html element fyrir hverja vöru.
function createProductElement(product, url = '') {
  const productArticle = document.createElement('article');
  productArticle.className = 'product'
  const productLink = document.createElement('a');
  productLink.href = url ? `${url}${product.id}` : `/sidur/product.html?productId=${product.id}`;

  productLink.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Category: ${product.category_title}</p>
  `;

  productArticle.appendChild(productLink);
  return productArticle;
}

// Fall til þess að rendera vörur á síðu
function renderProducts(products) {
  const container = document.getElementById('products-container');
  products.forEach(product => {
    container.appendChild(createProductElement(product));
  });
}

// Fall sem sækir vörur úr db.
async function fetchProducts() {
  let products = [];
  const baseUrl = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';
  const endpoint = 'products';
  let url = baseUrl + endpoint;

  while (url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      products = products.concat(data.items);

      if (data._links.next) {
        const nextUrl = data._links.next.href;
        const nextPathAndQuery = nextUrl.split('/products')[1];
        url = baseUrl + endpoint + nextPathAndQuery;
      } else {
        url = null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      url = null;
    }
  }
  renderProducts(products);
}

// Fall sem sækir 6 nýjustu vörurnar
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

// Fall sem renderar 6 nýjustu vörurnar.
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


document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  if (productId) {
    displayProductDetails(productId);
  } else {
    const url = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products';
    fetchProducts(url);
    fetchFeaturedProducts();
  }
});


// Fall sem sækir og sýnir vöruna eftir að þú hefur klikkað á staka vöru.
async function displayProductDetails(productId) {
  const url = `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products/${productId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const product = await response.json();
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

//Fall sem sækir 3 vörur sem eru í sama flokk og varan sem er valin.
async function fetchSimilarProducts(categoryId) {
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

//Fall sem rendarar similar products.
function renderSimilarProducts(products) {
  const container = document.getElementById('similar-products-container');
  container.innerHTML = '';
  products.forEach(product => {
    container.appendChild(createProductElement(product));
  });
}

// Random fall til að fá mismunandi vörur.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
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
// Fall sem sér um search-ið
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

