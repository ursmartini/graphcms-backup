const { apiExport } = require("./exporter");

const app = async () => {
	try {
		foo = await apiExport(process.env.ENDPOINT, process.env.TOKEN)
		console.log("foo is ");
		console.log(foo)
	} catch (err) { console.log(err) }
}

app()
