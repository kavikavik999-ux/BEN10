import { DestructibleObject } from '../types/game';

export function drawTownEnvironment(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  groundY: number,
  cameraX: number,
  destructibles: DestructibleObject[]
) {
  // 1. SKY LAYER: Vibrant, bright Bellwood comic daylight sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
  skyGrad.addColorStop(0, '#38bdf8'); // Bright sky blue
  skyGrad.addColorStop(0.55, '#7dd3fc');
  skyGrad.addColorStop(0.85, '#bae6fd');
  skyGrad.addColorStop(1, '#e0f2fe');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  // Distant warm sun
  const sunX = viewWidth * 0.82 - cameraX * 0.03;
  const sunY = viewHeight * 0.22;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.45)');
  sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy cartoon clouds (Slow parallax)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (let c = -2; c < 12; c++) {
    const cX = c * 380 - (cameraX * 0.08) % (14 * 380);
    const cY = 70 + ((c * 47) % 65);
    drawCartoonCloud(ctx, cX, cY, 55 + ((c * 23) % 25));
  }

  // 2. DISTANT LAYER: Green Hills & Bellwood Water Tower (Parallax 0.15)
  ctx.save();
  const hillOffset = cameraX * 0.15;
  ctx.fillStyle = '#86efac'; // Soft green distant hills
  ctx.beginPath();
  ctx.moveTo(0, groundY - 120);
  for (let h = -2; h < 18; h++) {
    const hX = h * 220 - (hillOffset % 220);
    ctx.quadraticCurveTo(hX + 110, groundY - 210, hX + 220, groundY - 120);
  }
  ctx.lineTo(viewWidth, groundY);
  ctx.lineTo(0, groundY);
  ctx.closePath();
  ctx.fill();

  // Bellwood Water Tower in background
  const towerX = 650 - (hillOffset % 1800);
  if (towerX > -150 && towerX < viewWidth + 150) {
    ctx.fillStyle = '#64748b';
    // Legs
    ctx.fillRect(towerX - 25, groundY - 240, 6, 120);
    ctx.fillRect(towerX + 19, groundY - 240, 6, 120);
    // Tank
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(towerX - 35, groundY - 290, 70, 50, 8);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Text "BELLWOOD"
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('BELLWOOD', towerX - 26, groundY - 260);
  }
  ctx.restore();

  // 3. MIDGROUND BUILDINGS & SHOPS (Parallax 0.45)
  ctx.save();
  const midOffset = cameraX * 0.45;

  // Town Buildings Array (Repeats cleanly across the town)
  const buildings = [
    { type: 'smoothie', w: 220, h: 260, color: '#fbcfe8', title: 'MR. SMOOTHIE' },
    { type: 'store', w: 180, h: 220, color: '#fed7aa', title: 'BELLWOOD BURGERS' },
    { type: 'brick', w: 200, h: 280, color: '#fca5a5', title: 'COMIC HAVEN' },
    { type: 'apartments', w: 240, h: 320, color: '#e2e8f0', title: 'APARTMENTS' },
    { type: 'tech', w: 190, h: 240, color: '#bbf7d0', title: 'ALIENTECH REPAIR' },
    { type: 'bank', w: 210, h: 270, color: '#fde68a', title: 'FIRST TOWN BANK' },
  ];

  let currentBuildX = -midOffset % 1240;
  if (currentBuildX > 0) currentBuildX -= 1240;

  while (currentBuildX < viewWidth + 400) {
    for (const b of buildings) {
      const bX = currentBuildX;
      const bY = groundY - b.h;

      if (bX > -300 && bX < viewWidth + 300) {
        // Main Building Wall
        ctx.fillStyle = b.color;
        ctx.fillRect(bX, bY, b.w, b.h);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bX, bY, b.w, b.h);

        // Roof Trim / Cornice
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bX - 4, bY - 10, b.w + 8, 14);

        // Windows Grid
        ctx.fillStyle = '#7dd3fc';
        const cols = Math.floor(b.w / 45);
        const rows = Math.floor((b.h - 80) / 45);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const wx = bX + 16 + c * 42;
            const wy = bY + 30 + r * 42;
            ctx.fillRect(wx, wy, 24, 28);
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(wx, wy, 24, 28);
            // Window glare
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillRect(wx + 2, wy + 2, 8, 12);
            ctx.fillStyle = '#7dd3fc';
          }
        }

        // Storefront Canopy & Signboard
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bX + 10, bY + b.h - 70, b.w - 20, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Rajdhani, Bangers, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.title, bX + b.w / 2, bY + b.h - 55);

        // Store Awning
        drawStoreAwning(ctx, bX + 10, bY + b.h - 48, b.w - 20);

        // Shop Entrance Door
        ctx.fillStyle = '#334155';
        ctx.fillRect(bX + b.w / 2 - 18, bY + b.h - 44, 36, 44);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bX + b.w / 2 - 14, bY + b.h - 38, 28, 30);

        // SPECIAL: MR. SMOOTHIE GIANT CUP ON ROOF!
        if (b.type === 'smoothie') {
          drawMrSmoothieCup(ctx, bX + b.w / 2, bY - 10);
        }
      }
      currentBuildX += b.w + 25;
    }
  }
  ctx.restore();

  // 4. FOREGROUND STREET, SIDEWALK, ROAD & VEHICLES (Follows camera 1:1)
  ctx.save();
  const fgOffset = cameraX;

  // Sidewalk (Concrete paving with slabs)
  const sidewalkHeight = 35;
  const roadY = groundY + sidewalkHeight;

  // Sidewalk platform
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, groundY - 14, viewWidth, sidewalkHeight);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, groundY - 14, viewWidth, sidewalkHeight);

  // Sidewalk slab divider lines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  for (let s = -fgOffset % 80; s < viewWidth + 80; s += 80) {
    ctx.beginPath();
    ctx.moveTo(s, groundY - 14);
    ctx.lineTo(s, roadY - 14);
    ctx.stroke();
  }

  // Curb edge
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, roadY - 16, viewWidth, 5);

  // Asphalt Road Surface
  const roadGrad = ctx.createLinearGradient(0, roadY, 0, viewHeight);
  roadGrad.addColorStop(0, '#1e293b');
  roadGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, roadY - 11, viewWidth, viewHeight - (roadY - 11));

  // Yellow road center dashed lines
  ctx.fillStyle = '#facc15';
  for (let d = -fgOffset % 90; d < viewWidth + 90; d += 90) {
    ctx.fillRect(d, roadY + 28, 45, 6);
  }

  // Crosswalk (White zebra stripes)
  const crosswalkX = 400 - (fgOffset % 1600);
  if (crosswalkX > -150 && crosswalkX < viewWidth + 150) {
    ctx.fillStyle = '#ffffff';
    for (let z = 0; z < 7; z++) {
      ctx.fillRect(crosswalkX + z * 18, roadY - 8, 12, 60);
    }
  }

  // GRANDPA MAX'S RUST BUCKET CAMPER VAN (Iconic RV parked on road!)
  const rvX = 900 - (fgOffset % 2400);
  if (rvX > -250 && rvX < viewWidth + 250) {
    drawRustBucketRV(ctx, rvX, roadY - 8);
  }

  // Regular parked car
  const carX = -200 - (fgOffset % 1800);
  if (carX > -200 && carX < viewWidth + 200) {
    drawParkedCar(ctx, carX, roadY - 4);
  }

  // Streetlights & Trees along sidewalk
  for (let p = -2; p < 14; p++) {
    const postX = p * 340 - (fgOffset % 340);
    if (postX > -100 && postX < viewWidth + 100) {
      // Streetlight
      drawStreetLight(ctx, postX, groundY - 14);

      // Tree
      drawSuburbanTree(ctx, postX + 160, groundY - 14);
    }
  }

  // DESTRUCTIBLE OBJECTS (Crates, Hydrants, Trash Cans)
  destructibles.forEach((obj) => {
    const screenX = obj.x - fgOffset;
    if (screenX > -100 && screenX < viewWidth + 100) {
      if (!obj.broken) {
        if (obj.type === 'crate') {
          // Wooden crate
          ctx.fillStyle = '#b45309';
          ctx.fillRect(screenX, obj.y - obj.height, obj.width, obj.height);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, obj.y - obj.height, obj.width, obj.height);
          // X-cross brace
          ctx.beginPath();
          ctx.moveTo(screenX, obj.y - obj.height);
          ctx.lineTo(screenX + obj.width, obj.y);
          ctx.moveTo(screenX + obj.width, obj.y - obj.height);
          ctx.lineTo(screenX, obj.y);
          ctx.stroke();
        } else if (obj.type === 'hydrant') {
          // Fire hydrant
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(screenX + 4, obj.y - obj.height, obj.width - 8, obj.height);
          ctx.beginPath();
          ctx.arc(screenX + obj.width / 2, obj.y - obj.height, 10, 0, Math.PI * 2);
          ctx.fill();
          // Silver nozzle caps
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(screenX, obj.y - obj.height + 14, 5, 6);
          ctx.fillRect(screenX + obj.width - 5, obj.y - obj.height + 14, 5, 6);
        } else {
          // Metal trash can
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(screenX, obj.y - obj.height, obj.width, obj.height);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, obj.y - obj.height, obj.width, obj.height);
        }
      } else {
        // Broken debris on ground
        ctx.fillStyle = obj.type === 'crate' ? '#92400e' : '#64748b';
        ctx.fillRect(screenX, obj.y - 8, 10, 8);
        ctx.fillRect(screenX + 14, obj.y - 6, 12, 6);
      }
    }
  });

  ctx.restore();
}

