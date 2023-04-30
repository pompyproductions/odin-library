function onWindowResize() {
    document.documentElement.style.setProperty('--doc-height', window.innerHeight + 'px')
}

window.addEventListener("resize", onWindowResize);
onWindowResize();