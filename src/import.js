const { apiImport } = require("./api");
const fs = require('fs');
const R = require('ramda');
const fetch = require("node-fetch");

if (!process.env.IMPORT_ENDPOINT) {
	console.error("ENV variable IMPORT_ENDPOINT missing");
	process.exit(1);
}

if (!process.env.IMPORT_TOKEN) {
	console.error("ENV variable IMPORT_TOKEN missing");
	process.exit(1);
}

if (!process.argv[2]) {
	console.error("Usage: yarn cms-import import-folder")
	process.exit(1);
}

const baseDir = process.argv[2]
const myApiImport = R.curry(apiImport)
	(process.env.IMPORT_ENDPOINT, process.env.IMPORT_TOKEN)

if (!fs.existsSync(baseDir)) {
	console.error("Import directory does not exist");
	process.exit(1);
}


const app = async () => {
	let allFiles = {};

	["nodes", "list", "relations"].map((c) => {
		let files = fs.readdirSync(`${baseDir}/${c}`)
		console.log(`Importing ${c} with ${files.length} files`)
		files.map((f) => {
			allFiles[`${c}/${f}`] = c
		})
	})


	let fileList = Object.keys(allFiles)
	do {
		let f = fileList.shift()
		let c = allFiles[f]
		let data = fs.readFileSync(`${baseDir}/${f}`, 'utf8')
		console.log(`Importing ${f} (${data.length} bytes)`)

		try {
			let res = await myApiImport(c, data)
		} catch (err) {
			console.error(err)
			return false
		}
	} while(fileList.length)
}

app()
