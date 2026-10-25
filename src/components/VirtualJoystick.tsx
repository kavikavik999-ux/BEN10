import React, { useRef, useState, useCallback, useEffect } from 'react';
import { JoystickInput } from '../types/game';

interface VirtualJoystickProps {
  onMove: (input: JoystickInput) => void;
  size?: number; // Base diameter (default ~140px)
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  size = 140,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);

  const radius = size / 2;
  const maxDistance = radius * 0.75;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsActive(true);

    processPointerEvent(e.clientX, e.clientY);
  };

  const processPointerEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const rawDistance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Clamp distance to max radius
      const clampedDistance = Math.min(rawDistance, maxDistance);
      const clampedX = Math.cos(angle) * clampedDistance;
      const clampedY = Math.sin(angle) * clampedDistance;

      setKnobPos({ x: clampedX, y: clampedY });

      // Normalized coordinates (-1 to 1) with small deadzone
      const deadzone = 0.12;
      const normalizedDist = clampedDistance / maxDistance;

      if (normalizedDist < deadzone) {
        onMove({
          x: 0,
          y: 0,
          active: true,
          angle,
          distance: 0,
        });
      } else {
        const adjustedDist = (normalizedDist - deadzone) / (1 - deadzone);
        onMove({
          x: Math.cos(angle) * adjustedDist,
          y: Math.sin(angle) * adjustedDist,
          active: true,
          angle,
          distance: adjustedDist,
        });
      }
    },
    [maxDistance, onMove]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    processPointerEvent(e.clientX, e.clientY);
  };

  const resetJoystick = useCallback(() => {
    activePointerIdRef.current = null;
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({
      x: 0,
      y: 0,
      active: false,
      angle: 0,
      distance: 0,
    });
  }, [onMove]);

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === activePointerIdRef.current) {
      resetJoystick();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === activePointerIdRef.current) {
      resetJoystick();
    }
  };

  useEffect(() => {
    return () => {
      resetJoystick();
    };
  }, [resetJoystick]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        width: size,
        height: size,
        touchAction: 'none',
      }}
      className={`relative rounded-full flex items-center justify-center select-none pointer-events-auto cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-zinc-950/85 border-2 border-emerald-400 shadow-[0_0_25px_rgba(34,197,94,0.5)]'
          : 'bg-zinc-900/60 border-2 border-emerald-500/40 shadow-lg'
      }`}
    >
      {/* Direction markings (N, S, E, W lines) */}
      <div className="absolute w-full h-[1px] bg-emerald-500/25 pointer-events-none" />
      <div className="absolute h-full w-[1px] bg-emerald-500/25 pointer-events-none" />
      <div className="absolute inset-2.5 rounded-full border border-dashed border-emerald-400/20 pointer-events-none" />

      {/* Movable Thumbstick Knob */}
      <div
        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center pointer-events-none shadow-xl transform transition-transform duration-75 ${
          isActive
            ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-emerald-800 border-2 border-emerald-200 shadow-[0_0_16px_#4ade80] scale-105'
            : 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-emerald-500/50'
        }`}
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        {/* Omnitrix green mini core in thumbstick */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isActive ? 'bg-black' : 'bg-emerald-950'
          }`}
        >
          <div
            className={`w-2.5 h-2.5 rotate-45 transform ${
              isActive ? 'bg-emerald-400 shadow-[0_0_6px_#4ade80]' : 'bg-emerald-600'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
