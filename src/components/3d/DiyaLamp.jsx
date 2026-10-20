import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Layout constants (bowl is 2 units wide) ── */
const BOWL_SQUASH = 0.85;
const FX = 1.42;          // flame base x (at the spout)
const FY = 1.07;          // flame base y
const OIL_TOP = 0.923 * BOWL_SQUASH;

const TIP_LIT = new THREE.Color('#ff6a1a');
const TIP_OUT = new THREE.Color('#2a1408');

const ss = (a, b, x) => {
  x = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/* ── Bowl: deep tapered cup, 13 ribs, short spout ── */
function makeBowlGeometry() {
  const prof = [
    [0, 0], [0.4, 0], [0.58, 0.03], [0.66, 0.12], [0.8, 0.45], [0.92, 0.75],
    [1.0, 0.97], [1.04, 1.04], [1.02, 1.09], [0.92, 1.09], [0.9, 1.0],
    [0.78, 0.7], [0.6, 0.4], [0.4, 0.22], [0, 0.22],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 160);
  g.rotateY(-Math.PI / 2);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    const ang = Math.atan2(v.z, v.x);
    const w = Math.exp(-(ang * ang) / (2 * 0.2 * 0.2)) * ss(0.8, 1.06, v.y);
    const rib = 1 + 0.03 * Math.cos(ang * 13) * ss(0.1, 0.3, v.y) * (1 - ss(0.85, 0.98, v.y));
    const a2 = ang * (1 - 0.5 * w);
    const r2 = r * rib + 0.3 * w;
    pos.setXYZ(i, r2 * Math.cos(a2), v.y + 0.03 * w, r2 * Math.sin(a2));
  }
  g.computeVertexNormals();
  return g;
}

/* ── Liquid volume that follows the inside of the bowl (85% full) ── */
function makeLiquidGeometry() {
  const pts = [[0, 0.225], [0.39, 0.225], [0.59, 0.4], [0.768, 0.7], [0.856, 0.923], [0, 0.923]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 64);
}

/* ── Flame ── */
function makeFlameGeometry() {
  const pts = [[0, 0], [0.07, 0.03], [0.12, 0.14], [0.115, 0.3], [0.075, 0.5], [0.03, 0.7], [0, 0.9]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 20);
}

const flameVertex = /* glsl */ `
  uniform float uTime;
  uniform float uLit;
  varying float vY;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 p = position;
    float h = p.y / 0.9;
    p.y *= 1.0 + 0.1 * sin(uTime * 11.0) + 0.05 * sin(uTime * 23.0);
    p.x += sin(uTime * 7.0 + p.y * 6.0) * 0.035 * h * h + sin(uTime * 3.1) * 0.02 * h;
    p.z += cos(uTime * 8.3 + p.y * 5.0) * 0.03 * h * h;
    p.x += 0.05 * h * h;
    p *= uLit;
    vY = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalMatrix * normal;
    vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const flameFragment = /* glsl */ `
  uniform float uCore;
  varying float vY;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(abs(dot(normalize(vN), normalize(vV))), 1.2);
    vec3 c = mix(vec3(0.2, 0.35, 1.0), vec3(1.0, 0.88, 0.4), smoothstep(0.0, 0.22, vY));
    c = mix(c, vec3(1.0, 0.42, 0.08), smoothstep(0.35, 0.95, vY));
    c = mix(c, vec3(1.0, 0.97, 0.85), uCore * (1.0 - vY));
    float a = f * (1.0 - smoothstep(0.72, 1.0, vY));
    gl_FragColor = vec4(c * 1.4, a * 0.85);
  }
