const chai = require('chai');
const nock = require('nock')
const chaiNock = require('chai-nock')
const R = require('ramda')

chai.use(chaiNock);

nock.disableNetConnect()

const { apiExport } = require('../exporter');

const sampleResponse = {
	"out": {
		"jsonElements": [
			"this should be returned"
		]
	}
}

const myApiExport = R.partial(apiExport, ["http://endpoint", "token"])

describe('Content versioning', () => {
	beforeEach(() => {
		nock.disableNetConnect()
	});

	afterEach(() => {
		nock.cleanAll()
		nock.enableNetConnect()
	})

	afterAll(nock.restore)

	describe('API client', () => {

		test('Should request from API', async () => {
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(
					200,
					JSON.stringify(sampleResponse), 
					{"content-type": "application/json"}
				)

			await expect(myApiExport())
				.resolves
				.toEqual(sampleResponse.out.jsonElements)

			scope.done()
		})

		test('Should fail when API does not respond', async () => {
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(500)

			await expect(myApiExport())
				.rejects
				.toThrow("API error");

			scope.done()
		});

		test('Should request from API using content-type json', async () => {
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(200)
				.on("request", (req, interceptor, body) => {
					expect(req.headers).toBeDefined()
					expect(req.headers["content-type"]).toBeDefined()
					expect(req.headers["content-type"])
						.toContainEqual("application/json")
				})

			// we're not interested in the actual result or further logic
			// but only in the passing of auth-headers
			try { await myApiExport() } catch (e) {}

			scope.done()
		})

		test('Should request from API using token', async () => {
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(200)
				.on("request", (req, interceptor, body) => {
					expect(req.headers).toBeDefined()
					expect(req.headers.authorization).toBeDefined()
					expect(req.headers.authorization)
						.toContainEqual("Bearer token")
				})

			// we're not interested in the actual result or further logic
			// but only in the passing of auth-headers
			try { await myApiExport() } catch (e) {}

			scope.done()
		})

		test('Should fail when API returns non-json', async () => {

			expect.assertions(1);
			const scope = nock("http://endpoint").post("/export")
				.reply(200, "foobar", { "content-type": "foo/bar" })

			await expect(myApiExport())
				.rejects
				.toThrow("Invalid content-type: foo/bar")
		});

		test('Should not fail when API returns utf-8-json', async () => {

			expect.assertions(1);
			const scope = nock("http://endpoint").post("/export")
				.reply(200,
					JSON.stringify(sampleResponse),
					{ "content-type": "application/json; charset=utf-8" }
				)

			await expect(myApiExport())
				.resolves
				.toEqual(sampleResponse.out.jsonElements)
		});

		test('Should fetch type', async () => {

			const expectedBody = {
				"fileType": "foobar",
				"cursor": { "table": 0, "row": 0, "field": 0, "array": 0 }
			}
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(
					200,
					JSON.stringify(sampleResponse),
					{ "content-type": "application/json" }
				)
				.on("request", (req, interceptor, body) => {
					expect(JSON.parse(body)).toEqual(expectedBody)
				})

			await expect(myApiExport({ "fileType": "foobar" }))
				.resolves
				.toEqual(sampleResponse.out.jsonElements)

			scope.done()
		});

		test('Should fetch from cursor', async () => {

			const expectedBody = {
				"fileType": "nodes",
				"cursor": { "foo": "bar" }
			}
			const scope = nock("http://endpoint")
				.post("/export")
				.reply(
					200,
					JSON.stringify(sampleResponse),
					{ "content-type": "application/json" }
				)
				.on("request", (req, interceptor, body) => {
					expect(JSON.parse(body)).toEqual(expectedBody)
				})

			await expect(myApiExport({ "cursor": {"foo": "bar"}}))
				.resolves
				.toEqual(sampleResponse.out.jsonElements)

			scope.done()
		});
	});

});
