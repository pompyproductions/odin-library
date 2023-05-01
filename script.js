const maskElement = document.querySelector(".mask");
const clipElement = document.querySelector(".clip");
const contentElement = document.querySelector(".content");
const addButton = document.querySelector("#add-button");
const submitButton = document.querySelector(".submit");
const form = {
    title: document.querySelector("#title"),
    year: document.querySelector("#year"),
    studio: document.querySelector("#studio"),
    alert: document.querySelector(".alert")
}
const table = document.querySelector("table");

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

function getCenterPos(elem) {
    const clientRect = elem.getBoundingClientRect();
    return {
        x: clientRect.x + (clientRect.width / 2),
        y: clientRect.y + (clientRect.height / 2)
    }
}

function calculateMask(elems) {
    // set for all elements (clip, mask)
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

function toggleMask() {
    isMaskActive = !isMaskActive;
    addButton.classList.toggle("active");
    calculateMask([maskElement, clipElement]);
}

function formAlert(msg) {
    form.alert.textContent = msg;
}

function onFormSubmit() {
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
    console.log(entry);
    appendToTable(entry);
    toggleMask();
}

function appendToTable(item) {
    const newRow = document.createElement("tr");

    for (prop in item) {
        const cell = document.createElement("td");
        cell.textContent = item[prop];
        newRow.appendChild(cell)
    }

    table.appendChild(newRow);
}

// function refreshTable() {

// }

addButton.addEventListener("click", toggleMask);
window.addEventListener("resize", () => {calculateMask([maskElement, clipElement])});
submitButton.addEventListener("click", onFormSubmit);
calculateMask([maskElement, clipElement]);

for (item of entries) {
    appendToTable(item);
}