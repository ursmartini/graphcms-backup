const fetch = require("node-fetch");

const R = require('ramda');
const apiExport = R.curry(async (endpoint,token,cursor) => {
	const res = await fetch(endpoint, {
		method: "post",
		body: JSON.stringify({
			"fileType": "nodes",
			"cursor": cursor
		}),
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	if (!res.ok) { 
		throw new Error("API error")
	}

	const resContentType = res.headers.get('content-type')
	if (resContentType != "application/json") {
		throw new Error(
			`Invalid content-type: ${resContentType}` )
	}
	let json = await res.json()
	return json.out.jsonElements
})

module.exports = {
	apiExport
}
