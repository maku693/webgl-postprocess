const gl = canvas.getContext("webgl");
gl.clearColor(0, 0, 0, 1);

const mainProgramInfo = twgl.createProgramInfo(gl, ["main_vs", "main_fs"]);
const mainBufferInfo = twgl.createBufferInfoFromArrays(gl, {
  aPosition: [0, 0.2, 0, -0.2, -0.2, 0, 0.2, -0.2, 0]
});

const flareProgramInfo = twgl.createProgramInfo(gl, ["flare_vs", "flare_fs"]);
const flareBufferInfo = twgl.createBufferInfoFromArrays(gl, {
  aPosition: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
});

const framebufferInfo = twgl.createFramebufferInfo(gl);

const render = time => {
  const { width, height } = gl.canvas;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, width, height);

  twgl.bindFramebufferInfo(gl, framebufferInfo);
  gl.useProgram(mainProgramInfo.program);
  twgl.setBuffersAndAttributes(gl, mainProgramInfo, mainBufferInfo);
  twgl.setUniforms(mainProgramInfo, {
    uTime: time * 0.001,
    uColor: [1, 0.4, 0.1, 1]
  });
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  twgl.drawBufferInfo(gl, mainBufferInfo);

  const resultTexture = twgl.createTexture(gl, {
    width,
    height,
    min: gl.LINEAR_MIPMAP_LINEAR
  });
  gl.bindTexture(gl.TEXTURE_2D, resultTexture);
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, width, height, 0);
  gl.generateMipmap(gl.TEXTURE_2D);

  twgl.bindFramebufferInfo(gl);
  gl.useProgram(flareProgramInfo.program);
  twgl.setBuffersAndAttributes(gl, flareProgramInfo, flareBufferInfo);
  twgl.setUniforms(flareProgramInfo, {
    uTexture: resultTexture,
    uTextureSize: [width, height]
  });
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  twgl.drawBufferInfo(gl, flareBufferInfo);

  requestAnimationFrame(render);
};
requestAnimationFrame(render);
