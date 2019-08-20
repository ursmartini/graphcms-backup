const chai = require('chai');
const nock = require('nock')
const chaiNock = require('chai-nock');

chai.use(chaiNock);

const { 
	ApiClient, ImportExport, FileWriter, FileReader
} = require('../exporter');


describe('Content versioning', () => {
	beforeEach(() => {
	});

	afterEach(nock.cleanAll)

	afterAll(nock.restore)

	describe('API client', () => {

		test('Should require an endpoint', async () => {
			expect.assertions(1);
			const apiclient = new ApiClient('', 'token')
			try {
				const result = await apiclient.export()
			} catch (err) {
				expect(err).toEqual(new Error("No endpoint specified"))
			}
		});

		test('Should require a token', async () => {
			expect.assertions(1);
			const apiclient = new ApiClient('http://endpoint/api', '')
			try {
				await apiclient.export()
			} catch (err) {
				expect(err).toEqual(new Error("No token specified"))
			}
		});

		test('Should request from API', async () => {

			const apiclient = new ApiClient('http://endpoint/api', 'token')
			const scope = nock("http://endpoint")
				.get("/api")
				.reply(200)

			try {
				await apiclient.export()
			} catch (err) {}
			scope.done()
		})

		test('Should request from API using token', async () => {

			const apiclient = new ApiClient('http://endpoint/api', 'token')
			const scope = nock("http://endpoint")
				.get("/api")
				.reply(200)
				.on("request", (req, interceptor, body) => {
					expect(req.headers).toBeDefined()
					expect(req.headers.authorization).toBeDefined()
					expect(req.headers.authorization).toContainEqual("Bearer token")
				})

			try {
				await apiclient.export()
			} catch (err) {}
			scope.done()
		})

		test('Should fail when API returns non-json', async () => {

			expect.assertions(1);
			const apiclient = new ApiClient('http://endpoint/api', 'token')
			const scope = nock("http://endpoint").get("/api")
				.reply(200, "foobar", { "content-type": "foo/bar" })

			try {
				const result = await apiclient.export()
			} catch (err) {
				expect(err).toEqual(new Error(
					"Invalid content-type: foo/bar"))
			}
		});

		test('Should fetch nodes', async () => {

			const sampleResponse = {
				"out": {
					"jsonElements": "this should be returned"
				}
			}
			const apiclient = new ApiClient('http://endpoint/api', 'token')
			const scope = nock("http://endpoint").get("/api")
				.reply(200, sampleResponse, { 
					"content-type": "application/json" 
				})

			const result = await apiclient.export("nodes")
			expect(result).toBeDefined()
			expect(result).toEqual("this should be returned");
			scope.done()

		});

	});

	describe("FileSystem writer", () => {
		test('Should write ...', async () => {
		});
	
	});


// 	describe("Exporter", () => {
// 		test("Should orchestrate ", async () => {
// 
// 			const apiClient = {
// 				export: jest.fn().mockResolvedValue("foobar")
// 			}
// 			const fileWriter = {
// 				save: jest.fn().mockResolvedValue("schnarz")
// 			}
// 
// 			const importExport = new ImportExport(apiClient, fileWriter);
// 			importExport.export()
// 
// 			console.log(fileWriter.save.mock.calls);
// 
// 			// expect(apiClient.export).toHaveBeenCalled()
// 			expect(fileWriter.save).toHaveBeenCalled()
// 
// 		});
// 	});

});
