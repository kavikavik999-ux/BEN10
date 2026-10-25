import { ActionState, CharacterId } from '../types/game';

interface DrawCharacterOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  characterId: CharacterId;
  action: ActionState;
  facing: 'left' | 'right';
  animFrame: number;
  isTransformed: boolean;
  transformProgress?: number; // 0 to 1 for flash effect
  isHurt?: boolean;
}

// Target: 20-30% of viewport height (approx 160-210px tall in 720p)
const BASE_SCALE = 2.15;

export function drawCharacter(opts: DrawCharacterOptions) {
  const {
    ctx,
    x,
    y,
    characterId,
    action,
    facing,
    animFrame,
    transformProgress = 0,
    isHurt = false,
  } = opts;

  ctx.save();
  ctx.translate(x, y);

  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Balanced scaling so Ben is full-sized and aliens are properly proportioned
  let characterScale = 2.15;
  if (characterId === 'ben') characterScale = 2.15; // Full visible size for Ben (~210px)!
  else if (characterId === 'humungousaur') characterScale = 2.4;
  else if (characterId === 'fourarms') characterScale = 2.25;
  else if (characterId === 'greymatter') characterScale = 1.35;
  else if (characterId === 'wildmutt') characterScale = 2.0;
  else if (characterId === 'rath') characterScale = 2.2;
  else characterScale = 2.15;

  ctx.scale(characterScale, characterScale);

  // Hurt flash & recoil
  if (isHurt || action === 'hurt') {
    ctx.rotate(-0.15);
    ctx.filter = 'brightness(1.5) drop-shadow(0 0 8px #ef4444)';
  }

  // Animation cycles & physics offsets
  const time = animFrame * 0.15;
  let bobY = 0;
  let legAngle = 0;
  let armAngle = 0;

  if (action === 'idle') {
    bobY = Math.sin(time * 3) * 2;
  } else if (action === 'walk') {
    bobY = Math.abs(Math.sin(time * 6)) * 4;
    legAngle = Math.sin(time * 6) * 0.55;
    armAngle = -Math.sin(time * 6) * 0.55;
  } else if (action === 'run') {
    bobY = Math.abs(Math.sin(time * 10)) * 6;
    legAngle = Math.sin(time * 10) * 0.85;
    armAngle = -Math.sin(time * 10) * 0.85;
  } else if (action === 'jump') {
    bobY = -14;
    legAngle = 0.4;
    armAngle = -0.5;
  } else if (action === 'fall') {
    bobY = -6;
    legAngle = -0.2;
    armAngle = 0.6;
  } else if (action === 'land') {
    bobY = 4;
    legAngle = 0.6;
    armAngle = -0.3;
  }

  // Draw Specific Character
  switch (characterId) {
    case 'ben':
      renderBenTennyson(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'heatblast':
      renderHeatblast(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'fourarms':
      renderFourArms(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'xlr8':
      renderXLR8(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'diamondhead':
      renderDiamondhead(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'bigchill':
      renderBigChill(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'humungousaur':
      renderHumungousaur(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'stinkfly':
      renderStinkfly(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'cannonbolt':
      renderCannonbolt(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'upgrade':
      renderUpgrade(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'wildmutt':
      renderWildmutt(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'greymatter':
      renderGreyMatter(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'swampfire':
      renderSwampfire(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'ghostfreak':
      renderGhostfreak(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'rath':
      renderRath(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'feedback':
      renderFeedback(ctx, action, bobY, legAngle, armAngle, time);
      break;
    case 'alienx':
      renderAlienX(ctx, action, bobY, legAngle, armAngle, time);
      break;
  }

  // Green Omnitrix Transformation Flash Burst
  if (transformProgress > 0) {
    ctx.save();
    ctx.globalAlpha = Math.sin(transformProgress * Math.PI) * 0.9;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#4ade80';

    // Massive Omnitrix circular energy pulse
    ctx.beginPath();
    ctx.arc(0, -42, 60, 0, Math.PI * 2);
    ctx.fill();

    // Black hourglass emblem
    ctx.fillStyle = '#052e16';
    ctx.beginPath();
    ctx.moveTo(-22, -62);
    ctx.lineTo(22, -62);
    ctx.lineTo(-22, -22);
    ctx.lineTo(22, -22);
    ctx.closePath();
    ctx.fill();

    // Energy ray spikes
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 4;
    for (let r = 0; r < 8; r++) {
      const a = (r * Math.PI) / 4 + time * 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 35, -42 + Math.sin(a) * 35);
      ctx.lineTo(Math.cos(a) * 75, -42 + Math.sin(a) * 75);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore();
}

/** 1. BEN TENNYSON: Detailed Animated 2D Cartoon Sprite */
function renderBenTennyson(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  const isPunching = action === 'punch';
  const isKicking = action === 'kick';
  const isSpecial = action === 'special' || action === 'transforming';
  const isJumping = action === 'jump';
  const isFalling = action === 'fall';
  const isLanding = action === 'land';

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(0, 0, isJumping || isFalling ? 16 : 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // LEFT (BACK) LEG & SNEAKER
  ctx.save();
  ctx.translate(-7, -35);
  if (isJumping) {
    ctx.rotate(-0.5);
  } else if (isLanding) {
    ctx.rotate(-0.7);
  } else {
    ctx.rotate(-legAngle * 0.85);
  }

  // Dark cargo pants with clean comic line
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 1.5;
  ctx.fillRect(-6, 0, 11, 24);
  ctx.strokeRect(-6, 0, 11, 24);

  // Cargo Pocket
  ctx.fillStyle = '#334155';
  ctx.fillRect(-7, 7, 3, 9);

  // Classic Black and White Sneaker
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-7, 24, 16, 9);
  ctx.strokeRect(-7, 24, 16, 9);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-7, 24, 11, 5); // Black sneaker toe & side stripe
  ctx.restore();

  // RIGHT (FRONT) LEG & SNEAKER (Kicking leg)
  ctx.save();
  ctx.translate(7, -35);
  if (isKicking) {
    // Powerful high martial arts kick!
    ctx.rotate(1.25);
    ctx.translate(4, -4);
  } else if (isJumping) {
    ctx.rotate(0.5);
  } else if (isLanding) {
    ctx.rotate(0.7);
  } else {
    ctx.rotate(legAngle);
  }

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-5, 0, 11, 24);
  ctx.strokeRect(-5, 0, 11, 24);

  // Sneaker
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, 24, 17, 9);
  ctx.strokeRect(-5, 24, 17, 9);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-5, 24, 11, 5);
  ctx.restore();

  // TORSO & SIGNATURE WHITE/BLACK SHIRT
  ctx.fillStyle = '#f8fafc'; // Crisp white
  ctx.fillRect(-15, -68, 30, 36);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 2;
  ctx.strokeRect(-15, -68, 30, 36);

  // Black vertical center stripe (Iconic classic Ben 10 original design)
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-4.5, -68, 9, 36);

  // Black neckline collar
  ctx.beginPath();
  ctx.arc(0, -68, 7.5, 0, Math.PI);
  ctx.fill();

  // LEFT ARM & VISIBLE OMNITRIX GAUNTLET
  ctx.save();
  ctx.translate(-15, -64);
  if (isSpecial) {
    // Slapping Omnitrix motion
    ctx.rotate(-0.95);
  } else {
    ctx.rotate(armAngle);
  }

  // White sleeve
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4, 0, 8, 10);
  ctx.strokeRect(-4, 0, 8, 10);

  // Forearm (Warm cartoon skin tone)
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-3.5, 10, 7, 18);
  ctx.strokeRect(-3.5, 10, 7, 18);

  // OMNITRIX GAUNTLET (Visibly on Ben's left wrist!)
  ctx.fillStyle = '#334155'; // Dark grey/slate casing
  ctx.fillRect(-6, 18, 12, 10);
  ctx.strokeRect(-6, 18, 12, 10);

  // Omnitrix Circular Dial (Emerald green with black ring)
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(0, 23, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Omnitrix Hourglass Core
  ctx.fillStyle = '#022c22';
  ctx.beginPath();
  ctx.moveTo(-3.5, 19);
  ctx.lineTo(3.5, 19);
  ctx.lineTo(-3.5, 27);
  ctx.lineTo(3.5, 27);
  ctx.closePath();
  ctx.fill();

  // Left Hand
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, 30, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // RIGHT ARM & PUNCHING FIST
  ctx.save();
  ctx.translate(15, -64);
  if (isPunching) {
    // Powerful straight punch forward with clenched fist!
    ctx.rotate(1.57);
    ctx.scale(1.2, 1);
  } else if (isSpecial) {
    ctx.rotate(0.9); // Slapping down onto left wrist
  } else {
    ctx.rotate(-armAngle);
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4, 0, 8, 10);
  ctx.strokeRect(-4, 0, 8, 10);

  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-3.5, 10, 7, 18);
  ctx.strokeRect(-3.5, 10, 7, 18);

  // Clenched Fist
  ctx.fillStyle = '#fdba74';
  ctx.beginPath();
  ctx.arc(0, 31, isPunching ? 7 : 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // HEAD & CARTOON FACE
  ctx.save();
  ctx.translate(0, -74);

  // Neck
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-4.5, 0, 9, 8);
  ctx.strokeRect(-4.5, 0, 9, 8);

  // Head Shape
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(0, -10, 14, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // BEN'S RECOGNIZABLE BROWN SPIKY HAIR (Signature shaggy spiky style)
  ctx.fillStyle = '#6b3f20'; // Warm rich brown
  ctx.strokeStyle = '#3b1c08';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  // Spikes and contours
  ctx.moveTo(-16, -12);
  ctx.quadraticCurveTo(-20, -28, -10, -32);
  ctx.lineTo(-4, -34);
  ctx.lineTo(2, -35);
  ctx.lineTo(9, -32);
  ctx.quadraticCurveTo(19, -28, 17, -12);
  ctx.lineTo(14, -8);
  ctx.lineTo(12, -12);
  // Bangs
  ctx.lineTo(6, -18);
  ctx.lineTo(2, -13);
  ctx.lineTo(-2, -19);
  ctx.lineTo(-7, -14);
  ctx.lineTo(-13, -8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Extra top spikes
  ctx.beginPath();
  ctx.moveTo(-9, -31);
  ctx.lineTo(-12, -39);
  ctx.lineTo(-5, -33);
  ctx.lineTo(1, -41);
  ctx.lineTo(6, -32);
  ctx.lineTo(12, -38);
  ctx.lineTo(10, -29);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // GREEN EYES (Emerald green cartoon eyes)
  // Eye whites
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-5, -10, 4, 4.5, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -10, 4, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Bright Green Irises
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-4.5, -10, 2.6, 0, Math.PI * 2);
  ctx.arc(6.5, -10, 2.6, 0, Math.PI * 2);
  ctx.fill();

  // Pupils & catchlights
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.arc(-4.2, -10, 1.4, 0, Math.PI * 2);
  ctx.arc(6.8, -10, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, -11.5, 1, 1);
  ctx.fillRect(6, -11.5, 1, 1);

  // Heroic Eyebrows
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-9, -16);
  ctx.lineTo(-2, -14);
  ctx.moveTo(3, -14);
  ctx.lineTo(10, -16);
  ctx.stroke();

  // Expressive smile or battle grit
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  if (isPunching || isKicking) {
    ctx.fillStyle = '#b91c1c';
    ctx.arc(1, -4, 4, 0, Math.PI);
    ctx.fill();
  } else {
    ctx.arc(1, -5, 4.5, 0.2, Math.PI * 0.9);
  }
  ctx.stroke();

  ctx.restore();
  ctx.restore();
}

/** 2. HEATBLAST: Pyronite (Magma charcoal armor, molten fissures, flaming head) */
function renderHeatblast(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);

  const isPunching = action === 'punch';
  const isSpecial = action === 'special';

  // Flame Aura Glow
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 20;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.save();
  ctx.translate(-9, -38);
  ctx.rotate(-legAngle);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-6, 0, 12, 28);
  // Fissure
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-2, 4);
  ctx.lineTo(3, 14);
  ctx.lineTo(-1, 24);
  ctx.stroke();
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-7, 28, 17, 10);
  ctx.restore();

  ctx.save();
  ctx.translate(9, -38);
  ctx.rotate(legAngle);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-6, 0, 12, 28);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(2, 4);
  ctx.lineTo(-3, 14);
  ctx.lineTo(3, 24);
  ctx.stroke();
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-6, 28, 18, 10);
  ctx.restore();

  // Torso
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-18, -78, 36, 42);
  ctx.strokeStyle = '#451a03';
  ctx.strokeRect(-18, -78, 36, 42);

  // Chest Molten Fissure
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-13, -74);
  ctx.lineTo(0, -58);
  ctx.lineTo(13, -74);
  ctx.lineTo(0, -42);
  ctx.closePath();
  ctx.fill();

  // Omnitrix badge on chest
  drawOmnitrixBadge(ctx, 0, -60, 7);

  // Flaming Arms
  ctx.save();
  ctx.translate(-19, -72);
  ctx.rotate(armAngle);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-5, 0, 10, 22);
  renderFlameHand(ctx, 0, 26, time);
  ctx.restore();

  ctx.save();
  ctx.translate(19, -72);
  if (isPunching || isSpecial) {
    ctx.rotate(1.55);
  } else {
    ctx.rotate(-armAngle);
  }
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-5, 0, 10, 22);
  renderFlameHand(ctx, 0, 26, time + 1.2);
  ctx.restore();

  // Head & Flaming Collar
  ctx.save();
  ctx.translate(0, -88);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-15, 0, 30, 10);

  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(0, -10, 13, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animated Flaming Head
  const flameH = 22 + Math.sin(time * 12) * 6;
  const gradient = ctx.createRadialGradient(0, -18, 4, 0, -22, flameH);
  gradient.addColorStop(0, '#fef08a');
  gradient.addColorStop(0.4, '#f97316');
  gradient.addColorStop(0.9, '#dc2626');
  gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(-17, -8);
  ctx.quadraticCurveTo(-24, -24, -11, -27 - Math.sin(time * 10) * 6);
  ctx.lineTo(-4, -36 - Math.cos(time * 9) * 8);
  ctx.lineTo(4, -34 - Math.sin(time * 11) * 7);
  ctx.lineTo(13, -28 - Math.cos(time * 12) * 6);
  ctx.quadraticCurveTo(24, -22, 17, -8);
  ctx.closePath();
  ctx.fill();

  // Yellow glowing eyes
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-6.5, -12, 4.5, 4.5);
  ctx.fillRect(2.5, -12, 4.5, 4.5);

  ctx.restore();
  ctx.restore();
}

