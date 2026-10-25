import { Enemy } from '../types/game';

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  if (enemy.facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Scale enemies so they match large character sizing and are easily visible on mobile screens
  const scale = enemy.type === 'boss_mech' ? 1.5 : 1.7;
  ctx.scale(scale, scale);

  const time = enemy.animTimer * 0.1;
  const bobY = Math.sin(time * 3) * 4;

  if (enemy.type === 'boss_mech') {
    renderVilgaxMechBoss(ctx, enemy, bobY, time);
  } else if (enemy.type === 'vilgax') {
    renderVilgaxWarlord(ctx, enemy, bobY, time);
  } else if (enemy.type === 'kevin') {
    renderKevinLevin(ctx, enemy, bobY, time);
  } else if (enemy.type === 'robot') {
    renderRobotEnemy(ctx, enemy, bobY, time);
  } else if (enemy.type === 'monster') {
    renderAlienMonster(ctx, enemy, bobY, time);
  } else if (enemy.type === 'drone') {
    renderVilgaxDrone(ctx, enemy, bobY, time);
  } else if (enemy.type === 'sentinel') {
    renderVilgaxSentinel(ctx, enemy, bobY, time);
  } else {
    renderDNAlien(ctx, enemy, bobY, time);
  }

  // Frozen Ice Block Overlay (Big Chill freeze power!)
  if (enemy.frozenTimer && enemy.frozenTimer > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(147, 197, 253, 0.55)';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    const h = enemy.type === 'boss_mech' ? 210 : 80;
    const w = enemy.type === 'boss_mech' ? 140 : 55;
    ctx.fillRect(-w / 2, -h, w, h);
    ctx.strokeRect(-w / 2, -h, w, h);

    // Frost facets
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 10, -h + 15);
    ctx.lineTo(w / 2 - 10, -h + 45);
    ctx.moveTo(-w / 2 + 15, -h + 60);
    ctx.lineTo(w / 2 - 20, -15);
    ctx.stroke();
    ctx.restore();
  }

  // Enemy Health Bar above head
  ctx.restore(); // Restore facing flip and scale for text & bar
  drawEnemyHealthBar(ctx, enemy);
}

function renderVilgaxMechBoss(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  bobY: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  const isFiring = enemy.currentAttack === 'firing_laser';
  const isTelegraphing = enemy.currentAttack === 'telegraph_laser';

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 75, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // HEAVY MECH LEGS
  // Left leg
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-45, -70, 26, 68);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-52, -14, 38, 14);

  // Right leg
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(18, -70, 26, 68);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(12, -14, 38, 14);

  // Red glowing joints
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-32, -40, 6, 0, Math.PI * 2);
  ctx.arc(32, -40, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // MASSIVE ARMORED CHASSIS / TORSO
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-60, -170, 120, 105, 14);
  ctx.fill();

  // Heavy steel armor plating
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-48, -155, 96, 75);

  // Glowing red power core vents
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 14;
  ctx.fillRect(-28, -135, 14, 40);
  ctx.fillRect(14, -135, 14, 40);
  ctx.fillRect(-10, -148, 20, 10);
  ctx.shadowBlur = 0;

  // SHOULDER MISSILE PODS & CANNONS
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-75, -200, 32, 45);
  ctx.fillRect(-70, -212, 8, 14);
  ctx.fillRect(-58, -212, 8, 14);

  ctx.fillRect(43, -200, 32, 45);
  ctx.fillRect(48, -212, 8, 14);
  ctx.fillRect(60, -212, 8, 14);

  // ARMS WITH MASSIVE LASER CANNONS
  // Left Arm
  ctx.save();
  ctx.translate(-70, -145);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-14, 0, 28, 48);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-18, 48, 36, 40);
  ctx.fillStyle = isFiring || isTelegraphing ? '#f87171' : '#dc2626';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = isFiring ? 25 : 8;
  ctx.beginPath();
  ctx.arc(0, 88, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Arm
  ctx.save();
  ctx.translate(70, -145);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-14, 0, 28, 48);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-18, 48, 36, 40);
  ctx.fillStyle = isFiring || isTelegraphing ? '#f87171' : '#dc2626';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = isFiring ? 25 : 8;
  ctx.beginPath();
  ctx.arc(0, 88, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // VILGAX CYBORG HEAD & TENTACLES
  ctx.save();
  ctx.translate(0, -185);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, -10, 26, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 18;
  ctx.fillRect(-16, -14, 10, 6);
  ctx.fillRect(6, -14, 10, 6);
  ctx.shadowBlur = 0;

  // Green Vilgax Tentacles chin
  ctx.fillStyle = '#65a30d';
  const tentacleSway = Math.sin(time * 6) * 3;
  for (let i = -16; i <= 16; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i - 3, 2);
    ctx.quadraticCurveTo(i + tentacleSway, 22, i + 2, 38);
    ctx.quadraticCurveTo(i - 4, 20, i + 3, 2);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
  ctx.restore();
}