`;

function makeFlameMaterial(core) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uLit: { value: 1 }, uCore: { value: core } },
    vertexShader: flameVertex,
    fragmentShader: flameFragment,
  });
}

/* ── Canvas-made textures ── */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,190,90,.9)');
  r.addColorStop(0.4, 'rgba(255,120,30,.28)');
  r.addColorStop(1, 'rgba(255,100,20,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 6, 64, 64, 64);
  r.addColorStop(0, 'rgba(0,0,0,.65)');
  r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* Om emblem: colour map + bump map so it looks pressed into the clay */
function makeEmblemTextures() {
  const mk = (base, line, hi, lo) => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 512);
    const draw = (dx, dy, col) => {
      g.strokeStyle = col;
      g.fillStyle = col;
      g.lineWidth = 9;
      [236, 200].forEach((rad) => {
        g.beginPath();
        g.arc(256 + dx, 256 + dy, rad, 0, Math.PI * 2);
        g.stroke();
      });
      g.font = '330px "Noto Sans Tamil","Latha","Nirmala UI","Tamil Sangam MN",serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('\u0BD0', 256 + dx, 276 + dy);
    };
    draw(4, 4, lo);
    draw(-3, -3, hi);
    draw(0, 0, line);
    return c;
  };
  const map = new THREE.CanvasTexture(mk('#c3552a', '#b04a22', '#d9714a', '#8a3216'));
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(mk('#000', '#fff', '#fff', '#000'));
  return { map, bump };
}

/* ── Rising embers ── */
function Embers({ reduce, litV }) {
  const N = 26;
  const ref = useRef();
  const positions = useMemo(() => new Float32Array(N * 3), []);
  const seeds = useMemo(
    () => Array.from({ length: N }, () => ({ t: Math.random(), s: 0.25 + Math.random() * 0.35, x: Math.random() * 6.28 })),
    []
  );

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    for (let i = 0; i < N; i++) {
      const o = seeds[i];
      if (!reduce) o.t += d * o.s;
      if (o.t > 1) { o.t = 0; o.x = Math.random() * 6.28; }
      positions[i * 3] = FX + Math.sin(o.x + o.t * 4) * 0.12 * o.t;
      positions[i * 3 + 1] = FY + 0.2 + o.t * 1.3;
      positions[i * 3 + 2] = Math.cos(o.x + o.t * 3) * 0.12 * o.t;
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.visible = litV.current > 0.1;
      ref.current.material.opacity = 0.8 * litV.current;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffb050"
        size={0.035}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function DiyaLamp({ reduce = false, lit = true }) {
  const litV = useRef(1);
  const flameRef = useRef();
  const tipRef = useRef();
  const lightRef = useRef();
  const glowRef = useRef();
  const glintRef = useRef();
  const ringRef = useRef();

  // Tamil glyph needs its web font loaded before it is painted onto the canvas
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    let live = true;
    if (document.fonts?.load) {
      document.fonts
        .load('330px "Noto Sans Tamil"', '\u0BD0')
        .catch(() => {})
        .finally(() => live && setFontReady(true));
    } else {
      setFontReady(true);
    }
    return () => { live = false; };
  }, []);

  const bowlGeo = useMemo(makeBowlGeometry, []);
  const liquidGeo = useMemo(makeLiquidGeometry, []);
  const flameGeo = useMemo(makeFlameGeometry, []);
  const outerFlame = useMemo(() => makeFlameMaterial(0), []);
  const coreFlame = useMemo(() => makeFlameMaterial(1), []);
  const glowTex = useMemo(makeGlowTexture, []);
  const shadowTex = useMemo(makeShadowTexture, []);
  /* rebuilt once the Tamil font is ready, so the glyph is painted with it */
  const emblem = useMemo(() => makeEmblemTextures(), [fontReady]);

  useEffect(() => () => {
    [bowlGeo, liquidGeo, flameGeo, outerFlame, coreFlame, glowTex, shadowTex].forEach((o) => o.dispose());
  }, [bowlGeo, liquidGeo, flameGeo, outerFlame, coreFlame, glowTex, shadowTex]);

  useEffect(() => () => { emblem.map.dispose(); emblem.bump.dispose(); }, [emblem]);

  useFrame((state, dt) => {
    litV.current += ((lit ? 1 : 0) - litV.current) * Math.min(1, Math.min(dt, 0.05) * 5);
    const L = litV.current;
    const t = reduce ? 0 : state.clock.elapsedTime;
    const fl = reduce ? 1 : 1 + 0.12 * Math.sin(t * 13) + 0.08 * Math.sin(t * 29) + 0.05 * Math.sin(t * 7.3);
    outerFlame.uniforms.uTime.value = t;
    coreFlame.uniforms.uTime.value = t;
    outerFlame.uniforms.uLit.value = L;
    coreFlame.uniforms.uLit.value = L;
    if (flameRef.current) flameRef.current.visible = L > 0.02;
    if (tipRef.current) tipRef.current.material.color.copy(L > 0.5 ? TIP_LIT : TIP_OUT);
    if (lightRef.current) lightRef.current.intensity = 26 * fl * L;
    if (glowRef.current) {
      glowRef.current.material.opacity = L * (0.75 + 0.25 * fl);
      glowRef.current.scale.setScalar(2.2 * (0.9 + 0.1 * fl));
    }
    if (glintRef.current) glintRef.current.material.opacity = 0.6 * fl * L;
    if (ringRef.current) ringRef.current.material.opacity = 0.15 + 0.3 * L;
  });

  return (
    <group>
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.003, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>

      {/* clay bowl */}
      <mesh geometry={bowlGeo} scale={[1, BOWL_SQUASH, 1]}>
        <meshStandardMaterial color="#c3552a" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Om emblem on the bowl floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.191, 0]}>
        <circleGeometry args={[0.4, 64]} />
        <meshStandardMaterial map={emblem.map} bumpMap={emblem.bump} bumpScale={2} roughness={0.9} />
      </mesh>

      {/* liquid — 85% transparent, 85% full */}
      <mesh geometry={liquidGeo} scale={[1, BOWL_SQUASH, 1]} renderOrder={1}>
        <meshStandardMaterial
          color="#ff9a14"
          transparent
          opacity={0.15}
          roughness={0.04}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          emissive="#5a2c06"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, OIL_TOP + 0.002, 0]} renderOrder={1}>
        <circleGeometry args={[0.851, 64]} />
        <meshStandardMaterial
          color="#ff9a14"
          transparent
          opacity={0.15}
          roughness={0.02}
          depthWrite={false}
          emissive="#8a4a0a"
          emissiveIntensity={0.7}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, OIL_TOP + 0.0005, 0]} renderOrder={2}>
        <torusGeometry args={[0.856, 0.014, 8, 96]} />
        <meshBasicMaterial color="#ff9a28" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* flame reflection on the liquid */}
      <mesh ref={glintRef} rotation={[-Math.PI / 2, 0, 0]} position={[0.5, OIL_TOP + 0.003, 0]} renderOrder={2}>
        <planeGeometry args={[1.5, 0.7]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* wick */}
      <mesh position={[1.25, 0.95, 0]} rotation={[0, 0, -1.0]}>
        <cylinderGeometry args={[0.02, 0.026, 0.4, 10]} />
        <meshStandardMaterial color="#e9dcc2" roughness={1} />
      </mesh>
      <mesh ref={tipRef} position={[FX, 1.06, 0]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshBasicMaterial color="#ff6a1a" />
      </mesh>

      {/* flame */}
      <group ref={flameRef} position={[FX, FY, 0]} scale={0.88} renderOrder={3}>
        <mesh geometry={flameGeo} material={outerFlame} renderOrder={3} />
        <mesh geometry={flameGeo} material={coreFlame} scale={0.55} renderOrder={3} />
      </group>

      {/* glow halo */}
      <sprite ref={glowRef} position={[FX, FY + 0.35, 0]} scale={[2.2, 2.2, 1]} renderOrder={2}>
        <spriteMaterial map={glowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>

      <pointLight ref={lightRef} position={[FX - 0.1, FY + 0.35, 0]} color="#ff8a2a" intensity={26} distance={8} decay={2} />

      <Embers reduce={reduce} litV={litV} />
    </group>
  );
}
