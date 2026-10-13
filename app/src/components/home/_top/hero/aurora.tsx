'use client';

import { useEffect, useRef } from 'react';

const VERTEX = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// Domain-warped value noise: slow folds of dark teal with a soft sheen that leans toward the pointer.
const FRAGMENT = `
precision highp float;
uniform vec2 uView;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uBase;
uniform vec3 uSheen;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec2 p = (gl_FragCoord.xy - 0.5 * uView) / uView.y;
  float t = uTime * 0.045;

  vec2 q = vec2(fbm(p * 0.8 + vec2(0.0, t)), fbm(p * 0.8 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 0.9 + 1.8 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(p * 0.9 + 1.8 * q + vec2(8.3, 2.8) - t * 0.4));
  float field = fbm(p * 0.8 + 1.6 * r);

  // Thin bright ridges where the warped field crosses a band, like light on fabric folds.
  float ridge = pow(1.0 - abs(field - 0.52) * 2.4, 7.0);
  ridge = clamp(ridge, 0.0, 1.0);

  float lean = 1.0 - smoothstep(0.0, 0.9, distance(uv, uPointer));
  vec3 color = uBase * (0.6 + field * 0.6);
  color += uSheen * ridge * (0.2 + 0.3 * lean);
  color += uSheen * 0.04 * lean;

  float grain = (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;
  gl_FragColor = vec4(color + grain, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

interface AuroraProps {
  /** Deep base color, hex. */
  base: string;
  /** Ridge highlight color, hex. */
  sheen: string;
  /** Stops the render loop while true (e.g. hero scrolled away). */
  paused: boolean;
  className?: string;
}

/**
 * Full-bleed WebGL backdrop. Renders at reduced resolution (the image is soft anyway) and
 * stops drawing while paused or when the tab is hidden. Renders nothing if WebGL is unavailable.
 */
export function Aurora({ base, sheen, paused, className }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resumeRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, depth: false });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uView = gl.getUniformLocation(program, 'uView');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uPointer = gl.getUniformLocation(program, 'uPointer');
    gl.uniform3fv(gl.getUniformLocation(program, 'uBase'), hexToRgb(base));
    gl.uniform3fv(gl.getUniformLocation(program, 'uSheen'), hexToRgb(sheen));

    // Half resolution: the field is soft, and this keeps the fragment cost low on laptops.
    const scale = Math.min(window.devicePixelRatio, 2) * 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uView, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const pointer = { x: 0.5, y: 0.7, tx: 0.5, ty: 0.7 };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let frame = 0;
    let running = false;
    // Start mid-way so the first frame is already a developed pattern.
    let elapsed = 40;
    let last = performance.now();
    const draw = (now: number) => {
      if (pausedRef.current || document.hidden) {
        running = false;
        return;
      }
      elapsed += Math.min(now - last, 64) / 1000;
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    resumeRef.current = start;
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resumeRef.current = null;
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [base, sheen]);

  return <canvas ref={canvasRef} className={className} />;
}
