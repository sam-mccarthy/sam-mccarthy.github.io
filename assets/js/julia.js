var script = document.currentScript;
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
    let src = script.src;
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

async function init() {
    let canvas = document.getElementById('julia');
    canvas.width *= 8;
    canvas.height *= 8;

    let gl = canvas.getContext("webgl2");

    if(gl == null){
        console.log("WebGL unavailable.");
        return;
    }

    let shader_names = ["julia.fs", "vertex.vs"];
    let shaders = {};

    for(let name of shader_names) {
        let shader = await load_shader(gl, name);
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
    console.log(shaders);
    gl.attachShader(julia_program, shaders.vertex);
    gl.attachShader(julia_program, shaders.julia);
    gl.linkProgram(julia_program);
    gl.useProgram(julia_program);

    let position_attribute = gl.getAttribLocation(julia_program, "position");
    let resolution_uniform = gl.getUniformLocation(julia_program, "resolution");
    let pan_uniform = gl.getUniformLocation(julia_program, "pan");
    let zoom_uniform = gl.getUniformLocation(julia_program, "zoom");
    let cxy_uniform = gl.getUniformLocation(julia_program, "cxy");

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

    let cx = 0;
    let cy = 0;

    let pan_x = 0;
    let pan_y = 0;

    let zoom = 1;

    canvas.addEventListener("mousemove", (event) => {
        // Is the primary button being pressed, too?
        if(event.buttons & 1 == 1){
            if(event.shiftKey){
                cx = event.offsetX / canvas.clientWidth * 2.0 - 1.0;
                cy = event.offsetY / canvas.clientHeight * 2.0 - 1.0;
                return;
            }

            let x_ratio = (2.0 * 2.0 * zoom);
            let y_ratio = (canvas.height / canvas.width) * x_ratio;
            pan_x -= event.movementX / canvas.clientWidth * x_ratio;
            pan_y += event.movementY / canvas.clientHeight * y_ratio;
        }
    });

    canvas.addEventListener("wheel", (event) => {
        zoom *= event.deltaY > 0 ? 0.98 : 1.02;

        event.preventDefault();
    });

    setInterval(function() { 
        gl.uniform2f(resolution_uniform, canvas.width, canvas.height);
        gl.uniform2f(pan_uniform, pan_x, pan_y);
        gl.uniform2f(cxy_uniform, cx, cy);
        gl.uniform1f(zoom_uniform, zoom);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }, 0);
}

window.onload = init;