/** 3. FOUR ARMS: Tetramand (4 muscular red arms, 4 yellow eyes, black tank) */
function renderFourArms(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 8);

  const isPunching = action === 'punch';
  const isSpecial = action === 'special';

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy Red Muscular Legs
  ctx.save();
  ctx.translate(-13, -46);
  ctx.rotate(-legAngle);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-8, 0, 17, 34);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-9, 34, 19, 13);
  ctx.restore();

  ctx.save();
  ctx.translate(13, -46);
  ctx.rotate(legAngle);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-8, 0, 17, 34);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-8, 34, 20, 13);
  ctx.restore();

  // Massive Torso
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-24, -94, 48, 50);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-7, -94, 14, 50);

  // Omnitrix on upper left chest
  drawOmnitrixBadge(ctx, -15, -82, 7.5);

  // 4 SEPARATE MUSCULAR RED ARMS
  // Top Left Arm
  ctx.save();
  ctx.translate(-26, -90);
  ctx.rotate(isSpecial ? -1.1 : armAngle * 0.9);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-7, 0, 14, 26);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-8, 22, 16, 4.5);
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(0, 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Top Right Arm (Punching)
  ctx.save();
  ctx.translate(26, -90);
  if (isPunching || isSpecial) {
    ctx.rotate(1.55);
  } else {
    ctx.rotate(-armAngle * 0.9);
  }
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-7, 0, 14, 26);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-8, 22, 16, 4.5);
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(0, 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Lower Left Arm
  ctx.save();
  ctx.translate(-23, -68);
  ctx.rotate(isSpecial ? -0.7 : -armAngle * 0.7);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(-6, 0, 12, 22);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-7, 18, 14, 3.5);
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(0, 26, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Lower Right Arm
  ctx.save();
  ctx.translate(23, -68);
  if (isPunching) {
    ctx.rotate(1.25);
  } else if (isSpecial) {
    ctx.rotate(0.8);
  } else {
    ctx.rotate(armAngle * 0.7);
  }
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(-6, 0, 12, 22);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-7, 18, 14, 3.5);
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.arc(0, 26, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tetramand Head with 4 Yellow Eyes
  ctx.save();
  ctx.translate(0, -100);
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(0, -10, 18, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-4.5, -28, 9, 22);

  // 4 Yellow Eyes
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-9, -17, 4.5, 4);
  ctx.fillRect(4.5, -17, 4.5, 4);
  ctx.fillRect(-10, -10, 4.5, 4);
  ctx.fillRect(5.5, -10, 4.5, 4);

  // Tusked Underbite Jaw
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(-12, -4);
  ctx.lineTo(12, -4);
  ctx.lineTo(8, 5);
  ctx.lineTo(-8, 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-9, -5, 3, 5);
  ctx.fillRect(6, -5, 3, 5);

  ctx.restore();
  ctx.restore();
}

