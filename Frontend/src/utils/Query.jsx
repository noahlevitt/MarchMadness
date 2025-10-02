import React, { useState } from 'react';

// Import the backend query function using HTTP
import { queryBackend } from '../utils/api';
 

const Query = () => {
    // State for handling query input and results
    const [queryInput, setQueryInput] = useState('');
    const [queryResult, setQueryResult] = useState('');

    // Function to handle backend query using HTTP
    const handleQuery = async () => {
        console.log("running...");
        if (!queryInput.trim()) {
            alert('Please enter a valid query.');
            return;
        }

        try {
            console.log("running...");
            const result = await queryBackend(queryInput); // Send custom query via HTTP
            console.log(result);
            setQueryResult(result); // Display results
        } catch (error) {
            console.error('Query failed:', error);
            setQueryResult('Error executing query.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
            <h2>Test Custom Backend Query</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Enter SQL query (e.g., SELECT * FROM bets)"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={handleQuery} style={{ padding: '8px 16px' }}>
                    Run Query
                </button>
            </div>
            <pre style={{ backgroundColor: '#eaeaea', padding: '10px', minHeight: '100px' }}>
            {queryResult || 'No query run yet.'}
            </pre>
        </div>
    )
}

export default Query;