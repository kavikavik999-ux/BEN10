import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActionState,
  CharacterId,
  CrystalSpike,
  DestructibleObject,
  Enemy,
  FloatingText,
  JoystickInput,
  Particle,
  PlayerState,
  Projectile,
} from '../types/game';
import { ALIENS_DATABASE, BEN_CHARACTER } from '../data/aliens';
import { drawTownEnvironment } from '../graphics/townRenderer';
import { drawCharacter } from '../graphics/characterRenderer';
import { drawEnemy } from '../graphics/enemyRenderer';
import {
  drawCrystalShield,
  drawCrystalSpikes,
  drawLaserSweep,
  drawParticles,
  drawProjectiles,
  drawTelegraphWarning,
} from '../graphics/effectsRenderer';
import { sounds } from '../audio/soundEngine';

interface GameCanvasProps {
  onOpenOmnitrix: () => void;
  isPaused: boolean;
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  boss: Enemy | null;
  setBoss: React.Dispatch<React.SetStateAction<Enemy | null>>;
  onTransform: (alienId: CharacterId) => void;
  onDeTransform: () => void;
  joystickInput: JoystickInput;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onOpenOmnitrix,
  isPaused,
  player,
  setPlayer,
  boss,
  setBoss,
  onTransform,
  onDeTransform,
  joystickInput,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Authoritative Player Physics State maintained internally (never wiped by React re-renders!)
  const playerStateRef = useRef<PlayerState>({
    ...player,
    x: 350,
    y: 600,
    vx: 0,
    vy: 0,
  });

  // Keep references to inputs and parent boss
  const bossRef = useRef<Enemy | null>(boss);
  bossRef.current = boss;

  const joystickRef = useRef<JoystickInput>(joystickInput);
  joystickRef.current = joystickInput;

  // React to characterId or transformation changes from props
  useEffect(() => {
    playerStateRef.current.characterId = player.characterId;
    playerStateRef.current.isTransformed = player.isTransformed;
    playerStateRef.current.transformationTimer = player.transformationTimer;
  }, [player.characterId, player.isTransformed, player.transformationTimer]);

  // Active enemies in the town world (Robots, Kevin Levin, Monsters, Vilgax, and Drones!)
  const enemiesRef = useRef<Enemy[]>([
    {
      id: 'robot_1',
      name: 'ASSAULT BATTLE ROBOT',
      type: 'robot',
      x: 520, // Right in front of player for immediate combat!
      y: 600,
      vx: 0,
      vy: 0,
      width: 58,
      height: 95,
      hp: 350,
      maxHp: 350,
      phase: 1,
      maxPhases: 1,
      attackTimer: 0,
      currentAttack: 'idle',
      laserAngle: 0,
      telegraphTimer: 0,
      facing: 'left',
      animTimer: 0,
      scoreValue: 450,
    },
    {
      id: 'kevin_1',
      name: 'KEVIN 11 MUTANT',
      type: 'kevin',
      x: 820,
      y: 600,
      vx: 0,
      vy: 0,
      width: 68,
      height: 105,
      hp: 520,
      maxHp: 520,
      phase: 1,
      maxPhases: 1,
      attackTimer: 0,
      currentAttack: 'idle',
      laserAngle: 0,
      telegraphTimer: 0,
      facing: 'left',
      animTimer: 0,
      scoreValue: 750,
    },
    {
      id: 'monster_1',
      name: 'ALIEN MUTANT BEAST',
      type: 'monster',
      x: 1150,
      y: 600,
      vx: 0,
      vy: 0,
      width: 65,
      height: 95,
      hp: 420,
      maxHp: 420,
      phase: 1,
      maxPhases: 1,
      attackTimer: 0,
      currentAttack: 'idle',
      laserAngle: 0,
      telegraphTimer: 0,
      facing: 'left',
      animTimer: 0,
      scoreValue: 550,
    },
    {
      id: 'vilgax_warlord_1',
      name: 'WARLORD VILGAX',
      type: 'vilgax',
      x: 1550,
      y: 600,
      vx: 0,
      vy: 0,
      width: 75,
      height: 120,
      hp: 750,
      maxHp: 750,
      phase: 1,
      maxPhases: 1,
      attackTimer: 0,
      currentAttack: 'idle',
      laserAngle: 0,
      telegraphTimer: 0,
      facing: 'left',
      animTimer: 0,
      scoreValue: 1000,
    },
    {
      id: 'drone_1',
      name: 'CYBER RECON DRONE',
      type: 'drone',
      x: 650,
      y: 520,
      vx: 0,
      vy: 0,
      width: 50,
      height: 50,
      hp: 260,
      maxHp: 260,
      phase: 1,
      maxPhases: 1,
      attackTimer: 0,
      currentAttack: 'idle',
      laserAngle: 0,
      telegraphTimer: 0,
      facing: 'left',
      animTimer: 0,
      scoreValue: 350,
    },
  ]);

  const enemySpawnTimerRef = useRef(0);

  const destructiblesRef = useRef<DestructibleObject[]>([
    { id: 'c1', type: 'crate', x: 440, y: 600, width: 42, height: 42, hp: 40, maxHp: 40, broken: false },
    { id: 'h1', type: 'hydrant', x: 700, y: 600, width: 30, height: 44, hp: 60, maxHp: 60, broken: false },
    { id: 'c2', type: 'crate', x: 1000, y: 600, width: 42, height: 42, hp: 40, maxHp: 40, broken: false },
    { id: 't1', type: 'trash_can', x: 1400, y: 600, width: 32, height: 46, hp: 50, maxHp: 50, broken: false },
    { id: 'c3', type: 'crate', x: 1850, y: 600, width: 42, height: 42, hp: 40, maxHp: 40, broken: false },
  ]);

  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const crystalSpikesRef = useRef<CrystalSpike[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const xlr8AfterimagesRef = useRef<{ x: number; y: number; alpha: number; facing: 'left' | 'right' }[]>([]);

  // Shield state (Diamondhead)
  const [shieldActive, setShieldActive] = useState(false);
  const shieldActiveRef = useRef(false);
  shieldActiveRef.current = shieldActive;

  // Camera & Screen Shake
  const cameraXRef = useRef(0);
  const shakeRef = useRef(0);

  // Keyboard keys
  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean }>({
    left: false,
    right: false,
    up: false,
  });