/** 4. XLR8: Kineceleran (Pointed visor helmet, wheeled feet, scissor claws, raptor tail) */
function renderXLR8(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  const isPunching = action === 'punch';
  const isRunning = action === 'run' || action === 'special';

  if (isRunning) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(-40, -22, 35, 14);
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Segmented Blue & Black Raptor Tail
  ctx.save();
  ctx.translate(-11, -44);
  const tailSway = Math.sin(time * 8) * 0.35;
  ctx.rotate(-0.4 + tailSway);
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-28, -7, -46, 7);
  ctx.quadraticCurveTo(-26, 13, 0, 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-20, -2, 7, 9);
  ctx.fillRect(-33, 1, 6, 7);
  ctx.restore();

  // Wheeled Legs
  ctx.save();
  ctx.translate(-8, -38);
  ctx.rotate(-legAngle * 1.25);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-4.5, 0, 9, 28);
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 31, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, 31, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(8, -38);
  ctx.rotate(legAngle * 1.25);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-4.5, 0, 9, 28);
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 31, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, 31, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Sleek Aerodynamic Torso
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-13, -74, 26, 40);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-13, -74, 6, 40);
  ctx.fillRect(7, -74, 6, 40);

  // Omnitrix badge on chest
  drawOmnitrixBadge(ctx, 0, -58, 6.5);

  // Scissor Claw Arms
  ctx.save();
  ctx.translate(-15, -70);
  ctx.rotate(armAngle * 1.25);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-4, 0, 8, 22);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-6, 22, 5, 10);
  ctx.fillRect(1, 22, 5, 10);
  ctx.restore();

  ctx.save();
  ctx.translate(15, -70);
  if (isPunching) {
    ctx.rotate(1.6);
  } else {
    ctx.rotate(-armAngle * 1.25);
  }
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-4, 0, 8, 22);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-6, 22, 5, 10);
  ctx.fillRect(1, 22, 5, 10);
  ctx.restore();

  // Pointed Aerodynamic Helmet & Green Visor
  ctx.save();
  ctx.translate(0, -82);
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.moveTo(-11, 0);
  ctx.quadraticCurveTo(-18, -20, 16, -34);
  ctx.lineTo(13, -11);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-9, -13, 18, 7);

  // Green Visor
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(3, -7, 7, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

/** 5. DIAMONDHEAD: Petrosapien (Cyan crystal body, 2 back crystal spikes, blade arms) */
function renderDiamondhead(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 6);

  const isPunching = action === 'punch';
  const isSpecial = action === 'special';

  // Crystal Glow
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 18;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // TWO MASSIVE BACK CRYSTAL SPIKES
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(-18, -62);
  ctx.lineTo(-34, -100);
  ctx.lineTo(-9, -78);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(18, -62);
  ctx.lineTo(34, -100);
  ctx.lineTo(9, -78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#6ee7b7';
  ctx.beginPath();
  ctx.moveTo(-18, -62);
  ctx.lineTo(-34, -100);
  ctx.lineTo(-22, -80);
  ctx.closePath();
  ctx.fill();

  // Crystal Legs
  ctx.save();
  ctx.translate(-11, -44);
  ctx.rotate(-legAngle);
  ctx.fillStyle = '#065f46';
  ctx.fillRect(-7, 0, 14, 30);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(-8, 30, 18, 11);
  ctx.restore();

  ctx.save();
  ctx.translate(11, -44);
  ctx.rotate(legAngle);
  ctx.fillStyle = '#065f46';
  ctx.fillRect(-7, 0, 14, 30);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(-7, 30, 18, 11);
  ctx.restore();

  // Torso
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-19, -84, 38, 44);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-7, -84, 14, 44);

  // Omnitrix on left chest
  drawOmnitrixBadge(ctx, -11, -74, 7);

  // Crystal Blade Arms
  ctx.save();
  ctx.translate(-20, -78);
  ctx.rotate(armAngle);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(-5.5, 0, 11, 24);
  ctx.fillStyle = '#6ee7b7';
  ctx.beginPath();
  ctx.moveTo(-7, 24);
  ctx.lineTo(0, 39);
  ctx.lineTo(7, 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(20, -78);
  if (isPunching || isSpecial) {
    ctx.rotate(1.55);
  } else {
    ctx.rotate(-armAngle);
  }
  ctx.fillStyle = '#10b981';
  ctx.fillRect(-5.5, 0, 11, 24);
  ctx.fillStyle = '#6ee7b7';
  ctx.beginPath();
  ctx.moveTo(-8, 24);
  ctx.lineTo(4, 44);
  ctx.lineTo(9, 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Faceted Crystal Head & Chin
  ctx.save();
  ctx.translate(0, -92);
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(15, -9);
  ctx.lineTo(11, 7);
  ctx.lineTo(0, 11);
  ctx.lineTo(-11, 7);
  ctx.lineTo(-15, -9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#6ee7b7';
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(0, 11);
  ctx.lineTo(-11, 7);
  ctx.lineTo(-15, -9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-8, -8, 4.5, 3.5);
  ctx.fillRect(3.5, -8, 4.5, 3.5);

  ctx.restore();
  ctx.restore();
}

/** 6. BIG CHILL: Necrofriggian (Moth wings cloak, cyan antennae, ice breath) */
function renderBigChill(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);

  // Flapping Cloak / Wings
  const wingFlap = Math.sin(time * 6) * 0.18;
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(-19, -68);
  ctx.quadraticCurveTo(-42 - wingFlap * 18, -100, -50, -42);
  ctx.quadraticCurveTo(-33, -10, -15, -22);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(19, -68);
  ctx.quadraticCurveTo(42 + wingFlap * 18, -100, 50, -42);
  ctx.quadraticCurveTo(33, -10, 15, -22);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-15, -75, 30, 42);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-5.5, -75, 11, 42);

  // Omnitrix on chest
  drawOmnitrixBadge(ctx, 0, -58, 6.5);

  // Limbs
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-11, -34, 8, 30);
  ctx.fillRect(3, -34, 8, 30);

  // Head & Cyan Antennae
  ctx.save();
  ctx.translate(0, -84);
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.arc(0, -9, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-7, -19);
  ctx.quadraticCurveTo(-16, -36, -9, -44);
  ctx.moveTo(7, -19);
  ctx.quadraticCurveTo(16, -36, 9, -44);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-7, -11, 4.5, 4.5);
  ctx.fillRect(2.5, -11, 4.5, 4.5);
  ctx.restore();

  ctx.restore();
}

