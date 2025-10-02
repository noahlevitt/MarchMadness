// Function to send a SQL query to the backend server (port 5001) and get the result as text
export const queryBackend = async (query) => {
    try {
        // Send a GET request to the backend with the query encoded in the URL
        const response = await fetch(`http://localhost:5001/query?q=${encodeURIComponent(query)}`);

        // Check if the response status is not OK (200–299 range)
        if (!response.ok) {
            // If not OK, throw an error with the response status
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If successful, return the response as plain text (not JSON)
        return await response.text();
    } catch (error) {
        // Log any error that occurred during the fetch
        console.error("Error querying backend:", error);

        // Return a fallback message for the UI or caller
        return "Error: Unable to fetch data";
    }
};

// Function to fetch game data from the /games endpoint on backend (port 5001) as JSON
export const fetchGames = async () => {
    try {
        // Send a GET request to the /games endpoint
        const response = await fetch("http://localhost:5001/games");

        // Check if the response was successful
        if (!response.ok) {
            // If not, throw an error with the HTTP status
            throw new Error(`Failed to fetch games: ${response.status}`);
        }

        // Return the parsed JSON data from the response
        return await response.json();
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching games:", error);

        // Return an empty array as a fallback (to avoid breaking the UI)
        return [];
    }
};

/**
 * Login to backend using email and password
 * @param {*} email - User email
 * @param {*} password - User password
 * @returns the result of the login query as raw text
 */
export const backendLogin = async (email, password) => {
    try {
        const response = await fetch(`http://localhost:5001/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};

/**
 * Sign up to backend with email and password
 * @param {*} email - Email for new user
 * @param {*} password - Password for new user
 * @returns response as plain text
 */
export const backendSignUp = async (email, password) => {
    try {
        const response = await fetch(`http://localhost:5001/signup?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};

export const changeBalance = async (email, balance) => {
    try {
        const response = await fetch(`http://localhost:5001/balance?email=${encodeURIComponent(email)}&balance=${encodeURIComponent(balance)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error querying backend:", error);
        return "Error: Unable to fetch data";
    }
};

export const placeBet = async (payload) => {
    try {
        const response = await fetch('http://localhost:5001/placebet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error placing bet:", error);
        return { error: "Unable to place bet" };
    }
};

export const fetchTeams = async () => {
  try {
    const response = await fetch('http://localhost:5001/teams');
    if (!response.ok) throw new Error('Failed to fetch teams');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching teams:', err);
    return [];
  }
};

/**
 * Fetch the current balance for the given email.
 * @param {string} email
 * @returns {Promise<number|null>} current balance or null on error
 */
export const fetchBalance = async (email) => {
    const res = await fetch(`http://localhost:5001/balance?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
    const { balance } = await res.json();
    return parseFloat(balance);
  };
  
  