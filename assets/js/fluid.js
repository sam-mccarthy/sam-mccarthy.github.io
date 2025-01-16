function new_texture(canvas, gl){
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

async function load_shader(gl, name) {
    let src = document.currentScript.src;
    let base = src.substring(0, src.lastIndexOf("/"));
    let shader_url = `${base}/${name}`;

    let request = await fetch(shader_url);
    let shader_src = await request.text();
    
    let type = name.endsWith("vs") ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, shader_src);
    gl.compileShader(shader);

    return shader;
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

    let shader_names = ["advect.fs", "boundary.fs", "divergence.fs", "force.fs", "gradient.fs", "jacobi.fs", "vertex.vs"];
    let shaders = {};

    for(let name of shader_names) {
        let shader = load_shader(name);
        if(shader == null){
            console.error("Failed loading shaders.");
            return;
        }

        let basename = name.split('.')[0];
        shaders[basename] = shader;
    }

    gl_setup(gl, shaders);
}

function gl_setup(gl, shaders){
    let canvas = gl.canvas;

    let pressure = new_texture(canvas, gl);
    let velocity = new_texture(canvas, gl);
    let ink = new_texture(canvas, gl);
    let vorticity = new_texture(canvas, gl);

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
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 0);
}

window.onload = init;