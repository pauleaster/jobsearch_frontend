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

const fetchFilteredData = async (searchTerms = [''], currentJobs, appliedJobs) => {
    try {
        console.log("api: fetchFilteredData: API_BASE_URL:", API_BASE_URL);
        console.log("api: fetchFilteredData: searchTerms:", searchTerms);
        console.log("api: fetchFilteredData: currentJobs:", currentJobs);
        console.log("api: fetchFilteredData: appliedJobs:", appliedJobs);

        const url = `${API_BASE_URL}/filteredJobsAndSearchTerms`;
        const jsonPayload = {
            filterTerms: searchTerms,
            currentJobs: currentJobs,
            appliedJobs: appliedJobs
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

export { fetchData, fetchFilteredData, fetchSearchTerms, fetchJobDetails, patchJobDetails };
