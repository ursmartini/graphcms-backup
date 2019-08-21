const chai = require('chai');
const nock = require('nock')
const chaiNock = require('chai-nock');

chai.use(chaiNock);

const { apiExport } = require('../exporter');

const sampleResponse = {
	"out": {
		"jsonElements": [
			"this should be returned"
		]
	}
}

const myApiExport = apiExport("http://endpoint/api", "token")


describe('Content versioning', () => {
	beforeEach(() => {
	});

	afterEach(nock.cleanAll)

	afterAll(nock.restore)

	describe('API client', () => {

		test('Should request from API', async () => {
			const scope = nock("http://endpoint")
				.post("/api")
				.reply(
					200, 
					JSON.stringify(sampleResponse), 
					{"content-type": "application/json"}
				)

			await expect(myApiExport(null))
				.resolves
				.toEqual(sampleResponse.out.jsonElements)

			scope.done()
		})

		test('Should fail when API does not respond', async () => {
			const scope = nock("http://endpoint")
				.post("/api")
				.reply(500)

			await expect(myApiExport(null))
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
			try { await myApiExport(null) } catch (e) {}

			scope.done()
		})

		test('Should fail when API returns non-json', async () => {

			expect.assertions(1);
			const scope = nock("http://endpoint").post("/api")
				.reply(200, "foobar", { "content-type": "foo/bar" })

			await expect(myApiExport(null))
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

			await expect(myApiExport({"foo": "bar"}))
				.resolves.toEqual(sampleResponse.out.jsonElements)

			scope.done()

		});
		test('Should fetch nodes', async () => {

		});
	});


});
