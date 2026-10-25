import React, { useState, useEffect, useRef } from 'react';
import { ALIENS_DATABASE, BEN_CHARACTER } from '../data/aliens';
import { CharacterId } from '../types/game';
import { sounds } from '../audio/soundEngine';
import { drawCharacter } from '../graphics/characterRenderer';
import { ChevronLeft, ChevronRight, X, Zap, Shield, Sparkles, Grid, Disc } from 'lucide-react';

interface OmnitrixWheelProps {
  currentAlienId: CharacterId;
  onSelectAlien: (alienId: CharacterId) => void;
  onDeTransform: () => void;
  onClose: () => void;
  omnitrixEnergy: number;
}

// Complete playable aliens (including Alien X!)
const ALL_PLAYABLE_ALIENS: Exclude<CharacterId, 'ben'>[] = [
  'alienx',
  'heatblast',
  'fourarms',
  'xlr8',
  'diamondhead',
  'bigchill',
  'humungousaur',
  'stinkfly',
  'cannonbolt',
  'upgrade',
  'wildmutt',
  'greymatter',
  'swampfire',
  'ghostfreak',
  'rath',
  'feedback',
];

const OMNITRIX_PLAYLISTS = [
  {
    id: 1,
    name: 'All Aliens (With Alien X)',
    aliens: ALL_PLAYABLE_ALIENS,
  },
  {
    id: 2,
    name: 'Original Ten',
    aliens: [
      'heatblast',
      'fourarms',
      'xlr8',
      'diamondhead',
      'wildmutt',
      'upgrade',
      'cannonbolt',
      'ghostfreak',
      'greymatter',
      'stinkfly',
    ] as Exclude<CharacterId, 'ben'>[],
  },
  {
    id: 3,
    name: 'Alien Force & Ultimate',
    aliens: [
      'swampfire',
      'humungousaur',
      'bigchill',
      'rath',
      'feedback',
    ] as Exclude<CharacterId, 'ben'>[],
  },
];

