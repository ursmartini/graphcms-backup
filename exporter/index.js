const fetch = require("node-fetch");

class ApiClient {
	constructor(endpoint, token) {
		this.endpoint = endpoint
		this.token = token
	}

	async export (endpoint, token) {
		if (!this.endpoint) throw new Error("No endpoint specified");
		if (!this.token) throw new Error("No token specified");
	
		const res = await fetch(this.endpoint, {
			headers: {
				"Authorization": `Bearer ${this.token}`
			}
		});
	
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
		//		const a = await this.apiClient.export()
		console.log("A="+a);
		console.log("hier");
		___console.log(this.fileWriter.save)
		console.log("da");
		return
		___console.log("3:"+this.fileWriter.save.mock.calls)

		const b = await this.fileWriter.save()
		console.log("B="+b);
		return
		console.log("HIER"+this.fileWriter.save);
		let cursor;
		while (true) {
			let [chunk, cursor] = await this.apiClient.exportChunk(cursor)
			await this.fileWriter.save(chunk)
			cursor = newCursor;
		}
	}
}

module.exports = {
	ApiClient,
	ImportExport,
	FileWriter,
	FileReader
}
