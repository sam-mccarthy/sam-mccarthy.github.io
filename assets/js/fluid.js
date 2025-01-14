function init() {
    const canvas = document.getElementById('fluid')

    canvas.width *= 4;  
    canvas.height *= 4;

    setInterval(update, 0)
    setInterval(draw, 0)
}

function update() {
}

function draw() {
}

window.onload = init