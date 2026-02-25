import React, { useRef, useEffect } from 'react';

const CodeGlobe = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const chars = "01<>/_[]{}*&^%$#@!".split("");

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    // Configuration
    const rows = 20; 
    const cols = 40; 
    const radius = 180; 

    // Generate Points with character data
    const points = [];
    for (let lat = 0; lat < rows; lat++) {
      const theta = (lat / (rows - 1)) * Math.PI - Math.PI / 2;
      for (let lon = 0; lon < cols; lon++) {
        const phi = (lon / cols) * 2 * Math.PI;
        points.push({
          baseX: radius * Math.cos(theta) * Math.cos(phi),
          baseY: radius * Math.sin(theta),
          baseZ: radius * Math.cos(theta) * Math.sin(phi),
          char: chars[Math.floor(Math.random() * chars.length)],
          speed: Math.random() * 0.05 + 0.01,
          lastUpdate: 0
        });
      }
    }

    let time = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const render = (now) => {
      if (!containerRef.current || !canvas) return;

      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotation Logic
      targetRotationY = time * 0.2 + (mouseX * 0.5);
      targetRotationX = (mouseY * 0.5);
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      
      time += 0.01;

      points.forEach(point => {
        // 3D Rotations
        let x1 = point.baseX * Math.cos(currentRotationY) - point.baseZ * Math.sin(currentRotationY);
        let z1 = point.baseZ * Math.cos(currentRotationY) + point.baseX * Math.sin(currentRotationY);
        let y1 = point.baseY;

        let y2 = y1 * Math.cos(currentRotationX) - z1 * Math.sin(currentRotationX);
        let z2 = y1 * Math.sin(currentRotationX) + z1 * Math.cos(currentRotationX);
        let x2 = x1;

        // Perspective
        const perspective = 500; 
        const scale = perspective / (perspective + z2);
        const screenX = centerX + x2 * scale;
        const screenY = centerY + y2 * scale;

        // Cull back-facing points for clarity
        if (z2 < -20) return; 

        // Update characters occasionally to simulate "streaming code"
        if (now - point.lastUpdate > 150) {
            point.char = chars[Math.floor(Math.random() * chars.length)];
            point.lastUpdate = now;
        }

        // Depth-based styling
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));
        const fontSize = 12 * scale;
        
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        
        // Classic Matrix Green with a hint of white for "new" code
        ctx.fillStyle = `rgba(0, 255, 70, ${alpha})`;
        if (Math.random() > 0.99) ctx.fillStyle = `rgba(200, 255, 200, ${alpha})`;
        
        ctx.fillText(point.char, screenX, screenY);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-xl aspect-square relative group cursor-crosshair mx-auto bg-black rounded-full overflow-hidden border border-green-900/30">
      {/* Matrix HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-green-500/10 rounded-full"></div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-green-500/40 font-mono tracking-widest">
        ENCRYPTED_CORE_SYNC
      </div>
      
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-4 h-4 border-l border-t border-green-500/40"></div>
      <div className="absolute bottom-8 right-8 w-4 h-4 border-r border-b border-green-500/40"></div>
    </div>
  );
};

export default CodeGlobe;