'use client';

import { useCallback, useEffect, useRef } from 'react';

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
  for (int i = 0; i < 4; i++) {
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
  /** Stops the render loop and the pointer listener while true (hero offscreen or tab hidden). */
  paused: boolean;
  className?: string;
}

// The field drifts slowly, so 30 fps reads the same as 60 at half the fragment cost.
const FRAME_MS = 1000 / 30;
// Render scale per CSS pixel, and the cap on the longest canvas side; the image is soft and upscales cleanly.
const RENDER_SCALE = 0.4;
const MAX_SIDE = 800;

/**
 * Full-bleed WebGL backdrop. Renders at reduced resolution and frame rate, and stops drawing
 * (and listening to the pointer) while paused. Renders nothing if WebGL is unavailable.
 */
export function Aurora({ base, sheen, paused, className }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) resumeRef.current?.();
  }, [paused]);

  const createRenderer = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: 'low-power',
    });
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

    const scale = Math.min(window.devicePixelRatio, 1.5) * RENDER_SCALE;
    const resize = () => {
      const fit = Math.min(1, MAX_SIDE / Math.max(canvas.clientWidth * scale, 1));
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale * fit));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale * fit));
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

    let frame = 0;
    let timer = 0;
    let running = false;
    // Start mid-way so the first frame is already a developed pattern.
    let elapsed = 40;
    let last = performance.now();
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', onPointer);
    };
    const draw = (now: number) => {
      if (pausedRef.current) {
        stop();
        return;
      }
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Sleep most of the frame budget, then let rAF land the next draw on a vsync (every other one at 60 Hz).
      timer = window.setTimeout(() => {
        frame = requestAnimationFrame(draw);
      }, FRAME_MS - 10);
    };
    const start = () => {
      if (running || pausedRef.current) return;
      running = true;
      last = performance.now();
      window.addEventListener('pointermove', onPointer, { passive: true });
      frame = requestAnimationFrame(draw);
    };
    resumeRef.current = start;
    start();

    return () => {
      stop();
      resumeRef.current = null;
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
      // Free the context slot now; browsers cap live WebGL contexts per page.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [base, sheen]);
  useEffect(() => {
    let disposed = false;
    let initialized = false;
    let ready = false;
    let cleanup: (() => void) | undefined;
    // Shader compilation can block first paint, so wait until the browser has idle time.
    const initialize = () => {
      if (!ready || disposed || initialized || pausedRef.current) return;
      initialized = true;
      cleanup = createRenderer();
    };
    resumeRef.current = initialize;
    const onIdle = () => {
      ready = true;
      initialize();
    };
    const idle = window.requestIdleCallback?.(onIdle, { timeout: 1200 });
    const timer = idle === undefined ? window.setTimeout(onIdle, 200) : undefined;
    return () => {
      disposed = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      if (resumeRef.current === initialize) resumeRef.current = null;
      cleanup?.();
    };
  }, [createRenderer]);

  return <canvas ref={canvasRef} className={className} />;
}
