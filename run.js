const { apiExport } = require("./exporter");

const folder = "tmp"

const app = async () => {
	try {
		let chunk = await apiExport(process.env.ENDPOINT, process.env.TOKEN)
		await resultWriter(folder, chunk)
	} catch (err) { console.log(err) }
}

app()
