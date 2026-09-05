'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SchemeNodeData {
  name: string;
  category: string;
  maxLoan: string;
  color: string;
}

const SAMPLE_SCHEME_NODES: SchemeNodeData[] = [
  { name: 'PMEGP Subsidy', category: 'General/SC/ST', maxLoan: '₹50 Lakh', color: '#06b6d4' },
  { name: 'PM Mudra Yojana', category: 'Micro Business', maxLoan: '₹10 Lakh', color: '#10b981' },
  { name: 'Stand-Up India', category: 'Women & SC/ST', maxLoan: '₹1 Crore', color: '#8b5cf6' },
  { name: 'PM-SVANidhi', category: 'Street Vendors', maxLoan: '₹50,000', color: '#f59e0b' },
  { name: 'PM Vishwakarma', category: 'Artisans/Crafts', maxLoan: '₹3 Lakh', color: '#ec4899' },
];

export default function HeroQuantumCore() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<SchemeNodeData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D assets for mouse rotation
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Quantum Particle Core (Sphere of points)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color('#06b6d4');
    const emeraldColor = new THREE.Color('#10b981');
    const purpleColor = new THREE.Color('#8b5cf6');

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + (Math.random() - 0.5) * 2.5;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color interpolation across radius
      const mixRatio = Math.random();
      const mixedColor = mixRatio < 0.5 
        ? cyanColor.clone().lerp(emeraldColor, mixRatio * 2)
        : emeraldColor.clone().lerp(purpleColor, (mixRatio - 0.5) * 2);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 2. Orbital Energy Rings (Torus Wireframes)
    const ringMatCyan = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ringMatEmerald = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const ringMatPurple = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.05, 16, 100), ringMatCyan);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(9.8, 0.04, 16, 100), ringMatEmerald);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(11.2, 0.03, 16, 100), ringMatPurple);
    ring3.rotation.z = Math.PI / 5;
    ring3.rotation.x = Math.PI / 2.5;
    coreGroup.add(ring3);

    // 3. Interactive Orbital Scheme Nodes
    const nodeMeshes: { mesh: THREE.Mesh; data: SchemeNodeData; angle: number; speed: number; radius: number; height: number }[] = [];

    SAMPLE_SCHEME_NODES.forEach((schemeData, idx) => {
      const nodeGeo = new THREE.SphereGeometry(0.55, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(schemeData.color),
        emissive: new THREE.Color(schemeData.color),
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });

      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.userData = schemeData;

      const angle = (idx / SAMPLE_SCHEME_NODES.length) * Math.PI * 2;
      const radius = 9.5;
      const height = (idx % 2 === 0 ? 1 : -1) * (1.5 + idx * 0.4);

      mesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      coreGroup.add(mesh);

      nodeMeshes.push({
        mesh,
        data: schemeData,
        angle,
        speed: 0.003 + (idx % 3) * 0.001,
        radius,
        height,
      });
    });

    // 4. Subtle Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x06b6d4, 3, 50);
    pointLightCyan.position.set(10, 10, 10);
    scene.add(pointLightCyan);

    const pointLightEmerald = new THREE.PointLight(0x10b981, 2, 50);
    pointLightEmerald.position.set(-10, -10, 10);
    scene.add(pointLightEmerald);

    // Mouse Tracking & Raycasting
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;

      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.3;

      mouseCoord.x = (x / width) * 2 - 1;
      mouseCoord.y = -(y / height) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        setHoveredNode(intersected.userData as SchemeNodeData);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    setIsLoaded(true);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth core rotation with spring interpolation
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05 + 0.002;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Particle pulse
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.z = elapsedTime * 0.04;

      // Orbit rings
      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.12;
      ring3.rotation.y = elapsedTime * 0.18;

      // Move orbiting scheme nodes
      nodeMeshes.forEach(node => {
        node.angle += node.speed;
        node.mesh.position.x = Math.cos(node.angle) * node.radius;
        node.mesh.position.z = Math.sin(node.angle) * node.radius;
        node.mesh.position.y = node.height + Math.sin(elapsedTime * 2 + node.angle) * 0.6;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'default';
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] flex items-center justify-center select-none">
      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef} 
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Floating HUD Tooltip when hovering over a 3D scheme node */}
      {hoveredNode && (
        <div className="absolute top-6 right-6 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 max-w-xs shadow-2xl backdrop-blur-xl bg-obsidian-900/90">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: hoveredNode.color }} />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Scheme Active Node
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-1">{hoveredNode.name}</h4>
            <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 pt-2 border-t border-white/10">
              <span>Category: <strong className="text-neutral-200">{hoveredNode.category}</strong></span>
              <span>Max: <strong className="text-emerald-400">{hoveredNode.maxLoan}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Bottom Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-900/80 border border-white/10 text-xs text-neutral-400 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono">Setu Core 3D Matrix — 300+ Rules Live in WebGL</span>
      </div>
    </div>
  );
}
