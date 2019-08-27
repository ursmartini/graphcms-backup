
if (!process.env.ENDPOINT) {
	console.error("ENV variable ENDPOINT missing");
	process.exit(1);
}

if (!process.env.TOKEN) {
	console.error("ENV variable TOKEN missing");
	process.exit(1);
}



const { apiExport } = require("./exporter");
const fs = require('fs');

const dir = "./workdir"
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}

const exportCategory = async (category) => {

	const categoryDir = dir + "/" + category
	if (!fs.existsSync(categoryDir)){
		fs.mkdirSync(categoryDir);
	}
	let chunkNum = 1
	let chunk, cursor;
	do {
		console.log(`Fetching chunk ${chunkNum} of category ${category}`)
		chunk = await apiExport(
			process.env.ENDPOINT, process.env.TOKEN,
			{ cursor: cursor, fileType: category }
		)
		fs.writeFileSync(
			`${categoryDir}/chunk_${String(chunkNum).padStart(5, '0')}.json`, 
			JSON.stringify(chunk)
		)
		cursor = chunk.cursor
		chunkNum++
	}
	while (chunk.isFull)
}

const app = async () => {
	try {

		[ "nodes", "list", "relations"].map(exportCategory)

	} catch (err) { console.log(err) }
}

app()
