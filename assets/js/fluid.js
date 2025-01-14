function newTexture(canvas, gl){
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const level = 0;
    const format = gl.RGBA;
    const width = canvas.width;
    const height = canvas.height;
    const border = 0;
    const type = gl.UNSIGNED_BYTE;
    const data = new Uint8Array(width * height * 4);
    
    gl.texImage2D(gl.TEXTURE_2D, level, format, width, height, border, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
}

function init() {
    let canvas = document.getElementById('fluid');
    canvas.width *= 4;
    canvas.height *= 4;

    let gl = canvas.getContext("webgl");

    if(gl == null){
        console.log("WebGL unavailable.");
        return;
    }

    let pressure = newTexture(canvas, gl);
    let velocity = newTexture(canvas, gl);
    let ink = newTexture(canvas, gl);
    let vorticity = newTexture(canvas, gl);

    setInterval(function() {
        update(gl, pressure, velocity, ink, vorticity);
    }, 0);
    setInterval(function() { draw(ink) }, 0);
}

function update(gl, pressure, velocity, ink, vorticity){
    
}

function draw(texture){

}

window.onload = init;