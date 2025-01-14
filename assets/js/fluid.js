const RADIUS = 5;
const COUNT = 1000;
var points = []

function distance() {

}
function init() {
    const canvas = document.getElementById('fluid')

    canvas.width *= 4;  
    canvas.height *= 4;

    for(let i = 0; i < COUNT; i++){
        let x = Math.random() * (canvas.width - 2 * RADIUS) + RADIUS;
        let y = Math.random() * (canvas.height - 2 * RADIUS) + RADIUS;
        
        let xv = 0;
        let yv = 0;

        points.push({x, y, xv, yv})
    }

    setInterval(update, 16)
    setInterval(draw, 16)
}

function update() {
    /*
        Forces:
            Repulsion from neighbors
            Repulsion from mouse cursor
            Gravity
    */

    const canvas = document.getElementById('fluid')
    const fG = 1;
    
    for(let pointIndex in points){
        let point = points[pointIndex];

        let fRepel = 0;
        for(let neighborIndex in points){
            if(pointIndex == neighborIndex)
                continue;
            let neighbor = points[neighborIndex];
            fRepel += distance(point, neighbor);
        }
        
        let acceleration = fG + fRepel + fMouse;

        if(point.x > canvas.width - RADIUS)
            point.x = canvas.width - RADIUS;
        else if(point.x < RADIUS)
            point.x = RADIUS;
        
        if(point.y > canvas.height - RADIUS)
            point.y = canvas.height - RADIUS;
        else if(point.y < RADIUS)
            point.y = RADIUS;
    }
}

function draw() {
    const canvas = document.getElementById('fluid')
    if(canvas.getContext){
        const ctx = canvas.getContext("2d")
        
        ctx.fillStyle = "#e6f7ff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = "#00334d"
        for(let point of points){
            ctx.beginPath()
            ctx.arc(point.x, point.y, RADIUS, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
}

window.onload = init