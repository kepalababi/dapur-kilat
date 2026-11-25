// Dapur Kilat — every pixel the player sees, drawn with canvas 2D.
// No images, no fonts from the network: shapes, text and colour only.

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawLayer(ctx, shape, x, y, w, ing) {
  ctx.fillStyle = ing.side;
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1;
  if (shape === 'bunTop') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 10, w / 2, 11, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 10, w / 2 - 2, 9, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  } else if (shape === 'bunBottom') {
    rr(ctx, x, y, w, 12, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ing.top;
    rr(ctx, x + 1, y, w - 2, 5, 3);
    ctx.fill();
  } else if (shape === 'patty') {
    rr(ctx, x - 2, y, w + 4, 11, 5);
    ctx.fill();
    ctx.stroke();
  } else if (shape === 'cheese') {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - 6, y + 12);
    ctx.lineTo(x + w / 2 + 4, y + 5);
    ctx.lineTo(x + w / 2 - 2, y + 12);
    ctx.lineTo(x + 6, y + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (shape === 'lettuce') {
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    for (let i = 0; i <= 6; i++) {
      const px = x + (w / 6) * i;
      ctx.lineTo(px, y + (i % 2 === 0 ? 2 : 9));
    }
    ctx.lineTo(x + w, y + 11);
    ctx.lineTo(x, y + 11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (shape === 'tomato') {
    ctx.fillStyle = ing.top;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 5, w / 2 - 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f5b7b1';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 5, w / 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMiniStack(ctx, stack, x, y, w) {
  let cy = y + stack.length * 11;
  for (let i = 0; i < stack.length; i++) {
    cy -= 11;
    const ing = ING_BY_ID[stack[i]];
    drawLayer(ctx, ing.shape, x, cy, w, ing);
  }
}

function drawHeader(ctx, s) {
  ctx.fillStyle = COLORS.header;
  ctx.fillRect(0, 0, DK.canvasW, 54);
  ctx.fillStyle = COLORS.headerText;
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('DAPUR KILAT', 18, 28);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#d8b98a';
  ctx.fillText('burger cepat saji', 178, 30);
  // Shift timer bar
  const tw = 240;
  const tx = DK.canvasW / 2 - tw / 2;
  ctx.fillStyle = '#4a3826';
  rr(ctx, tx, 16, tw, 22, 11);
  ctx.fill();
  const frac = Math.max(0, s.shiftLeft / DK.shiftSeconds);
  ctx.fillStyle = frac < 0.25 ? COLORS.danger : COLORS.gold;
  if (frac > 0) {
    rr(ctx, tx + 2, 18, (tw - 4) * frac, 18, 9);
    ctx.fill();
  }
  ctx.fillStyle = COLORS.headerText;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(Math.ceil(s.shiftLeft) + ' dtk', DK.canvasW / 2, 27);
  // Score, coins, hearts
  ctx.textAlign = 'right';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('Skor ' + s.score, DK.canvasW - 18, 20);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#f5c542';
  ctx.fillText('Koin ' + s.coins, DK.canvasW - 18, 40);
  ctx.fillStyle = '#ff8a80';
  let hearts = '';
  for (let i = 0; i < DK.hearts; i++) hearts += i < s.hearts ? '♥ ' : '♡ ';
  ctx.textAlign = 'left';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(hearts, DK.canvasW - 250, 40);
}

function drawOrderBoard(ctx, s) {
  ctx.fillStyle = COLORS.board;
  rr(ctx, 14, 64, DK.canvasW - 28, 108, 12);
  ctx.fill();
  ctx.strokeStyle = COLORS.boardEdge;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('PAPAN PESANAN', 28, 84);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('sajikan sebelum waktunya habis', 150, 84);
  for (let i = 0; i < DK.maxOrders; i++) {
    const ox = 28 + i * 300;
    const oy = 92;
    const ow = 284;
    const oh = 70;
    const order = s.orders[i];
    ctx.fillStyle = '#fffdf6';
    rr(ctx, ox, oy, ow, oh, 8);
    ctx.fill();
    const matched = order && s.plate.length > 0 && stacksEqual(s.plate, order.recipe.stack);
    ctx.strokeStyle = matched ? COLORS.button : '#e3d3ae';
    ctx.lineWidth = matched ? 3 : 1.5;
    ctx.stroke();
    if (!order) {
      ctx.fillStyle = COLORS.muted;
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('— menunggu pesanan —', ox + ow / 2, oy + oh / 2 + 4);
      continue;
    }
    const frac = Math.max(0, order.left / DK.orderSeconds);
    ctx.fillStyle = frac < 0.3 ? COLORS.danger : '#7fb069';
    rr(ctx, ox + 8, oy + oh - 12, (ow - 16) * frac, 6, 3);
    ctx.fill();
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(order.recipe.name, ox + 10, oy + 18);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(order.customer, ox + 10, oy + 34);
    ctx.fillStyle = '#b7791f';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('Rp' + order.recipe.value + 'k  •  ' + Math.ceil(order.left) + ' dtk', ox + 10, oy + 50);
    drawMiniStack(ctx, order.recipe.stack, ox + ow - 78, oy + 6, 64);
  }
}

function drawPlate(ctx, s) {
  const cx = DK.canvasW / 2;
  const py = 300;
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(cx, py + 52, 150, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.plate;
  ctx.beginPath();
  ctx.ellipse(cx, py + 44, 140, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.plateEdge;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (s.plate.length === 0) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('piring kosong — klik bahan di bawah', cx, py + 48);
  } else {
    let ly = py + 36;
    for (let i = 0; i < s.plate.length; i++) {
      ly -= 12;
      const ing = ING_BY_ID[s.plate[i]];
      drawLayer(ctx, ing.shape, cx - 62, ly, 124, ing);
    }
  }
  ctx.fillStyle = COLORS.ink;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  const matched = s.plate.length > 0 && s.orders.some((o) => o && stacksEqual(s.plate, o.recipe.stack));
  ctx.fillText(matched ? 'Pesanan cocok! Sajikan sekarang.' : 'Rakit burger di piring ini', cx, 208);
  // Serve and Clear buttons
  drawButton(ctx, cx + 170, 268, 120, 44, 'SAJIKAN', matched, COLORS.button, COLORS.buttonEdge);
  drawButton(ctx, cx - 290, 268, 120, 44, 'BUANG', s.plate.length > 0, '#95a5a6', '#7f8c8d');
  ctx.fillStyle = COLORS.muted;
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('Spasi = sajikan • C = buang', cx + 230, 330);
}

function drawButton(ctx, x, y, w, h, label, enabled, fill, edge) {
  ctx.globalAlpha = enabled ? 1 : 0.45;
  ctx.fillStyle = fill;
  rr(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = edge;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  ctx.globalAlpha = 1;
  ctx.textBaseline = 'alphabetic';
}

function drawCounter(ctx, s) {
  ctx.fillStyle = COLORS.counter;
  rr(ctx, 14, 392, DK.canvasW - 28, 158, 12);
  ctx.fill();
  ctx.strokeStyle = COLORS.counterEdge;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffe9c4';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MEJA BAHAN — klik atau tekan 1–6', 28, 414);
  const bw = 138;
  const gap = 12;
  const x0 = 28;
  for (let i = 0; i < INGREDIENTS.length; i++) {
    const ing = INGREDIENTS[i];
    const x = x0 + i * (bw + gap);
    const y = 424;
    const h = 108;
    ctx.fillStyle = '#fff8ea';
    rr(ctx, x, y, bw, h, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    drawLayer(ctx, ing.shape, x + 22, y + 26, bw - 44, ing);
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.label, x + bw / 2, y + 62);
    ctx.fillStyle = COLORS.muted;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('tombol ' + ing.key, x + bw / 2, y + 82);
  }
  ctx.fillStyle = COLORS.muted;
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Klik bahan untuk menumpuk di piring • Sajikan saat tumpukan sama dengan pesanan', DK.canvasW / 2, 576);
}

function drawFloaters(ctx, s, now) {
  ctx.textAlign = 'center';
  for (const f of s.floaters) {
    const age = (now - f.born) / 1000;
    if (age > 1.4) continue;
    ctx.globalAlpha = 1 - age / 1.4;
    ctx.fillStyle = f.color;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(f.text, f.x, f.y - age * 42);
  }
  ctx.globalAlpha = 1;
}

function drawTitle(ctx, s) {
  ctx.fillStyle = 'rgba(43,33,24,0.82)';
  ctx.fillRect(0, 0, DK.canvasW, DK.canvasH);
  ctx.fillStyle = COLORS.headerText;
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DAPUR KILAT', DK.canvasW / 2, 200);
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillStyle = '#f5c542';
  ctx.fillText('Rakit burger secepat kilat, sajikan sebelum pelanggan pergi.', DK.canvasW / 2, 244);
  ctx.fillStyle = '#fff8ea';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Klik bahan (atau tekan 1–6) untuk menumpuk di piring.', DK.canvasW / 2, 300);
  ctx.fillText('Sajikan (Spasi) saat tumpukan sama dengan pesanan.', DK.canvasW / 2, 326);
  ctx.fillText('Shift 90 detik • 3 hati • pesanan hangus kalau waktunya habis.', DK.canvasW / 2, 352);
  ctx.fillStyle = COLORS.button;
  rr(ctx, DK.canvasW / 2 - 110, 390, 220, 52, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('MULAI MASAK', DK.canvasW / 2, 423);
}

function drawGameOver(ctx, s) {
  ctx.fillStyle = 'rgba(43,33,24,0.85)';
  ctx.fillRect(0, 0, DK.canvasW, DK.canvasH);
  ctx.fillStyle = COLORS.headerText;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(s.hearts <= 0 ? 'DAPUR TUTUP!' : 'SHIFT SELESAI!', DK.canvasW / 2, 210);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillStyle = '#f5c542';
  ctx.fillText('Skor akhir: ' + s.score + '  •  Pesanan tersaji: ' + s.served, DK.canvasW / 2, 262);
  ctx.fillStyle = '#fff8ea';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Klik di mana saja untuk masak lagi.', DK.canvasW / 2, 310);
}

function drawKitchen(ctx, s, now) {
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, DK.canvasW, DK.canvasH);
  ctx.fillStyle = COLORS.tile;
  for (let y = 54; y < 392; y += 28) {
    ctx.fillRect(0, y, DK.canvasW, 1);
  }
  drawHeader(ctx, s);
  drawOrderBoard(ctx, s);
  drawPlate(ctx, s);
  drawCounter(ctx, s);
  drawFloaters(ctx, s, now);
  if (s.phase === 'title') drawTitle(ctx, s);
  if (s.phase === 'over') drawGameOver(ctx, s);
}

function stacksEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
