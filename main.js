const gl = canvas.getContext("webgl");

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
  aPosition: [-1, -1, 0, 1, -1, 0, -1, 1, 0]
});

const render = () => {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, {
    uMVPMatrix: twgl.m4.identity(),
    uColor: [1, 1, 0, 1]
  });
  twgl.drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
};

render();
