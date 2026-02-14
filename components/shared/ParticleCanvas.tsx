
import React, { useRef, useEffect } from 'react';

export interface ParticleEffect {
    type: 'none' | 'fireworks';
}

interface ParticleCanvasProps {
    effect: ParticleEffect;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ effect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            opacity: number;

            constructor(x: number, y: number, size: number, color: string, speedX: number, speedY: number) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
                this.opacity = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
                this.opacity -= 0.02;
            }

            draw() {
                if (!ctx) return;
                ctx.globalAlpha = this.opacity > 0 ? this.opacity : 0;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        
        class Firework {
            x: number;
            y: number;
            particles: Particle[] = [];
            hue: number;
            
            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.hue = Math.random() * 360;
                for (let loopIndex = 0; loopIndex < 50; loopIndex++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 5 + 1;
                    this.particles.push(new Particle(
                        this.x, 
                        this.y, 
                        Math.random() * 3 + 1, 
                        `hsl(${this.hue}, 100%, 70%)`,
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    ));
                }
            }

            update() {
                this.particles.forEach(p => {
                    p.update();
                    p.speedY += 0.05; // gravity
                });
                this.particles = this.particles.filter(p => p.opacity > 0);
            }

            draw() {
                this.particles.forEach(p => p.draw());
            }
        }


        let particles: (Particle | Firework)[] = [];
        
        const createBaseParticles = () => {
            let baseParticles = [];
            const rosePetalColors = ['#FADADD', '#E6A4B4', '#D98A9E'];
            const diamondColor = '#B8860B';

            for (let loopIndex = 0; loopIndex < 100; loopIndex++) {
                const isDiamond = Math.random() > 0.9;
                const color = isDiamond ? diamondColor : rosePetalColors[Math.floor(Math.random() * rosePetalColors.length)];
                baseParticles.push(new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 2 + 1,
                    color,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ));
            }
            return baseParticles;
        }

        particles = createBaseParticles();

        if (effect.type === 'fireworks') {
            for (let loopIndex = 0; loopIndex < 5; loopIndex++) {
                setTimeout(() => {
                    particles.push(new Firework(Math.random() * canvas.width, Math.random() * canvas.height * 0.5));
                }, loopIndex * 300);
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                if (p instanceof Particle) {
                    if (p.y > canvas.height || p.y < 0 || p.x > canvas.width || p.x < 0) {
                        // Reset particle
                        p.x = Math.random() * canvas.width;
                        p.y = Math.random() * canvas.height;
                    }
                } else if(p instanceof Firework) {
                     if (p.particles.length === 0) {
                         particles.splice(index, 1);
                     }
                }
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [effect]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default ParticleCanvas;
