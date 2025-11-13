import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, PanResponder, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';

// --- Vertex & Fragment ---
const vertex = `#version 100
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `#version 100
precision highp float;
varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;
uniform float hue;
uniform float hover;
uniform float rot;
uniform float hoverIntensity;

vec3 rgb2yiq(vec3 c) {
  float y = dot(c, vec3(0.299, 0.587, 0.114));
  float i = dot(c, vec3(0.596, -0.274, -0.322));
  float q = dot(c, vec3(0.211, -0.523, 0.312));
  return vec3(y, i, q);
}
vec3 yiq2rgb(vec3 c) {
  float r = c.x + 0.956 * c.y + 0.621 * c.z;
  float g = c.x - 0.272 * c.y - 0.647 * c.z;
  float b = c.x - 1.106 * c.y + 1.703 * c.z;
  return vec3(r, g, b);
}
vec3 adjustHue(vec3 color, float hueDeg) {
  float hueRad = hueDeg * 3.14159265 / 180.0;
  vec3 yiq = rgb2yiq(color);
  float cosA = cos(hueRad);
  float sinA = sin(hueRad);
  float i = yiq.y * cosA - yiq.z * sinA;
  float q = yiq.y * sinA + yiq.z * cosA;
  yiq.y = i;
  yiq.z = q;
  return yiq2rgb(yiq);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(
    p3.x + p3.y,
    p3.x + p3.z,
    p3.y + p3.z
  ) * p3.zyx);
}

float snoise3(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - K1);
  vec3 d3 = d0 - 0.5;
  vec4 h = max(0.6 - vec4(
    dot(d0, d0),
    dot(d1, d1),
    dot(d2, d2),
    dot(d3, d3)
  ), 0.0);
  vec4 n = h * h * h * h * vec4(
    dot(d0, hash33(i)),
    dot(d1, hash33(i + i1)),
    dot(d2, hash33(i + i2)),
    dot(d3, hash33(i + 1.0))
  );
  return dot(vec4(31.316), n);
}

vec4 extractAlpha(vec3 colorIn) {
  float a = max(max(colorIn.r, colorIn.g), colorIn.b);
  return vec4(colorIn.rgb / (a + 1e-5), a);
}

const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
const float innerRadius = 0.6;
const float noiseScale = 0.65;

float light1(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * attenuation);
}
float light2(float intensity, float attenuation, float dist) {
  return intensity / (1.0 + dist * dist * attenuation);
}

vec4 draw(vec2 uv) {
  vec3 color1 = adjustHue(baseColor1, hue);
  vec3 color2 = adjustHue(baseColor2, hue);
  vec3 color3 = adjustHue(baseColor3, hue);

  float ang = atan(uv.y, uv.x);
  float len = length(uv);
  float invLen = len > 0.0 ? 1.0 / len : 0.0;

  float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
  float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
  float d0 = distance(uv, (r0 * invLen) * uv);
  float v0 = light1(1.0, 10.0, d0);
  v0 *= smoothstep(r0 * 1.05, r0, len);
  float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;

  float a = iTime * -1.0;
  vec2 pos = vec2(cos(a), sin(a)) * r0;
  float d = distance(uv, pos);
  float v1 = light2(1.5, 5.0, d);
  v1 *= light1(1.0, 50.0, d0);

  float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
  float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

  vec3 col = mix(color1, color2, cl);
  col = mix(color3, col, v0);
  col = (col + v1) * v2 * v3;
  col = clamp(col, 0.0, 1.0);

  return extractAlpha(col);
}

