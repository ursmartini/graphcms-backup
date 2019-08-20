const fetch = require("node-fetch");

class ApiClient {
	constructor(endpoint, token) {
		if (!endpoint) throw new Error("No endpoint specified");
		if (!token) throw new Error("No token specified");

		this.endpoint = endpoint
		this.token = token
	}

	async export (cursor) {
	
		const res = await fetch(this.endpoint, {
			method: "post",
			body: JSON.stringify({
				"fileType": "nodes",
				"cursor": cursor
			}),
			headers: {
				"Authorization": `Bearer ${this.token}`
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
	}
}

class FileWriter {
	constructor() {}
	async save() {}
}

class FileReader {
	constructor() {}
	async read() {}
}

class ImportExport {
	constructor(apiClient, fileWriter) {
		this.apiClient = apiClient
		this.fileWriter = fileWriter

		console.log("this.fileWriter" + fileWriter)
	}

	async export () {

		const isEof = (res) => !res.isFull
		const nextCursor = (res) => res?res.cursor:null

// 		do {
// 			let result = await this.apiClient.export(nextCursor())
// 
// 			let [data, cursor, eof] = this.converter.convert(chunk)
// 			const foo = await this.fileWriter.save(data)
// 			console.log(foo)
// 
// 			const cursor = a.cursor
// 
// 		} while (!isEof(result));


	}
}

module.exports = {
	ApiClient,
	ImportExport,
	FileWriter,
	FileReader
}
