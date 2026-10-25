import React, { useState, useCallback, useEffect } from 'react';
import { CharacterId, Enemy, JoystickInput, PlayerState } from './types/game';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { OmnitrixWheel } from './components/OmnitrixWheel';
import { TestVerificationModal } from './components/TestVerificationModal';
import { sounds } from './audio/soundEngine';
import { RotateCcw, Keyboard, Smartphone, Maximize2 } from 'lucide-react';

export default function App() {
  // Mobile landscape detection
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    return window.innerHeight > window.innerWidth && window.innerWidth < 768;
  });

  // Virtual Joystick input state
  const [joystickInput, setJoystickInput] = useState<JoystickInput>({
    x: 0,
    y: 0,
    active: false,
    angle: 0,
    distance: 0,
  });

  // Player state - starts canonically as Ben Tennyson (TEST 1)
  const [player, setPlayer] = useState<PlayerState>({
    x: 350,
    y: 600,
    vx: 0,
    vy: 0,
    isGrounded: true,
    facing: 'right',
    characterId: 'ben',
    action: 'idle',
    actionTimer: 0,
    animFrame: 0,
    hp: 220,
    maxHp: 220,
    omnitrixEnergy: 100,
    isTransformed: false,
    transformationTimer: 0,
    specialCooldownTimer: 0,
    comboCount: 3,
    comboResetTimer: 180,
    score: 12450,
    coins: 0,
  });

  // Boss state - Vilgax Mech Drone (down the street at x: 2300)
  const [boss, setBoss] = useState<Enemy | null>({
    id: 'boss_vilgax_mech',
    name: 'VILGAX MECH DRONE',
    type: 'boss_mech',
    x: 2350,
    y: 600,
    vx: 0,
    vy: 0,
    width: 140,
    height: 220,
    hp: 1750,
    maxHp: 2200,
    phase: 2,
    maxPhases: 3,
    attackTimer: 1200,
    currentAttack: 'idle',
    laserAngle: 0,
    telegraphTimer: 0,
    facing: 'left',
    animTimer: 0,
    scoreValue: 3000,
  });

  // UI state
  const [isOmnitrixOpen, setIsOmnitrixOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControlsGuide, setShowControlsGuide] = useState(false);

  // Monitor orientation changes
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
      setIsPortrait(portrait);
    };

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Try locking to landscape mode
  const attemptLandscapeLock = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      if ('orientation' in screen && 'lock' in screen.orientation) {
        (screen.orientation.lock as (orientation: string) => Promise<void>)('landscape').catch(() => {});
      }
    } catch {
      // ignore
    }
    setIsPortrait(false);
  }, []);

  // TRANSFORMATION HANDLER (Fixes the transformation bug!)
  const handleTransform = useCallback((alienId: CharacterId) => {
    sounds.playTransformation();

    setPlayer((prev) => ({
      ...prev,
      characterId: alienId,
      isTransformed: alienId !== 'ben',
      action: 'transforming',
      actionTimer: 25,
      transformationTimer: 550,
      specialCooldownTimer: 0,
      score: prev.score + 500,
    }));
  }, []);

  // DE-TRANSFORM HANDLER (Restores Ben Tennyson!)
  const handleDeTransform = useCallback(() => {
    sounds.playDetransform();

    setPlayer((prev) => ({
      ...prev,
      characterId: 'ben',
      isTransformed: false,
      action: 'detransforming',
      actionTimer: 20,
      transformationTimer: 500,
    }));
  }, []);

  // HUD Action Dispatches
  const handlePunch = () => {
    const fn = (window as unknown as { triggerPunch?: () => void }).triggerPunch;
    if (fn) fn();
  };

  const handleKick = () => {
    const fn = (window as unknown as { triggerKick?: () => void }).triggerKick;
    if (fn) fn();
  };

  const handleSpecial = () => {
    const fn = (window as unknown as { triggerSpecial?: () => void }).triggerSpecial;
    if (fn) fn();
  };

  const handleJump = () => {
    const fn = (window as unknown as { triggerJump?: () => void }).triggerJump;
    if (fn) fn();
  };

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleResetBattle = () => {
    setPlayer((prev) => ({
      ...prev,
      hp: 220,
      omnitrixEnergy: 100,
      comboCount: 0,
      action: 'idle',
      x: 350,
      y: 600,
    }));
    setBoss((prev) =>
      prev
        ? {
            ...prev,
            hp: 2200,
            phase: 1,
            currentAttack: 'idle',
            attackTimer: 0,
          }
        : null
    );
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none font-sans touch-none">
      {/* Edge-to-edge landscape canvas filling the entire screen */}
      <GameCanvas
        onOpenOmnitrix={() => setIsOmnitrixOpen(true)}
        isPaused={isPaused}
        player={player}
        setPlayer={setPlayer}
        boss={boss}
        setBoss={setBoss}
        onTransform={handleTransform}
        onDeTransform={handleDeTransform}
        joystickInput={joystickInput}
      />

      {/* Responsive HUD with Virtual Joystick and Action Buttons */}
      <GameHUD
        player={player}
        boss={boss}
        onOpenOmnitrix={() => setIsOmnitrixOpen(true)}
        onPunch={handlePunch}
        onKick={handleKick}
        onSpecial={handleSpecial}
        onJump={handleJump}
        onJoystickMove={setJoystickInput}
        onPauseToggle={() => setIsPaused((p) => !p)}
        isPaused={isPaused}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        onSelectQuickAlien={handleTransform}
      />

      {/* OMNITRIX SELECTION WHEEL (12+ Aliens with complete species dossiers) */}
      {isOmnitrixOpen && (
        <OmnitrixWheel
          currentAlienId={player.characterId}
          onSelectAlien={handleTransform}
          onDeTransform={handleDeTransform}
          onClose={() => setIsOmnitrixOpen(false)}
          omnitrixEnergy={player.omnitrixEnergy}
        />
      )}

      {/* MANDATORY TEST VERIFICATION SUITE MODAL */}
      {isTestModalOpen && (
        <TestVerificationModal
          currentAlienId={player.characterId}
          onTransform={handleTransform}
          onDeTransform={handleDeTransform}
          onSpecial={handleSpecial}
          onClose={() => setIsTestModalOpen(false)}
        />
      )}

      {/* MOBILE PORTRAIT ORIENTATION NOTICE */}
      {isPortrait && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6 text-center select-none">
          <div className="flex flex-col items-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-spin-slow">
              <Smartphone size={32} />
            </div>
            <h2 className="text-2xl font-black text-emerald-400 font-mono tracking-wider mb-2">
              PLEASE ROTATE DEVICE
            </h2>
            <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
              BEN 10: ULTIMATE ALIEN BATTLE is optimized for horizontal landscape gameplay with the virtual joystick and action controls.
            </p>
            <button
              onClick={attemptLandscapeLock}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 text-black font-black uppercase text-xs font-mono shadow-[0_0_20px_#22c55e] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Maximize2 size={16} />
              <span>PLAY IN LANDSCAPE</span>
            </button>
          </div>
        </div>
      )}

      {/* KEYBOARD CONTROLS GUIDE DIALOG */}
      {showControlsGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border-2 border-emerald-500 rounded-2xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                <Keyboard size={20} />
                <span>KEYBOARD & JOYSTICK CONTROLS</span>
              </div>
              <button
                onClick={() => setShowControlsGuide(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">Virtual Joystick or A / D</span>
                <span>Move Left / Right</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">Joystick Up or W / Space</span>
                <span>Jump / Fly</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">J or 1</span>
                <span>Punch (Arm Strike Hitbox)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">K or 2</span>
                <span>Kick (Leg Strike Hitbox)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">L or 3</span>
                <span>Special Ability</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">O or Tab</span>
                <span>Omnitrix Alien Wheel</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-zinc-900">
                <span className="text-emerald-400">Q</span>
                <span>De-transform to Ben</span>
              </div>
            </div>

            <button
              onClick={() => setShowControlsGuide(false)}
              className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase font-mono rounded-xl transition"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* PAUSE MENU OVERLAY */}
      {isPaused && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-950 border-2 border-emerald-500 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            <h2 className="text-3xl font-black text-emerald-400 font-mono tracking-widest mb-6">
              GAME PAUSED
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-sm transition shadow-[0_0_15px_#22c55e] cursor-pointer"
              >
                RESUME BATTLE
              </button>
              <button
                onClick={() => {
                  setIsPaused(false);
                  setIsOmnitrixOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 border border-emerald-500/40 font-bold uppercase text-xs transition cursor-pointer"
              >
                SELECT ALIEN
              </button>
              <button
                onClick={() => {
                  setIsPaused(false);
                  setIsTestModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold uppercase text-xs transition cursor-pointer"
              >
                MANDATORY TEST SUITE
              </button>
              <button
                onClick={() => setShowControlsGuide(true)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold uppercase text-xs transition cursor-pointer"
              >
                CONTROLS GUIDE
              </button>
              <button
                onClick={handleResetBattle}
                className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-bold uppercase text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>RESTART BATTLE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
