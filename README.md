# GraphCMS-Content-Backup

This package allows you to dump and import content from GraphCMS.

## Getting Started

### Prerequisites

You need to have access to a source GraphCMS project to back-up it's content 
In detail you need a `system token` with `CONTENT_EXPORT` permissions and
the endpoint to the API.

To import a content snapshot you need to have an content-wise empty new
GraphCMS-project but it has to have the models already pre-configured,
otherwise the import won't work. Currently there is no convenient way to
export/import the schema/structure. You can help yourself by copying the
project into a new one without the data (can be done in the project settings)

### Installation

	npm install

## Running the tests

There aren't so many tests but it's a start.

### API tests

Run them with

	yarn test

## Usage

Performing a content backup should definitely be automated in some way.
For security reasons the naming of the required auth token and endpoint
differentiates between backup and restore.

### Perform a content backup

Obtain a `system token` with `CONTENT_EXPORT` permissions from the settings
page of your GraphCMS project and copy the project endpoint:

	https://app.graphcms.com/.../master/settings

Export the relevant information through environment variables

	export ENDPOINT=...
	export TOKEN=...

Run the content export through yarn

	yarn cms-export

This will create a new folder `workdir/%timestamp%` with the folders and 
content files representing the current content snapshot.

### Perform a content restore

Obtain a `system token` with `CONTENT_IMPORT` permissions from the settings
page of your *new* GraphCMS project and copy the project endpoint.

*Keep in mind:* The data that you will import now will be added to the 
project in any case, so this step is *not* idempotent.

Export the relevant information as environment variables

	export IMPORT_ENDPOINT=...
	export IMPORT_TOKEN=...

Run the content import through yarn

	yarn cms-import workdir/%timestamp%

## Known issues

### Broken restore

Content restore does not fully work. Running the above command fails when
importing the first list:

	Importing nodes/chunk_00060.json (983421 bytes)
	Importing nodes/chunk_00061.json (983139 bytes)
	Importing nodes/chunk_00062.json (998700 bytes)
	Importing nodes/chunk_00063.json (693236 bytes)
	Importing list/chunk_00001.json (2 bytes)
	Error: Internal Server Error, {
	  "errors" : [ {
	    "message" : "list (of class java.lang.String)",
	    "requestId" : "prisma-prod-eu-west_graphcms-prod:ck03ysyg00hh40b20nswh5onp"
	  } ]
	}
	    at apiImport (/Users/urs/work/adac-camping/graphcms-backup/src/api/index.js:51:9)
	    at processTicksAndRejections (internal/process/task_queues.js:89:5)
	    at async app (/Users/urs/work/adac-camping/graphcms-backup/src/import.js:51:14)
