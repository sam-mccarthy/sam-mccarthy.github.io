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
    
    $.get("../../../../../assets/js/fluid.vs", function(vs_src){
        $.get("../../../../../assets/js/fluid.fs", function(fs_src){
            glSetup(gl, vs_src, fs_src);
        });
    });
}

function glSetup(gl, vertex_src, fragment_src){
    let canvas = gl.canvas;

    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertex_shader, vertex_src);
    gl.shaderSource(fragment_shader, fragment_src);

    gl.compileShader(vertex_shader);
    gl.compileShader(fragment_shader);
    
    let fluid_program = gl.createProgram();
    gl.attachShader(fluid_program, vertex_shader);
    gl.attachShader(fluid_program, fragment_shader);
    gl.linkProgram(fluid_program);
    gl.useProgram(fluid_program);

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

    let position_attribute = gl.getAttribLocation(fluid_program, "a_position");
    let resolution_uniform = gl.getUniformLocation(fluid_program, "u_resolution");

    let impulse_uniform = gl.getUniformLocation(fluid_program, "u_impulse");
    let pressure_uniform = gl.getUniformLocation(fluid_program, "u_pressure");
    let velocity_uniform = gl.getUniformLocation(fluid_program, "u_velocity");
    let ink_uniform = gl.getUniformLocation(fluid_program, "u_ink");
    let vorticity_uniform = gl.getUniformLocation(fluid_program, "u_vorticity");

    let position_buffer = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0,              0,
        canvas.width,   0,
        0,              canvas.height,
        0,              canvas.height,
        canvas.width,   0,
        canvas.width,   canvas.height
    ]), gl.STATIC_DRAW);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;

    gl.enableVertexAttribArray(position_attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.vertexAttribPointer(position_attribute, size, type, normalize, stride, offset);

    let impulse_x = 0;
    let impulse_y = 0;
    let impulse_dx = 0;
    let impulse_dy = 0;

    canvas.addEventListener("mousemove", (event) => {
        // Is the primary button being pressed, too?
        if(event.buttons & 1 == 1){
            impulse_x = event.offsetX / canvas.clientWidth;
            impulse_y = event.offsetY / canvas.clientHeight;
            impulse_dx = event.movementX / canvas.clientWidth;
            impulse_dy = event.movementY / canvas.clientHeight;
        }
    });

    setInterval(function() { 
        gl.uniform4f(impulse_uniform, impulse_x, impulse_y, impulse_dx, impulse_dy);
        gl.uniform2f(resolution_uniform, canvas.width, canvas.height);
        gl.uniform1i(pressure_uniform, 0);
        gl.uniform1i(velocity_uniform, 1);
        gl.uniform1i(ink_uniform, 2);
        gl.uniform1i(vorticity_uniform, 3);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 0);
}

window.onload = init;