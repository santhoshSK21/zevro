'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CLOTH_W = 32;
const CLOTH_H = 32;

function FabricCloth({ isOpen }: { isOpen: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Basic geometry for cloth
  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10, CLOTH_W, CLOTH_H), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttribute = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    // Simple displacement animation
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      
      // Wind effect
      const wave = Math.sin(vertex.x * 2 + time * 2) * 0.2;
      
      // Open/Close effect based on isOpen
      const targetZ = isOpen ? (Math.abs(vertex.x) > 2 ? 0 : -5) : wave;
      
      // Interpolate
      vertex.z += (targetZ - vertex.z) * 0.1;
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#EDE4D8"
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function FabricCanvas({ isOpen }: { isOpen: boolean }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <FabricCloth isOpen={isOpen} />
      </Canvas>
    </div>
  );
}
