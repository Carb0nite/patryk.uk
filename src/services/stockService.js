// Stock data service for fetching real-time stock prices
// Uses Alpha Vantage API - Get your FREE API key at: https://www.alphavantage.co/support/#api-key
//
// SETUP INSTRUCTIONS:
// 1. Get a free API key from: https://www.alphavantage.co/support/#api-key
// 2. Add it to .env file as: VITE_ALPHA_VANTAGE_API_KEY=your_key_here
// 3. Free tier: 25 requests/day, 5 requests/minute - perfect for portfolio use with caching

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

/**
 * Fetch 1-year historical stock data for a given ticker symbol
 * @param {string} ticker - Stock ticker symbol (e.g., 'CRM', 'CSCO', 'IBM')
 * @returns {Promise<number[]>} Array of closing prices over the past year
 */
export async function fetchStockData(ticker) {
    // Check cache first
    const cached = getFromCache(ticker);
    if (cached) {
        console.log(`✓ Using cached data for ${ticker}`);
        return cached;
    }

    try {
        // Alpha Vantage API - Free tier, CORS-enabled
        // API key is loaded from environment variable
        const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${ticker}&apikey=${API_KEY}`;

        console.log(`Fetching stock data for ${ticker}...`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for API errors
        if (data['Error Message']) {
            throw new Error('Invalid ticker symbol');
        }

        if (data['Note']) {
            // API rate limit exceeded
            console.warn('⚠️ API rate limit reached. Using cached/fallback data.');
            throw new Error('API rate limit');
        }

        // Extract weekly time series data
        const timeSeries = data['Weekly Time Series'];
        if (!timeSeries) {
            throw new Error('No time series data available');
        }

        // Get the last 52 weeks of closing prices (1 year)
        const prices = Object.entries(timeSeries)
            .slice(0, 52)
            .reverse() // Chronological order (oldest to newest)
            .map(([date, values]) => parseFloat(values['4. close']))
            .filter(price => !isNaN(price) && price > 0);

        if (prices.length === 0) {
            throw new Error('No valid price data received');
        }

        // Cache the result
        saveToCache(ticker, prices);

        console.log(`✓ Fetched ${prices.length} weeks of data for ${ticker}`);
        return prices;

    } catch (error) {
        console.warn(`⚠️ Could not fetch live data for ${ticker}:`, error.message);
        console.log(`   → Using fallback data (get free API key at: https://www.alphavantage.co/support/#api-key)`);

        // Return fallback data based on ticker
        return getFallbackData(ticker);
    }
}

/**
 * Fetch stock data for multiple tickers
 * @param {string[]} tickers - Array of ticker symbols
 * @returns {Promise<Object>} Object with ticker symbols as keys and price arrays as values
 */
export async function fetchMultipleStocks(tickers) {
    const results = {};

    // Fetch all stocks in parallel
    const promises = tickers.map(ticker =>
        fetchStockData(ticker)
            .then(data => ({ ticker, data }))
            .catch(error => {
                console.error(`Failed to fetch ${ticker}:`, error);
                return { ticker, data: getFallbackData(ticker) };
            })
    );

    const responses = await Promise.all(promises);

    responses.forEach(({ ticker, data }) => {
        results[ticker] = data;
    });

    return results;
}

/**
 * Get data from localStorage cache
 */
function getFromCache(ticker) {
    try {
        const cached = localStorage.getItem(`stock_${ticker}`);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(`stock_${ticker}`);
        return null;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

/**
 * Save data to localStorage cache
 */
function saveToCache(ticker, data) {
    try {
        const cacheEntry = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(`stock_${ticker}`, JSON.stringify(cacheEntry));
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

/**
 * Get fallback simulated data if API fails
 */
function getFallbackData(ticker) {
    const fallbackData = {
        'CRM': [220, 215, 198, 185, 195, 210, 225, 240, 235, 250, 265, 280, 275, 290, 295],
        'CSCO': [45, 47, 46, 48, 50, 49, 52, 55, 53, 56, 58, 57, 59, 58, 60],
        'IBM': [140, 135, 130, 128, 132, 138, 145, 150, 155, 160, 165, 170, 175, 180, 185]
    };

    return fallbackData[ticker] || [100, 102, 104, 103, 105, 107, 106, 108, 110, 109, 111, 113, 112, 114, 115];
}
