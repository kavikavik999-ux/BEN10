export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  groundY: number,
  cameraX: number,
  time: number
) {
  // SKY BACKGROUND: Dark sci-fi nocturnal city with toxic green undertone
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#030d09');
  skyGrad.addColorStop(0.5, '#062016');
  skyGrad.addColorStop(0.85, '#02120b');
  skyGrad.addColorStop(1, '#0a0f0d');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // GIANT LUMINOUS GREEN MOON (From Screenshot 1!)
  ctx.save();
  const moonX = width * 0.72 - cameraX * 0.05;
  const moonY = height * 0.28;
  const moonRadius = 60;

  // Moon outer green glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2.2);
  moonGlow.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
  moonGlow.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
  moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Moon surface
  const moonGrad = ctx.createRadialGradient(moonX - 15, moonY - 15, 5, moonX, moonY, moonRadius);
  moonGrad.addColorStop(0, '#bbf7d0');
  moonGrad.addColorStop(0.7, '#22c55e');
  moonGrad.addColorStop(1, '#14532d');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fill();

  // Moon craters
  ctx.fillStyle = 'rgba(20, 83, 45, 0.35)';
  ctx.beginPath();
  ctx.arc(moonX - 18, moonY + 8, 14, 0, Math.PI * 2);
  ctx.arc(moonX + 16, moonY - 12, 18, 0, Math.PI * 2);
  ctx.arc(moonX + 8, moonY + 22, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // DISTANT CITY SKYLINE (Ruined skyscrapers with green lights)
  ctx.save();
  const parallaxDistant = cameraX * 0.15;
  ctx.fillStyle = '#0a1d15';
  for (let i = -1; i < 18; i++) {
    const bX = i * 90 - (parallaxDistant % 90);
    const bW = 60 + ((i * 37) % 30);
    const bH = 140 + ((i * 53) % 90);
    ctx.fillRect(bX, groundY - bH, bW, bH);

    // Occasional green windows
    ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if ((i + r + c) % 3 === 0) {
          ctx.fillRect(bX + 8 + c * 16, groundY - bH + 20 + r * 22, 6, 8);
        }
      }
    }
    ctx.fillStyle = '#0a1d15';
  }
  ctx.restore();

  // MIDGROUND: BROKEN HIGHWAY OVERPASS & BRIGHTER TOMORROW BILLBOARD (Screenshot 1!)
  ctx.save();
  const parallaxMid = cameraX * 0.4;

  // Broken Highway Bridge across upper midground
  ctx.fillStyle = '#111827';
  ctx.fillRect(-200 - parallaxMid, groundY - 180, width + 400 + parallaxMid * 2, 28);
  // Support pillars
  ctx.fillStyle = '#1f2937';
  for (let p = 0; p < 8; p++) {
    const pillX = p * 240 - (parallaxMid % 240);
    ctx.fillRect(pillX, groundY - 180, 32, 180);
    // Concrete joints
    ctx.fillStyle = '#374151';
    ctx.fillRect(pillX - 6, groundY - 186, 44, 12);
    ctx.fillStyle = '#1f2937';
  }

  // BILLBOARD (Left side, exactly matching Screenshot 1: "STRONGER PEOPLE BRIGHTER TOMORROW")
  const billX = 40 - parallaxMid * 0.6;
  const billY = groundY - 290;
  if (billX > -250 && billX < width + 100) {
    // Billboard Frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(billX, billY, 150, 110);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(billX, billY, 150, 110);

    // Support steel truss
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(billX + 65, billY + 110, 20, 110);

    // Text "STRONGER PEOPLE BRIGHTER TOMORROW"
    ctx.fillStyle = '#94a3b8';
    ctx.font = '900 13px Bangers, Rajdhani, sans-serif';
    ctx.fillText('STRONGER', billX + 14, billY + 28);
    ctx.fillText('PEOPLE', billX + 14, billY + 46);
    ctx.fillText('BRIGHTER', billX + 14, billY + 66);
    ctx.fillText('TOMORROW', billX + 14, billY + 86);

    // Colored accent bars on billboard
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(billX + 14, billY + 94, 8, 5);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(billX + 24, billY + 94, 8, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(billX + 34, billY + 94, 8, 5);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(billX + 44, billY + 94, 8, 5);
  }
  ctx.restore();

  // FOREGROUND ROAD / BATTLE ARENA (Asphalt, cracked stone, neon road lines)
  ctx.save();
  // Base Road Ground
  const roadGrad = ctx.createLinearGradient(0, groundY, 0, height);
  roadGrad.addColorStop(0, '#111827');
  roadGrad.addColorStop(0.3, '#0b0f19');
  roadGrad.addColorStop(1, '#030712');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Ground Edge / Curb
  ctx.fillStyle = '#374151';
  ctx.fillRect(0, groundY, width, 4);

  // Red / Green battle lane road markings
  ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
  for (let l = 0; l < width; l += 60) {
    ctx.fillRect(l - (cameraX % 60), groundY + 35, 30, 4);
  }

  // Debris & Rubble details
  ctx.fillStyle = '#1e293b';
  for (let d = 0; d < 12; d++) {
    const dX = (d * 115) % width;
    ctx.beginPath();
    ctx.moveTo(dX, groundY + 10);
    ctx.lineTo(dX + 14, groundY + 4);
    ctx.lineTo(dX + 22, groundY + 12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
