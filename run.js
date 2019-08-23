const { apiExport } = require("./exporter");
const fs = require('fs');


const dir = "./tmp"
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}

const app = async () => {
	try {
		let chunk = await apiExport(process.env.ENDPOINT, process.env.TOKEN)
		fs.writeFileSync(dir + "/chunk.json", JSON.stringify(chunk))


	} catch (err) { console.log(err) }
}

app()
