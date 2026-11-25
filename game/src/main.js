// Dapur Kilat — state, input, loop and sound. No libraries, no network.
// The game boots from window.SHOT for screenshots: 'play', 'serve' or 'rush'
// jump straight into a mid-game frame instead of the title screen.

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let audioCtx = null;
function beep(freq, ms, type, gain) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.value = gain || 0.08;
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + ms / 1000);
  } catch (e) { /* sound is decoration; a silent game still plays */ }
}
function jingle(notes) {
  notes.forEach((n, i) => setTimeout(() => beep(n, 110, 'triangle', 0.09), i * 95));
}

function freshState() {
  return {
    phase: 'title',
    score: 0,
    coins: 0,
    hearts: DK.hearts,
    served: 0,
    shiftLeft: DK.shiftSeconds,
    plate: [],
    orders: [null, null, null],
    floaters: [],
    lastSpawn: 0,
    customerIdx: 0,
    startedAt: 0,
  };
}

let s = freshState();

function pickRecipe() {
  return RECIPES[Math.floor(Math.random() * RECIPES.length)];
}

function spawnOrder(slot) {
  const recipe = pickRecipe();
  s.orders[slot] = {
    recipe,
    customer: CUSTOMERS[s.customerIdx % CUSTOMERS.length],
    left: DK.orderSeconds,
  };
  s.customerIdx++;
}

function startShift() {
  s = freshState();
  s.phase = 'playing';
  s.startedAt = performance.now();
  for (let i = 0; i < DK.maxOrders; i++) spawnOrder(i);
  jingle([523, 659, 784]);
}

function addIngredient(id) {
  if (s.phase !== 'playing') return;
  if (s.plate.length >= DK.maxLayers) {
    beep(140, 90, 'square', 0.06);
    return;
  }
  s.plate.push(id);
  beep(660, 50, 'triangle', 0.06);
}

function clearPlate() {
  if (s.phase !== 'playing' || s.plate.length === 0) return;
  s.plate = [];
  beep(220, 80, 'sawtooth', 0.05);
}

function matchingOrder() {
  if (s.plate.length === 0) return -1;
  for (let i = 0; i < s.orders.length; i++) {
    const o = s.orders[i];
    if (o && stacksEqual(s.plate, o.recipe.stack)) return i;
  }
  return -1;
}

function servePlate() {
  if (s.phase !== 'playing') return;
  const idx = matchingOrder();
  if (idx < 0) {
    beep(130, 140, 'square', 0.07);
    addFloater(DK.canvasW / 2, 250, 'Belum cocok!', '#e74c3c');
    return;
  }
  const order = s.orders[idx];
  const timeBonus = Math.round((order.left / DK.orderSeconds) * 20);
  const gained = order.recipe.value + timeBonus;
  s.score += gained;
  s.coins += order.recipe.value;
  s.served++;
  addFloater(DK.canvasW / 2, 250, '+' + gained + '  Tersaji!', '#27ae60');
  jingle([784, 988, 1175]);
  s.orders[idx] = null;
  s.plate = [];
  s.lastSpawn = performance.now();
}

function addFloater(x, y, text, color) {
  s.floaters.push({ x, y, text, color, born: performance.now() });
  if (s.floaters.length > 8) s.floaters.shift();
}

function tick(dt) {
  if (s.phase !== 'playing') return;
  s.shiftLeft -= dt;
  for (let i = 0; i < s.orders.length; i++) {
    const o = s.orders[i];
    if (!o) continue;
    o.left -= dt;
    if (o.left <= 0) {
      s.orders[i] = null;
      s.hearts--;
      addFloater(DK.canvasW / 2, 150, 'Pesanan hangus!', '#e74c3c');
      beep(180, 220, 'sawtooth', 0.08);
      s.lastSpawn = performance.now();
    }
  }
  const now = performance.now();
  if (now - s.lastSpawn > DK.spawnDelayMs) {
    for (let i = 0; i < s.orders.length; i++) {
      if (!s.orders[i]) {
        spawnOrder(i);
        s.lastSpawn = now;
        break;
      }
    }
  }
  if (s.shiftLeft <= 0 || s.hearts <= 0) {
    s.shiftLeft = Math.max(0, s.shiftLeft);
    s.phase = 'over';
    jingle([392, 330, 262]);
  }
}

