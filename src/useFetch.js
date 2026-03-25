import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) return; 

        setLoading(true);
        setError(null); 

        async function fetchData() {
            try {
                const token = localStorage.getItem("token");

                const headers = {
                    "Content-Type": "application/json"
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(url, {
                    method: "GET",
                    headers: headers
                });

                if (response.status === 401 || response.status === 403) {
                    throw new Error("Session expired or unauthorized. Please log in again.");
                }

                if (!response.ok) {
                    throw new Error(`Something went wrong: ${response.status}`);
                }

                const fetchedData = await response.json();
                setData(fetchedData);

            } catch (error) {
                console.error("Fetch Error:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [url]);

    return { data, loading, error };
};

export default useFetch;