const { apiExport } = require("./exporter");

const app = async () => {
	foo = await apiExport(process.env.ENDPOINT, process.env.TOKEN)
	console.log("foo is ");
	console.log(foo)
}

app()
