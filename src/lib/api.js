/**
 * API föll.
 * @see https://lldev.thespacedevs.com/2.2.0/swagger/
 */

async function fetchProductData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const products = data.map(item => ({
          title: item.title,
          image: item.image,
          price: item.price,
          category_title: item.category_title
      }));
      return products;
  } catch (error) {
      console.error('Error fetching data:', error);
      return [];
  }
}

export { fetchProductData };