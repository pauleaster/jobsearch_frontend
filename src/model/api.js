import { normaliseData } from "../utils/transform";
import { denormaliseJobDetails } from '../utils/transform';

/**
 * Expected env, per your note:
 * REACT_APP_API_HTTP_BASE_URL=http://localhost:3001/api
 * (and optionally HTTPS equivalent)
 */
const API_BASE_URL = ((useHttpsApi = process.env.REACT_APP_USE_HTTPS_API === "true") => {
  return useHttpsApi
    ? process.env.REACT_APP_API_HTTPS_BASE_URL
    : process.env.REACT_APP_API_HTTP_BASE_URL;
})();

/** Small helper: consistent error surfacing */
const fetchJson = async (url, options) => {
  const res = await fetch(url, options);
  const text = await res.text();

  // Try JSON; if not JSON, keep raw text for debugging
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
};

/**
 * VALID JOB SEARCH TERMS
 * - GET  /api/validJobsAndSearchTerms
 * - POST /api/filteredJobsAndSearchTerms   body: { filterTerms: string[], currentJob?: bool|null, appliedJob?: bool|null }
 */
const fetchValidJobsAndSearchTerms = async ({ skip = 0, limit = 100 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (skip !== undefined && skip !== null) params.set("skip", String(skip));
    if (limit !== undefined && limit !== null) params.set("limit", String(limit));
    const url = `${API_BASE_URL}/validJobsAndSearchTerms?${params.toString()}`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error fetching valid jobs/search terms", error);
    return null;
  }
};

const fetchFilteredValidJobsAndSearchTerms = async (
  filterTerms = [""],
  currentJob = null,
  appliedJob = null,
  skip = 0,
  limit = 100
) => {
  try {
    const url = `${API_BASE_URL}/filteredJobsAndSearchTerms`;
    return await fetchJson(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filterTerms,
        currentJob,
        appliedJob,
        skip,
        limit,
      }),
    });
  } catch (error) {
    console.error("There was an error fetching filtered valid jobs/search terms", error);
    return null;
  }
};

/**
 * SEARCH TERMS
 * - GET  /api/searchterms/
 * - POST /api/searchterms/
 * - GET  /api/searchterms/{term_id}
 * - DELETE /api/searchterms/{term_id}
 */
const fetchSearchTerms = async () => {
  try {
    const url = `${API_BASE_URL}/searchterms/`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error fetching the search terms", error);
    return null;
  }
};

const createSearchTerm = async (term) => {
  try {
    const url = `${API_BASE_URL}/searchterms/`;
    // OpenAPI expects SearchTermSchema: { Term: string } (capital T)
    return await fetchJson(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Term: term }),
    });
  } catch (error) {
    console.error("There was an error creating the search term", error);
    return null;
  }
};

const fetchSearchTermById = async (termId) => {
  try {
    const url = `${API_BASE_URL}/searchterms/${termId}`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error fetching the search term", error);
    return null;
  }
};

const deleteSearchTerm = async (termId) => {
  try {
    const url = `${API_BASE_URL}/searchterms/${termId}`;
    // 204 No Content expected; fetchJson handles empty body -> null
    return await fetchJson(url, { method: "DELETE" });
  } catch (error) {
    console.error("There was an error deleting the search term", error);
    return null;
  }
};

/**
 * JOBS
 * - GET    /api/jobs/           query: skip, limit, search
 * - POST   /api/jobs/           body: JobSchema
 * - GET    /api/jobs/count      query: search
 * - GET    /api/jobs/{job_id}
 * - PUT    /api/jobs/{job_id}   body: JobSchema
 * - PATCH  /api/jobs/{job_id}   body: { field: string, value?: string|null }
 * - DELETE /api/jobs/{job_id}
 */
const fetchJobs = async ({ skip = 0, limit = 100, search = null } = {}) => {
  try {
    const params = new URLSearchParams();
    if (skip !== undefined && skip !== null) params.set("skip", String(skip));
    if (limit !== undefined && limit !== null) params.set("limit", String(limit));
    if (search !== undefined && search !== null && search !== "") params.set("search", String(search));

    const url = `${API_BASE_URL}/jobs/?${params.toString()}`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error fetching jobs", error);
    return null;
  }
};

