const createLowercaseDBField = (webField) => {
    // console.log(`createLowercaseDBField("${webField}")`);
    if (webField === null || webField === undefined) {
        return webField;  // return the original value if it's null or undefined
    }

    if (typeof webField !== 'string') {
        // console.warn("createLowercaseFieldValue received a non-string value:", webField);
        return webField;  // return the original value or handle as you see fit
    }
    const result = webField.toLowerCase().replace(/ /g, '_');
    // console.log(`createLowercaseDBField: result = "${result}"`);
    return result;
}

const normaliseData = (data) => {
    // If data is an array, normalise each item
    if (Array.isArray(data)) {
        return data.map(normaliseJobDetails);
    }
    // Otherwise, normalise the single object
    return normaliseJobDetails(data);
};

/**
 * Checks if the given field is a date field.
 * @param {string} field The field name to check.
 * @returns {boolean} True if the field is a date field, false otherwise.
 */
const isDateField = (field) => {
    // Example implementation, adjust based on your application's fields
    // console.log(`isDateField("${field}")`);
    const dateFields = ['Application Date', 'Job Date'];
    const isDate = dateFields.includes(field);
    // console.log(`isDateField: isDate = ${isDate}`);
    return isDate;
};

/**
 * Converts a date string from dd/MM/yyyy format to ISO format (yyyy-MM-dd).
 * @param {string} ddMMYYYYStr The date string in dd/MM/yyyy format.
 * @returns {string} The date string in ISO format.
 */
const convertDDMMYYYYToISO = (ddMMYYYYStr) => {
    // console.log(`convertDDMMYYYYToISO("${ddMMYYYYStr}")`);
    if (!ddMMYYYYStr) return '';
    const parts = ddMMYYYYStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        // console.log(`convertDDMMYYYYToISO: newDate = "${newDate}"`);
        return newDate;
    }
    // console.log("convertDDMMYYYYToISO: invalid date string returned empty string");
    return '';
};

/**
 * Formats a date string from ISO format (yyyy-MM-dd) or (yyyy-MM-ddThh:mm:ss)
 * to dd/MM/yyyy format.
 * @param {string} isoStr The date string in ISO format.
 * @returns {string} The date string in dd/MM/yyyy format.
 */
const formatDateToDDMMYYYY = (isoStr) => {
    // console.log(`formatDateToDDMMYYYY("${isoStr}")`);
    if (!isoStr) return '';

    // Split the ISO string on 'T' to separate date from time, if present
    const [datePart] = isoStr.split('T');
    // Now split the date part to get year, month, and day
    const [year, month, day] = datePart.split('-');

    // console.log(`formatDateToDDMMYYYY: year = "${year}"`);
    // console.log(`formatDateToDDMMYYYY: month = "${month}"`);
    // console.log(`formatDateToDDMMYYYY: day = "${day}"`);

    // Format the date into dd/MM/yyyy
    const newDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    // console.log(`formatDateToDDMMYYYY: newDate = "${newDate}"`);
    return newDate;
};

export function normaliseJobDetails(raw) {
    return {
        job_id: raw.Id ?? null,
        job_number: raw.job_number ?? null,
        job_url: raw.Url ?? raw.job_url ?? null,
        title: raw.Title ?? raw.title ?? null,
        comments: raw.comments ?? null,
        requirements: raw.requirements ?? null,
        follow_up: raw.follow_up ?? null,
        highlight: raw.highlight ?? null,
        applied: raw.applied ?? null,
        contact: raw.contact ?? null,
        application_comments: raw.application_comments ?? null,
        application_date: raw.ApplicationDate ?? raw.application_date ?? null,
        job_date: raw.JobDate ?? raw.job_date ?? null,
        unsuccessful: raw.Unsuccessful ?? raw.unsuccessful ?? null,
        search_terms: raw.SearchTerms ?? raw.search_terms ?? null,
        salary: raw.salary ?? null,
        position: raw.position ?? null,
        advertiser: raw.advertiser ?? null,
        location: raw.location ?? null,
        work_type: raw.work_type ?? null,
        expired: raw.expired ?? null,
        updated_at: raw.updated_at ?? null
    };
}

export { createLowercaseDBField, normaliseData, isDateField, convertDDMMYYYYToISO, formatDateToDDMMYYYY };