$(document).ready(function () {
    //init ace editors
    ace.config.set("basePath", "/javascripts/lib/ace-src-min")

    let editor_l = ace.edit("editor-l");
    editor_l.session.setMode("ace/mode/yaml");

    let editor_r = ace.edit("editor-r");
    editor_r.session.setMode("ace/mode/json");

    let options = {
        theme: "ace/theme/nord_dark",
        fontSize: "1rem",
        wrapBehavioursEnabled: true,
        hScrollBarAlwaysVisible: false,
        vScrollBarAlwaysVisible: false,
        scrollPastEnd: false,
        showPrintMargin: false
    };

    editor_l.setOptions(options);
    editor_r.setOptions(options);

    let validCounter = 0;

    //buttons
    $("#validate").click(function () {
        let $message = $("#message");
        let yaml = editor_l.getValue();
        let json = editor_r.getValue();

        let jsonApi;
        try {
            jsonApi = JsYaml.load(yaml);
        } catch (err) {
            validCounter = 0;
            $message.text(err);
            return;
        }

        derefOpenApi(jsonApi)
            .then(schema => {
                validate(schema, JSON.parse(json))
                    .then(result => {
                        if (result === "valid") {
                            validCounter++;
                            $message.text("valid (" + validCounter + ")");
                        } else {
                            validCounter = 0;
                            $message.text(result);
                        }
                    })
                    .catch(err => {
                        validCounter = 0;
                        $message.text(err.toString());
                    });
            })
            .catch(err => {
                validCounter = 0;
                $message.text(err.toString());
            });
    });

    $("#jsv-export").click(function () {
        validCounter = 0;
        let $message = $("#message");
        let yaml = editor_l.getValue();

        let jsonApi;
        try {
            jsonApi = JsYaml.load(yaml);
        } catch (err) {
            $message.text(err);
            return;
        }

        convertOpenApiToJsonSchema(jsonApi).then(schema => {
            let zip = new JSZip();
            try {
                let schemaType = schema["$schema"];
                for (const pathKey in schema["paths"]) {
                    let pathObj = schema["paths"][pathKey];
                    for (const method in pathObj) {
                        try {
                            if ("requestBody" in pathObj[method]) {
                                let requestBody;
                                if ("application/json" in pathObj[method]["requestBody"]["content"]) {
                                    requestBody = pathObj[method]["requestBody"]["content"]["application/json"]["schema"];
                                } else {
                                    requestBody = pathObj[method]["requestBody"]["content"]["*/*"]["schema"];
                                }

                                requestBody["$schema"] = schemaType;
                                requestBody["id"] = method + "|" + pathKey;
                                zip.file("paths" + pathKey + "/" + method.toUpperCase() + ".jsv", JSON.stringify(requestBody));
                            }
                        } catch (e) {
                            //continue
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
            zip.file("complete_schema.jsv", JSON.stringify(schema));

            zip.generateAsync({type: "blob"}).then(function (content) {
                saveAs(content, "schema_" + Date.now() + ".zip");
            });

            $message.text("download triggered successfully.");
        }).catch(err => {
            $message.text(err);
        });
    });

    //after init finished
    setTimeout(function () {
        $(".editor").show();
    }, 250);


    async function derefOpenApi(schema) {
        return await JsonSchemaRefParser.dereference(schema);
    }

    async function convertOpenApiToJsonSchema(schema) {
        let result = await JsonSchemaRefParser.dereference(schema);
        return OpenapiSchemaToJsonSchema(result);
    }

    async function validate(input_schema, request) {
        const openapi = await OpenapiEnforcer(input_schema);

        let [req, error, warning] = openapi.request(request);

        let result = "valid";
        if (typeof error !== "undefined") {
            result = error.toString();
        }
        if (typeof warning !== "undefined") {
            result += "\nwarning: " + warning.toString();
        }

        return result;
    }
});