/** Helper: Draw fluffy cartoon cloud */
function drawCartoonCloud(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.5, y - radius * 0.25, radius * 0.75, 0, Math.PI * 2);
  ctx.arc(x + radius * 1.1, y, radius * 0.6, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.5, y + radius * 0.2, radius * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Helper: Draw Mr. Smoothie giant mascot cup */
function drawMrSmoothieCup(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  // Big Cup Body
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy);
  ctx.lineTo(cx - 40, cy - 70);
  ctx.lineTo(cx + 40, cy - 70);
  ctx.lineTo(cx + 30, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 3;
  ctx.stroke();

  // White Lid
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 70, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Red & White Striped Straw
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 70);
  ctx.lineTo(cx + 25, cy - 105);
  ctx.stroke();

  // Happy Mascot Face on Cup
  ctx.fillStyle = '#052e16';
  ctx.beginPath();
  ctx.arc(cx - 12, cy - 42, 4, 0, Math.PI * 2);
  ctx.arc(cx + 12, cy - 42, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy - 35, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

/** Helper: Draw store awning with stripes */
function drawStoreAwning(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
  const stripeW = 16;
  const count = Math.floor(width / stripeW);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#ffffff';
    ctx.fillRect(x + i * stripeW, y, stripeW, 16);
    // Scalloped fringe
    ctx.beginPath();
    ctx.arc(x + i * stripeW + stripeW / 2, y + 16, stripeW / 2, 0, Math.PI);
    ctx.fill();
  }
}

/** Helper: Draw Grandpa Max's Rust Bucket RV Motorhome */
function drawRustBucketRV(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Main RV Body
  ctx.fillStyle = '#f8fafc'; // Off-white classic chassis
  ctx.fillRect(x, y - 68, 175, 54);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y - 68, 175, 54);

  // Red and Green side racing stripes (Signature Rust Bucket look!)
  ctx.fillStyle = '#dc2626'; // Red stripe
  ctx.fillRect(x, y - 38, 175, 6);
  ctx.fillStyle = '#16a34a'; // Green stripe
  ctx.fillRect(x, y - 31, 175, 5);

  // Front Windshield
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(x + 140, y - 64);
  ctx.lineTo(x + 170, y - 48);
  ctx.lineTo(x + 140, y - 48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // RV Windows
  ctx.fillRect(x + 20, y - 62, 34, 20);
  ctx.strokeRect(x + 20, y - 62, 34, 20);
  ctx.fillRect(x + 70, y - 62, 45, 20);
  ctx.strokeRect(x + 70, y - 62, 45, 20);

  // Rooftop AC unit
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x + 55, y - 78, 38, 10);

  // Wheels
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + 35, y - 10, 15, 0, Math.PI * 2);
  ctx.arc(x + 135, y - 10, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(x + 35, y - 10, 7, 0, Math.PI * 2);
  ctx.arc(x + 135, y - 10, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Helper: Parked car */
function drawParkedCar(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#3b82f6'; // Blue sedan
  ctx.fillRect(x, y - 34, 90, 24);
  ctx.beginPath();
  ctx.moveTo(x + 15, y - 34);
  ctx.lineTo(x + 30, y - 50);
  ctx.lineTo(x + 65, y - 50);
  ctx.lineTo(x + 80, y - 34);
  ctx.closePath();
  ctx.fill();

  // Wheels
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + 22, y - 8, 10, 0, Math.PI * 2);
  ctx.arc(x + 70, y - 8, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Helper: Streetlight with glowing lamp */
function drawStreetLight(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 130);
  ctx.quadraticCurveTo(x, y - 150, x + 25, y - 150);
  ctx.stroke();

  // Lamp shade
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + 18, y - 153, 16, 7);

  // Glowing warm light
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(x + 26, y - 146, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Helper: Suburban tree */
function drawSuburbanTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 6, y - 65, 12, 65);

  // Green Foliage canopy
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(x, y - 85, 32, 0, Math.PI * 2);
  ctx.arc(x - 18, y - 70, 24, 0, Math.PI * 2);
  ctx.arc(x + 18, y - 70, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(x - 5, y - 90, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
