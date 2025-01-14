function newTexture(canvas, gl){
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

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

    return texture;
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

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pressure);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, velocity);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, ink);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, vorticity);

    let impulse_uniform = gl.getUniformLocation(fluidProgram, "u_impulse");
    let pressure_uniform = gl.getUniformLocation(fluidProgram, "u_pressure");
    let velocity_uniform = gl.getUniformLocation(fluidProgram, "u_velocity");
    let ink_uniform = gl.getUniformLocation(fluidProgram, "u_ink");
    let vorticity_uniform = gl.getUniformLocation(fluidProgram, "u_vorticity");

    let vertex_buffer = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0
    ]), gl.STATIC_DRAW);

    let impulse_x = 0;
    let impulse_y = 0;
    let impulse_dx = 0;
    let impulse_dy = 0;

    setInterval(function() {
        
    }, 0);

    setInterval(function() { 
        gl.uniform4f(impulse_uniform, impulse_x, impulse_y, impulse_dx, impulse_dy);
        gl.uniform1i(pressure_uniform, 0);
        gl.uniform1i(velocity_uniform, 1);
        gl.uniform1i(ink_uniform, 2);
        gl.uniform1i(vorticity_uniform, 3);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 0);
}

window.onload = init;