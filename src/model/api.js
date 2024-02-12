import { normaliseData } from "../utils/transform";

const API_BASE_URL = ((useHttpsApi = process.env.REACT_APP_USE_HTTPS_API === "true") => {
    if (useHttpsApi) {
        const api_base_url = process.env.REACT_APP_API_HTTPS_BASE_URL;
        console.log("api: API_BASE_URL: api_base_url:", api_base_url);
        return api_base_url;
    } else {
        const api_base_url = process.env.REACT_APP_API_HTTP_BASE_URL;
        console.log("api: API_BASE_URL: api_base_url:", api_base_url);
        return api_base_url;
    }
})();





const fetchData = async () => {
    try {
        console.log("api: fetchData: API_BASE_URL:", API_BASE_URL);
        const url = `${API_BASE_URL}/validJobsAndSearchTerms`;
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

const fetchAvailableJobs = async () => {
    try {
        console.log("api: fetchAvailableJobs")
        const jobs = await fetchData(); // Assuming fetchData returns an array of jobs
        console.log("api: fetchAvailableJobs: jobs:", jobs)
        if (!jobs) return null;

        const wordsToCheck = ["no", "longer", "advertised"]; // Words to check for in comments

        const availableJobsPromises = jobs.map(async (job) => {
            const jobDetails = await fetchJobDetails(job.job_id);
            if (jobDetails && jobDetails.comments) {
                const commentsLower = jobDetails.comments.toLowerCase();
                // Check if all words are present in comments
                const allWordsPresent = wordsToCheck.every(word => commentsLower.includes(word));
                if (!allWordsPresent) {
                    return jobDetails; // Include job if not all words are present
                }
            }
            return null; // Exclude job if all words are present
        });

        // Resolve all promises and filter out null values (excluded jobs)
        const availableJobs = (await Promise.all(availableJobsPromises)).filter(job => job !== null);
        return availableJobs;
    } catch (error) {
        console.error("There was an error in the process of fetching available jobs", error);
        return null;
    }
};


const fetchFilteredData = async (searchTerms = ['']) => {
    try {
        console.log("api: fetchFilteredData: API_BASE_URL:", API_BASE_URL);
        console.log("api: fetchFilteredData: searchTerms:", searchTerms);
        const url = `${API_BASE_URL}/filteredJobsAndSearchTerms`;
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
        console.log("api: fetchSearchTerms: API_BASE_URL:", API_BASE_URL);
        const url = `${API_BASE_URL}/searchTerms`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error fetching the data", error);
        return null;
    }
}

const fetchJobDetails = async (jobId) => {
    try {
        console.log("api: fetchJobDetails: API_BASE_URL:", API_BASE_URL);
        console.log("api: fetchJobDetails: jobId:", jobId);
        const url = `${API_BASE_URL}/job/${jobId}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("api: fetchJobDetails: data:", data);
        const normalisedData = normaliseData(data);
        console.log("api: fetchJobDetails: normalisedData:", normalisedData);
        return normalisedData[0];
    } catch (error) {
        console.error("There was an error fetching the job details", error);
        return null;
    }
}

const isPatchEnabled = true;

const patchJobDetails = async (jobId, field, value) => {
    console.log("api: patchJobDetails: API_BASE_URL:", API_BASE_URL);
    console.log("patchJobDetails(", jobId, field, value,")");
    if (isPatchEnabled) {
        console.log("Patching is enabled");
        try {
            const patchBody = JSON.stringify({ field, value });
            console.log("api: patchJobDetails: patchBody:\n", patchBody);
            console.log("\n");
            const response = await fetch(`${API_BASE_URL}/job/${jobId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: patchBody
            });
            const data = await response.json();
            console.log("api: patchJobDetails: data:", data);
            return data;
        } catch (error) {
            console.error("There was an error patching the job details", error);
            return null;
        }
    } else {
        console.log("Patching is disabled");
    }
}

export { fetchAvailableJobs, fetchFilteredData, fetchSearchTerms, fetchJobDetails, patchJobDetails };