void main() {
  vec2 fragCoord = vUv * iResolution;
  vec2 center = iResolution * 0.5;
  float size = min(iResolution.x, iResolution.y);
  vec2 uv = (fragCoord - center) / size * 2.0;

  float angle = rot;
  float s = sin(angle);
  float c = cos(angle);
  uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

  uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
  uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);

  vec4 col = draw(uv);
  gl_FragColor = vec4(col.rgb * col.a, col.a);
}`;

// ---------------- GLOrb component ----------------
interface GLOrbProps {
    listening: boolean;
    onToggleListening: () => void; // parent handles start/stop recording
    size?: number;
    hue?: number;
    hoverIntensity?: number;
}

export const GLOrb: React.FC<GLOrbProps> = ({ listening, onToggleListening, size = 360, hue = 200, hoverIntensity = 0.2 }) => {
    const hoverRef = useRef<number>(0);
    const rotRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const glRef = useRef<any>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            const gl = glRef.current;
            if (gl) {
                try {
                    gl.endFrameEXP();
                } catch (e) {}
            }
        };
    }, []);

    const pan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setHoverFromTouch(locationX, locationY);
            },
            onPanResponderMove: (e) => {
                const { locationX, locationY } = e.nativeEvent;
                setHoverFromTouch(locationX, locationY);
            },
            onPanResponderRelease: () => {
                hoverRef.current = 0;
            },
        })
    ).current;

    function setHoverFromTouch(x: number, y: number) {
        const w = Dimensions.get('window').width;
        const s = Math.min(w, size);
        const cx = s / 2;
        const cy = s / 2;
        const uvx = ((x - cx) / s) * 2.0;
        const uvy = ((y - cy) / s) * 2.0;
        const d = Math.sqrt(uvx * uvx + uvy * uvy);
        hoverRef.current = d < 0.8 ? 1.0 : 0.0;
    }

    async function onContextCreate(gl: any) {
        glRef.current = gl;

        const program = createProgram(gl, vertex, fragment);
        const positionLoc = gl.getAttribLocation(program, 'position');
        const iTimeLoc = gl.getUniformLocation(program, 'iTime');
        const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
        const hueLoc = gl.getUniformLocation(program, 'hue');
        const hoverLoc = gl.getUniformLocation(program, 'hover');
        const rotLoc = gl.getUniformLocation(program, 'rot');
        const hoverIntensityLoc = gl.getUniformLocation(program, 'hoverIntensity');

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const start = Date.now();
        const startRef = { current: start } as any;

        function render() {
            const now = Date.now();
            const t = (now - startRef.current) / 1000;
            timeRef.current = t;

            const width = gl.drawingBufferWidth;
            const height = gl.drawingBufferHeight;
            gl.viewport(0, 0, width, height);
            gl.uniform1f(iTimeLoc, t);
            gl.uniform2f(iResolutionLoc, width, height);
            gl.uniform1f(hueLoc, hue);

            const hv = hoverRef.current;
            const targetRotSpeed = listening ? 0.9 : 0.2;
            rotRef.current += 0.016 * targetRotSpeed;

            gl.uniform1f(hoverLoc, hv);
            gl.uniform1f(rotLoc, rotRef.current);
            gl.uniform1f(hoverIntensityLoc, hoverIntensity);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.flush();

            try {
                gl.endFrameEXP();
            } catch (e) {}

            rafRef.current = requestAnimationFrame(render);
        }

        render();
    }

    return (
        <View {...pan.panHandlers} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <GLView style={{ width: size, height: size }} onContextCreate={onContextCreate} />

            <TouchableOpacity
                onPress={onToggleListening}
                className="rouned-full absolute"
                style={{
                    width: size * 0.66,
                    height: size * 0.66,
                }}
            />
        </View>
    );
};

// ---------- WebGL helper functions (shared) ----------
function createShader(gl: any, type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('Could not compile shader:' + info);
    }
    return shader;
}

function createProgram(gl: any, vertSrc: string, fragSrc: string) {
    const v = createShader(gl, gl.VERTEX_SHADER, vertSrc);
    const f = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(prog);
        gl.deleteProgram(prog);
        throw new Error('Could not link program:' + info);
    }
    return prog;
}
