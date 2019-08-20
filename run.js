const { ApiClient, ImportExport, FileWriter } = require("./exporter");

console.log(process.env.ENDPOINT)
console.log(process.env.TOKEN)

let bar = new ApiClient('http://example.com', 'foo')
let baz = new FileWriter()
let foo = new ImportExport(bar, baz)


foo.export()
// bar.export(1,2);
