

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/validJobsAndSearchTerms');
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

const isPatchEnabled = false;

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

export { fetchData, fetchJobDetails, patchJobDetails };
