const chai = require('chai');
const nock = require('nock')
const chaiNock = require('chai-nock');

chai.use(chaiNock);

const { 
	ApiClient, ImportExport, FileWriter, FileReader
} = require('../exporter');

const sampleResponse = {
	"out": {
		"jsonElements": [
			"this should be returned"
		]
	}
}

const client = new ApiClient('http://endpoint/api', 'token')

describe('Content versioning', () => {
	beforeEach(() => {
	});

	afterEach(nock.cleanAll)

	afterAll(nock.restore)

	describe('API client', () => {

		test('Should require an endpoint', () => {
			expect(() => {
				new ApiClient('', 'token')
			}).toThrow("No endpoint specified")
		});

		test('Should require a token', () => {
			expect(() => {
				new ApiClient('endpoint', '')
			}).toThrow("No token specified")
		});

		test('Should construct successfully', () => {
			expect(new ApiClient('endpoint', 'token'))
				.toBeInstanceOf(ApiClient)
		});

		test('Should request from API', async () => {
			const scope = nock("http://endpoint")
				.post("/api")
				.reply(
					200, 
					JSON.stringify(sampleResponse), 
					{"content-type": "application/json"}
				)

			await expect(client.export())
				.resolves
				.toEqual(sampleResponse.out.jsonElements)

			scope.done()
		})

		test('Should fail when API does not respond', async () => {
			const scope = nock("http://endpoint")
				.post("/api")
				.reply(500)

			await expect(client.export())
				.rejects
				.toThrow("API error");

			scope.done()
		});

		test('Should request from API using token', async () => {
			const scope = nock("http://endpoint")
				.post("/api")
				.reply(200)
				.on("request", (req, interceptor, body) => {
					expect(req.headers).toBeDefined()
					expect(req.headers.authorization).toBeDefined()
					expect(req.headers.authorization).toContainEqual("Bearer token")
				})

			// we're not interested in the actual result or further logic
			// but only in the passing of auth-headers
			try { await client.export() } catch (e) {}

			scope.done()
		})

		test('Should fail when API returns non-json', async () => {

			expect.assertions(1);
			const scope = nock("http://endpoint").post("/api")
				.reply(200, "foobar", { "content-type": "foo/bar" })

			await expect(client.export())
				.rejects
				.toThrow("Invalid content-type: foo/bar")
		});

		test('Should fetch from cursor', async () => {

			const expectedBody = {
				"fileType": "nodes",
				"cursor": { "foo": "bar" }
			}
			const scope = nock("http://endpoint")
				.post("/api", JSON.stringify(expectedBody))
				.reply(
					200,
					JSON.stringify(sampleResponse),
					{ "content-type": "application/json" }
				)

			const cursor = {"foo": "bar"}

			await expect(
				client.export(cursor)
			).resolves.toEqual(sampleResponse.out.jsonElements)

			scope.done()

		});
		test('Should fetch nodes', async () => {

			const sampleResponse = {
				"out": {
					"jsonElements": "this should be returned"
				}
			}
			const scope = nock("http://endpoint").post("/api")
				.reply(200, sampleResponse, { 
					"content-type": "application/json" 
				})

			const result = await client.export("nodes")
			expect(result).toBeDefined()
			expect(result).toEqual("this should be returned");
			scope.done()

		});

	});

	describe("FileSystem writer", () => {
		test('Should write ...', async () => {
		});
	
	});


	describe("Exporter", () => {
		test("Should orchestrate ", async () => {

			const apiClient = {
				export: jest.fn()
			}
			apiClient.export.mockResolvedValue("foobar")
			apiClient.export.mockResolvedValue("foobar")

			const converter = {
				convert: jest.fn().mockResolvedValue("convertted")
			}

			const fileWriter = {
				save: jest.fn().mockResolvedValue("schnarz")
			}

			const importExport = new ImportExport(apiClient, converter, fileWriter);
			importExport.export()

			console.log(fileWriter.save.mock.calls);

			// expect(apiClient.export).toHaveBeenCalled()
//			expect(fileWriter.save).toHaveBeenCalled()

		});
	});

});
