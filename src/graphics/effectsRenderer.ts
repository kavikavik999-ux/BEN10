import { CrystalSpike, Particle, Projectile } from '../types/game';

export function drawCrystalShield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Outer green crystal glow
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 24;

  // Crystalline Geodesic Dome (from Screenshot 1!)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.strokeStyle = '#6ee7b7';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI * 0.9, Math.PI * 2.1);
  ctx.lineTo(0, radius * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Geodesic faceted polygon lines inside shield
  ctx.beginPath();
  for (let a = Math.PI * 1.0; a <= Math.PI * 2.0; a += Math.PI * 0.25) {
    const px = Math.cos(a) * radius;
    const py = Math.sin(a) * radius;
    ctx.moveTo(0, -radius * 0.3);
    ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Floating crystalline shards rotating around shield
  for (let i = 0; i < 6; i++) {
    const angle = time * 4 + (i * Math.PI) / 3;
    const sx = Math.cos(angle) * (radius + 12);
    const sy = Math.sin(angle) * (radius + 8) - 15;
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 8);
    ctx.lineTo(sx + 5, sy);
    ctx.lineTo(sx, sy + 8);
    ctx.lineTo(sx - 5, sy);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export function drawCrystalSpikes(
  ctx: CanvasRenderingContext2D,
  spikes: CrystalSpike[]
) {
  spikes.forEach((spike) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, spike.alpha);
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 12;

    // Sharp green crystal spike erupting from ground
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.moveTo(spike.x - spike.width / 2, spike.y);
    ctx.lineTo(spike.x, spike.y - spike.height);
    ctx.lineTo(spike.x + spike.width / 2, spike.y);
    ctx.closePath();
    ctx.fill();

    // Bright facet highlight
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.moveTo(spike.x - spike.width / 2, spike.y);
    ctx.lineTo(spike.x, spike.y - spike.height);
    ctx.lineTo(spike.x, spike.y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  });
}

export function drawLaserSweep(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  intensity: number,
  time: number
) {
  ctx.save();
  // Core searing beam
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 30 * intensity;

  // Outer red glow
  ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 * intensity})`;
  ctx.lineWidth = 16 * intensity;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // White-hot core
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * intensity})`;
  ctx.lineWidth = 6 * intensity;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Impact flare
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(targetX, targetY, 14 * intensity, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawTelegraphWarning(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  time: number
) {
  ctx.save();
  // Red dashed telegraph laser line along ground (Screenshot 1!)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 8]);
  ctx.lineDashOffset = -time * 30;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.setLineDash([]);

  // DODGE WARNING BOX (Screenshot 1: red triangle icon + "DODGE! INCOMING LASER SWEEP")
  const boxX = (fromX + toX) / 2 - 100;
  const boxY = Math.min(fromY, toY) - 55;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, 200, 44, 8);
  ctx.fill();
  ctx.stroke();

  // Warning triangle icon
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(boxX + 22, boxY + 12);
  ctx.lineTo(boxX + 32, boxY + 32);
  ctx.lineTo(boxX + 12, boxY + 32);
  ctx.closePath();
  ctx.fill();

  // Exclamation point
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(boxX + 21, boxY + 18, 2, 7);
  ctx.fillRect(boxX + 21, boxY + 27, 2, 2.5);

  // Warning text
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 13px Rajdhani, sans-serif';
  ctx.fillText('DODGE!', boxX + 40, boxY + 22);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 10px Rajdhani, sans-serif';
  ctx.fillText('INCOMING LASER SWEEP', boxX + 40, boxY + 35);

  ctx.restore();
}

export function drawProjectiles(
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[]
) {
  projectiles.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = p.glowColor;
    ctx.shadowBlur = 14;

    if (p.type === 'fireball') {
      // Swirling magma fireball
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.radius);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#f97316');
      grad.addColorStop(1, '#ef4444');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'crystal_shard') {
      // Rotating diamond razor shard
      ctx.fillStyle = '#6ee7b7';
      ctx.beginPath();
      ctx.moveTo(0, -p.radius * 1.6);
      ctx.lineTo(p.radius * 0.7, 0);
      ctx.lineTo(0, p.radius * 1.6);
      ctx.lineTo(-p.radius * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    } else if (p.type === 'electricity') {
      // High-voltage Feedback bolt
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(-5, -6);
      ctx.lineTo(4, 7);
      ctx.lineTo(15, 0);
      ctx.stroke();
    } else if (p.type === 'sonic') {
      // Four Arms sonic shockwave ring
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'rocket') {
      // Vilgax mech missile
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, -4, 20, 8);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(10, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'black_hole') {
      // Alien X Cosmic Black Hole
      const holeGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, p.radius);
      holeGrad.addColorStop(0, '#000000');
      holeGrad.addColorStop(0.6, '#581c87');
      holeGrad.addColorStop(0.9, '#a855f7');
      holeGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = holeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Accretion disk rings
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.radius * 0.85, p.radius * 0.35, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'cosmic_blast') {
      // Celestial supernova starburst
      const starGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.radius);
      starGrad.addColorStop(0, '#ffffff');
      starGrad.addColorStop(0.4, '#c084fc');
      starGrad.addColorStop(0.8, '#38bdf8');
      starGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Default energy orb
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[]
) {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;

    if (p.shape === 'spark') {
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    } else if (p.shape === 'crystal') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x + p.size * 0.6, p.y);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.lineTo(p.x - p.size * 0.6, p.y);
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'coin') {
      // 100 COIN REWARD TOKEN (Gold disc with rim and sparkle!)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Coin inner rim
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'star') {
      // Celestial 4-pointed twinkle star
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size * 1.5);
      ctx.quadraticCurveTo(p.x, p.y, p.x + p.size * 1.5, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + p.size * 1.5);
      ctx.quadraticCurveTo(p.x, p.y, p.x - p.size * 1.5, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - p.size * 1.5);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}