/** 7. HUMUNGOUSAUR: Vaxasaurian (Towering Sauropod Dinosaur) */
function renderHumungousaur(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 14);

  // Colossal Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spiked Tail
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(-18, -48);
  ctx.quadraticCurveTo(-50, -32, -62, -10);
  ctx.lineTo(-46, -4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(-58, -20);
  ctx.lineTo(-68, -28);
  ctx.lineTo(-50, -15);
  ctx.closePath();
  ctx.fill();

  // Colossal Legs
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-20, -48, 18, 46);
  ctx.fillRect(3, -48, 18, 46);

  // Massive Torso
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-29, -102, 58, 58);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-14, -98, 28, 50);

  // Omnitrix on chest
  drawOmnitrixBadge(ctx, 0, -82, 9);

  // Giant Arms
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-38, -98, 16, 42);
  ctx.fillRect(22, -98, 16, 42);

  // Dino Head with Horn Brow
  ctx.save();
  ctx.translate(0, -112);
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(0, -11, 20, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-18, -24, 36, 9);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-10, -13, 6, 4.5);
  ctx.fillRect(4, -13, 6, 4.5);
  ctx.restore();

  ctx.restore();
}

/** 8. STINKFLY: Lepidopterran (4 stalk eyes, 4 wings, stinger tail) */
function renderStinkfly(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  const hoverY = Math.sin(time * 8) * 7;
  ctx.translate(0, bobY - 8 + hoverY);

  // Stinger Tail
  ctx.fillStyle = '#4d7c0f';
  ctx.beginPath();
  ctx.moveTo(-7, -42);
  ctx.quadraticCurveTo(-30, -26, -38, -4);
  ctx.lineTo(-26, -2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-39, -8, 5, 9);

  // 4 Wings
  const wingAngle = Math.sin(time * 24) * 0.45;
  ctx.fillStyle = 'rgba(234, 179, 8, 0.5)';
  ctx.save();
  ctx.translate(-5, -72);
  ctx.rotate(-0.5 + wingAngle);
  ctx.fillRect(-32, -13, 38, 12);
  ctx.restore();
  ctx.save();
  ctx.translate(5, -72);
  ctx.rotate(0.5 - wingAngle);
  ctx.fillRect(-6, -13, 38, 12);
  ctx.restore();

  // Torso
  ctx.fillStyle = '#65a30d';
  ctx.fillRect(-13, -74, 26, 38);
  drawOmnitrixBadge(ctx, 0, -56, 6.5);

  // Legs
  ctx.fillStyle = '#365314';
  ctx.fillRect(-10, -36, 6, 28);
  ctx.fillRect(4, -36, 6, 28);

  // Head with 4 Eyestalks
  ctx.save();
  ctx.translate(0, -82);
  ctx.fillStyle = '#4d7c0f';
  ctx.beginPath();
  ctx.ellipse(0, -7, 13, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#365314';
  ctx.lineWidth = 3;
  const stalks = [
    { x1: -4, y1: -13, x2: -13, y2: -26 },
    { x1: -2, y1: -15, x2: -5, y2: -28 },
    { x1: 2, y1: -15, x2: 5, y2: -28 },
    { x1: 4, y1: -13, x2: 13, y2: -26 },
  ];
  stalks.forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(s.x2, s.y2, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  ctx.restore();
}

/** 9. CANNONBOLT: Arburian Pelarota (Yellow & white shell, sphere form) */
function renderCannonbolt(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);

  const isSpecial = action === 'special';

  if (isSpecial) {
    ctx.save();
    ctx.rotate(time * 20);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -28, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-7, -56, 14, 56);
    drawOmnitrixBadge(ctx, 0, -28, 7);
    ctx.restore();
    ctx.restore();
    return;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 35, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chunky Legs
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, -34, 11, 32);
  ctx.fillRect(3, -34, 11, 32);

  // Bulky White Torso
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(0, -60, 24, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Yellow Shell Carapace Plates
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(-18, -68, 13, 0, Math.PI * 2);
  ctx.arc(18, -68, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  ctx.fillRect(-4.5, -82, 9, 46);
  drawOmnitrixBadge(ctx, 0, -72, 7);

  // Head
  ctx.save();
  ctx.translate(0, -88);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, -4, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-9, -13, 18, 6);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(-5.5, -5.5, 3.5, 3.5);
  ctx.fillRect(2.5, -5.5, 3.5, 3.5);
  ctx.restore();

  ctx.restore();
}

/** 10. UPGRADE: Galvanic Mechamorph (Glowing green circuitry, optic eye) */
function renderUpgrade(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 18;

  // Charcoal Body
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-11, -38, 9, 36);
  ctx.fillRect(4, -38, 9, 36);
  ctx.fillRect(-16, -78, 32, 42);

  // Glowing Green Circuit Traces
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, -70);
  ctx.lineTo(-11, -64);
  ctx.moveTo(0, -70);
  ctx.lineTo(11, -64);
  ctx.moveTo(-7, -32);
  ctx.lineTo(-7, -12);
  ctx.moveTo(8, -32);
  ctx.lineTo(8, -12);
  ctx.stroke();

  drawOmnitrixBadge(ctx, 0, -60, 6.5);

  // Arms
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-22, -74, 8, 26);
  ctx.fillRect(14, -74, 8, 26);

  // Cyclops Optic Head
  ctx.save();
  ctx.translate(0, -86);
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(0, -7, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(0, -7, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f0fdf4';
  ctx.beginPath();
  ctx.arc(0, -7, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/** 11. WILDMUTT: Vulpimancer (Quadruped orange beast, no eyes, gill neck) */
function renderWildmutt(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Quadruped Beast Limbs
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-26, -32, 11, 30);
  ctx.fillRect(15, -32, 13, 30);

  // Muscular Body
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(0, -40, 32, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Quills
  ctx.fillStyle = '#7c2d12';
  for (let i = -20; i <= 16; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, -60);
    ctx.lineTo(i + 3, -68);
    ctx.lineTo(i + 6, -60);
    ctx.closePath();
    ctx.fill();
  }

  drawOmnitrixBadge(ctx, -7, -46, 6.5);

  // Head with Fangs & Gills
  ctx.save();
  ctx.translate(24, -46);
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-6, -7);
  ctx.lineTo(-6, 7);
  ctx.moveTo(-11, -5);
  ctx.lineTo(-11, 5);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(7, 7);
  ctx.lineTo(10, 15);
  ctx.lineTo(13, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/** 12. GREY MATTER: Galvan (Miniature frog genius) */
function renderGreyMatter(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY + 10);

  // Small grey legs
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-9, -26, 7, 24);
  ctx.fillRect(3, -26, 7, 24);

  // Galvan Jumpsuit
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-11, -56, 22, 32);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-3.5, -56, 7, 32);
  drawOmnitrixBadge(ctx, 0, -45, 5.5);

  // Oversized Head
  ctx.save();
  ctx.translate(0, -70);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(0, -9, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Giant Green Eyes
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(-9, -10, 8, 0, Math.PI * 2);
  ctx.arc(9, -10, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#052e16';
  ctx.fillRect(-12, -11, 7, 3);
  ctx.fillRect(6, -11, 7, 3);
  ctx.restore();

  ctx.restore();
}

/** 13. SWAMPFIRE: Methanosian (Plant body, fiery head petals) */
function renderSwampfire(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);

  ctx.fillStyle = '#15803d';
  ctx.fillRect(-10, -40, 9, 38);
  ctx.fillRect(3, -40, 9, 38);

  ctx.fillStyle = '#166534';
  ctx.fillRect(-16, -78, 32, 40);

  // Methane bulbs
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(-16, -72, 7, 0, Math.PI * 2);
  ctx.arc(16, -72, 7, 0, Math.PI * 2);
  ctx.fill();

  drawOmnitrixBadge(ctx, 0, -60, 7);

  // Flame Head Petals
  ctx.save();
  ctx.translate(0, -86);
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(-22, -24);
  ctx.lineTo(-9, -15);
  ctx.lineTo(0, -30);
  ctx.lineTo(9, -15);
  ctx.lineTo(22, -24);
  ctx.lineTo(15, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.ellipse(0, -7, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#15803d';
  ctx.fillRect(-5.5, -9, 3.5, 3.5);
  ctx.fillRect(2.5, -9, 3.5, 3.5);
  ctx.restore();

  ctx.restore();
}

/** 14. GHOSTFREAK: Ectonurite (Wispy ghost tail, moving purple eye track) */
function renderGhostfreak(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  const floatY = Math.sin(time * 5) * 9;
  ctx.translate(0, bobY - 14 + floatY);

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(-13, -38);
  ctx.quadraticCurveTo(-20, -12, -7 + Math.sin(time * 6) * 11, 10);
  ctx.quadraticCurveTo(9, -12, 13, -38);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-15, -78, 30, 44);

  // Eye Track
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-11, -74);
  ctx.lineTo(9, -50);
  ctx.stroke();

  // Moving Purple Eye
  const eyePos = (Math.sin(time * 3) + 1) * 0.5;
  const eyeX = -11 + 20 * eyePos;
  const eyeY = -74 + 24 * eyePos;
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  drawOmnitrixBadge(ctx, -7, -44, 6);
  ctx.restore();
}

