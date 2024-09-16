const Big = require('big.js');

// Function to decode a value from a given base to decimal
function decodeValue(value, base) {
    return new Big(parseInt(value, base));
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
            result = result.times(xi.minus(xj));
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
        result = result.plus(yi.div(li).times(xi));
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

// Input JSON string
const inputJSON = JSON.stringify({
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
});

// Output the result
const constantTerm = findConstantTerm(inputJSON);
console.log("Constant Term:", constantTerm.toString());
