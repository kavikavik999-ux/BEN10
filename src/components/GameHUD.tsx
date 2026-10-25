import React from 'react';
import { CharacterId, Enemy, JoystickInput, PlayerState } from '../types/game';
import { ALIENS_DATABASE, BEN_CHARACTER } from '../data/aliens';
import { VirtualJoystick } from './VirtualJoystick';
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface GameHUDProps {
  player: PlayerState;
  boss: Enemy | null;
  onOpenOmnitrix: () => void;
  onPunch: () => void;
  onKick: () => void;
  onSpecial: () => void;
  onJump: () => void;
  onJoystickMove: (input: JoystickInput) => void;
  onPauseToggle: () => void;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTestModal: () => void;
  onSelectQuickAlien: (id: CharacterId) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  boss,
  onOpenOmnitrix,
  onPunch,
  onKick,
  onSpecial,
  onJump,
  onJoystickMove,
  onPauseToggle,
  isPaused,
  soundEnabled,
  onToggleSound,
  onOpenTestModal,
  onSelectQuickAlien,
}) => {
  const currentData =
    player.characterId === 'ben'
      ? BEN_CHARACTER
      : ALIENS_DATABASE[player.characterId as Exclude<CharacterId, 'ben'>];

  const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const energyPct = Math.max(0, Math.min(100, player.omnitrixEnergy));

  // Request fullscreen/landscape on user tap
  const handleFullscreenRequest = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      if ('orientation' in screen && 'lock' in screen.orientation) {
        (screen.orientation.lock as (orientation: string) => Promise<void>)('landscape').catch(() => {});
      }
    } catch {
      // ignore failures gracefully
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* TOP STATUS BAR: Player Portrait, HP, Omnitrix, Score + Boss HP + Utility buttons */}
      <div className="flex items-start justify-between w-full z-20">
        {/* PLAYER STATUS (Large, clear mobile HUD) */}
        <div className="flex items-center gap-3">
          {/* Circular Portrait with Omnitrix Green Ring */}
          <div
            onClick={onOpenOmnitrix}
            className="pointer-events-auto cursor-pointer relative w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-zinc-950 border-3 border-emerald-400 p-0.5 shadow-[0_0_20px_rgba(34,197,94,0.7)] flex items-center justify-center overflow-hidden active:scale-95 transition"
            title="Tap to Open Omnitrix Wheel"
          >
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center font-bold text-xs uppercase"
              style={{
                backgroundColor:
                  player.characterId === 'ben' ? '#14532d' : `${currentData.primaryColor}55`,
              }}
            >
              {player.characterId === 'ben' ? (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-300 font-mono font-black">BEN</span>
                  <span className="text-lg font-black text-white leading-none">10</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-emerald-300 font-mono">HERO</span>
                  <span className="text-xs font-black text-white text-center px-1 truncate max-w-[55px]">
                    {currentData.name.slice(0, 5)}
                  </span>
                </div>
              )}
            </div>

            {/* Glowing Active Status indicator */}
            <div
              className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-black ${
                player.isTransformed ? 'bg-emerald-400 animate-pulse' : 'bg-green-500'
              }`}
            />
          </div>

          {/* HP and Omnitrix Core Gauges */}
          <div className="flex flex-col gap-1 min-w-[170px] sm:min-w-[240px]">
            {/* HP BAR */}
            <div className="flex items-center justify-between text-xs font-black font-mono text-zinc-100">
              <span className="text-emerald-400">HP</span>
              <span>
                {Math.round(player.hp)} / {player.maxHp}
              </span>
            </div>
            <div className="h-4 bg-zinc-950/90 rounded-full border border-emerald-500/60 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-300 rounded-full transition-all duration-200 shadow-[0_0_10px_#22c55e]"
                style={{ width: `${hpPct}%` }}
              />
            </div>

            {/* OMNITRIX ENERGY BAR */}
            <div className="flex items-center justify-between text-[11px] font-bold font-mono text-zinc-300">
              <span className="text-emerald-400 flex items-center gap-1.5">
                OMNITRIX
                {player.isTransformed && (
                  <span className="text-[9px] text-amber-300 animate-pulse font-black">
                    ACTIVE
                  </span>
                )}
              </span>
              <span>{Math.round(energyPct)}%</span>
            </div>
            <div className="h-2.5 bg-zinc-950/90 rounded-full border border-zinc-700 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  player.isTransformed
                    ? 'bg-gradient-to-r from-emerald-400 to-lime-300 shadow-[0_0_8px_#4ade80]'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${energyPct}%` }}
              />
            </div>

            {/* SCORE, COINS & BELLWOOD LEVEL */}
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-300 mt-0.5 flex-wrap">
              <span>
                SCORE <span className="text-white">{player.score}</span>
              </span>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5 bg-amber-500/25 border border-amber-400/50 text-amber-300 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                <span className="text-xs">🪙</span>
                <span className="font-black text-amber-200">{player.coins || 0}</span>
                <span className="text-[9px] text-amber-400 font-black">COINS</span>
              </div>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">
                BELLWOOD <span className="text-emerald-400">Infinite Arena</span>
              </span>
            </div>
          </div>
        </div>

        {/* BOSS HEALTH BAR (Top Center) */}
        {boss && boss.hp > 0 && (
          <div className="hidden sm:flex flex-col items-center max-w-[320px] w-full px-4">
            <div className="flex items-center justify-between w-full text-xs font-black font-mono text-red-400 mb-1">
              <span className="truncate">{boss.name}</span>
              <span className="text-zinc-400 text-[10px]">
                PHASE {boss.phase} / {boss.maxPhases}
              </span>
            </div>
            <div className="w-full h-3.5 bg-zinc-950/95 rounded-full border border-red-500/70 p-0.5 shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-200"
                style={{ width: `${Math.max(0, (boss.hp / boss.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* TOP RIGHT BUTTONS: Select Alien, Test Suite, Fullscreen, Sound, Pause */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* SELECT ALIEN (OMNITRIX) TOP BUTTON */}
          <button
            onClick={onOpenOmnitrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-black font-mono font-black text-xs transition shadow-[0_0_15px_rgba(74,222,128,0.7)] cursor-pointer active:scale-95"
            title="Click to Open Omnitrix Alien Wheel"
          >
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rotate-45 transform" />
            </div>
            <span>OMNITRIX</span>
          </button>

          {/* TEST SUITE BUTTON */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/85 hover:bg-zinc-800 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold transition cursor-pointer"
            title="Open Mandatory Test Suite"
          >
            <CheckCircle2 size={15} />
            <span className="hidden lg:inline">TESTS</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreenRequest}
            className="p-2 rounded-xl bg-zinc-900/85 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen Landscape"
          >
            <Maximize2 size={18} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-zinc-900/85 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Pause Button */}
          <button
            onClick={onPauseToggle}
            className="p-2 rounded-xl bg-zinc-900/85 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-950/50 transition cursor-pointer"
            title="Pause Game"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>

      {/* MIDDLE: COMBO DISPLAY */}
      <div className="flex items-center justify-between w-full pointer-events-none px-4">
        {player.comboCount > 1 ? (
          <div className="flex flex-col animate-bounce">
            <span className="text-4xl sm:text-5xl font-black italic text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_#22c55e] font-sans">
              x{player.comboCount}
            </span>
            <span className="text-sm font-black uppercase text-emerald-200 tracking-widest -mt-1 font-mono">
              COMBO!
            </span>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* BOTTOM CONTROLS: VIRTUAL JOYSTICK ON LEFT, ACTIVE POWERS IN CENTER, ACTION BUTTONS ON RIGHT */}
      <div className="flex items-end justify-between w-full z-30 pointer-events-none pb-1 sm:pb-2 gap-2">
        {/* BOTTOM LEFT: REAL 360-DEGREE VIRTUAL JOYSTICK + NEARBY JUMP BUTTON */}
        <div className="flex items-end gap-2.5 sm:gap-3 pointer-events-auto shrink-0">
          {/* Virtual Joystick Widget */}
          <div className="relative">
            <VirtualJoystick onMove={onJoystickMove} size={140} />
          </div>

          {/* Jump / Fly Button adjacent to Joystick */}
          <button
            onClick={onJump}
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-zinc-950/90 border-2 border-emerald-500/70 active:border-emerald-300 active:bg-emerald-950/70 flex flex-col items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition transform active:scale-90 cursor-pointer"
            title={`${currentData.canFly ? 'Fly' : 'Jump'} (W / Space / Up)`}
          >
            <span className="text-xl sm:text-2xl font-black">{currentData.canFly ? '🪽' : '↑'}</span>
            <span className="text-[8px] sm:text-[9px] font-bold font-mono uppercase text-emerald-300">
              {currentData.canFly ? 'FLY' : 'JUMP'}
            </span>
          </button>
        </div>

        {/* BOTTOM CENTER: ACTIVE HERO POWERS & SPECIAL OPTION SHOWCASE CARD */}
        <div
          onClick={onSpecial}
          className="hidden md:flex pointer-events-auto cursor-pointer flex-col gap-1 bg-zinc-950/90 backdrop-blur-md border border-emerald-500/60 hover:border-emerald-300 rounded-2xl px-3 py-1.5 shadow-[0_0_20px_rgba(0,0,0,0.85)] max-w-[340px] lg:max-w-[400px] w-full transition transform hover:scale-[1.02] active:scale-95"
          title={`Click to trigger ${currentData.specialName} (Keyboard: L or 3)`}
        >
          {/* Top row: Alien name, species, cooldown status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg">{currentData.specialIcon}</span>
              <span className="text-xs font-black font-mono uppercase text-white truncate">
                {currentData.name}
              </span>
              <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-zinc-800 text-emerald-400">
                {currentData.species}
              </span>
            </div>

            {/* Ready/Cooldown state */}
            <div className="text-[10px] font-mono font-black">
              {player.specialCooldownTimer > 0 ? (
                <span className="text-amber-400 animate-pulse">
                  RECHARGE {(player.specialCooldownTimer / 1000).toFixed(1)}s
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  SPECIAL READY [L]
                </span>
              )}
            </div>
          </div>

          {/* Special ability details */}
          <div className="flex items-center justify-between bg-zinc-900/90 rounded-lg px-2 py-0.5 border border-zinc-800">
            <div className="flex flex-col overflow-hidden pr-2">
              <span className="text-[10px] sm:text-[11px] font-black font-mono text-cyan-300 uppercase truncate">
                ⚡ {currentData.specialName}
              </span>
              <span className="text-[8px] sm:text-[9px] text-zinc-400 truncate max-w-[230px] lg:max-w-[280px]">
                {currentData.specialDescription}
              </span>
            </div>

            {/* Punch power display */}
            <div className="shrink-0 text-right">
              <span className="text-[8px] font-mono text-zinc-400 block">PUNCH [J]</span>
              <span className="text-[9px] font-black font-mono text-amber-300 truncate max-w-[80px] block">
                {currentData.punchPowerName.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Cooldown progress meter */}
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-100 ${
                player.specialCooldownTimer > 0
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-green-300 shadow-[0_0_8px_#38bdf8]'
              }`}
              style={{
                width: `${
                  player.specialCooldownTimer > 0
                    ? 100 - (player.specialCooldownTimer / currentData.specialCooldown) * 100
                    : 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* BOTTOM RIGHT: ACTION BUTTONS (PUNCH, KICK, SPECIAL, OMNITRIX) */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto shrink-0">
          {/* PUNCH BUTTON */}
          <button
            onClick={onPunch}
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-zinc-950/95 border-2 border-emerald-600/80 active:border-emerald-300 active:bg-emerald-900/70 flex flex-col items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition transform active:scale-90 cursor-pointer"
            title={`${currentData.punchPowerName} (J / 1)`}
          >
            <span className="text-lg sm:text-xl">✊</span>
            <span className="text-[8px] sm:text-[9px] font-black font-mono uppercase text-emerald-300">
              PUNCH
            </span>
          </button>

          {/* KICK BUTTON */}
          <button
            onClick={onKick}
            className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-zinc-950/95 border-2 border-emerald-600/80 active:border-emerald-300 active:bg-emerald-900/70 flex flex-col items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition transform active:scale-90 cursor-pointer"
            title="Martial Kick Strike (K / 2)"
          >
            <span className="text-lg sm:text-xl">🦵</span>
            <span className="text-[8px] sm:text-[9px] font-black font-mono uppercase text-emerald-300">
              KICK
            </span>
          </button>

          {/* SPECIAL POWER BUTTON (ALAS, CLEARLY LABELED WITH SPECIAL POWER ICON & NAME!) */}
          <button
            onClick={onSpecial}
            disabled={player.specialCooldownTimer > 0}
            style={{
              borderColor:
                player.specialCooldownTimer > 0 ? '#52525b' : currentData.primaryColor,
              boxShadow:
                player.specialCooldownTimer > 0
                  ? 'none'
                  : `0 0 20px ${currentData.primaryColor}99`,
            }}
            className={`w-14 h-14 sm:w-17 sm:h-17 rounded-full border-2.5 flex flex-col items-center justify-center transition transform active:scale-90 cursor-pointer ${
              player.specialCooldownTimer > 0
                ? 'bg-zinc-900/90 text-zinc-500 opacity-60'
                : 'bg-zinc-950/95 active:scale-95'
            }`}
            title={`Special: ${currentData.specialName} (L / 3)`}
          >
            <span className="text-xl sm:text-2xl leading-none">{currentData.specialIcon}</span>
            <span
              className="text-[8px] sm:text-[9px] font-black font-mono uppercase text-center px-0.5 truncate max-w-[56px] leading-tight mt-0.5"
              style={{ color: player.specialCooldownTimer > 0 ? '#a1a1aa' : '#ffffff' }}
            >
              {player.specialCooldownTimer > 0
                ? `${(player.specialCooldownTimer / 1000).toFixed(1)}s`
                : currentData.specialName.split(' ')[0]}
            </span>
          </button>

          {/* OMNITRIX TRANSFORMATION BUTTON (Large Dial Button) */}
          <button
            onClick={onOpenOmnitrix}
            className="w-15 h-15 sm:w-19 sm:h-19 rounded-full bg-gradient-to-b from-emerald-950 via-zinc-950 to-black border-3 border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.8)] transition transform hover:scale-105 active:scale-90 cursor-pointer"
            title="Open Omnitrix Wheel (O / Tab)"
          >
            {/* Omnitrix Hourglass Logo */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 border-2 border-emerald-200 flex items-center justify-center shadow-[0_0_14px_#4ade80]">
              <div className="w-5 h-5 sm:w-6.5 sm:h-6.5 bg-black rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-emerald-400 rotate-45 transform" />
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] font-black font-mono uppercase text-emerald-300 tracking-wider mt-0.5">
              OMNITRIX
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
