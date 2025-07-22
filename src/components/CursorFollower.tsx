import { useEffect, useState } from 'react';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-[9999] h-12 w-12 rounded-full bg-primary/20 blur-2xl transition-transform duration-150 ease-out hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};

export default CursorFollower;