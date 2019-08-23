const fetch = require("node-fetch");
const R = require('ramda');

// Fancy deconstruruing and default parameters pattern from here:
// https://gist.github.com/ericelliott/f3c2a53a1d4100539f71
const apiExport = async (endpoint, token, { fileType, cursor } = {}) => {

	const body = {
		"fileType": fileType || "nodes",
		"cursor": cursor || {
			"table": 0,
			"row": 0,
			"field": 0,
			"array": 0
		}
	}

	const res = await fetch(endpoint + "/export", {
		method: "post",
		body: JSON.stringify(body),
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-type": "application/json"
		}
	});

	if (!res.ok) { 
		throw new Error("API error")
	}

	const resContentType = res.headers.get('content-type')
	if (!resContentType.includes("application/json")) {
		throw new Error(
			`Invalid content-type: ${resContentType}` )
	}

	let json = await res.json()
	return json.out.jsonElements
}

const resultWriter = async () => {
	return true
}

module.exports = {
	apiExport,
	resultWriter
}
