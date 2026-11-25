// Dapur Kilat — data: ingredients, recipes, colours and timings.
// Every number here is a design choice, not a copy of another game.
const DK = {
  canvasW: 960,
  canvasH: 600,
  shiftSeconds: 90,
  orderSeconds: 26,
  maxOrders: 3,
  maxLayers: 8,
  hearts: 3,
  spawnDelayMs: 900,
};

// One ingredient: id, label, key, colours and the shape its layer draws as.
const INGREDIENTS = [
  { id: 'bunBawah', label: 'Roti Bawah', key: '1', top: '#e8b06a', side: '#c98d4b', shape: 'bunBottom' },
  { id: 'patty', label: 'Patty Daging', key: '2', top: '#7a4a2b', side: '#5d3620', shape: 'patty' },
  { id: 'keju', label: 'Keju', key: '3', top: '#ffc93c', side: '#f0a500', shape: 'cheese' },
  { id: 'selada', label: 'Selada', key: '4', top: '#7bc96f', side: '#4e9b47', shape: 'lettuce' },
  { id: 'tomat', label: 'Tomat', key: '5', top: '#e74c3c', side: '#c0392b', shape: 'tomato' },
  { id: 'bunAtas', label: 'Roti Atas', key: '6', top: '#e8b06a', side: '#c98d4b', shape: 'bunTop' },
];

const ING_BY_ID = {};
for (const ing of INGREDIENTS) ING_BY_ID[ing.id] = ing;

// One order: a name, the stack bottom-to-top, and what it pays.
const RECIPES = [
  { name: 'Burger Klasik', value: 40, stack: ['bunBawah', 'patty', 'selada', 'bunAtas'] },
  { name: 'Keju Lumer', value: 55, stack: ['bunBawah', 'patty', 'keju', 'patty', 'bunAtas'] },
  { name: 'Veggie Segar', value: 45, stack: ['bunBawah', 'selada', 'tomat', 'keju', 'bunAtas'] },
  { name: 'Tomat Segar', value: 50, stack: ['bunBawah', 'patty', 'tomat', 'selada', 'bunAtas'] },
  { name: 'Double Daging', value: 70, stack: ['bunBawah', 'patty', 'keju', 'patty', 'keju', 'bunAtas'] },
];

const CUSTOMERS = ['Bu Sari', 'Pak Budi', 'Mbak Rina', 'Mas Agus', 'Dek Lala', 'Kak Dimas', 'Bu Tini', 'Pak Joko'];

// Kitchen palette: warm wood, cream tiles and a dark header.
const COLORS = {
  header: '#2b2118',
  headerText: '#ffe9c4',
  wall: '#f6ead6',
  tile: '#efe0c3',
  board: '#fff8ea',
  boardEdge: '#d9c39a',
  counter: '#b07a45',
  counterEdge: '#8a5a2e',
  plate: '#ffffff',
  plateEdge: '#cfc4ae',
  button: '#27ae60',
  buttonEdge: '#1e8449',
  danger: '#e74c3c',
  gold: '#f1c40f',
  ink: '#3a2a18',
  muted: '#8a7a63',
};
