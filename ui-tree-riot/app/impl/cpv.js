
const CPV_CODE_RE = /^(\d{1,8})-?\d?$/;

export function comparator(dataItem, userInput) {
    let res = {contain: false, utilData: {}};

    if (!userInput || userInput === '') {
        return {...res, contain: true};
    }

    if (typeof userInput !== 'string' || typeof dataItem.name !== 'string') {
        console.error('Incorrect type of argument');
        return {...res, contain: true}
    }

    const inputIsCode = (input) => CPV_CODE_RE.test(input);
    const foundSubstring = (base, subStr) => {
        const start = base.toLowerCase().indexOf(subStr.toLowerCase());
        const end = start + subStr.length;
        if (start !== -1) {
            return {contain: true, start, end};
        }
        return {contain: false};
    };

    if (inputIsCode(userInput.trim())) {
        // Search by code
        const {contain, start, end} = foundSubstring(dataItem.code, userInput.trim());
        if (contain) {
            res = {
                ...res,
                contain,
                utilData: {
                    ...res.utilData,
                    markCodeStart: start,
                    markCodeEnd: end,
                },
            };
        }
    } else {
        // Search by name
        const {contain, start, end} = foundSubstring(dataItem.name, userInput);
        if (contain) {
            res = {
                ...res,
                contain,
                utilData: {
                    ...res.utilData,
                    markNameStart: start,
                    markNameEnd: end,
                },
            };
        }
    }

    return res;
}
