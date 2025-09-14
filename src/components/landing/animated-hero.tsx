
'use client';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';

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
                 {/* Simplified background */}
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
            </div>
        </section>
    );
};
