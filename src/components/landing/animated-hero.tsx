
'use client';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';

// 3D Brain Component
const Brain = () => {
    const brainRef = useRef<THREE.Mesh>(null!);
    const neuronsRef = useRef<THREE.Points>(null!);

    const [neuronPositions] = useState(() => {
        const positions = new Float32Array(200 * 3);
        for (let i = 0; i < 200; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = 2 * Math.sin(phi) * Math.cos(theta);
            const y = 2 * Math.sin(phi) * Math.sin(theta);
            const z = 2 * Math.cos(phi);
            positions.set([x, y, z], i * 3);
        }
        return positions;
    });

    useFrame((state, delta) => {
        brainRef.current.rotation.y += 0.005;
        if (neuronsRef.current && Math.random() > 0.98) {
            const randomNeuronIndex = Math.floor(Math.random() * 200);
            // This part is tricky to do efficiently in Drei, so we simulate a flash
        }
    });

    return (
        <group>
            <mesh ref={brainRef}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial color={0x5a2d80} transparent opacity={0.6} roughness={0.5} metalness={0.5} />
            </mesh>
            <Points ref={neuronsRef} positions={neuronPositions}>
                <PointMaterial transparent color="#8b5cf6" size={0.05} sizeAttenuation={true} depthWrite={false} />
            </Points>
        </group>
    );
};


// Background Neural Network
const NeuralNetworkBackground = () => {
    const pointsRef = useRef<THREE.Group>(null!);

    const [positions, colors] = useMemo(() => {
        const numPoints = 100;
        const pos = new Float32Array(numPoints * 3);
        const col = new Float32Array(numPoints * 3);
        for (let i = 0; i < numPoints; i++) {
            pos.set([
                (Math.random() - 0.5) * 20, 
                (Math.random() - 0.5) * 20, 
                (Math.random() - 0.5) * 10
            ], i * 3);
            const color = new THREE.Color();
            color.setHSL(Math.random(), 1.0, 0.7);
            col.set([color.r, color.g, color.b], i * 3);
        }
        return [pos, col];
    }, []);

    useFrame(({ clock }) => {
        if(pointsRef.current) {
            // A simple animation to make points move
            pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions}>
             <PointMaterial vertexColors size={0.1} sizeAttenuation={true} depthWrite={false} />
        </Points>
    );
};

export const AnimatedHero = () => {
    const [title, setTitle] = useState('');
    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const fullTitle = "A Safe Space for Student Minds";

    useEffect(() => {
        let i = 0;
        const typeWriter = () => {
            if (i < fullTitle.length) {
                setTitle(prev => prev + fullTitle.charAt(i));
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    const titleElement = document.getElementById('main-title');
                    if(titleElement) titleElement.classList.remove('typing-animation');
                    setSubtitleVisible(true);
                }, 500);
            }
        };
        typeWriter();
    }, []);

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50">
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    <Suspense fallback={null}>
                        <NeuralNetworkBackground />
                    </Suspense>
                </Canvas>
            </div>
            
            <div className="relative z-10 text-center">
                <header className="mt-20 md:mt-32">
                    <h1 id="main-title" className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-100 typing-animation">
                        {title}
                    </h1>
                    <p id="subtitle" className={`text-lg md:text-xl lg:text-2xl text-gray-400 transition-opacity duration-1000 ease-in-out ${subtitleVisible ? 'opacity-100 neural-glow' : 'opacity-0'}`}>
                        AI-driven partner for mental health support.
                    </p>
                </header>
                
                <div className="flex flex-wrap justify-center space-x-4 mt-8">
                    <Link href="/demo" legacyBehavior>
                        <a className="button-pulse bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                           Try a Demo
                        </a>
                    </Link>
                     <Link href="/register" legacyBehavior>
                        <a className="button-pulse bg-gray-800 text-gray-300 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
                           Register Now
                        </a>
                    </Link>
                </div>

                <div className="mt-20 md:mt-24 w-full max-w-sm h-[300px] md:max-w-md md:h-[400px] mx-auto">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Suspense fallback={null}>
                            <Brain />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </section>
    );
};
