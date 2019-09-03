
if (!process.env.ENDPOINT) {
	console.error("ENV variable ENDPOINT missing");
	process.exit(1);
}

if (!process.env.TOKEN) {
	console.error("ENV variable TOKEN missing");
	process.exit(1);
}

const { apiExport } = require("./api");
const fs = require('fs');
const timestamp = new Date().toISOString();

const mkdir = dir => !fs.existsSync(dir) && fs.mkdirSync(dir)

const baseDir = `./workdir/${timestamp}`
mkdir(baseDir);

const exportCategory = async (category) => {

	const dir = `${baseDir}/${category}`
	mkdir(dir);

	let chunkNum = 1
	let chunk, cursor;
	do {
		console.log(`Fetching chunk ${chunkNum} of category ${category}`)
		chunk = await apiExport(
			process.env.ENDPOINT, process.env.TOKEN,
			{ cursor: cursor, fileType: category }
		)
		fs.writeFileSync(
			`${dir}/chunk_${String(chunkNum).padStart(5, '0')}.json`, 
			JSON.stringify(chunk.out.jsonElements)
		)
		cursor = chunk.cursor
		chunkNum++
	}
	while (chunk.isFull)

}

const app = async () => {
	try {

		console.log(`Exporting into ${baseDir}`);
		[ "nodes", "list", "relations"].map(exportCategory)

	} catch (err) { console.log(err) }
}

app()
