// Import the big.js library
const Big = require('big.js');

// Function to decode a value from a given base to decimal
function decodeValue(value, base) {
    return new Big(parseInt(value, base));
}

// Function to decode y-values from different bases
function decodeYValues(yValues) {
    return yValues.map(yValue => decodeValue(yValue.value, yValue.base));
}

// Function to parse the JSON and extract roots
function parseJSON(inputJSON) {
    const data = JSON.parse(inputJSON);
    const { n, k } = data.keys;
    const roots = [];

    for (const key in data) {
        if (key !== 'keys') {
            const base = parseInt(data[key].base, 10);
            const value = data[key].value;
            const x = new Big(key);
            const y = decodeValue(value, base);
            roots.push({ x, y });
        }
    }

    return { n, k, roots };
}

// Function to calculate Lagrange basis polynomial L_i(x)
function lagrangeBasis(i, xValues) {
    return xValues.reduce((result, xj, j) => {
        if (i !== j) {
            const xi = xValues[i];
            const term = xi.minus(xj);
            result = result.times(term);
        }
        return result;
    }, new Big(1));
}

// Function to compute Lagrange Interpolation polynomial
function lagrangeInterpolation(xValues, yValues) {
    const n = xValues.length;
    let result = new Big(0);

    for (let i = 0; i < n; i++) {
        const xi = xValues[i];
        const yi = yValues[i];
        const li = lagrangeBasis(i, xValues);
        const term = yi.div(li).times(xi);
        result = result.plus(term);
    }

    return result;
}

// Function to find the constant term from JSON string
function findConstantTerm(jsonString) {
    const { roots } = parseJSON(jsonString);
    const xValues = roots.map(root => root.x);
    const yValues = roots.map(root => root.y);
    
    return lagrangeInterpolation(xValues, yValues);
}

// Function to run a specific test case
function runTest(testCase, expectedConstantTerm) {
    const jsonString = JSON.stringify(testCase);
    const constantTerm = findConstantTerm(jsonString);
    return constantTerm.eq(new Big(expectedConstantTerm)) ? "Pass" : "Fail";
}

// Function to run multiple random tests
function runTests(numTests) {
    // Example function to generate a random test case
    function generateRandomTestCase() {
        const n = Math.floor(Math.random() * 10) + 1;
        const k = Math.floor(Math.random() * (n - 1)) + 1;
        const keys = { n, k };
        const testCase = { keys };

        for (let i = 1; i <= n; i++) {
            const base = Math.floor(Math.random() * 16) + 2;
            const value = Math.floor(Math.random() * 10000).toString(base);
            testCase[i] = { base: base.toString(), value };
        }

        return testCase;
    }

    // Run and validate a number of random tests
    for (let i = 0; i < numTests; i++) {
        const testCase = generateRandomTestCase();
        const jsonString = JSON.stringify(testCase);
        const result = findConstantTerm(jsonString);
        console.log(`Test Case ${i + 1}: ${result}`);
    }
}

// Specific test cases
const testCase1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

const testCase2 = {
    "keys": { "n": 9, "k": 6 },
    "1": { "base": "10", "value": "28735619723837" },
    "2": { "base": "16", "value": "1A228867F0CA" },
    "3": { "base": "12", "value": "32811A4AA0B7B" },
    "4": { "base": "11", "value": "917978721331A" },
    "5": { "base": "16", "value": "1A22886782E1" },
    "6": { "base": "10", "value": "28735619654702" },
    "7": { "base": "14", "value": "71AB5070CC4B" },
    "8": { "base": "9", "value": "122662581541670" },
    "9": { "base": "8", "value": "642121030037605" }
};

// Run specific test cases
console.log("Running specific test cases:");
console.log("Test Case 1:", runTest(testCase1, 1));
console.log("Test Case 2:", runTest(testCase2, 28735619723837));


