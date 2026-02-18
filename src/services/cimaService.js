
// Use relative path to leverage Vite proxy
const API_BASE_URL = '/api/psuministro';

/**
 * Fetches the list of medicine shortages from the CIMA API.
 * @param {number} page - The page number to fetch.
 * @param {number} pageSize - Number of items per page (set to 5000 to ensure full client-side matching).
 * @returns {Promise<Object>} - The JSON response from the API.
 */
/**
 * Fetches ALL medicine shortages from the CIMA API by iterating through pages.
 * The API seems to cap at 200 items per page regardless of pageSize param in some cases,
 * or simply paginates. This function ensures we get everything.
 * @returns {Promise<Object>} - The combined JSON response with all results.
 */
export const getAllShortages = async () => {
  let allResults = [];
  let page = 1;
  let hasMore = true;
  const pageSize = 1000; // Request large page, but loop anyway

  try {
    // Add a unique timestamp 't' to force the browser to fetch fresh data every time (Cache Busting)
    const cacheBuster = `&t=${Date.now()}`;
    while (hasMore) {
      const response = await fetch(`${API_BASE_URL}?pagina=${page}&tamanioPagina=${pageSize}${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.resultados || [];

      if (results.length > 0) {
        allResults = [...allResults, ...results];
        // If we got fewer items than requested (or 0), we're probably done.
        // However, CIMA API might behavior varies. Safe bet is if results < 25, we're at end?
        // Or just keep going until 0.
        if (results.length < pageSize && results.length < 25) {
          // Optimization: If very few results, likely the last page.
          // But strictly, we should just check if results.length === 0 on next page.
          // Let's rely on empty array check for next loop if we got full page.
        }
        page++;
      } else {
        hasMore = false;
      }

      // Safety break to prevent infinite loops if API is weird
      if (page > 50) hasMore = false;
    }

    return { resultados: allResults, total: allResults.length };
  } catch (error) {
    console.error('Error fetching shortages:', error);
    throw error;
  }
};
