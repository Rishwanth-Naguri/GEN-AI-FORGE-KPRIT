import { useEffect, useRef } from 'react';

export default function NetworkBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particlesArray = [];
        let w, h;

        const init = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;

            const numParticles = Math.min((w * h) / 10000, 100); // Scale by screen size
            particlesArray = [];

            for (let i = 0; i < numParticles; i++) {
                particlesArray.push(new Particle(w, h));
            }
        };

        class Particle {
            constructor(w, h) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                // Direction and speed
                this.directionX = (Math.random() - 0.5) * 1.5;
                this.directionY = (Math.random() - 0.5) * 1.5;
                // Node size
                this.size = Math.random() * 2 + 1;
            }

            update() {
                if (this.x > w || this.x < 0) this.directionX = -this.directionX;
                if (this.y > h || this.y < 0) this.directionY = -this.directionY;

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                // Purple/cyan tone depending on position logic? Actually just solid low-opacity white/purple looks best.
                ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
                ctx.fill();
            }
        }

        const connect = () => {
            let opacityValue = 1;
            const connectionDistance = 150;

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance =
                        ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < connectionDistance * connectionDistance) {
                        opacityValue = 1 - (distance / (connectionDistance * connectionDistance));
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.25})`; // Subtle purple connection lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        };

        init();
        animate();

        const resizeHandler = () => init();
        window.addEventListener('resize', resizeHandler);

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // Behind everything
                pointerEvents: 'none', // Allow clicks to pass through
                opacity: 0.8
            }}
        />
    );
}