function renderVilgaxDrone(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  bobY: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 20);

  // Hover shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 25 - bobY, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Drone Sphere
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  // Red Eye
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Wings / Thrusters
  ctx.fillStyle = '#475569';
  ctx.fillRect(-28, -5, 14, 7);
  ctx.fillRect(14, -5, 14, 7);

  // Thruster fire
  ctx.fillStyle = '#f87171';
  ctx.fillRect(-24, 2, 5, 9 + Math.sin(time * 12) * 3);
  ctx.fillRect(19, 2, 5, 9 + Math.cos(time * 12) * 3);

  ctx.restore();
}

function renderVilgaxSentinel(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  bobY: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  // Heavy Ground Sentinel Walker
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-14, -36, 10, 36);
  ctx.fillRect(4, -36, 10, 36);

  // Armored Torso
  ctx.fillStyle = '#334155';
  ctx.fillRect(-20, -74, 40, 40);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -74, 40, 40);

  // Heavy Arm Cannon
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(15, -68, 22, 14);

  // Sensor Visor
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.fillRect(-12, -70, 24, 6);
  ctx.shadowBlur = 0;

  ctx.restore();
}

function renderDNAlien(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  bobY: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  // DNAlien (Grey-blue humanoid with Xenocyte parasite)
  ctx.fillStyle = '#475569';
  ctx.fillRect(-9, -34, 7, 34);
  ctx.fillRect(2, -34, 7, 34);

  ctx.fillStyle = '#334155';
  ctx.fillRect(-14, -68, 28, 36);

  // Arms with claws
  ctx.fillStyle = '#475569';
  ctx.fillRect(-20, -64, 7, 24);
  ctx.fillRect(13, -64, 7, 24);

  // Xenocyte head
  ctx.fillStyle = '#818cf8';
  ctx.beginPath();
  ctx.ellipse(0, -76, 16, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red eye
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-5, -79, 10, 5);

  ctx.restore();
}

/** 1. ROBOT ENEMY: Heavy mechanized combat droid */
function renderRobotEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, bobY: number, _time: number) {
  ctx.save();
  ctx.translate(0, bobY);

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Metal Mechanical Legs
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-18, -45, 14, 45);
  ctx.fillRect(4, -45, 14, 45);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-22, -8, 20, 8);
  ctx.fillRect(2, -8, 20, 8);

  // Torso / Chassis
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-24, -95, 48, 52, 6);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Power Core
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, -68, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Head with Red Optic Visor
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-15, -118, 30, 22);
  ctx.strokeStyle = '#0f172a';
  ctx.strokeRect(-15, -118, 30, 22);

  // Glowing Horizontal Red Scanner Line
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.fillRect(-12, -108, 24, 4.5);
  ctx.shadowBlur = 0;

  // Arms & Dual Laser Blaster
  ctx.fillStyle = '#475569';
  ctx.fillRect(-32, -92, 10, 38);
  ctx.fillRect(22, -92, 10, 38);

  // Laser cannon muzzle
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(18, -60, 22, 10);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(40, -58, 4, 6);

  ctx.restore();
}