// Alien Face Silhouette Icon Component (Matching Screenshot 2 green dial face icons!)
export const AlienFaceSilhouette: React.FC<{ alienId: CharacterId; size?: number; isSelected?: boolean }> = ({
  alienId,
  size = 28,
  isSelected = false,
}) => {
  const strokeColor = isSelected ? '#000000' : '#4ade80';
  const fillColor = isSelected ? '#000000' : '#22c55e';

  switch (alienId) {
    case 'heatblast':
      // Flaming head with stone collar
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 3C12 7 8 13 8 18C8 23 11 27 16 27C21 27 24 23 24 18C24 13 20 7 16 3Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M16 7C14 10 11 14 11 18C11 21 13 24 16 24C19 24 21 21 21 18C21 14 18 10 16 7Z" fill={fillColor} />
          <circle cx="13" cy="18" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="19" cy="18" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
        </svg>
      );
    case 'fourarms':
      // Tetramand 4-eyed muscular silhouette
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="11" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.25" />
          <path d="M16 5V27M8 12H24" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="20" cy="12" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="12" cy="17" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="20" cy="17" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
        </svg>
      );
    case 'xlr8':
      // Pointed cone helmet with green visor
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M6 26L25 6L21 24L15 27L6 26Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M15 14L22 10L19 19L14 17L15 14Z" fill={fillColor} />
          <circle cx="16" cy="16" r="2" fill={isSelected ? '#22c55e' : '#ffffff'} />
        </svg>
      );
    case 'diamondhead':
      // Angular crystal head with back dorsal spikes
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 4L24 14L20 27L16 29L12 27L8 14L16 4Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M5 10L10 14M27 10L22 14" stroke={strokeColor} strokeWidth="2" />
          <rect x="11" y="14" width="3" height="2.5" fill={isSelected ? '#22c55e' : '#fef08a'} />
          <rect x="18" y="14" width="3" height="2.5" fill={isSelected ? '#22c55e' : '#fef08a'} />
        </svg>
      );
    case 'bigchill':
      // Moth antennae horns & moth hood
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="18" r="9" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.25" />
          <path d="M11 12Q7 4 10 3M21 12Q25 4 22 3" stroke={strokeColor} strokeWidth="2" />
          <circle cx="13" cy="18" r="2" fill={isSelected ? '#22c55e' : '#38bdf8'} />
          <circle cx="19" cy="18" r="2" fill={isSelected ? '#22c55e' : '#38bdf8'} />
        </svg>
      );
    case 'humungousaur':
      // Sauropod dinosaur brow ridge
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <rect x="7" y="10" width="18" height="15" rx="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M5 10H27" stroke={strokeColor} strokeWidth="2" />
          <circle cx="12" cy="16" r="1.8" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="20" cy="16" r="1.8" fill={isSelected ? '#22c55e' : '#facc15'} />
        </svg>
      );
    case 'stinkfly':
      // 4 eyestalks & bug wings
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="18" rx="8" ry="7" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M12 13L8 6M14 12L12 5M18 12L20 5M20 13L24 6" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="8" cy="6" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="12" cy="5" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="20" cy="5" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
          <circle cx="24" cy="6" r="1.5" fill={isSelected ? '#22c55e' : '#facc15'} />
        </svg>
      );
    case 'cannonbolt':
      // Carapace shell orb
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="11" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M9 16C9 12 12 9 16 9C20 9 23 12 23 16" stroke={strokeColor} strokeWidth="2" />
          <circle cx="13" cy="19" r="1.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <circle cx="19" cy="19" r="1.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
        </svg>
      );
    case 'upgrade':
      // Cyclops optic circle eye & circuitry
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="11" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <circle cx="16" cy="16" r="5" stroke={strokeColor} strokeWidth="2" />
          <circle cx="16" cy="16" r="2.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <path d="M16 5V11M16 21V27M5 16H11M21 16H27" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'wildmutt':
      // Beast fangs & neck gills
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="16" rx="11" ry="8" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M8 12V20M11 11V21M21 19L23 25L25 19" stroke={strokeColor} strokeWidth="1.8" />
          <path d="M12 21L14 26L16 21" stroke={strokeColor} strokeWidth="1.8" />
        </svg>
      );
    case 'greymatter':
      // Giant frog eyes with horizontal pupils
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="19" r="8" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.25" />
          <circle cx="10" cy="12" r="5" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <circle cx="22" cy="12" r="5" stroke={strokeColor} strokeWidth="2" fill={fillColor} />
          <rect x="8" y="11" width="4" height="2" fill={isSelected ? '#22c55e' : '#052e16'} />
          <rect x="20" y="11" width="4" height="2" fill={isSelected ? '#22c55e' : '#052e16'} />
        </svg>
      );
    case 'swampfire':
      // Plant flame petal head
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 4L20 12L25 9L22 17L27 21L19 22L16 28L13 22L5 21L10 17L7 9L12 12L16 4Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <circle cx="13" cy="17" r="1.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <circle cx="19" cy="17" r="1.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
        </svg>
      );
    case 'ghostfreak':
      // Ghostly swirl & purple eye
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 6Q24 6 24 16Q24 26 16 28Q8 26 8 16Q8 6 16 6Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M10 12L22 20" stroke={strokeColor} strokeWidth="2" />
          <circle cx="16" cy="16" r="3" fill={isSelected ? '#22c55e' : '#a855f7'} />
        </svg>
      );
    case 'rath':
      // Tiger ears & fangs
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M6 8L10 13H22L26 8L24 17L22 25H10L8 17L6 8Z" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <circle cx="12" cy="16" r="1.8" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <circle cx="20" cy="16" r="1.8" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <path d="M13 22L14 25L15 22M17 22L18 25L19 22" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );
    case 'feedback':
      // Dual golden plug antennae & one eye
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="18" r="9" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M12 12Q6 4 10 3M20 12Q26 4 22 3" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="16" cy="18" r="3.5" fill={isSelected ? '#22c55e' : '#4ade80'} />
        </svg>
      );
    case 'alienx':
      // 3 sharp celestial horns & green cosmic eyes
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="19" r="8.5" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M16 11L16 2M11 13L5 4M21 13L27 4" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="13" cy="19" rx="2" ry="1.2" fill={isSelected ? '#22c55e' : '#4ade80'} />
          <ellipse cx="19" cy="19" rx="2" ry="1.2" fill={isSelected ? '#22c55e' : '#4ade80'} />
        </svg>
      );
    default:
      // Ben Tennyson human face with spiky hair
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="18" r="9" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.3" />
          <path d="M7 14L9 6L14 10L16 4L19 10L24 6L25 14" stroke={strokeColor} strokeWidth="2" />
          <circle cx="13" cy="18" r="1.8" fill={isSelected ? '#22c55e' : '#10b981'} />
          <circle cx="19" cy="18" r="1.8" fill={isSelected ? '#22c55e' : '#10b981'} />
        </svg>
      );
  }
};

