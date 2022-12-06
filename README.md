# OpenAPI Tools
A static website to perform various [OpenAPI](https://www.openapis.org/) operations (tested with OpenAPI 3.0.x).
- Validation of a YAML OpenAPI definition
- Validating a JSON call against a YAML OpenAPI definition
- Convert the YAML OpenAPI definition to a dereferenced JSON schema (additionally with each RequestBody as a single JSON schema).

Available here through GitHub Pages:

[<img src="https://github.com/BoThomas/openapi-tools/blob/main/.github/button.png" height="50"/>](https://bothomas.github.io/openapi-tools/)

## Problem
Having created my OpenAPI definition in YAML, I have no way to test/validate sample calls against it until I roll it out on an API management solution.

For JSON schemas, there are many validators on the internet. However, there is little to convert the OpenAPI definition to a JSON schema. Even if I succeed in converting, I need JSON schemas per RequestBody to be able to validate meaningfully.

There are numerous useful OpenAPI tools to solve the problems described. You can find a list [here](https://openapi.tools/). However, the tools are either paid SaaS solutions, but mostly server-side/cli-based libraries.

## Solution
- A simple website where I can insert my OpenAPI definition (without having to host it publicly).
- At the push of a button, I can validate an inserted sample json call against my OpenAPI definition.
- Errors are displayed directly and understandably.
- With the click of a button, I can dereference my OpenAPI definition, export it to a JSON schema and create JSON schemas for each request body. The result is downloaded directly as a ZIP file.
- All described functions run in my browser without my OpenAPI definition or my JSON request leaving my browser.
- Using existing libraries to do the heavy lifting.

In part, this project will be obsolet with the spread of [OpenAPI 3.1.x](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released), since this version is fully compatible with the JSON Schema definition.

## Static site approach
Not everyone wants to process their API definitions and sample requests on foreign servers. Therefore, the project is designed as a static website: All data remains with you and your browser.

To achieve this, [browserify](https://github.com/browserify/browserify) is used in the [package.json](https://github.com/BoThomas/openapi-tools/blob/main/package.json) to build the npm modules for client-side use.
Admittedly - the implementation in the package.json is a bit shaky - but it works.

Plus, I don't have to pay a hoster - thanks [GitHub Pages](https://pages.github.com/)!

## Dependencies
This project is highly reliant on the packages used, which do most of the work :slightly_smiling_face:

- [jquery](https://github.com/jquery/jquery) (MIT)  
JavaScript utils library
- [ace editor](https://github.com/ajaxorg/ace) (BSD)  
browser based standalone code editor
- [jszip](https://github.com/Stuk/jszip) (MIT/GPLv3)  
creating .zip files
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) (MIT)  
client side file saving
- [js-yaml](https://github.com/nodeca/js-yaml) (MIT)  
JavaScript implementation of YAML
- [json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser) (MIT)  
library for dealing with references/dereferencing
- [openapi-enforcer](https://github.com/Gi60s/openapi-enforcer) (Apache-2.0)  
tools for using the Open API Specification (e.g. validating requests)
- [openapi-schema-to-json-schema](https://github.com/openapi-contrib/openapi-schema-to-json-schema) (MIT)  
convert OpenAPI Schema to JSON Schema
- [browserify](https://github.com/browserify/browserify) (MIT)  
bundle npm modules for client side use
