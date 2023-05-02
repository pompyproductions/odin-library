const maskElement = document.querySelector(".mask");
const clipElement = document.querySelector(".clip");
const contentElement = document.querySelector(".content");
const addButton = document.querySelector("#add-button");
const submitButton = document.querySelector(".submit");
const infosElement = document.querySelector(".infos");
const form = {
    title: document.querySelector("#title"),
    year: document.querySelector("#year"),
    studio: document.querySelector("#studio"),
    alert: document.querySelector(".alert")
}
const table = document.querySelector("tbody");

let isMaskActive = false;
const entries = [
    new Anime("Attack on Titan", {
        year: "2023",
        studio: "Mappa"
    }),
    new Anime("Boku no Hero Academia", {
        year: "2023",
        studio: "Mappa"
    }),
];

// object constructors

function Anime(title, optionalArgs = {}) {
    this.title = title;
    this.year = "";
    this.studio = "";
    for (arg in optionalArgs) {
        if (["year", "studio"].includes(arg)) {
            this[arg] = optionalArgs[arg]
        }
    }
}

// helpers: calculation

function getCenterPos(elem) {
    const clientRect = elem.getBoundingClientRect();
    return {
        x: clientRect.x + (clientRect.width / 2),
        y: clientRect.y + (clientRect.height / 2)
    }
}

function calculateMask(elems) {
    const coords = getCenterPos(addButton);
    const docDims = {
        height: document.documentElement.getBoundingClientRect().height,
        width: document.documentElement.getBoundingClientRect().width
    };
    if (!isMaskActive) {
        elems.forEach((elem) => {
            elem.style.left = `${coords.x}px`;
            elem.style.right = `${docDims.width - coords.x}px`;
            elem.style.top = `${coords.y}px`;
            elem.style.bottom = `${docDims.height - coords.y}px`;
        })
    } else {
        const radius = Math.sqrt(
            Math.pow(coords.x, 2) + 
            Math.pow(docDims.height - coords.y, 2)
        ) + 20;
        elems.forEach((elem) => {
            elem.style.left = `${coords.x - radius}px`;
            elem.style.right = `${docDims.width - radius - coords.x}px`;
            elem.style.top = `${coords.y - radius}px`;
            elem.style.bottom = `${docDims.height - coords.y - radius}px`;
        })
    }
}

function calculateInfosHeight() {
    return infosElement.getBoundingClientRect().height;
}

// helpers: DOM content

function updateInfos(entry) {
    infosElement.querySelector(".title").textContent = entry.title;
    infosElement.querySelector(".studio").textContent = entry.studio;
    infosElement.querySelector(".season").textContent = `${entry.year}${entry.season ? " " + entry.season : ""}`;
    infosElement.querySelector(".status").textContent = entry.status ? `Status: ${entry.status}` : "No info on status";
    infosElement.querySelector(".score").textContent = entry.score ? `Score: ${entry.score}/10` : "No score given";
    infosElement.style.setProperty("--elem-height", calculateInfosHeight())
}

function appendToTable(item, id) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-index", id.toString());
    for (prop in item) {
        const cell = document.createElement("td");
        cell.textContent = item[prop];
        newRow.appendChild(cell)
    }
    table.appendChild(newRow);
}



function toggleMask() {
    isMaskActive = !isMaskActive;
    addButton.classList.toggle("active");
    calculateMask([maskElement, clipElement]);
}

function formAlert(msg) {
    form.alert.textContent = msg;
}

function displayInfos(id) {
    updateInfos(entries[id]);
}

// event handlers

function handleFormSubmit() {
    if (!form.title.value) {
        formAlert("Please enter a value for the title.");
        return;
    }
    const entry = new Anime(form.title.value);
    if (form.year.value) {
        entry.year = form.year.value;
    }
    if (form.studio.value) {
        entry.studio = form.studio.value;
    }
    appendToTable(entry, entries.length);
    entries.push(entry);
    toggleMask();
}

function handleTableClick(e) {
    const row = e.target.closest("tr");
    if (!(row && row.getAttribute("data-index"))) return;
    displayInfos(Number(row.getAttribute("data-index")));
}

addButton.addEventListener("click", toggleMask);
window.addEventListener("resize", () => {calculateMask([maskElement, clipElement])});
submitButton.addEventListener("click", handleFormSubmit);
table.addEventListener("click", handleTableClick);
calculateMask([maskElement, clipElement]);


for (let i = 0; i < entries.length; i++) {
    appendToTable(entries[i], i);
}
displayInfos()