// Hologram Canvas Component that renders live 2D animated model in the center (Screenshot 2!)
const AlienHologramCanvas: React.FC<{ characterId: CharacterId }> = ({ characterId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height - 24;

      // Green holographic beam background
      const grad = ctx.createLinearGradient(cx, 0, cx, cy);
      grad.addColorStop(0, 'rgba(74, 222, 128, 0.05)');
      grad.addColorStop(0.7, 'rgba(34, 197, 94, 0.25)');
      grad.addColorStop(1, 'rgba(74, 222, 128, 0.6)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - 35, 10);
      ctx.lineTo(cx + 35, 10);
      ctx.lineTo(cx + 60, cy);
      ctx.lineTo(cx - 60, cy);
      ctx.closePath();
      ctx.fill();

      // Holographic scanlines
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 10; y < cy; y += 8) {
        ctx.beginPath();
        ctx.moveTo(cx - 55, y);
        ctx.lineTo(cx + 55, y);
        ctx.stroke();
      }

      // Draw real 2D animated cartoon character
      drawCharacter({
        ctx,
        x: cx,
        y: cy,
        characterId,
        action: 'idle',
        facing: 'right',
        animFrame: frame,
        isTransformed: characterId !== 'ben',
        transformProgress: 0,
      });

      // Holographic base pedestal ring
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 48, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [characterId]);

  return <canvas ref={canvasRef} width={200} height={200} className="w-full h-full pointer-events-none" />;
};

