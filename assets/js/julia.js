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
    let canvas = document.getElementById('julia');
    canvas.width *= 4;
    canvas.height *= 4;

    let gl = canvas.getContext("webgl");

    if(gl == null){
        console.log("WebGL unavailable.");
        return;
    }

    let shader_names = ["julia.fs", "vertex.vs"];
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

    let julia_program = gl.createProgram();
    gl.attachShader(julia_program, shaders.vertex);
    gl.attachShader(julia_program, shaders.julia);
    gl.linkProgram(julia_program);
    gl.useProgram(julia_program);

    let position_attribute = gl.getAttribLocation(julia_program, "position");
    let resolution_uniform = gl.getUniformLocation(julia_program, "resolution");
    let pan_uniform = gl.getUniformLocation(julia_program, "pan");

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

    let pan_x = 0;
    let pan_y = 0;

    let zoom = 1 / (zoom);

    canvas.addEventListener("mousemove", (event) => {
        // Is the primary button being pressed, too?
        if(event.buttons & 1 == 1){
            pan_x += event.movementX / canvas.clientWidth;
            pan_y += event.movementY / canvas.clientHeight;
        }
    });

    canvas.addEventListener("wheel", (event) => {
        zoom += event.deltaY / 10;

        return false;
    });

    setInterval(function() { 
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 0);
}

window.onload = init;