/** 2. VILGAX WARLORD: Ben's iconic arch-nemesis (builgates) */
function renderVilgaxWarlord(ctx: CanvasRenderingContext2D, _enemy: Enemy, bobY: number, time: number) {
  ctx.save();
  ctx.translate(0, bobY);

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Massive Biomechanical Armor Legs
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-26, -65, 20, 65);
  ctx.fillRect(6, -65, 20, 65);
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(-30, -12, 26, 12);
  ctx.fillRect(4, -12, 26, 12);

  // Massive Torso / Ruby Biomechanical Armor
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.roundRect(-36, -135, 72, 72, 8);
  ctx.fill();
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Golden Skull Crest Shoulder Mantle
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(-45, -138);
  ctx.lineTo(-20, -145);
  ctx.lineTo(0, -138);
  ctx.lineTo(20, -145);
  ctx.lineTo(45, -138);
  ctx.lineTo(35, -118);
  ctx.lineTo(-35, -118);
  ctx.closePath();
  ctx.fill();

  // Green Tentacle Chimera Head
  ctx.fillStyle = '#16a34a'; // Chimera alien green skin
  ctx.beginPath();
  ctx.arc(0, -154, 22, 0, Math.PI * 2);
  ctx.fill();

  // Vilgax's signature green facial tentacles!
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 5;
  for (let t = -3; t <= 3; t++) {
    const sway = Math.sin(time * 3 + t) * 3;
    ctx.beginPath();
    ctx.moveTo(t * 5, -144);
    ctx.quadraticCurveTo(t * 7 + sway, -130, t * 5 + sway, -118);
    ctx.stroke();
  }

  // Piercing Crimson / Yellow Eyes
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-8, -158, 4, 0, Math.PI * 2);
  ctx.arc(8, -158, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-9, -159, 2, 2);
  ctx.fillRect(7, -159, 2, 2);
  ctx.shadowBlur = 0;

  // Ruby Energy Broadsword in Hand
  ctx.save();
  ctx.translate(34, -100);
  ctx.rotate(0.35 + Math.sin(time * 4) * 0.1);
  // Sword Hilt
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-4, 0, 8, 16);
  // Ruby Laser Blade
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(7, 0);
  ctx.lineTo(4, -85);
  ctx.lineTo(0, -96);
  ctx.lineTo(-4, -85);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/** 3. KEVIN LEVIN / KEVIN 11: Mutant absorption brute (Metal + Stone + Crystal) */
function renderKevinLevin(ctx: CanvasRenderingContext2D, _enemy: Enemy, bobY: number, _time: number) {
  ctx.save();
  ctx.translate(0, bobY);

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 38, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left Leg: Absorbed Metal (Silver steel)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-20, -55, 16, 55);
  // Right Leg: Absorbed Stone (Granite brown)
  ctx.fillStyle = '#78716c';
  ctx.fillRect(4, -55, 17, 55);

  // Mutant Torso (Half steel metal, half solid rock)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-28, -115, 28, 62);
  ctx.fillStyle = '#78716c';
  ctx.fillRect(0, -115, 28, 62);
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 2;
  ctx.strokeRect(-28, -115, 56, 62);

  // Taydenite Crystal Spikes on Back
  ctx.fillStyle = '#67e8f9';
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  for (let s = 1; s <= 3; s++) {
    ctx.beginPath();
    ctx.moveTo(-18 + s * 10, -115);
    ctx.lineTo(-14 + s * 10, -140);
    ctx.lineTo(-10 + s * 10, -115);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Left Arm: Steel Razor Blade Hand
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-38, -110, 12, 42);
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(-38, -68);
  ctx.lineTo(-26, -68);
  ctx.lineTo(-32, -98);
  ctx.closePath();
  ctx.fill();

  // Right Arm: Massive Boulder Fist (Crushing Stone Punch)
  ctx.fillStyle = '#57534e';
  ctx.fillRect(26, -110, 16, 44);
  ctx.beginPath();
  ctx.arc(34, -62, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#292524';
  ctx.stroke();

  // Head: Kevin's human face turning mutant
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.roundRect(-13, -138, 26, 24, 4);
  ctx.fill();

  // Black disheveled hair
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-16, -136);
  ctx.lineTo(-18, -150);
  ctx.lineTo(-6, -145);
  ctx.lineTo(0, -152);
  ctx.lineTo(8, -144);
  ctx.lineTo(18, -148);
  ctx.lineTo(15, -135);
  ctx.closePath();
  ctx.fill();

  // Glowing eyes
  ctx.fillStyle = '#a855f7';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 8;
  ctx.fillRect(-8, -132, 4, 3);
  ctx.fillRect(4, -132, 4, 3);
  ctx.shadowBlur = 0;

  ctx.restore();
}

