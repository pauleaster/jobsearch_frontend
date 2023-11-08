

const fetchData = async () => {
    try {
        const url = `http://localhost:3001/api/validJobsAndSearchTerms`;
        console.log("api: fetchData: url:", url);


        const response = await fetch(url);
        const data = await response.json();
        console.log("api: fetchData: data:", data);
        return data;
    } catch (error) {
        console.error("There was an error fetching the data", error);
        return null;
    }
}

const fetchFilteredData = async (searchTerms = ['']) => {
    try {
        console.log("api: fetchFilteredData: searchTerms:", searchTerms);
        const url = `http://localhost:3001/api/filteredJobsAndSearchTerms`;
        const jsonPayload = {
            filterTerms: searchTerms
        };
        console.log("api: fetchFilteredData: jsonPayload:", jsonPayload);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonPayload) // Send search terms in the request body
        });
        const data = await response.json();
        console.log("api: fetchFilteredData: data:", data);
        return data;
    } catch (error) {
        console.error("There was an error fetching the data", error);
        return null;
    }
}

const fetchSearchTerms = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/searchTerms');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error fetching the data", error);
        return null;
    }
}

const fetchJobDetails = async (jobId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/job/${jobId}`);
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("There was an error fetching the job details", error);
        return null;
    }
}

const isPatchEnabled = true;

const patchJobDetails = async (jobId, field, value) => {
    console.log("patchJobDetails(", jobId, field, value,")");
    if (isPatchEnabled) {
        console.log("Patching is enabled");
        try {
            const response = await fetch(`http://localhost:3001/api/job/${jobId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field, value })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("There was an error patching the job details", error);
            return null;
        }
    } else {
        console.log("Patching is disabled");
    }
}

export { fetchData, fetchFilteredData, fetchSearchTerms, fetchJobDetails, patchJobDetails };
