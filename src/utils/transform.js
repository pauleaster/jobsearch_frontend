const createLowercaseDBField = (webField) => {
    // console.log(`createLowercaseDBField("${webField}")`);
    if (webField === null || webField === undefined) {
        return webField;  // return the original value if it's null or undefined
    }

    if (typeof webField !== 'string') {
        console.warn("createLowercaseFieldValue received a non-string value:", webField);
        return webField;  // return the original value or handle as you see fit
    }
    const result = webField.toLowerCase().replace(/ /g, '_');
    // console.log(`createLowercaseDBField: result = "${result}"`);
    return result;
}

export { createLowercaseDBField };