  // Spawn Floating Combat Text
  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string = '#ffffff') => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      alpha: 1,
      life: 0,
      maxLife: 45,
    });
  }, []);

  // Spawn Particles
  const spawnParticles = useCallback(
    (
      x: number,
      y: number,
      color: string,
      count: number = 10,
      shape: Particle['shape'] = 'circle'
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 6 + 3,
          color,
          alpha: 1,
          life: 0,
          maxLife: 22 + Math.random() * 15,
          shape,
        });
      }
    },
    []
  );

  // Hit test helper for player attacks against all active enemies, boss, and crates
  const checkAttackHits = useCallback(
    (hitbox: { x1: number; x2: number; y1: number; y2: number }, baseDamage: number, knockback: number = 10) => {
      const p = playerStateRef.current;
      const currentAlien = p.characterId === 'ben' ? BEN_CHARACTER : ALIENS_DATABASE[p.characterId];
      const damage = Math.round(baseDamage * currentAlien.damageModifier);
      const dir = p.facing === 'right' ? 1 : -1;
      let hitAny = false;

      // Check Minions
      enemiesRef.current.forEach((en) => {
        if (en.hp <= 0) return;
        const enX1 = en.x - en.width / 2;
        const enX2 = en.x + en.width / 2;
        const enY1 = en.y - en.height;
        const enY2 = en.y;

        if (hitbox.x2 >= enX1 && hitbox.x1 <= enX2 && hitbox.y2 >= enY1 && hitbox.y1 <= enY2) {
          en.hp = Math.max(0, en.hp - damage);
          en.vx = dir * knockback;
          en.currentAttack = 'hurt';
          hitAny = true;
          sounds.playBossHurt();
          spawnParticles(en.x, en.y - en.height / 2, currentAlien.primaryColor, 14, 'spark');
          spawnFloatingText(en.x, en.y - en.height - 10, `-${damage}`, '#facc15');

          if (en.hp <= 0) {
            spawnParticles(en.x, en.y - en.height / 2, '#ef4444', 30, 'spark');
            p.score += en.scoreValue;
            p.coins = (p.coins || 0) + 100;
            sounds.playCoinSound();
            spawnFloatingText(en.x, en.y - en.height - 20, `DEFEATED! +${en.scoreValue}`, '#4ade80');
            spawnFloatingText(en.x, en.y - en.height - 40, '+100 COINS 🪙', '#facc15');

            // Spawn 10 golden coin particles
            for (let c = 0; c < 10; c++) {
              particlesRef.current.push({
                x: en.x + (Math.random() - 0.5) * 24,
                y: en.y - en.height / 2 + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 6,
                vy: -4 - Math.random() * 4,
                size: 7,
                color: '#facc15',
                alpha: 1,
                life: 0,
                maxLife: 35,
                shape: 'coin',
              });
            }
          }
        }
      });

      // Check Boss Mech
      if (bossRef.current && bossRef.current.hp > 0) {
        const b = bossRef.current;
        const bX1 = b.x - b.width / 2;
        const bX2 = b.x + b.width / 2;
        const bY1 = b.y - b.height;
        const bY2 = b.y;

        if (hitbox.x2 >= bX1 && hitbox.x1 <= bX2 && hitbox.y2 >= bY1 && hitbox.y1 <= bY2) {
          b.hp = Math.max(0, b.hp - damage);
          hitAny = true;
          sounds.playBossHurt();
          shakeRef.current = 12;
          spawnParticles(b.x - 30, b.y - 100, currentAlien.primaryColor, 18, 'spark');
          spawnFloatingText(b.x - 40, b.y - 150, `-${damage}`, '#f87171');

          if (b.hp <= 0) {
            p.score += 5000;
            p.coins = (p.coins || 0) + 1000;
            sounds.playCoinSound();
            spawnFloatingText(b.x, b.y - 180, 'BOSS DESTROYED! +1000 COINS 🪙', '#facc15');
          }
        }
      }

      // Check Destructibles
      destructiblesRef.current.forEach((obj) => {
        if (obj.broken) return;
        if (hitbox.x2 >= obj.x && hitbox.x1 <= obj.x + obj.width && hitbox.y2 >= obj.y - obj.height) {
          obj.hp -= damage;
          spawnParticles(obj.x + obj.width / 2, obj.y - obj.height / 2, '#b45309', 10, 'spark');
          if (obj.hp <= 0) {
            obj.broken = true;
            spawnParticles(obj.x + obj.width / 2, obj.y - obj.height / 2, '#78350f', 22, 'spark');
            p.score += 150;
            spawnFloatingText(obj.x, obj.y - obj.height, '+150', '#22c55e');
          }
        }
      });

      if (hitAny) {
        p.comboCount += 1;
        p.comboResetTimer = 160;
        p.score += Math.round(100 * p.comboCount);
      }
    },
    [spawnParticles, spawnFloatingText]
  );

  // PUNCH ACTION (Custom punching powers for each alien!)
  const triggerPunch = useCallback(() => {
    const p = playerStateRef.current;
    if (p.action === 'transforming') return;

    sounds.playPunch();
    p.action = 'punch';
    p.actionTimer = 16;

    const dir = p.facing === 'right' ? 1 : -1;
    const reach = p.characterId === 'fourarms' ? 160 : p.characterId === 'humungousaur' ? 190 : 130;
    const x1 = dir === 1 ? p.x : p.x - reach;
    const x2 = dir === 1 ? p.x + reach : p.x;

    // Trigger distinctive alien punch powers
    switch (p.characterId) {
      case 'heatblast':
        // Fire punch: creates burst of flames!
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'fireball',
          x: p.x + dir * 65,
          y: p.y - 95,
          vx: dir * 16,
          vy: 0,
          radius: 16,
          damage: 40,
          life: 0,
          maxLife: 30,
          color: '#f97316',
          glowColor: '#ef4444',
        });
        spawnParticles(p.x + dir * 65, p.y - 95, '#facc15', 12, 'flame');
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🔥 FLAME PUNCH!', '#f97316');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 40, 12);
        break;

      case 'fourarms':
        // 4-arm beatdown: launches heavy shockwave!
        shakeRef.current = 14;
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'sonic',
          x: p.x + dir * 75,
          y: p.y - 90,
          vx: dir * 14,
          vy: 0,
          radius: 40,
          damage: 65,
          life: 0,
          maxLife: 25,
          color: '#ffffff',
          glowColor: '#ef4444',
        });
        spawnParticles(p.x + dir * 70, p.y - 85, '#ef4444', 20, 'spark');
        spawnFloatingText(p.x + dir * 50, p.y - 150, '💥 4-ARM BEATDOWN!', '#ef4444');
        checkAttackHits({ x1, x2, y1: p.y - 170, y2: p.y + 10 }, 65, 18);
        break;

      case 'diamondhead':
        // Crystal blade jab shoots razor diamond shard!
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'crystal_shard',
          x: p.x + dir * 70,
          y: p.y - 95,
          vx: dir * 18,
          vy: 0,
          radius: 12,
          damage: 42,
          life: 0,
          maxLife: 35,
          color: '#6ee7b7',
          glowColor: '#10b981',
        });
        spawnParticles(p.x + dir * 70, p.y - 95, '#6ee7b7', 14, 'crystal');
        spawnFloatingText(p.x + dir * 50, p.y - 140, '💎 DIAMOND BLADE!', '#10b981');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 42, 12);
        break;

      case 'xlr8':
        // Supersonic claw flurry (3 rapid slashes!)
        spawnFloatingText(p.x + dir * 50, p.y - 140, '💨 SUPERSONIC CLAWS x3!', '#38bdf8');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 45, 12);
        spawnParticles(p.x + dir * 65, p.y - 90, '#38bdf8', 18, 'spark');
        break;

      case 'humungousaur':
        // Giant dinosaur earth-shattering punch!
        shakeRef.current = 18;
        spawnFloatingText(p.x + dir * 50, p.y - 160, '🦖 TITAN PUNCH!', '#f59e0b');
        checkAttackHits({ x1, x2, y1: p.y - 190, y2: p.y + 10 }, 75, 24);
        spawnParticles(p.x + dir * 80, p.y - 80, '#92400e', 22, 'spark');
        break;

      case 'bigchill':
        // Frostbite punch chills targets!
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'ice_beam',
          x: p.x + dir * 65,
          y: p.y - 95,
          vx: dir * 15,
          vy: 0,
          radius: 20,
          damage: 38,
          life: 0,
          maxLife: 25,
          color: '#93c5fd',
          glowColor: '#38bdf8',
        });
        spawnFloatingText(p.x + dir * 50, p.y - 140, '❄️ FROSTBITE!', '#60a5fa');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 38, 10);
        break;

      case 'upgrade':
        // Nanite electric punch!
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'electricity',
          x: p.x + dir * 65,
          y: p.y - 95,
          vx: dir * 16,
          vy: 0,
          radius: 16,
          damage: 42,
          life: 0,
          maxLife: 25,
          color: '#4ade80',
          glowColor: '#22c55e',
        });
        spawnFloatingText(p.x + dir * 50, p.y - 140, '⚡ NANITE SHOCK!', '#4ade80');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 40, 10);
        break;

      case 'swampfire':
        // Flame vine punch!
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🌿 FLAME VINE!', '#16a34a');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 44, 12);
        spawnParticles(p.x + dir * 65, p.y - 90, '#f97316', 15, 'flame');
        break;

      case 'rath':
        // Wrist blade slash!
        shakeRef.current = 10;
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🐯 WRIST BLADE FURY!', '#ea580c');
        checkAttackHits({ x1, x2, y1: p.y - 170, y2: p.y + 10 }, 58, 16);
        spawnParticles(p.x + dir * 65, p.y - 90, '#ea580c', 18, 'spark');
        break;

      case 'stinkfly':
        // Stinger spear jab
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🪲 STINGER JAB!', '#a3e635');
        checkAttackHits({ x1, x2, y1: p.y - 150, y2: p.y + 10 }, 42, 12);
        spawnParticles(p.x + dir * 65, p.y - 85, '#84cc16', 15, 'circle');
        break;

      case 'cannonbolt':
        // Heavy shell bash
        shakeRef.current = 12;
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🛡️ SHELL BASH!', '#eab308');
        checkAttackHits({ x1, x2, y1: p.y - 150, y2: p.y + 10 }, 55, 18);
        spawnParticles(p.x + dir * 70, p.y - 75, '#ca8a04', 18, 'spark');
        break;

      case 'ghostfreak':
        // Spectral claw strike
        spawnFloatingText(p.x + dir * 50, p.y - 140, '👻 SPECTRAL CLAW!', '#cbd5e1');
        checkAttackHits({ x1, x2, y1: p.y - 150, y2: p.y + 10 }, 46, 12);
        spawnParticles(p.x + dir * 65, p.y - 85, '#94a3b8', 16, 'spark');
        break;

      case 'feedback':
        // Conductive plug shock strike
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'laser',
          x: p.x + dir * 65,
          y: p.y - 95,
          vx: dir * 20,
          vy: 0,
          radius: 14,
          damage: 48,
          life: 0,
          maxLife: 25,
          color: '#22c55e',
          glowColor: '#4ade80',
        });
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🔌 PLUG SHOCK!', '#22c55e');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 45, 12);
        break;

      case 'alienx':
        // Reality Warp Cosmic Fist: warps space, mini black hole vortex!
        shakeRef.current = 14;
        sounds.playPunch();
        spawnFloatingText(p.x + dir * 60, p.y - 140, '🌌 REALITY WARP FIST!', '#a855f7');
        checkAttackHits({ x1, x2, y1: p.y - 170, y2: p.y + 10 }, 85, 20);
        spawnParticles(p.x + dir * 70, p.y - 85, '#a855f7', 22, 'star');
        spawnParticles(p.x + dir * 70, p.y - 85, '#ffffff', 14, 'spark');
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'black_hole',
          x: p.x + dir * 70,
          y: p.y - 90,
          vx: dir * 18,
          vy: 0,
          radius: 28,
          damage: 80,
          life: 0,
          maxLife: 35,
          color: '#a855f7',
          glowColor: '#3b82f6',
        });
        break;

      default:
        // Ben Tennyson hero jab
        spawnFloatingText(p.x + dir * 40, p.y - 140, '👊 HERO JAB!', '#ffffff');
        checkAttackHits({ x1, x2, y1: p.y - 160, y2: p.y + 10 }, 32, 10);
        spawnParticles(p.x + dir * 50, p.y - 80, '#ffffff', 12, 'spark');
        break;
    }
  }, [checkAttackHits, spawnFloatingText, spawnParticles]);

  // KICK ACTION
  const triggerKick = useCallback(() => {
    const p = playerStateRef.current;
    if (p.action === 'transforming') return;

    sounds.playKick();
    p.action = 'kick';
    p.actionTimer = 18;

    const dir = p.facing === 'right' ? 1 : -1;
    const reach = 140;
    const x1 = dir === 1 ? p.x : p.x - reach;
    const x2 = dir === 1 ? p.x + reach : p.x;

    spawnFloatingText(p.x + dir * 50, p.y - 130, '🦵 MARTIAL KICK!', '#38bdf8');
    checkAttackHits({ x1, x2, y1: p.y - 130, y2: p.y + 20 }, 40, 16);
    spawnParticles(p.x + dir * 60, p.y - 45, '#38bdf8', 14, 'spark');
  }, [checkAttackHits, spawnFloatingText, spawnParticles]);

  // JUMP / FLIGHT ACTION
  const triggerJump = useCallback(() => {
    const p = playerStateRef.current;
    const currentAlien = p.characterId === 'ben' ? BEN_CHARACTER : ALIENS_DATABASE[p.characterId];

    if (currentAlien.canFly) {
      p.vy = -10.5;
      p.isGrounded = false;
      p.action = 'jump';
      sounds.playSpecial(p.characterId);
      return;
    }

    if (p.isGrounded) {
      const jumpPower = p.characterId === 'greymatter' ? -17 : -15;
      p.vy = jumpPower;
      p.isGrounded = false;
      p.action = 'jump';
    }
  }, []);

  // SPECIAL ACTION
  const triggerSpecial = useCallback(() => {
    const p = playerStateRef.current;
    if (p.specialCooldownTimer > 0 || p.action === 'transforming') return;

    const currentAlien = p.characterId === 'ben' ? BEN_CHARACTER : ALIENS_DATABASE[p.characterId];
    sounds.playSpecial(p.characterId);

    p.action = 'special';
    p.actionTimer = 30;
    p.specialCooldownTimer = currentAlien.specialCooldown;
    p.score += 150;

    const dir = p.facing === 'right' ? 1 : -1;

    switch (p.characterId) {
      case 'heatblast':
        // Inferno Volley
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'player',
              type: 'fireball',
              x: p.x + dir * 65,
              y: p.y - 95 + (i - 1) * 16,
              vx: dir * 19,
              vy: (i - 1) * 1.5,
              radius: 20,
              damage: 55,
              life: 0,
              maxLife: 60,
              color: '#f97316',
              glowColor: '#ea580c',
            });
            spawnParticles(p.x + dir * 65, p.y - 95, '#facc15', 10, 'flame');
          }, i * 90);
        }
        spawnFloatingText(p.x + dir * 60, p.y - 150, '🔥 INFERNO VOLLEY!', '#f97316');
        break;

      case 'fourarms':
        // Sonic Shockwave Clap
        shakeRef.current = 20;
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'sonic',
          x: p.x + dir * 75,
          y: p.y - 85,
          vx: dir * 15,
          vy: 0,
          radius: 55,
          damage: 85,
          life: 0,
          maxLife: 45,
          color: '#f8fafc',
          glowColor: '#38bdf8',
        });
        spawnParticles(p.x + dir * 75, p.y - 20, '#ffffff', 28, 'spark');
        spawnFloatingText(p.x + dir * 60, p.y - 160, '💥 SONIC CLAP!', '#ffffff');
        break;

      case 'xlr8':
        // Blinding Hyperspeed Dash!
        shakeRef.current = 10;
        p.vx = dir * 42;
        checkAttackHits(
          {
            x1: Math.min(p.x, p.x + dir * 450),
            x2: Math.max(p.x, p.x + dir * 450),
            y1: p.y - 140,
            y2: p.y,
          },
          60,
          20
        );
        spawnParticles(p.x, p.y - 60, '#38bdf8', 35, 'spark');
        spawnFloatingText(p.x + dir * 80, p.y - 150, '💨 SUPERSONIC BLITZ!', '#38bdf8');
        break;

      case 'diamondhead':
        // Crystal Shield & Spikes
        setShieldActive(true);
        setTimeout(() => setShieldActive(false), 2600);

        for (let s = 1; s <= 6; s++) {
          crystalSpikesRef.current.push({
            x: p.x + dir * (s * 60),
            y: p.y,
            height: 80 + s * 14,
            maxHeight: 80 + s * 14,
            width: 34,
            life: 0,
            alpha: 1,
            damageDealt: false,
          });
        }

        for (let k = 0; k < 5; k++) {
          projectilesRef.current.push({
            id: Math.random().toString(),
            owner: 'player',
            type: 'crystal_shard',
            x: p.x + dir * 60,
            y: p.y - 105 + k * 12,
            vx: dir * 22,
            vy: (k - 2) * 2.5,
            radius: 14,
            damage: 38,
            life: 0,
            maxLife: 55,
            color: '#6ee7b7',
            glowColor: '#10b981',
          });
        }
        shakeRef.current = 10;
        spawnFloatingText(p.x + dir * 60, p.y - 150, '💎 CRYSTAL SPIKES & SHIELD!', '#10b981');
        break;

      case 'bigchill':
        // Cryo-Freeze Ice Beam
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'ice_beam',
          x: p.x + dir * 65,
          y: p.y - 95,
          vx: dir * 18,
          vy: 0,
          radius: 34,
          damage: 50,
          life: 0,
          maxLife: 50,
          color: '#93c5fd',
          glowColor: '#38bdf8',
        });
        spawnParticles(p.x + dir * 65, p.y - 95, '#bae6fd', 20, 'ice');
        spawnFloatingText(p.x + dir * 60, p.y - 150, '❄️ CRYO FREEZE BEAM!', '#38bdf8');
        break;

      case 'humungousaur':
        // Colossal Titan Stomp
        shakeRef.current = 26;
        spawnParticles(p.x, p.y, '#78350f', 40, 'spark');
        checkAttackHits({ x1: p.x - 280, x2: p.x + 280, y1: p.y - 180, y2: p.y + 10 }, 90, 24);
        spawnFloatingText(p.x, p.y - 170, '🦖 TITAN EARTHQUAKE!', '#f59e0b');
        break;

      case 'stinkfly':
        // Slime Stream
        for (let s = 0; s < 3; s++) {
          setTimeout(() => {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'player',
              type: 'slime',
              x: p.x + dir * 60,
              y: p.y - 100 + s * 12,
              vx: dir * 18,
              vy: (s - 1) * 2,
              radius: 18,
              damage: 44,
              life: 0,
              maxLife: 60,
              color: '#84cc16',
              glowColor: '#65a30d',
            });
            spawnParticles(p.x + dir * 60, p.y - 100, '#a3e635', 10, 'circle');
          }, s * 100);
        }
        spawnFloatingText(p.x + dir * 60, p.y - 150, '🪲 ACID SLIME STREAM!', '#84cc16');
        break;

      case 'cannonbolt':
        // Wrecking Ball Charge
        shakeRef.current = 16;
        p.vx = dir * 36;
        checkAttackHits(
          {
            x1: Math.min(p.x, p.x + dir * 350),
            x2: Math.max(p.x, p.x + dir * 350),
            y1: p.y - 110,
            y2: p.y,
          },
          75,
          18
        );
        spawnFloatingText(p.x + dir * 60, p.y - 140, '🛡️ WRECKING BALL!', '#eab308');
        break;

      case 'upgrade':
        // Optic Plasma Laser Beam
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'laser',
          x: p.x + dir * 55,
          y: p.y - 115,
          vx: dir * 28,
          vy: 0,
          radius: 22,
          damage: 65,
          life: 0,
          maxLife: 50,
          color: '#22c55e',
          glowColor: '#4ade80',
        });
        spawnFloatingText(p.x + dir * 60, p.y - 150, '⚡ OPTIC PLASMA BEAM!', '#22c55e');
        break;

      case 'wildmutt':
        // Savage Pounce
        p.vx = dir * 25;
        p.vy = -11;
        checkAttackHits({ x1: p.x, x2: p.x + dir * 200, y1: p.y - 130, y2: p.y }, 55, 14);
        spawnFloatingText(p.x + dir * 50, p.y - 140, '🐾 SAVAGE POUNCE!', '#ea580c');
        break;

      case 'greymatter':
        // Neural Disabler Zap
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'electricity',
          x: p.x + dir * 45,
          y: p.y - 55,
          vx: dir * 20,
          vy: 0,
          radius: 18,
          damage: 58,
          life: 0,
          maxLife: 45,
          color: '#4ade80',
          glowColor: '#22c55e',
        });
        spawnFloatingText(p.x + dir * 40, p.y - 100, '🧠 NEURAL ZAP!', '#4ade80');
        break;

      case 'swampfire':
        // Methane Fire Jet & Healing
        p.hp = Math.min(p.maxHp, p.hp + 35);
        spawnFloatingText(p.x, p.y - 150, '+35 REGEN!', '#4ade80');
        for (let f = 0; f < 3; f++) {
          projectilesRef.current.push({
            id: Math.random().toString(),
            owner: 'player',
            type: 'fireball',
            x: p.x + dir * 60,
            y: p.y - 95 + f * 10,
            vx: dir * 18,
            vy: (f - 1) * 2,
            radius: 18,
            damage: 48,
            life: 0,
            maxLife: 55,
            color: '#16a34a',
            glowColor: '#ef4444',
          });
        }
        spawnFloatingText(p.x + dir * 60, p.y - 140, '🌿 METHANE FIRE!', '#15803d');
        break;

      case 'ghostfreak':
        // Ectoplasmic Phasing & Tentacle Barrage
        p.action = 'special';
        spawnParticles(p.x, p.y - 75, '#cbd5e1', 25, 'spark');
        for (let t = 0; t < 4; t++) {
          setTimeout(() => {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'player',
              type: 'electricity',
              x: p.x + dir * 60,
              y: p.y - 95 + (t - 1.5) * 16,
              vx: dir * 20,
              vy: (t - 1.5) * 1.8,
              radius: 18,
              damage: 54,
              life: 0,
              maxLife: 45,
              color: '#94a3b8',
              glowColor: '#475569',
            });
            spawnParticles(p.x + dir * 60, p.y - 95, '#cbd5e1', 12, 'spark');
          }, t * 80);
        }
        spawnFloatingText(p.x + dir * 60, p.y - 140, '👻 SPECTRAL TENTACLES!', '#cbd5e1');
        break;

      case 'rath':
        // Wrist Blade Slam & Roar
        shakeRef.current = 18;
        p.vx = dir * 30;
        p.vy = -6;
        checkAttackHits({ x1: p.x, x2: p.x + dir * 320, y1: p.y - 160, y2: p.y + 10 }, 82, 22);
        spawnParticles(p.x + dir * 80, p.y - 80, '#ea580c', 28, 'spark');
        spawnFloatingText(p.x + dir * 60, p.y - 150, '🐯 WRIST BLADE SLAM!', '#ea580c');
        break;

      case 'feedback':
        // Overcharge Lightning Arc
        shakeRef.current = 14;
        for (let arc = 0; arc < 4; arc++) {
          setTimeout(() => {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'player',
              type: 'laser',
              x: p.x + dir * 60,
              y: p.y - 95 + (arc - 1.5) * 14,
              vx: dir * 26,
              vy: (arc - 1.5) * 2,
              radius: 20,
              damage: 64,
              life: 0,
              maxLife: 50,
              color: '#22c55e',
              glowColor: '#4ade80',
            });
            spawnParticles(p.x + dir * 60, p.y - 95, '#22c55e', 14, 'spark');
          }, arc * 75);
        }
        spawnFloatingText(p.x + dir * 60, p.y - 150, '🔌 OVERCHARGE LIGHTNING!', '#22c55e');
        break;

      case 'alienx':
        // Ultimate Power: Cosmic Supernova Reality Warp
        sounds.playCosmicWarp();
        shakeRef.current = 28;
        // Freezes all active enemies in spacetime!
        enemiesRef.current.forEach((en) => {
          if (en.hp > 0 && Math.abs(p.x - en.x) < 700) {
            en.frozenTimer = 3500;
          }
        });
        // Massive catastrophic damage to all enemies on screen
        checkAttackHits({ x1: p.x - 650, x2: p.x + 650, y1: p.y - 250, y2: p.y + 30 }, 280, 25);
        // Launch 4 cosmic black hole / supernova waves radiating in all directions
        for (let s = -2; s <= 2; s++) {
          if (s === 0) continue;
          projectilesRef.current.push({
            id: Math.random().toString(),
            owner: 'player',
            type: 'cosmic_blast',
            x: p.x,
            y: p.y - 90,
            vx: s * 14,
            vy: (Math.random() - 0.5) * 4,
            radius: 36,
            damage: 150,
            life: 0,
            maxLife: 50,
            color: '#ffffff',
            glowColor: '#a855f7',
          });
        }
        // 45 cosmic star particles bursting
        for (let st = 0; st < 45; st++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 4 + Math.random() * 12;
          particlesRef.current.push({
            x: p.x,
            y: p.y - 80,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 4 + Math.random() * 6,
            color: Math.random() > 0.5 ? '#a855f7' : Math.random() > 0.5 ? '#38bdf8' : '#ffffff',
            alpha: 1,
            life: 0,
            maxLife: 45,
            shape: 'star',
          });
        }
        spawnFloatingText(p.x, p.y - 170, '🌌 CELESTIAL SUPERNOVA WARP!', '#a855f7');
        break;

      default:
        // Ben Tennyson: Omnitrix Sonic Burst
        shakeRef.current = 12;
        projectilesRef.current.push({
          id: Math.random().toString(),
          owner: 'player',
          type: 'sonic',
          x: p.x + dir * 55,
          y: p.y - 80,
          vx: dir * 16,
          vy: 0,
          radius: 35,
          damage: 45,
          life: 0,
          maxLife: 35,
          color: '#4ade80',
          glowColor: '#22c55e',
        });
        spawnParticles(p.x, p.y - 70, '#4ade80', 20, 'spark');
        spawnFloatingText(p.x + dir * 50, p.y - 140, '⌚ OMNITRIX BURST!', '#4ade80');
        checkAttackHits({ x1: p.x - 70, x2: p.x + dir * 140, y1: p.y - 140, y2: p.y + 10 }, 40, 14);
        break;
    }
  }, [checkAttackHits, spawnParticles, spawnFloatingText]);

  // Bind triggers to window for HUD buttons
  useEffect(() => {
    (window as unknown as { triggerPunch?: () => void }).triggerPunch = triggerPunch;
    (window as unknown as { triggerKick?: () => void }).triggerKick = triggerKick;
    (window as unknown as { triggerJump?: () => void }).triggerJump = triggerJump;
    (window as unknown as { triggerSpecial?: () => void }).triggerSpecial = triggerSpecial;
  }, [triggerPunch, triggerKick, triggerJump, triggerSpecial]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = true;
      else if (key === 'arrowright' || key === 'd') keysRef.current.right = true;
      else if (key === 'arrowup' || key === 'w' || key === ' ') triggerJump();
      else if (key === 'j' || key === '1') triggerPunch();
      else if (key === 'k' || key === '2') triggerKick();
      else if (key === 'l' || key === '3') triggerSpecial();
      else if (key === 'o' || key === 'tab') {
        e.preventDefault();
        onOpenOmnitrix();
      } else if (key === 'q') onDeTransform();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') keysRef.current.left = false;
      else if (key === 'arrowright' || key === 'd') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump, triggerPunch, triggerKick, triggerSpecial, onOpenOmnitrix, onDeTransform]);

  // MAIN 60 FPS GAME LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let syncCounter = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const gameLoop = (now: number) => {
      animId = requestAnimationFrame(gameLoop);
      if (isPaused) return;

      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      const viewWidth = canvas.width;
      const viewHeight = canvas.height;
      const groundY = viewHeight - 110;

      const p = playerStateRef.current;
      const b = bossRef.current;
      const currentAlien = p.characterId === 'ben' ? BEN_CHARACTER : ALIENS_DATABASE[p.characterId];

      // 1. JOYSTICK & KEYBOARD MOVEMENT
      const joy = joystickRef.current;
      const baseMoveSpeed = 7.0 * currentAlien.speedModifier; // XLR8 speedModifier is 2.6 (18.2px/frame!)

      if (joy.active && (Math.abs(joy.x) > 0.06 || Math.abs(joy.y) > 0.06)) {
        p.vx = joy.x * baseMoveSpeed;
        if (Math.abs(joy.x) > 0.08) {
          p.facing = joy.x > 0 ? 'right' : 'left';
        }
        if (p.action === 'idle' || p.action === 'walk') {
          p.action = Math.abs(joy.x) > 0.5 ? 'run' : 'walk';
        }
      } else if (keysRef.current.left) {
        p.vx = -baseMoveSpeed;
        p.facing = 'left';
        p.action = 'run';
      } else if (keysRef.current.right) {
        p.vx = baseMoveSpeed;
        p.facing = 'right';
        p.action = 'run';
      } else {
        p.vx *= 0.75;
        if (Math.abs(p.vx) < 0.1) p.vx = 0;
        if ((p.action === 'walk' || p.action === 'run') && p.isGrounded) {
          p.action = 'idle';
        }
      }

      // Flying control with Joystick (Big Chill / Stinkfly)
      if (currentAlien.canFly && joy.active && joy.y < -0.25) {
        p.vy = joy.y * 7;
        p.isGrounded = false;
        p.action = 'jump';
      } else {
        p.vy += 0.85; // Gravity
      }

      p.x += p.vx;
      p.y += p.vy;

      // XLR8 supersonic motion afterimages
      if (p.characterId === 'xlr8' && (p.action === 'run' || p.action === 'special' || Math.abs(p.vx) > 10)) {
        if (Math.random() > 0.4) {
          xlr8AfterimagesRef.current.push({
            x: p.x,
            y: p.y,
            alpha: 0.6,
            facing: p.facing,
          });
        }
      }

      // Unlimited running: No artificial walls or boundary locks!
      // Ben and aliens can run and walk infinitely in both directions!

      // Ground collision
      if (p.y >= groundY) {
        p.y = groundY;
        p.vy = 0;
        if (!p.isGrounded && p.action === 'jump') {
          p.action = 'land';
          p.actionTimer = 6;
        }
        p.isGrounded = true;
      } else if (p.vy > 3 && p.action !== 'punch' && p.action !== 'kick' && p.action !== 'special') {
        p.action = 'fall';
      }

      // Smooth Camera tracking (centers player smoothly in landscape view)
      const targetCamX = p.x - viewWidth * 0.38;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.12;

      // Timers & regeneration
      p.animFrame++;
      if (p.actionTimer > 0) {
        p.actionTimer--;
        if (p.actionTimer === 0 && p.action !== 'transforming') {
          p.action = 'idle';
        }
      }
      if (p.specialCooldownTimer > 0) {
        p.specialCooldownTimer = Math.max(0, p.specialCooldownTimer - dt);
      }
      if (p.comboResetTimer > 0) {
        p.comboResetTimer--;
        if (p.comboResetTimer === 0) p.comboCount = 0;
      }
      if (p.transformationTimer > 0) {
        p.transformationTimer -= dt;
      }

      // Swampfire health regen
      if (p.characterId === 'swampfire') {
        p.hp = Math.min(p.maxHp, p.hp + (dt / 1000) * 2.5);
      }

      // Omnitrix Energy drain while transformed
      if (p.isTransformed) {
        p.omnitrixEnergy = Math.max(0, p.omnitrixEnergy - (dt / 1000) * 1.5);
        if (p.omnitrixEnergy <= 0) {
          onDeTransform();
        }
      } else {
        p.omnitrixEnergy = Math.min(100, p.omnitrixEnergy + (dt / 1000) * 3.5);
      }

      // Periodically sync HUD stats to React state (every 6 frames)
      syncCounter++;
      if (syncCounter >= 6) {
        syncCounter = 0;
        setPlayer((prev) => ({
          ...prev,
          hp: p.hp,
          omnitrixEnergy: p.omnitrixEnergy,
          comboCount: p.comboCount,
          score: p.score,
          coins: p.coins || 0,
          specialCooldownTimer: p.specialCooldownTimer,
        }));
      }

      // 2. CONTINUOUS INFINITE ENEMY SPAWNER & MINIONS AI
      enemySpawnTimerRef.current += dt;
      const livingEnemies = enemiesRef.current.filter((e) => e.hp > 0);

      // Continuously spawn fresh enemies straight toward the player
      if (livingEnemies.length < 5 || enemySpawnTimerRef.current > 3000) {
        enemySpawnTimerRef.current = 0;
        if (livingEnemies.length < 9) {
          const spawnSide = Math.random() > 0.5 ? 1 : -1;
          const spawnX = p.x + spawnSide * (480 + Math.random() * 260);
          const types: Enemy['type'][] = ['robot', 'vilgax', 'kevin', 'monster', 'drone'];
          const chosenType = types[Math.floor(Math.random() * types.length)];
          const id = `en_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

          let name = 'BATTLE ROBOT';
          let hp = 320;
          let width = 58;
          let height = 95;
          let scoreVal = 400;

          if (chosenType === 'robot') {
            name = 'ASSAULT BATTLE ROBOT';
            hp = 340;
            width = 58;
            height = 95;
            scoreVal = 450;
          } else if (chosenType === 'vilgax') {
            name = 'WARLORD VILGAX';
            hp = 680;
            width = 75;
            height = 120;
            scoreVal = 1000;
          } else if (chosenType === 'kevin') {
            name = 'KEVIN 11 MUTANT';
            hp = 500;
            width = 68;
            height = 105;
            scoreVal = 750;
          } else if (chosenType === 'monster') {
            name = 'ALIEN MUTANT BEAST';
            hp = 400;
            width = 65;
            height = 95;
            scoreVal = 550;
          } else {
            name = 'CYBER RECON DRONE';
            hp = 250;
            width = 50;
            height = 50;
            scoreVal = 350;
          }

          enemiesRef.current.push({
            id,
            name,
            type: chosenType,
            x: spawnX,
            y: chosenType === 'drone' ? groundY - 70 : groundY,
            vx: 0,
            vy: 0,
            width,
            height,
            hp,
            maxHp: hp,
            phase: 1,
            maxPhases: 1,
            attackTimer: Math.random() * 1000,
            currentAttack: 'idle',
            laserAngle: 0,
            telegraphTimer: 0,
            facing: spawnSide === 1 ? 'left' : 'right',
            animTimer: 0,
            scoreValue: scoreVal,
          });
        }
      }

      // Update and move all enemies straight forward towards the player
      enemiesRef.current.forEach((en) => {
        if (en.hp <= 0) return;
        en.animTimer++;

        if (en.frozenTimer && en.frozenTimer > 0) {
          en.frozenTimer -= dt;
          return;
        }

        const distToPlayer = p.x - en.x;
        en.facing = distToPlayer > 0 ? 'right' : 'left';

        // Approach player straight forward ("enimies nera varannum")
        const speed = en.type === 'monster' ? 3.1 : en.type === 'robot' ? 2.4 : en.type === 'kevin' ? 2.7 : 2.5;
        if (Math.abs(distToPlayer) > 75) {
          en.vx = Math.sign(distToPlayer) * speed;
        } else {
          en.vx = 0; // In melee combat range, easy to attack and combo!
        }
        en.x += en.vx;

        // Enemy attacks
        en.attackTimer += dt;
        if (en.attackTimer > 2300 && Math.abs(distToPlayer) < 480) {
          en.attackTimer = 0;
          if (en.type === 'robot' || en.type === 'drone') {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'enemy',
              type: 'laser',
              x: en.x,
              y: en.y - en.height / 2,
              vx: distToPlayer > 0 ? 12 : -12,
              vy: 0,
              radius: 8,
              damage: 15,
              life: 0,
              maxLife: 70,
              color: '#ef4444',
              glowColor: '#dc2626',
            });
          } else if (en.type === 'vilgax') {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'enemy',
              type: 'laser',
              x: en.x,
              y: en.y - en.height / 2,
              vx: distToPlayer > 0 ? 14 : -14,
              vy: 0,
              radius: 12,
              damage: 22,
              life: 0,
              maxLife: 60,
              color: '#dc2626',
              glowColor: '#ef4444',
            });
          } else if (en.type === 'kevin') {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'enemy',
              type: 'crystal_shard',
              x: en.x,
              y: en.y - en.height / 2,
              vx: distToPlayer > 0 ? 13 : -13,
              vy: 0,
              radius: 12,
              damage: 18,
              life: 0,
              maxLife: 55,
              color: '#78716c',
              glowColor: '#a855f7',
            });
          } else if (en.type === 'monster') {
            projectilesRef.current.push({
              id: Math.random().toString(),
              owner: 'enemy',
              type: 'slime',
              x: en.x,
              y: en.y - en.height / 2,
              vx: distToPlayer > 0 ? 11 : -11,
              vy: 0,
              radius: 10,
              damage: 16,
              life: 0,
              maxLife: 60,
              color: '#a855f7',
              glowColor: '#9333ea',
            });
          }
        }
      });

      // 3. UPDATE BOSS AI (Vilgax Mech Drone)
      if (b && b.hp > 0) {
        b.animTimer++;
        b.attackTimer += dt;

        if (b.hp <= b.maxHp * 0.33) b.phase = 3;
        else if (b.hp <= b.maxHp * 0.66) b.phase = 2;
        else b.phase = 1;

        if (b.attackTimer > 4000 && b.currentAttack === 'idle') {
          b.currentAttack = 'telegraph_laser';
          b.telegraphTimer = 1800;
          sounds.playOmnitrixBeep();
        }

        if (b.currentAttack === 'telegraph_laser') {
          b.telegraphTimer -= dt;
          if (b.telegraphTimer <= 0) {
            b.currentAttack = 'firing_laser';
            sounds.playLaserSweep();
            shakeRef.current = 18;
            setTimeout(() => {
              if (bossRef.current) {
                bossRef.current.currentAttack = 'idle';
                bossRef.current.attackTimer = 0;
              }
            }, 1400);
          }
        }

        if (b.currentAttack === 'firing_laser') {
          const startX = b.x - 70;
          const targetX = b.x - 550;
          if (p.x > targetX && p.x < startX) {
            if (shieldActiveRef.current) {
              spawnParticles(p.x, p.y - 60, '#6ee7b7', 8, 'crystal');
            } else {
              p.hp = Math.max(0, p.hp - 1.2);
              spawnParticles(p.x, p.y - 60, '#ef4444', 3, 'spark');
            }
          }
        }
      }

      // 4. UPDATE PROJECTILES
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const pr = projectilesRef.current[i];
        pr.x += pr.vx;
        pr.y += pr.vy;
        pr.life++;

        if (pr.owner === 'player') {
          // Hit Minions
          enemiesRef.current.forEach((en) => {
            if (en.hp <= 0) return;
            if (Math.hypot(pr.x - en.x, pr.y - (en.y - en.height / 2)) < pr.radius + 35) {
              en.hp = Math.max(0, en.hp - pr.damage);
              sounds.playBossHurt();
              spawnParticles(pr.x, pr.y, pr.color, 14, 'spark');
              spawnFloatingText(en.x, en.y - en.height - 10, `-${pr.damage}`, '#facc15');

              if (pr.type === 'ice_beam') {
                en.frozenTimer = 3500;
                spawnFloatingText(en.x, en.y - en.height - 25, 'FROZEN!', '#38bdf8');
              }

              if (en.hp <= 0) {
                spawnParticles(en.x, en.y - en.height / 2, '#ef4444', 30, 'spark');
                p.score += en.scoreValue;
                p.coins = (p.coins || 0) + 100;
                sounds.playCoinSound();
                spawnFloatingText(en.x, en.y - en.height - 20, `DEFEATED! +${en.scoreValue}`, '#4ade80');
                spawnFloatingText(en.x, en.y - en.height - 40, '+100 COINS 🪙', '#facc15');

                for (let c = 0; c < 10; c++) {
                  particlesRef.current.push({
                    x: en.x + (Math.random() - 0.5) * 24,
                    y: en.y - en.height / 2,
                    vx: (Math.random() - 0.5) * 6,
                    vy: -4 - Math.random() * 4,
                    size: 7,
                    color: '#facc15',
                    alpha: 1,
                    life: 0,
                    maxLife: 35,
                    shape: 'coin',
                  });
                }
              }

              pr.life = pr.maxLife;
            }
          });

          // Hit Boss
          if (b && b.hp > 0) {
            if (Math.hypot(pr.x - b.x, pr.y - (b.y - 120)) < pr.radius + 70) {
              b.hp = Math.max(0, b.hp - pr.damage);
              sounds.playBossHurt();
              shakeRef.current = 8;
              spawnParticles(pr.x, pr.y, pr.color, 16, 'spark');
              spawnFloatingText(b.x - 30, b.y - 160, `-${pr.damage}`, '#f87171');
              p.score += 300;
              pr.life = pr.maxLife;
            }
          }
        } else {
          // Enemy projectile hitting player
          if (Math.hypot(pr.x - p.x, pr.y - (p.y - 70)) < pr.radius + 35) {
            if (!shieldActiveRef.current) {
              p.hp = Math.max(0, p.hp - pr.damage);
              sounds.playPunch();
              shakeRef.current = 8;
              spawnParticles(p.x, p.y - 60, '#ef4444', 12, 'spark');
            }
            pr.life = pr.maxLife;
          }
        }

        if (pr.life >= pr.maxLife) {
          projectilesRef.current.splice(i, 1);
        }
      }

      // 5. UPDATE PARTICLES, SPIKES, FLOATING TEXTS & AFTERIMAGES
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;
        if (pt.life >= pt.maxLife) particlesRef.current.splice(i, 1);
      }

      for (let i = crystalSpikesRef.current.length - 1; i >= 0; i--) {
        const sp = crystalSpikesRef.current[i];
        sp.life++;
        if (!sp.damageDealt) {
          checkAttackHits({ x1: sp.x - 25, x2: sp.x + 25, y1: sp.y - sp.height, y2: sp.y }, 45);
          sp.damageDealt = true;
        }
        if (sp.life > 90) {
          sp.alpha -= 0.03;
          if (sp.alpha <= 0) crystalSpikesRef.current.splice(i, 1);
        }
      }

      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.y -= 1.3;
        ft.life++;
        ft.alpha = 1 - ft.life / ft.maxLife;
        if (ft.life >= ft.maxLife) floatingTextsRef.current.splice(i, 1);
      }

      for (let i = xlr8AfterimagesRef.current.length - 1; i >= 0; i--) {
        const af = xlr8AfterimagesRef.current[i];
        af.alpha -= 0.05;
        if (af.alpha <= 0) xlr8AfterimagesRef.current.splice(i, 1);
      }

      // Screen shake decay
      if (shakeRef.current > 0) {
        shakeRef.current *= 0.88;
        if (shakeRef.current < 0.2) shakeRef.current = 0;
      }

      // ==========================================
      // RENDERING CANVAS (Full Edge-to-Edge Landscape)
      // ==========================================
      ctx.save();
      if (shakeRef.current > 0) {
        ctx.translate((Math.random() - 0.5) * shakeRef.current, (Math.random() - 0.5) * shakeRef.current);
      }

      // 1. Draw 2D Town Environment (Mr Smoothie, Rust Bucket, Stores, Parallax)
      drawTownEnvironment(ctx, viewWidth, viewHeight, groundY, cameraXRef.current, destructiblesRef.current);

      // World Camera Translation for dynamic objects
      ctx.save();
      ctx.translate(-cameraXRef.current, 0);

      // 2. Draw Ground Crystal Spikes
      drawCrystalSpikes(ctx, crystalSpikesRef.current);

      // 3. Draw XLR8 Speed Ghost Afterimages
      xlr8AfterimagesRef.current.forEach((af) => {
        ctx.save();
        ctx.globalAlpha = af.alpha * 0.45;
        drawCharacter({
          ctx,
          x: af.x,
          y: af.y,
          characterId: 'xlr8',
          action: 'run',
          facing: af.facing,
          animFrame: p.animFrame,
          isTransformed: true,
        });
        ctx.restore();
      });

      // 4. Draw Minion Enemies
      enemiesRef.current.forEach((en) => {
        if (en.hp > 0) {
          drawEnemy(ctx, en);
        }
      });

      // 5. Draw Boss Mech Drone
      if (b && b.hp > 0) {
        drawEnemy(ctx, b);

        if (b.currentAttack === 'telegraph_laser') {
          drawTelegraphWarning(ctx, b.x - 70, b.y - 70, b.x - 550, groundY, now * 0.003);
        }
        if (b.currentAttack === 'firing_laser') {
          drawLaserSweep(ctx, b.x - 70, b.y - 70, b.x - 580, groundY, 1.0, now * 0.005);
        }
      }

      // 6. Draw Projectiles
      drawProjectiles(ctx, projectilesRef.current);

      // 7. Draw Particles
      drawParticles(ctx, particlesRef.current);

      // 8. Draw Diamondhead Crystal Shield Dome
      if (shieldActiveRef.current && p.characterId === 'diamondhead') {
        drawCrystalShield(ctx, p.x + (p.facing === 'right' ? 35 : -35), p.y - 75, 75, now * 0.002);
      }

      // 9. Draw Main Playable Character (Ben Tennyson or Active Alien!)
      drawCharacter({
        ctx,
        x: p.x,
        y: p.y,
        characterId: p.characterId,
        action: p.action,
        facing: p.facing,
        animFrame: p.animFrame,
        isTransformed: p.isTransformed,
        transformProgress: p.transformationTimer > 0 ? p.transformationTimer / 550 : 0,
      });

      // 10. Draw Floating Combat Text
      floatingTextsRef.current.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = '900 16px Bangers, Rajdhani, sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore(); // Restore world camera
      ctx.restore(); // Restore shake
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused, onDeTransform, setPlayer]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />
    </div>
  );
};