export const OmnitrixWheel: React.FC<OmnitrixWheelProps> = ({
  currentAlienId,
  onSelectAlien,
  onDeTransform,
  onClose,
  omnitrixEnergy,
}) => {
  const [currentPlaylistIdx, setCurrentPlaylistIdx] = useState(0);
  const activePlaylist = OMNITRIX_PLAYLISTS[currentPlaylistIdx];

  const [selectedAlienId, setSelectedAlienId] = useState<CharacterId>(
    currentAlienId === 'ben' ? activePlaylist.aliens[0] : currentAlienId
  );

  const [viewMode, setViewMode] = useState<'wheel' | 'grid'>('wheel');

  const selectedData =
    selectedAlienId === 'ben'
      ? BEN_CHARACTER
      : ALIENS_DATABASE[selectedAlienId as Exclude<CharacterId, 'ben'>];

  const handlePrevPlaylist = () => {
    sounds.playOmnitrixDialTurn();
    const nextIdx = (currentPlaylistIdx - 1 + OMNITRIX_PLAYLISTS.length) % OMNITRIX_PLAYLISTS.length;
    setCurrentPlaylistIdx(nextIdx);
    setSelectedAlienId(OMNITRIX_PLAYLISTS[nextIdx].aliens[0]);
  };

  const handleNextPlaylist = () => {
    sounds.playOmnitrixDialTurn();
    const nextIdx = (currentPlaylistIdx + 1) % OMNITRIX_PLAYLISTS.length;
    setCurrentPlaylistIdx(nextIdx);
    setSelectedAlienId(OMNITRIX_PLAYLISTS[nextIdx].aliens[0]);
  };

  const handlePickAlien = (alienId: CharacterId) => {
    sounds.playOmnitrixDialTurn();
    setSelectedAlienId(alienId);
  };

  const handleConfirmTransform = () => {
    sounds.playTransformation();
    onSelectAlien(selectedAlienId);
    onClose();
  };

  const handleInstantSelect = (alienId: CharacterId) => {
    sounds.playOmnitrixDialTurn();
    setSelectedAlienId(alienId);
    sounds.playTransformation();
    onSelectAlien(alienId);
    onClose();
  };

  const handleRevertToBen = () => {
    sounds.playDetransform();
    onDeTransform();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md select-none p-3 sm:p-5">
      {/* Container inspired by Screenshot 2 with authentic Omnitrix interface */}
      <div className="relative w-full max-w-5xl h-[94vh] max-h-[660px] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-2 border-emerald-500 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] flex flex-col justify-between overflow-hidden">
        {/* Background circuit grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* TOP STATUS BAR: Omnitrix Hourglass & Core Energy + Playlist Title + View Switcher */}
        <div className="relative z-10 flex items-center justify-between border-b border-emerald-900/70 pb-3">
          <div className="flex items-center gap-3">
            {/* Animated Omnitrix Dial */}
            <div className="w-11 h-11 rounded-full bg-emerald-600 border-2 border-emerald-300 flex items-center justify-center shadow-[0_0_18px_rgba(74,222,128,0.8)] animate-pulse">
              <div className="w-6.5 h-6.5 bg-black rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-400 rotate-45 transform" />
              </div>
            </div>

            {/* Core Energy */}
            <div className="w-40 sm:w-56">
              <div className="flex justify-between text-xs font-black text-emerald-400 font-mono mb-1">
                <span>OMNITRIX READY</span>
                <span>{Math.round(omnitrixEnergy)}%</span>
              </div>
              <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-emerald-500/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-300 rounded-full transition-all duration-300 shadow-[0_0_8px_#4ade80]"
                  style={{ width: `${omnitrixEnergy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Playlist & View Mode Selector */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-700 mr-2">
              <button
                onClick={() => setViewMode('wheel')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  viewMode === 'wheel'
                    ? 'bg-emerald-500 text-black shadow-[0_0_8px_#22c55e]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Disc size={14} />
                <span>WHEEL</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-black shadow-[0_0_8px_#22c55e]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid size={14} />
                <span>ALL (GRID)</span>
              </button>
            </div>

            {/* Playlist Cycle */}
            <button
              onClick={handlePrevPlaylist}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 transition cursor-pointer"
              title="Previous Playlist"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center px-2 min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-emerald-400/80">
                PLAYLIST {activePlaylist.id} / {OMNITRIX_PLAYLISTS.length}
              </div>
              <div className="text-xs sm:text-sm font-black text-white truncate font-mono">
                {activePlaylist.name}
              </div>
            </div>
            <button
              onClick={handleNextPlaylist}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 transition cursor-pointer"
              title="Next Playlist"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-white transition border border-zinc-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* MAIN BODY: CIRCULAR OMNITRIX WHEEL OR ROSTER GRID + ALIEN SPECIES DOSSIER */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1 my-2 overflow-y-auto">
          {/* LEFT/CENTER: OMNITRIX DIAL OR GRID */}
          <div className="md:col-span-7 flex flex-col items-center justify-center relative min-h-[300px]">
            {viewMode === 'wheel' ? (
              /* Circular Omnitrix Wheel (Screenshot 2!) */
              <div className="relative w-76 h-76 sm:w-88 sm:h-88 flex items-center justify-center">
                {/* Glowing Outer Rings */}
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 shadow-[0_0_35px_rgba(34,197,94,0.4)] animate-spin-slow pointer-events-none" />
                <div className="absolute inset-5 rounded-full border-2 border-dashed border-emerald-400/30 pointer-events-none" />

                {/* Center Hologram Hub with LIVE 2D ANIMATED CARTOON SPRITE! */}
                <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-emerald-950 via-zinc-950 to-black border-4 border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.6)] z-20 overflow-hidden">
                  <AlienHologramCanvas characterId={selectedAlienId} />
                  <div className="absolute bottom-2 text-center pointer-events-none">
                    <span className="text-[11px] font-black uppercase text-emerald-300 font-mono tracking-wider px-2 py-0.5 rounded bg-black/70">
                      {selectedData.name}
                    </span>
                  </div>
                </div>

                {/* Alien Selector Buttons around circular rim with REAL SILHOUETTES! */}
                {activePlaylist.aliens.map((alienKey, index) => {
                  const total = activePlaylist.aliens.length;
                  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
                  const radius = 135; // Pixel radius along ring
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const isSelected = selectedAlienId === alienKey;
                  const alien = ALIENS_DATABASE[alienKey];

                  return (
                    <button
                      key={alienKey}
                      onClick={() => handlePickAlien(alienKey)}
                      className={`absolute z-30 w-12 h-12 sm:w-13 sm:h-13 -ml-6 -mt-6 rounded-full flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-120 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-400 text-black border-2 border-white shadow-[0_0_22px_#4ade80] scale-120 ring-4 ring-emerald-500/50'
                          : 'bg-zinc-950 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-950 hover:border-emerald-300'
                      }`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      title={alien.name}
                    >
                      {/* Alien Silhouette Graphic matching Screenshot 2! */}
                      <AlienFaceSilhouette alienId={alienKey} size={24} isSelected={isSelected} />
                    </button>
                  );
                })}
              </div>
            ) : (
              /* All Aliens Full Grid View */
              <div className="w-full h-full max-h-[380px] overflow-y-auto p-2">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  <button
                    onClick={() => handlePickAlien('ben')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center cursor-pointer ${
                      selectedAlienId === 'ben'
                        ? 'bg-emerald-500 text-black border-white shadow-[0_0_15px_#22c55e]'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-emerald-400'
                    }`}
                  >
                    <AlienFaceSilhouette alienId="ben" size={26} isSelected={selectedAlienId === 'ben'} />
                    <span className="text-xs font-black uppercase font-mono mt-1">Ben Tennyson</span>
                  </button>

                  {ALL_PLAYABLE_ALIENS.map((alienKey) => {
                    const alien = ALIENS_DATABASE[alienKey];
                    const isSelected = selectedAlienId === alienKey;
                    return (
                      <button
                        key={alienKey}
                        onClick={() => handlePickAlien(alienKey)}
                        onDoubleClick={() => handleInstantSelect(alienKey)}
                        className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-black border-white shadow-[0_0_15px_#22c55e]'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-emerald-400 hover:bg-zinc-800'
                        }`}
                      >
                        <AlienFaceSilhouette alienId={alienKey} size={26} isSelected={isSelected} />
                        <span className="text-xs font-bold truncate max-w-[80px] font-mono mt-1">
                          {alien.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 truncate max-w-[80px]">
                          {alien.species}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: ALIEN SPECIES DOSSIER & STAT BARS (Matching Screenshot 2) */}
          <div className="md:col-span-5 bg-zinc-950/85 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-[inset_0_0_25px_rgba(0,0,0,0.85)]">
            <div>
              {/* Alien Name & Species */}
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-3">
                <div>
                  <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-wider font-mono">
                    {selectedData.name}
                  </h3>
                  <div className="text-xs text-zinc-300 font-mono mt-0.5">
                    SPECIES: <span className="text-white font-bold">{selectedData.species}</span>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    HOME WORLD: <span className="text-white font-bold">{selectedData.homeWorld}</span>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-2xl border border-emerald-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(74,222,128,0.3)]"
                  style={{ backgroundColor: `${selectedData.primaryColor}33` }}
                >
                  <Sparkles size={20} className="text-emerald-400" />
                </div>
              </div>

              {/* STAT BARS (IQ, STRENGTH, SPEED, DURABILITY, AGILITY) */}
              <div className="space-y-2 font-mono text-xs mb-4">
                {Object.entries(selectedData.stats).map(([statName, val]) => (
                  <div key={statName} className="flex items-center justify-between">
                    <span className="uppercase text-emerald-400/90 font-bold w-26">
                      {statName}:
                    </span>
                    <div className="flex-1 flex gap-1 h-3.5 bg-zinc-900 rounded p-0.5 border border-zinc-800">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-xs transition-all ${
                            i < val
                              ? 'bg-emerald-500 shadow-[0_0_5px_#22c55e]'
                              : 'bg-zinc-800/60'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-8 text-right font-bold text-emerald-300 ml-2">
                      {val}/10
                    </span>
                  </div>
                ))}
              </div>

              {/* SPECIAL ABILITY INFO */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase mb-1">
                  <Zap size={15} />
                  <span>SPECIAL: {selectedData.specialName}</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {selectedData.specialDescription}
                </p>
                <div className="mt-2 text-[10px] text-emerald-300 font-mono">
                  PUNCH ATTACK: <span className="text-white font-bold">{selectedData.punchPowerName}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: SLAM OMNITRIX / TRANSFORM / DE-TRANSFORM */}
            <div className="flex gap-3 mt-4 pt-3 border-t border-zinc-800">
              <button
                onClick={handleConfirmTransform}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:from-emerald-400 hover:to-green-300 text-black font-black text-sm tracking-widest uppercase transition shadow-[0_0_25px_rgba(74,222,128,0.7)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap size={18} />
                <span>SLAM OMNITRIX & TRANSFORM!</span>
              </button>

              {currentAlienId !== 'ben' && (
                <button
                  onClick={handleRevertToBen}
                  className="py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs uppercase transition flex items-center gap-1.5 cursor-pointer"
                  title="Revert to Ben Tennyson"
                >
                  <Shield size={16} />
                  <span>DE-TRANSFORM</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM HELP FOOTER */}
        <div className="relative z-10 text-center text-xs text-emerald-400/70 font-mono border-t border-emerald-950 pt-2 flex items-center justify-between">
          <span>Tap alien silhouette to preview &bull; Click SLAM OMNITRIX to transform</span>
          <span>Instant Omnitrix Selection Active</span>
        </div>
      </div>
    </div>
  );
};