/** 4. ALIEN MONSTER: Savage DNAlien Mutant Beast */
function renderAlienMonster(ctx: CanvasRenderingContext2D, _enemy: Enemy, bobY: number, _time: number) {
  ctx.save();
  ctx.translate(0, bobY);

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 42, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beast Claws & Legs
  ctx.fillStyle = '#312e81';
  ctx.fillRect(-22, -48, 14, 48);
  ctx.fillRect(8, -48, 14, 48);
  // Claws
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-26, -4, 6, 6);
  ctx.fillRect(22, -4, 6, 6);

  // Spiked Carapace Torso
  ctx.fillStyle = '#4338ca';
  ctx.beginPath();
  ctx.ellipse(0, -78, 28, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Mutant Back Spikes
  ctx.fillStyle = '#a855f7';
  for (let sp = 0; sp < 4; sp++) {
    ctx.beginPath();
    ctx.moveTo(-22, -100 + sp * 14);
    ctx.lineTo(-38, -108 + sp * 14);
    ctx.lineTo(-18, -88 + sp * 14);
    ctx.closePath();
    ctx.fill();
  }

  // Beast Head with Horns & Fangs
  ctx.fillStyle = '#3730a3';
  ctx.beginPath();
  ctx.ellipse(0, -114, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Two Curved Horns
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-14, -120);
  ctx.quadraticCurveTo(-26, -145, -12, -150);
  ctx.lineTo(-6, -124);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(14, -120);
  ctx.quadraticCurveTo(26, -145, 12, -150);
  ctx.lineTo(6, -124);
  ctx.closePath();
  ctx.fill();

  // Red Mutant Glowing Eyes
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(-7, -115, 3.5, 0, Math.PI * 2);
  ctx.arc(7, -115, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Razor Fangs & Acid Maw
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, -106, 8, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, -106, 3, 4);
  ctx.fillRect(2, -106, 3, 4);

  ctx.restore();
}

function drawEnemyHealthBar(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  const isBoss = enemy.type === 'boss_mech';
  const barWidth = isBoss ? 180 : 70;
  const barHeight = isBoss ? 10 : 6;
  const barY = enemy.y - enemy.height - (isBoss ? 35 : 18);

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(enemy.x - barWidth / 2 - 2, barY - 2, barWidth + 4, barHeight + 4);

  const pct = Math.max(0, enemy.hp / enemy.maxHp);
  ctx.fillStyle = isBoss ? '#ef4444' : '#f97316';
  ctx.fillRect(enemy.x - barWidth / 2, barY, barWidth * pct, barHeight);

  if (isBoss) {
    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 12px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${enemy.name} (PHASE ${enemy.phase}/${enemy.maxPhases})`, enemy.x, barY - 8);
  }
  ctx.restore();
}
