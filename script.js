const maskElement = document.querySelector(".mask");
const clipElement = document.querySelector(".clip");
const contentElement = document.querySelector(".content");
const addButton = document.querySelector("#add-button");
let isMaskActive = true;

function handleButtonClick() {
    toggleMask()
    addButton.classList.toggle("active");
    // maskElement.classList.toggle("active")
    // document.querySelector("#new-entry").classList.toggle("hidden")
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
    calculateMask([maskElement, clipElement]);
}

addButton.addEventListener("click", handleButtonClick);
window.addEventListener("resize", () => {calculateMask([maskElement, clipElement])});
toggleMask();
