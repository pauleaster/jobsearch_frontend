

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3001/api/validJobsAndSearchTerms');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error fetching the data", error);
        return null;
    }
}

async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`http://localhost:3001/api/job/${jobId}`);
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("There was an error fetching the job details", error);
        return null;
    }
}

export { fetchData, fetchJobDetails };