const createJob = async (job) => {
  try {
    const url = `${API_BASE_URL}/jobs/`;
    return await fetchJson(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
  } catch (error) {
    console.error("There was an error creating the job", error);
    return null;
  }
};

const fetchJobsCount = async (search = null) => {
  try {
    const params = new URLSearchParams();
    if (search !== undefined && search !== null && search !== "") params.set("search", String(search));

    const suffix = params.toString() ? `?${params.toString()}` : "";
    const url = `${API_BASE_URL}/jobs/count${suffix}`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error fetching jobs count", error);
    return null;
  }
};

const fetchJobDetails = async (jobId) => {
  try {
    const url = `${API_BASE_URL}/jobs/${jobId}`;
    const data = await fetchJson(url);

    // Get both the normalised data and the mapping
    const { normalised, mapping } = normaliseData(data);
    const details = Array.isArray(normalised) ? normalised[0] : normalised; // If normalised is an array, use the first item (single job expected)
    const fieldMapping = Array.isArray(mapping) ? mapping[0] : mapping; // If mapping is an array, use the first item (single job expected)

    // If normalised is an array, use the first item (single job expected)
    return {
      details: details,
      mapping: fieldMapping,
    };
  } catch (error) {
    console.error("There was an error fetching the job details", error);
    return null;
  }
};

const updateJob = async (jobId, job, mapping) => {
  try {
    // Denormalise the job details before sending to API
    const denormalisedJob = denormaliseJobDetails(job, mapping);
    const url = `${API_BASE_URL}/jobs/${jobId}`;
    return await fetchJson(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
  } catch (error) {
    console.error("There was an error updating the job", error);
    return null;
  }
};

const isPatchEnabled = true;

const patchJobDetails = async (jobId, field, value) => {
  if (!isPatchEnabled) return null;

  try {
    const url = `${API_BASE_URL}/jobs/${jobId}`;
    return await fetchJson(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
  } catch (error) {
    console.error("There was an error patching the job details", error);
    return null;
  }
};

const deleteJob = async (jobId) => {
  try {
    const url = `${API_BASE_URL}/jobs/${jobId}`;
    // 204 No Content expected
    return await fetchJson(url, { method: "DELETE" });
  } catch (error) {
    console.error("There was an error deleting the job", error);
    return null;
  }
};

/**
 * TEST
 * - GET /api/test/db-connection
 * - GET /api/test/health
 */
const testDbConnection = async () => {
  try {
    const url = `${API_BASE_URL}/test/db-connection`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error testing DB connection", error);
    return null;
  }
};

const healthCheck = async () => {
  try {
    const url = `${API_BASE_URL}/test/health`;
    return await fetchJson(url);
  } catch (error) {
    console.error("There was an error calling health check", error);
    return null;
  }
};

/**
 * ROOT (only if you ever need it)
 * - GET /
 * Not included because your API_BASE_URL ends with /api, so root would be different anyway.
 */

const fetchCombinedJobsAndSearchTerms = async ({
  filterTerms = [],
  currentJob = null,
  appliedJob = null,
  remoteJob = null,
  followUpSelectionMode = null,
  skip = 0,
  limit = 100,
  sortMode = "algorithm", // new
  sortBy = null,          // new
  sortDir = null          // new
} = {}) => {
  try {
    const url = `${API_BASE_URL}/filteredCombinedJobsAndSearchTerms`;
    const body = {
      filterTerms,
      currentJob,
      appliedJob,
      remoteJob,
      followUpSelectionMode,
      skip,
      limit,
      sortMode
    };
    if (sortMode === "column") {
      if (sortBy) body.sortBy = sortBy;
      if (sortDir) body.sortDir = sortDir;
    }
    // For explicit algorithm mode, no sortBy/sortDir needed

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Log all readable response headers
console.log("fetchCombinedJobsAndSearchTerms: response headers:");
for (const [key, value] of res.headers.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Optional direct checks
console.log("X-Total-Count:", res.headers.get("X-Total-Count"));
console.log("X-Page-Size:", res.headers.get("X-Page-Size"));

    const text = await res.text();
    let rows;
    try {
      rows = text ? JSON.parse(text) : [];
    } catch {
      rows = [];
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    }

    const totalCountHeader =
      res.headers.get("X-Total-Count") ?? res.headers.get("x-total-count");
    const totalCount = Number(totalCountHeader ?? 0);
    console.log(`fetchCombinedJobsAndSearchTerms: totalCountHeader = "${totalCountHeader}", totalCount = ${totalCount}`);

    const pageSizeHeader =
      res.headers.get("X-Page-Size") ?? res.headers.get("x-page-size");
    const pageSize = Number(pageSizeHeader ?? 0);
    console.log(`fetchCombinedJobsAndSearchTerms: pageSizeHeader = "${pageSizeHeader}", pageSize = ${pageSize}`);

    return { rows, totalCount, pageSize };
  } catch (error) {
    console.error("There was an error fetching combined jobs and search terms", error);
    return { rows: [], totalCount: 0, pageSize: 0 };
  }
};

export {
  // Valid job + search term combos
  fetchValidJobsAndSearchTerms,
  fetchFilteredValidJobsAndSearchTerms,

  // Search terms
  fetchSearchTerms,
  createSearchTerm,
  fetchSearchTermById,
  deleteSearchTerm,

  // Jobs
  fetchJobs,
  createJob,
  fetchJobsCount,
  fetchJobDetails,
  updateJob,
  patchJobDetails,
  deleteJob,

  // Test
  testDbConnection,
  healthCheck,

  // Combined jobs and search terms
  fetchCombinedJobsAndSearchTerms,
};