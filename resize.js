function onWindowResize() {
    document.documentElement.style.setProperty('--doc-height', window.innerHeight + 'px')
}

window.onresize = onWindowResize;
onWindowResize()