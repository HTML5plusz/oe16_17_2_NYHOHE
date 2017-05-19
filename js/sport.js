var model = [
    {
        "title": "Bajnokságok",
        "request": {
            "path": "/championship/namedescription/all",
            "params": null,
        },
        "display": {
            "type": "single",
            "cols": [
                {
                    "prop": "name",
                    "title": "Név"
                },{
                    "prop": "description",
                    "title": "Leírás"
                }
            ]
        }
    },{
        "title": "Sportágak",
        "request": {
            "path": "/sport/namedescription/all",
            "params": null,
        },
        "display": {
            "type": "single",
            "cols": [
                {
                    "prop": "name",
                    "title": "Név"
                },{
                    "prop": "description",
                    "title": "Leírás"
                }
            ]
        }
    },{
        "title": "Egy sport",
        "request": {
            "path": "/sport/{id}",
            "params": [
                {
                    "prop": "{id}",
                    "title": "Sportág azonosítója"
                }
            ]
        },
        "display": {
            "type": "multi",
            "cols": [
                {
                    "prop": "name",
                    "title": "Név"
                },{
                    "prop": "description",
                    "title": "Leírás"
                }
            ],
            "iter": [
                {
                    "name": "specialization",
                    "title": "Specializációk",
                    "cols": [
                        {
                            "prop": "name",
                            "title": "Név",
                        },{
                            "prop": "description",
                            "title": "Leírás"
                        }
                    ]
                }
            ]
        }
    },{
        "title": "Sportág hozzáadása",
        "request": {
            "path": "/sport/save",
            "type": "post",
            "params": [
                {
                    "prop": "name",
                    "title": "Név"
                },{
                    "prop": "description",
                    "title": "Leírás"
                }
            ]
        },
    }
];


window.onload = function() {
    var menu = document.getElementById("menu");
    for (var i = 0; i < model.length; i++) {
        var li = document.createElement("li");
        li.textContent = model[i].title;
        li.onclick = function(i) {
            return function() {
                getData(model[i]);
            };
        }(i);
        menu.appendChild(li);
    }
};

function getData(dataParams) {
    var content = document.getElementById("content");
    content.textContent = "";

    if (dataParams.request.type === "post") {
        displayParamsForm(dataParams.request.params, function (inputs) {
            var data = {};
            for (var i = 0; i < inputs.length; i++) {
                data[inputs[i].prop] = inputs[i].input.value;
            }
            sendPostRequest(baseurl + dataParams.request.path, data, function() {
                var p = document.createElement("p");
                p.textContent = JSON.parse(this.responseText).message === "OK" ? "Adatfelvitel sikeres" : "Hiba az adatfelvitel során";
                content.textContent = "";
                content.appendChild(p);
            });
        });
    } else if (dataParams.display.type === "single") {
        sendGetRequest(baseurl + dataParams.request.path, function() {
            displayTable(dataParams.display.cols, JSON.parse(this.responseText), content);
        });
    } else {
        displayParamsForm(dataParams.request.params, function (inputs) {
            var path = dataParams.request.path;
            for (var i = 0; i < inputs.length; i++) {
                path = path.replace(inputs[i].prop, inputs[i].input.value);
            }
            sendGetRequest(baseurl + path, function() {
                content.textContent = "";
                displayMulti(dataParams.display.cols, dataParams.display.iter, JSON.parse(this.responseText), content);
            });
        });
    }
}

function sendGetRequest(url, callback) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", callback);
    req.open("GET", url);
    req.send();
}

function sendPostRequest(url, data, callback) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", callback);
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "Basic " + btoa(auth));
    req.send(JSON.stringify(data));
}

function displayTable(cols, data, parent) {
    var trElement = document.createElement("tr");
    for (var i = 0; i < cols.length; i++) {
        var thElement = document.createElement("th");
        thElement.textContent = cols[i].title;
        trElement.appendChild(thElement);
    }

    var theadElement = document.createElement("thead");
    theadElement.appendChild(trElement);

    var tbodyElement = document.createElement("tbody");
    for (var i = 0; i < data.length; i++) {
        var trElement = document.createElement("tr");
        for (var j = 0; j < cols.length; j++) {
            var tdElement = document.createElement("td");
            tdElement.textContent = data[i][cols[j].prop];
            trElement.appendChild(tdElement);
        }
        tbodyElement.appendChild(trElement);
    }

    var tableElement = document.createElement("table");
    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);

    parent.appendChild(tableElement);
}

function displayMulti(cols, iter, data, parent) {
    var ul = document.createElement("ul");
    for (var i = 0; i < cols.length; i++) {
        var li = document.createElement("li");
        li.textContent = cols[i].title + ": " + data[cols[i].prop];
        ul.appendChild(li);
    }
    parent.appendChild(ul);

    for (var i = 0; i < iter.length; i++) {
        var h2 = document.createElement("h2");
        h2.textContent = iter[i].title;
        parent.appendChild(h2);
        displayTable(iter[i].cols, data[iter[i].name], parent);
    }
}

function displayParamsForm(params, callback) {
    var ul = document.createElement("ul");
    ul.classList.add("paramList");
    var inputs = [];

    for (var i = 0; i < params.length; i++) {
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", params[i].title);

        var li = document.createElement("li");
        li.appendChild(input);
        ul.appendChild(li);

        inputs.push({
            "input": input,
            "prop": params[i].prop
        });
    }

    var button = document.createElement("button");
    button.textContent = "Küldés";
    button.onclick = function() {
        callback(inputs);
    };

    var li = document.createElement("li");
    li.appendChild(button);
    ul.appendChild(li);

    var content = document.getElementById("content");
    content.appendChild(ul);
}