function stationAt(px, py) {
  if (py < 424 || py > 532) return -1;
  const bw = 138;
  const gap = 12;
  const x0 = 28;
  for (let i = 0; i < INGREDIENTS.length; i++) {
    const x = x0 + i * (bw + gap);
    if (px >= x && px <= x + bw) return i;
  }
  return -1;
}

function onClick(ev) {
  const rect = canvas.getBoundingClientRect();
  const px = (ev.clientX - rect.left) * (DK.canvasW / rect.width);
  const py = (ev.clientY - rect.top) * (DK.canvasH / rect.height);
  if (s.phase === 'title') { startShift(); return; }
  if (s.phase === 'over') { startShift(); return; }
  const st = stationAt(px, py);
  if (st >= 0) { addIngredient(INGREDIENTS[st].id); return; }
  const cx = DK.canvasW / 2;
  if (px >= cx + 170 && px <= cx + 290 && py >= 268 && py <= 312) { servePlate(); return; }
  if (px >= cx - 290 && px <= cx - 170 && py >= 268 && py <= 312) { clearPlate(); return; }
}

function onKey(ev) {
  if (s.phase === 'title' && (ev.key === 'Enter' || ev.key === ' ')) { startShift(); return; }
  if (s.phase === 'over' && ev.key === 'Enter') { startShift(); return; }
  if (s.phase !== 'playing') return;
  if (ev.key === ' ') { ev.preventDefault(); servePlate(); return; }
  if (ev.key === 'c' || ev.key === 'C' || ev.key === 'Backspace') { clearPlate(); return; }
  const ing = INGREDIENTS.find((g) => g.key === ev.key);
  if (ing) addIngredient(ing.id);
}

canvas.addEventListener('click', onClick);
window.addEventListener('keydown', onKey);

// Screenshot boots: render one chosen mid-game frame on load.
function bootShot(shot) {
  startShift();
  if (shot === 'play') {
    s.score = 120;
    s.coins = 120;
    s.shiftLeft = 62;
    s.plate = ['bunBawah', 'patty', 'keju'];
    s.orders[0] = { recipe: RECIPES[1], customer: 'Bu Sari', left: 18 };
    s.orders[1] = { recipe: RECIPES[0], customer: 'Pak Budi', left: 9 };
    s.orders[2] = { recipe: RECIPES[4], customer: 'Mbak Rina', left: 22 };
  } else if (shot === 'serve') {
    s.score = 240;
    s.coins = 185;
    s.shiftLeft = 48;
    s.plate = ['bunBawah', 'patty', 'selada', 'bunAtas'];
    s.orders[0] = { recipe: RECIPES[0], customer: 'Bu Sari', left: 14 };
    s.orders[1] = { recipe: RECIPES[3], customer: 'Pak Budi', left: 20 };
    s.orders[2] = { recipe: RECIPES[2], customer: 'Mbak Rina', left: 11 };
    addFloater(DK.canvasW / 2, 250, '+52  Tersaji!', '#27ae60');
  } else if (shot === 'rush') {
    s.score = 310;
    s.coins = 260;
    s.hearts = 2;
    s.shiftLeft = 18;
    s.plate = ['bunBawah', 'patty', 'keju', 'patty'];
    s.orders[0] = { recipe: RECIPES[4], customer: 'Bu Sari', left: 6 };
    s.orders[1] = { recipe: RECIPES[1], customer: 'Pak Budi', left: 4 };
    s.orders[2] = { recipe: RECIPES[3], customer: 'Mbak Rina', left: 12 };
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  tick(dt);
  drawKitchen(ctx, s, now);
  requestAnimationFrame(frame);
}

const shot = window.SHOT || new URLSearchParams(location.search).get('shot');
if (shot) bootShot(shot);
requestAnimationFrame(frame);
