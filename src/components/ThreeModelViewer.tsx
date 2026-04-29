"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default function ThreeModelViewer({ file }: { file: File }) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | THREE.Group | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const contents = e.target?.result;
      if (!contents) return;

      try {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        
        if (fileExt === 'stl') {
          const loader = new STLLoader();
          // STLLoader expects an ArrayBuffer
          const geom = loader.parse(contents as ArrayBuffer);
          geom.computeVertexNormals();
          setGeometry(geom);
        } else if (fileExt === 'obj') {
          // OBJ loader parses string
          const decoder = new TextDecoder('utf-8');
          const objStr = decoder.decode(contents as ArrayBuffer);
          const loader = new OBJLoader();
          const group = loader.parse(objStr);
          setGeometry(group);
        } else {
          setError("Preview not supported for this file type");
        }
      } catch (err) {
        setError("Could not parse 3D file for preview.");
      }
    };
    reader.onerror = () => setError("Failed to read file.");
    
    reader.readAsArrayBuffer(file);
    
  }, [file]);

  if (error) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{error}</div>;
  }

  if (!geometry) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading 3D Preview...</div>;
  }

  return (
    <div style={{ width: '100%', height: '300px', background: 'var(--bg-main)', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [0, 0, 150], fov: 50 }}>
        <color attach="background" args={['#0a0a0c']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Stage environment="city" intensity={0.5}>
          {geometry instanceof THREE.BufferGeometry ? (
            <mesh geometry={geometry}>
              <meshStandardMaterial color="#6d28d9" roughness={0.3} metalness={0.1} />
            </mesh>
          ) : (
            <primitive object={geometry} />
          )}
        </Stage>
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} />
      </Canvas>
    </div>
  );
}
