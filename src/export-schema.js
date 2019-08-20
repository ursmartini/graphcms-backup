
if (!process.env.ENDPOINT) {
	console.error("ENV variable ENDPOINT missing");
	process.exit(1);
}

if (!process.env.PTOKEN) {
	console.error("ENV variable TOKEN missing");
	process.exit(1);
}

const fetchSchema = require('graphql-fetch-schema').default
const { buildClientSchema,introspectionQuery } = require("graphql");
const fs = require('fs')
const fetch = require('node-fetch')

const apiExportSchema = async (endpoint, token) => {

	const body = {
		"query": introspectionQuery
	}

	const res = await fetch(endpoint, {
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

	return await res.json()
}

apiExportSchema(process.env.ENDPOINT, process.env.PTOKEN)
	.then(
  (x) => {
	  console.log(x)
  },
  err => {
    console.error(err)
  },
)


