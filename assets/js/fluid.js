const RADIUS = 5;
const COUNT = 100;
var points = []
var lastUpdate;

function distance(pA, pB) {
    let dx = pA.x - pB.x;
    let dy = pA.y - pB.y;

    return Math.sqrt(dx * dx + dy * dy)
}

function init() {
    const canvas = document.getElementById('fluid')

    canvas.width *= 4;  
    canvas.height *= 4;

    for(let i = 0; i < COUNT; i++){
        let x = Math.random() * (canvas.width - 2 * RADIUS) + RADIUS;
        let y = Math.random() * (canvas.height - 2 * RADIUS) + RADIUS;
        
        let xv = 0.0;
        let yv = 0.0;

        points.push({x, y, xv, yv})
    }

    setInterval(update, 50)
    setInterval(draw, 50)
}

function update() {
    /*
        Forces:
            Repulsion from neighbors
            Repulsion from mouse cursor
            Gravity
    */

    const canvas = document.getElementById('fluid')
    const fG = 0.2;
    
    for(let pointIndex in points){
        let point = points[pointIndex];

        let fRepel = {x: 0, y: 0};
        for(let neighborIndex in points){
            if(pointIndex == neighborIndex)
                continue;
            let neighbor = points[neighborIndex];

            let dist = distance(point, neighbor)
            
            let strength = (1.0 / (dist * dist));
            
            if(!isFinite(strength))
                strength = 0;

            fRepel.x += (point.x - neighbor.x) * strength;
            fRepel.y += (point.y - neighbor.y) * strength;
        }
        
        let fMouse = {x: 0, y: 0};
        let accelX = fRepel.x + fMouse.x;
        let accelY = fG + fRepel.y + fMouse.y;

        point.xv += accelX;
        point.yv += accelY;

        point.x += point.xv;
        point.y += point.yv;

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