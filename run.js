const { apiExport } = require("./exporter");

console.log(process.env.ENDPOINT)
console.log(process.env.TOKEN)

apiExport(process.env.ENDPOINT, process.env.TOKEN)

