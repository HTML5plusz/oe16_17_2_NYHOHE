window.onload = function() {
    var menuitems = document.getElementsByClassName("menuitem");
    for (var i = 0; i < menuitems.length; i++) {
        menuitems[i].onclick = function(i) {
            return function() {
                displayData(menuitems[i].getAttribute("href"));
            };
        }(i);
    }
    displayData(window.location.hash);
};

function iter(o, el) {
    var ul = document.createElement("ul");
    if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) {
            addListItem(ul, null, o[i]);
        }
    } else {
        el.appendChild(document.createTextNode(o.name || o.id));
        for (var prop in o) {
            addListItem(ul, prop, o[prop]);
        }
    }
    el.appendChild(ul);
}

function addListItem(ul, prop, o) {
    if (o && typeof(o) === "object" || prop !== "id" && prop !== "name") {
        var li = document.createElement("li");
        var toggleOpen = document.createElement("span");
        toggleOpen.classList.add("toggle_open");
        li.appendChild(toggleOpen);

        if (o && typeof(o) === "object") {
            toggleOpen.textContent = "⊟";
            toggleOpen.onclick = function(toggleOpen, li) {
                var open = true;
                return function(e) {
                    if (open) {
                        toggleOpen.textContent = "⊞";
                    } else {
                        toggleOpen.textContent = "⊟";
                    }
                    open = !open;
                    li.classList.toggle("hide_descendants");
                };
            }(toggleOpen, li);
            if (prop) {
                li.appendChild(document.createTextNode(prop + (Array.isArray(o) ? "" : ": ")));
            }
            iter(o, li);
        } else {
            li.innerHTML += prop + ": " + o;
        }

        ul.appendChild(li);
    }
}

function displayData(hash) {
    var listEl = document.getElementById("list");
    listEl.innerHTML = "<li>Betöltés...</li>";
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        listEl.innerHTML = "";
        addListItem(listEl, "*", JSON.parse(this.responseText));
    });
    req.open("GET", baseurl + hash.slice(1));
    req.send();
}