/** 15. RATH: Appoplexian (Orange tiger humanoid, wrist blades) */
function renderRath(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 8);

  const isPunching = action === 'punch';

  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-13, -42, 12, 40);
  ctx.fillRect(2, -42, 12, 40);

  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-22, -90, 44, 50);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-9, -86, 18, 32);

  drawOmnitrixBadge(ctx, 0, -72, 7);

  // Wrist Blades
  ctx.save();
  ctx.translate(24, -84);
  if (isPunching) ctx.rotate(1.55);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-7, 0, 14, 26);
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.moveTo(7, 22);
  ctx.lineTo(22, 24);
  ctx.lineTo(7, 28);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Tiger Head
  ctx.save();
  ctx.translate(0, -96);
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(0, -9, 16, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-8, -5, 16, 9);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(-9, -13, 4.5, 4);
  ctx.fillRect(4.5, -13, 4.5, 4);
  ctx.restore();

  ctx.restore();
}

/** 16. FEEDBACK: Conductoid (Plug antennae & tail) */
function renderFeedback(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY - 4);
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 14;

  ctx.fillStyle = '#09090b';
  ctx.fillRect(-10, -38, 9, 36);
  ctx.fillRect(3, -38, 9, 36);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-10, -6, 9, 4.5);
  ctx.fillRect(3, -6, 9, 4.5);

  ctx.fillStyle = '#09090b';
  ctx.fillRect(-15, -76, 30, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4.5, -76, 9, 40);
  drawOmnitrixBadge(ctx, 0, -60, 7);

  // Antennae
  ctx.save();
  ctx.translate(0, -84);
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.ellipse(0, -7, 12, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(-7, -17);
  ctx.quadraticCurveTo(-20, -34, -13, -44);
  ctx.moveTo(7, -17);
  ctx.quadraticCurveTo(20, -34, 13, -44);
  ctx.stroke();

  ctx.fillStyle = '#eab308';
  ctx.fillRect(-16, -48, 7, 7);
  ctx.fillRect(10, -48, 7, 7);

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(0, -7, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/** Helper: Draw the canonical green & black Omnitrix badge with hourglass */
function drawOmnitrixBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#09090b';
  const r = radius * 0.75;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - r);
  ctx.lineTo(cx + r, cy - r);
  ctx.lineTo(cx - r, cy + r);
  ctx.lineTo(cx + r, cy + r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Helper: Flaming hands for Heatblast */
function renderFlameHand(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.save();
  const flameR = 9 + Math.sin(t * 12) * 2.5;
  const gradient = ctx.createRadialGradient(x, y, 2, x, y, flameR);
  gradient.addColorStop(0, '#fef08a');
  gradient.addColorStop(0.5, '#f97316');
  gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, flameR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Alien X: Omnipotent Celestialsapien with cosmic starry body and 3 horns */
function renderAlienX(
  ctx: CanvasRenderingContext2D,
  action: ActionState,
  bobY: number,
  legAngle: number,
  armAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(0, bobY);

  const isPunching = action === 'punch';
  const isKicking = action === 'kick';
  const isSpecial = action === 'special';

  // Cosmic Celestial Nebula Aura
  ctx.save();
  ctx.shadowColor = isSpecial ? '#a855f7' : '#38bdf8';
  ctx.shadowBlur = isSpecial ? 35 : 18;

  // Ground Shadow (levitating slight elevation for Alien X!)
  ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 4, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Helper: Draw starry limb
  const drawStarryLimb = (lx: number, ly: number, lw: number, lh: number, angle: number) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-lw / 2, 0, lw, lh);
    ctx.strokeStyle = '#3b0764';
    ctx.lineWidth = 1;
    ctx.strokeRect(-lw / 2, 0, lw, lh);

    // Dynamic Twinkling Stars inside limb
    ctx.fillStyle = '#ffffff';
    for (let s = 1; s <= 3; s++) {
      const starAlpha = 0.4 + Math.sin(time * 4 + s * 2.3) * 0.4;
      ctx.globalAlpha = starAlpha;
      ctx.fillRect(-lw / 4 + (s % 2) * (lw / 2), (lh / 4) * s, 1.5, 1.5);
    }
    ctx.restore();
  };

  // Back Leg
  drawStarryLimb(-6, -42, 9, 44, isKicking ? 0.9 : -legAngle * 0.7);
  // Front Leg
  drawStarryLimb(4, -42, 9.5, 45, isKicking ? -1.1 : legAngle);

  // Muscular Torso (Deep void black)
  ctx.fillStyle = '#050508';
  ctx.beginPath();
  ctx.moveTo(-13, -78);
  ctx.lineTo(13, -78);
  ctx.lineTo(9, -42);
  ctx.lineTo(-9, -42);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#581c87';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Twinkling stars across chest & abdomen
  ctx.fillStyle = '#ffffff';
  const starCoords = [
    [-6, -72], [4, -68], [-2, -60], [6, -55], [-7, -50], [2, -47],
    [-8, -65], [7, -74], [0, -70]
  ];
  starCoords.forEach(([sx, sy], idx) => {
    ctx.save();
    const starTwinkle = 0.4 + Math.sin(time * 5 + idx * 1.7) * 0.5;
    ctx.globalAlpha = Math.max(0.2, starTwinkle);
    ctx.fillRect(sx, sy, 1.8, 1.8);
    ctx.restore();
  });

  // Chest Omnitrix Badge
  drawOmnitrixBadge(ctx, 0, -66, 6.5);

  // Head with Canonical 3 Celestialsapien Horns
  ctx.save();
  ctx.fillStyle = '#050508';
  ctx.beginPath();
  ctx.roundRect(-8.5, -96, 17, 18, 4);
  ctx.fill();
  ctx.strokeStyle = '#581c87';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 3 Sharp Celestial Horns:
  // Center Horn (tallest)
  ctx.fillStyle = '#050508';
  ctx.beginPath();
  ctx.moveTo(-2.5, -96);
  ctx.lineTo(0, -112);
  ctx.lineTo(2.5, -96);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left Horn (angled outward)
  ctx.beginPath();
  ctx.moveTo(-8, -94);
  ctx.lineTo(-12, -107);
  ctx.lineTo(-4, -96);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Horn (angled outward)
  ctx.beginPath();
  ctx.moveTo(4, -96);
  ctx.lineTo(12, -107);
  ctx.lineTo(8, -94);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Piercing Green Cosmic Eyes (No pupils, pure glowing celestial light)
  ctx.fillStyle = '#4ade80';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.ellipse(-3.5, -88, 3, 2, 0.2, 0, Math.PI * 2);
  ctx.ellipse(3.5, -88, 3, 2, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Arms
  // Back Arm
  drawStarryLimb(-12, -76, 8, 36, isPunching ? -0.4 : -armAngle * 0.7);

  // Front Arm & Cosmic Fist
  ctx.save();
  ctx.translate(10, -76);
  const punchAngle = isPunching ? 1.55 : isSpecial ? 0.3 : armAngle;
  ctx.rotate(punchAngle);
  ctx.fillStyle = '#050508';
  ctx.fillRect(-4, 0, 8.5, isPunching ? 46 : 38);

  // Stars in arm
  ctx.fillStyle = '#ffffff';
  for (let a = 1; a <= 3; a++) {
    ctx.fillRect(-1 + (a % 2) * 2, a * 10, 1.5, 1.5);
  }

  // Reality Warp Fist / Hand
  if (isPunching || isSpecial) {
    // Cosmic Nebula Fist with warping rings
    const fistGrad = ctx.createRadialGradient(0, isPunching ? 46 : 38, 2, 0, isPunching ? 46 : 38, 18);
    fistGrad.addColorStop(0, '#ffffff');
    fistGrad.addColorStop(0.4, '#a855f7');
    fistGrad.addColorStop(0.8, '#3b82f6');
    fistGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = fistGrad;
    ctx.beginPath();
    ctx.arc(0, isPunching ? 46 : 38, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
  ctx.restore();
}
