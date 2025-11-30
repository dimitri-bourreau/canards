'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

// Animated Hearts Component
function AnimatedHearts({ position, onComplete }: { position: [number, number, number]; onComplete: () => void }) {
  const [hearts, setHearts] = useState([
    { id: 0, x: 0, y: 0, scale: 1, opacity: 1 },
    { id: 1, x: -0.3, y: 0.1, scale: 0.8, opacity: 1 },
    { id: 2, x: 0.3, y: 0.15, scale: 0.7, opacity: 1 },
  ]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <Html position={[position[0], position[1] + 0.5, position[2]]} center>
      <div className="pointer-events-none">
        {hearts.map((heart, i) => (
          <div
            key={heart.id}
            className="absolute text-2xl animate-bounce"
            style={{
              left: `${heart.x * 50}px`,
              animation: `floatUp 1.5s ease-out forwards`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0,
            }}
          >
            ❤️
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </Html>
  );
}

// Water surface with ripple effect
function WaterSurface({ activeEffects }: { activeEffects: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRipple: { value: activeEffects.includes('cleaning') ? 1.0 : 0.0 },
    uColor1: { value: new THREE.Color('#0d7a61') },
    uColor2: { value: new THREE.Color('#074c3e') },
  }), []);
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uRipple.value = activeEffects.includes('cleaning') ? 1.0 : 0.0;
    }
  }, [activeEffects]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[5, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uRipple;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Wave animation
            float wave = sin(pos.x * 2.0 + uTime * 2.0) * 0.05;
            wave += sin(pos.y * 3.0 + uTime * 1.5) * 0.03;
            
            // Ripple effect
            if (uRipple > 0.0) {
              float dist = length(pos.xy);
              wave += sin(dist * 10.0 - uTime * 5.0) * 0.1 * uRipple * (1.0 - dist / 5.0);
            }
            
            pos.z += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          
          void main() {
            float dist = length(vUv - 0.5) * 2.0;
            vec3 color = mix(uColor1, uColor2, dist);
            
            // Shimmer effect
            float shimmer = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime * 1.3) * 0.05;
            color += shimmer;
            
            // Edge fade
            float alpha = smoothstep(1.0, 0.8, dist);
            
            gl_FragColor = vec4(color, alpha * 0.9);
          }
        `}
        transparent
      />
    </mesh>
  );
}

// Duck component
function Duck({ 
  position, 
  index, 
  onPet 
}: { 
  position: [number, number, number]; 
  index: number;
  onPet: (pos: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const currentPos = useRef<[number, number, number]>(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Swimming motion
      const time = state.clock.elapsedTime + offset;
      const newX = position[0] + Math.sin(time * 0.5) * 0.5;
      const newZ = position[2] + Math.cos(time * 0.3) * 0.3;
      const newY = 0.15 + Math.sin(time * 2) * 0.03;
      
      meshRef.current.position.x = newX;
      meshRef.current.position.z = newZ;
      meshRef.current.position.y = newY;
      
      currentPos.current = [newX, newY, newZ];
      
      // Face direction of movement
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;
      
      // Scale up slightly when hovered
      const targetScale = isHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPet(currentPos.current);
  };
  
  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={isHovered ? "#ffe066" : "#f5d742"} 
          emissive={isHovered ? "#f5d742" : "#000000"}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0.15, 0.12, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={isHovered ? "#ffe066" : "#f5d742"}
          emissive={isHovered ? "#f5d742" : "#000000"}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>
      {/* Beak */}
      <mesh position={[0.28, 0.1, 0]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color="#ff9800" />
      </mesh>
      {/* Cursor hint when hovered */}
      {isHovered && (
        <Html position={[0, 0.4, 0]} center>
          <div className="bg-lake-900/90 text-cream-100 text-[10px] px-2 py-1 rounded-lg whitespace-nowrap border border-amber-500/30">
            Cliquer pour caresser 🤚
          </div>
        </Html>
      )}
    </group>
  );
}

// Fish component
function Fish({ startPosition, index }: { startPosition: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const speed = useMemo(() => 0.5 + Math.random() * 0.5, []);
  const radius = useMemo(() => 1 + Math.random() * 2, []);
  const depth = useMemo(() => -0.3 - Math.random() * 0.5, []);
  const jumpTime = useRef(Math.random() * 100);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + offset;
      
      // Swimming in circles
      meshRef.current.position.x = Math.cos(time * speed) * radius;
      meshRef.current.position.z = Math.sin(time * speed) * radius;
      meshRef.current.position.y = depth;
      
      // Occasional jump
      if (time > jumpTime.current && time < jumpTime.current + 1) {
        const jumpProgress = (time - jumpTime.current);
        meshRef.current.position.y = depth + Math.sin(jumpProgress * Math.PI) * 1.5;
      } else if (time > jumpTime.current + 1) {
        jumpTime.current = time + 5 + Math.random() * 10;
      }
      
      // Face direction of movement
      meshRef.current.rotation.y = -time * speed + Math.PI / 2;
    }
  });
  
  const colors = ['#ff6b6b', '#ffa502', '#7bed9f', '#70a1ff', '#ff6b81'];
  const color = colors[index % colors.length];
  
  return (
    <group ref={meshRef} position={startPosition} scale={0.6}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.08, 0.12, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Dragonfly component
function Dragonfly({ index }: { index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const wingRef1 = useRef<THREE.Mesh>(null);
  const wingRef2 = useRef<THREE.Mesh>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const radius = useMemo(() => 2 + Math.random() * 2.5, []);
  const height = useMemo(() => 1.5 + Math.random() * 1, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + offset;
      
      // Flying path
      meshRef.current.position.x = Math.cos(time * 0.8) * radius;
      meshRef.current.position.z = Math.sin(time * 1.2) * radius * 0.7;
      meshRef.current.position.y = height + Math.sin(time * 3) * 0.2;
      
      // Face direction
      meshRef.current.rotation.y = -time * 0.8 + Math.PI / 2;
      
      // Wing flutter
      if (wingRef1.current && wingRef2.current) {
        const flutter = Math.sin(time * 30) * 0.3;
        wingRef1.current.rotation.z = flutter;
        wingRef2.current.rotation.z = -flutter;
      }
    }
  });
  
  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.02, 0.15, 4, 8]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.3} />
      </mesh>
      {/* Wings */}
      <mesh ref={wingRef1} position={[0, 0.02, 0.03]}>
        <planeGeometry args={[0.15, 0.04]} />
        <meshStandardMaterial color="#b3e5fc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wingRef2} position={[0, 0.02, -0.03]}>
        <planeGeometry args={[0.15, 0.04]} />
        <meshStandardMaterial color="#b3e5fc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Plant component
function Plant({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const height = useMemo(() => 0.3 + Math.random() * 0.4, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + offset;
      meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    }
  });
  
  return (
    <group ref={meshRef} position={position}>
      {/* Stem */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.03, height, 8]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      {/* Leaves */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, height * 0.3 + i * 0.15, 0]} rotation={[0, i * 2.1, 0.5]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshStandardMaterial color="#4caf50" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Lily pad */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#66bb6a" />
      </mesh>
    </group>
  );
}

// Ground/Shore
function Shore() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <ringGeometry args={[4.8, 7, 64]} />
      <meshStandardMaterial color="#5d4e37" />
    </mesh>
  );
}

// Scene setup with isometric camera
function Scene() {
  const { camera } = useThree();
  const ducks = useGameStore((state) => state.ducks);
  const fish = useGameStore((state) => state.fish);
  const dragonflies = useGameStore((state) => state.dragonflies);
  const plants = useGameStore((state) => state.plants);
  const activeEffects = useGameStore((state) => state.activeEffects);
  const petDuck = useGameStore((state) => state.petDuck);
  
  const [heartPositions, setHeartPositions] = useState<{ id: number; pos: [number, number, number] }[]>([]);
  const heartIdRef = useRef(0);
  
  // Set up isometric-like view
  useEffect(() => {
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  const handlePetDuck = (pos: [number, number, number]) => {
    // Add hearts
    const newId = heartIdRef.current++;
    setHeartPositions(prev => [...prev, { id: newId, pos }]);
    
    // Increase duck happiness
    petDuck();
  };
  
  const removeHearts = (id: number) => {
    setHeartPositions(prev => prev.filter(h => h.id !== id));
  };
  
  // Generate positions
  const duckPositions = useMemo(() => {
    const count = Math.min(ducks.population, 10);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      return [Math.cos(angle) * radius, 0.15, Math.sin(angle) * radius] as [number, number, number];
    });
  }, [ducks.population]);
  
  const fishCount = Math.min(Math.floor(fish.population / 3), 15);
  const dragonflyCount = Math.min(Math.floor(dragonflies.population / 3), 8);
  const plantCount = Math.min(Math.floor(plants.coverage / 10), 10);
  
  const plantPositions = useMemo(() => {
    return Array.from({ length: plantCount }, (_, i) => {
      const angle = (i / plantCount) * Math.PI * 2 + 0.3;
      const radius = 3.5 + Math.random() * 0.8;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number];
    });
  }, [plantCount]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#fff5e6" />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#87ceeb" />
      
      {/* Environment */}
      <Shore />
      <WaterSurface activeEffects={activeEffects} />
      
      {/* Animals */}
      {duckPositions.map((pos, i) => (
        <Duck key={`duck-${i}`} position={pos} index={i} onPet={handlePetDuck} />
      ))}
      
      {Array.from({ length: fishCount }, (_, i) => (
        <Fish key={`fish-${i}`} startPosition={[0, -0.3, 0]} index={i} />
      ))}
      
      {Array.from({ length: dragonflyCount }, (_, i) => (
        <Dragonfly key={`dragonfly-${i}`} index={i} />
      ))}
      
      {/* Plants */}
      {plantPositions.map((pos, i) => (
        <Plant key={`plant-${i}`} position={pos} index={i} />
      ))}
      
      {/* Animated Hearts */}
      {heartPositions.map(({ id, pos }) => (
        <AnimatedHearts key={id} position={pos} onComplete={() => removeHearts(id)} />
      ))}
      
      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        minDistance={8}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function IsometricLake() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden glass relative">
      {/* Title overlay */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="font-display font-bold text-cream-100 text-lg flex items-center gap-2">
          <span>🏞️</span>
          Vue du Lac
        </h2>
        <p className="text-xs text-cream-300/50">Cliquez sur un canard !</p>
      </div>
      
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [8, 8, 8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', cursor: 'pointer' }}
      >
        <Scene />
      </Canvas>
      
      {/* Decorative corners */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-lake-900/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-lake-900/50 to-transparent pointer-events-none" />
    </div>
  );
}
