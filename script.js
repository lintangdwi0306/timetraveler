// ==========================================
// TIME TRAVELER — Chronicles of the Lost Era
// ==========================================

// ================= PROLOG DATA =================

const prologSlides = [
  {
    scene: '<span class="character">🧒</span>',
    text: "Namaku Rei. Sore itu aku sedang beres-beres gudang rumah nenek, tempat penuh barang-barang tua yang berdebu."
  },
  {
    scene: '<span class="character">🧒</span><span class="device">🕰️</span>',
    text: "Di antara kardus-kardus lama, aku menemukan sebuah jam saku antik berukir aneh. Anehnya, jam itu masih berdetak walau nenek bilang sudah rusak puluhan tahun."
  },
  {
    scene: '<span class="character">🧒</span><span class="device">🕰️</span>',
    text: "Penasaran, aku menekan tombol kecil di sisinya. Tiba-tiba jam itu bergetar hebat dan memancarkan cahaya keemasan yang menyilaukan!"
  },
  {
    scene: '<span class="device">✨🕰️✨</span>',
    text: "\"Ternyata... ini bukan jam biasa. Ini MESIN WAKTU!\" — tapi sepertinya alat ini rusak, dan aku malah terlempar entah ke zaman mana."
  },
  {
    scene: '<span class="character">👻</span>',
    text: "Sesosok roh kecil muncul dari cahaya jam itu. \"Namaku Kronos, penjaga waktu,\" katanya. \"Mesin ini kehabisan Time Fragment. Bantu aku menyelesaikan tantangan di setiap zaman, agar kau bisa pulang.\""
  },
  {
    scene: '<span class="character">🧒</span><span class="character">👻</span>',
    text: "\"Baiklah Kronos, ayo kita cari jalan pulang — satu zaman demi satu zaman!\""
  }
];

// ================= COMPANION LINES =================

const companionEraIntro = {
  era1: "Kita mendarat di salah satu kerajaan Nusantara. Hati-hati, dan perhatikan sekitarmu, Rei.",
  era2: "Aroma laut dan rempah... kita berada di jalur bahari Nusantara. Bersiaplah berlayar!",
  era3: "Udara terasa tegang. Ini masa perjuangan kemerdekaan Indonesia — semangatnya berkobar di sini.",
  era4: "Wah, cahaya neon di mana-mana. Sepertinya kita berada di masa depan Indonesia!"
};

const companionSuccess = [
  "Yeay! Kamu berhasil!",
  "Mantap, Time Fragment makin dekat!",
  "Kronos bangga padamu!",
  "Kerja bagus, Rei!"
];

const companionRetry = [
  "Hampir! Coba lagi, Rei.",
  "Tidak apa, ayo dicoba sekali lagi.",
  "Sedikit lagi, jangan menyerah!"
];

// ================= SOUND FX (disintesis langsung, tanpa file audio) =================

let audioCtx = null;
function getAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function beep(freq, duration, type, volume, delay, glideTo) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const startAt = ctx.currentTime + (delay || 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.setValueAtTime(freq, startAt);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, startAt + duration);
  gain.gain.setValueAtTime(volume || 0.2, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.03);
}

const sfx = {
  click() { beep(500, 0.05, "triangle", 0.12); },
  correct() {
    beep(523.25, 0.12, "sine", 0.22);
    beep(783.99, 0.16, "sine", 0.2, 0.1);
  },
  wrong() { beep(220, 0.22, "sawtooth", 0.18, 0, 110); },
  complete() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => beep(f, 0.16, "sine", 0.2, i * 0.09));
  },
  // Suara "puter" (whoosh perpindahan) — dibikin berlapis: swirl saat portal
  // membuka, "sedotan" turun saat menarik Rei masuk, lalu "thump" mendarat
  // di zaman baru, supaya berasa jelas ada perpindahan tempat.
  portal() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;

    // 1) swirl naik — portal terbuka & mulai menyedot
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    const filt1 = ctx.createBiquadFilter();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(140, t0);
    osc1.frequency.exponentialRampToValueAtTime(1100, t0 + 0.55);
    filt1.type = "bandpass";
    filt1.Q.value = 0.8;
    filt1.frequency.setValueAtTime(400, t0);
    filt1.frequency.exponentialRampToValueAtTime(2200, t0 + 0.55);
    g1.gain.setValueAtTime(0.0001, t0);
    g1.gain.exponentialRampToValueAtTime(0.2, t0 + 0.15);
    g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    osc1.connect(filt1).connect(g1).connect(ctx.destination);
    osc1.start(t0);
    osc1.stop(t0 + 0.6);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(18, t0);
    lfoGain.gain.setValueAtTime(35, t0);
    lfo.connect(lfoGain).connect(osc1.frequency);
    lfo.start(t0);
    lfo.stop(t0 + 0.6);

    // 2) tersedot masuk — nada jatuh cepat pas karakter "ditarik" ke zaman baru
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(900, t0 + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(80, t0 + 0.95);
    g2.gain.setValueAtTime(0.0001, t0 + 0.5);
    g2.gain.exponentialRampToValueAtTime(0.24, t0 + 0.58);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.97);
    osc2.connect(g2).connect(ctx.destination);
    osc2.start(t0 + 0.5);
    osc2.stop(t0 + 1.0);

    // 3) "thump" mendarat di scene/zaman baru
    const osc3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(95, t0 + 0.92);
    osc3.frequency.exponentialRampToValueAtTime(40, t0 + 1.1);
    g3.gain.setValueAtTime(0.0001, t0 + 0.92);
    g3.gain.exponentialRampToValueAtTime(0.32, t0 + 0.95);
    g3.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.18);
    osc3.connect(g3).connect(ctx.destination);
    osc3.start(t0 + 0.92);
    osc3.stop(t0 + 1.2);

    // lapisan noise "angin berputar" sepanjang transisi
    const bufSize = Math.floor(ctx.sampleRate * 1.05);
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.value = 1.1;
    noiseFilter.frequency.setValueAtTime(250, t0);
    noiseFilter.frequency.exponentialRampToValueAtTime(2500, t0 + 0.5);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, t0 + 1.0);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, t0);
    noiseGain.gain.exponentialRampToValueAtTime(0.15, t0 + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.0);
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
    noise.start(t0);
    noise.stop(t0 + 1.05);
  },
  // Bunyi "tik" ketikan pendek tiap huruf muncul, kayak efek teks visual novel /
  // terminal — bukan suara ngobrol, cuma nemenin teks yang lagi diketik.
  voice() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const dur = 0.02;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1150 + Math.random() * 180, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.055, t0 + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.01);
  },
  typewriter() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(Math.random() > 0.5 ? 980 : 1240, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.045, t0 + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.018);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.025);
  }
};

// ================= EFEK KETIK + SUARA NGOBROL GIBBERISH =================
// Menampilkan teks huruf-per-huruf sambil membunyikan blip acak tiap karakter
// (skip spasi), dipakai untuk gelembung Kronos, toast lapangan, dan dialog cerita.
function typeGibberish(el, text, speed) {
  speed = speed || 20;
  clearInterval(el._typeInterval);
  el.textContent = "";
  let i = 0;
  el._typeInterval = setInterval(() => {
    if (i < text.length) {
      el.textContent = text.slice(0, i + 1);
      const ch = text[i];
      if (ch !== " " && ch !== "\n") sfx.voice(ch);
      i++;
    } else {
      clearInterval(el._typeInterval);
      el._typeInterval = null;
    }
  }, speed);
}

function typeDialogText(el, text, speed) {
  speed = speed || 22;
  clearInterval(el._typeInterval);
  el.textContent = "";
  let i = 0;
  el._typeInterval = setInterval(() => {
    if (i < text.length) {
      el.textContent = text.slice(0, i + 1);
      if (text[i] !== " " && text[i] !== "\n") sfx.typewriter();
      i++;
    } else {
      clearInterval(el._typeInterval);
      el._typeInterval = null;
    }
  }, speed);
}

// ================= MUSIK LATAR =================
// Loop melodi pendek yang disintesis (bukan file audio), main dari saat
// pemain mulai berpetualang sampai sesi bermainnya selesai.
const bgMusic = (function () {
  let playing = false;
  let timer = null;
  let masterGain = null;
  let step = 0;
  const stepDur = 0.42;
  const melody = [523.25, 587.33, 659.25, 784.0, 659.25, 587.33, 523.25, 440.0,
                  493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440.0];
  const bass = [130.81, 130.81, 164.81, 164.81, 146.83, 146.83, 110.0, 110.0];

  function scheduleStep() {
    const ctx = getAudioCtx();
    if (!ctx || !playing || !masterGain) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(melody[step % melody.length], t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 0.92);
    osc.connect(gain).connect(masterGain);
    osc.start(t);
    osc.stop(t + stepDur);

    if (step % 2 === 0) {
      const bosc = ctx.createOscillator();
      const bgain = ctx.createGain();
      bosc.type = "sine";
      bosc.frequency.setValueAtTime(bass[(step / 2) % bass.length], t);
      bgain.gain.setValueAtTime(0.0001, t);
      bgain.gain.exponentialRampToValueAtTime(0.07, t + 0.05);
      bgain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 1.85);
      bosc.connect(bgain).connect(masterGain);
      bosc.start(t);
      bosc.stop(t + stepDur * 2);
    }

    step++;
    timer = setTimeout(scheduleStep, stepDur * 1000);
  }

  return {
    start() {
      const ctx = getAudioCtx();
      if (!ctx || playing) return;
      playing = true;
      masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
      step = 0;
      scheduleStep();
    },
    stop() {
      playing = false;
      if (timer) clearTimeout(timer);
      timer = null;
      if (masterGain) {
        try { masterGain.disconnect(); } catch (e) {}
        masterGain = null;
      }
    }
  };
})();

// Bunyi "klik" halus di setiap tombol
document.addEventListener("click", function (e) {
  if (e.target.closest("button")) sfx.click();
}, true);

// ================= VISUAL FEEDBACK =================

function popConfetti(originEl, icons) {
  const list = icons || ["✨", "⭐", "🎉"];
  const rect = originEl
    ? originEl.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 12; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.textContent = list[Math.floor(Math.random() * list.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    piece.style.left = originX + "px";
    piece.style.top = originY + "px";
    piece.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    piece.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 850);
  }
}

function flashCorrect(el) {
  if (!el) return;
  el.classList.add("fx-correct");
  setTimeout(() => el.classList.remove("fx-correct"), 450);
}

function flashWrong(el) {
  if (!el) return;
  el.classList.add("fx-wrong");
  setTimeout(() => el.classList.remove("fx-wrong"), 450);
}

// ================= ERA DATA =================
// Each era has: intro story, one skill-based minigame, and one narrative dialog choice.

const eras = [
  {
    id: "era1",
    icon: "🏯",
    title: "Kerajaan Nusantara",
    bgClass: "bg-kingdom",
    field: {
      object: { icon: "🏺", label: "Guci Kuno", lore: "Guci ini konon dipakai menyimpan air suci untuk upacara kerajaan.", bonus: 20, pos: 30 },
      echo: { icon: "👑", label: "Time Echo Kerajaan", lore: "Kamu melihat bayangan seorang raja memimpin upacara di halaman istana.", pos: 45 },
      obstacle: { icon: "🪨", pos: 76 },
      npc: { icon: "💂", label: "Penjaga Gerbang", greet: "Selamat datang di halaman istana. Bersiaplah sebelum menghadap raja.", pos: 60 },
      gate: { icon: "🚪", label: "Gerbang Istana", pos: 90 }
    },
    story: "Kamu tiba di halaman kerajaan Nusantara pada masa lalu. Mesin waktumu rusak dan membutuhkan Time Fragment untuk kembali ke masa sekarang.",
    completeText: "Kamu berhasil melewati Kerajaan Nusantara dan mengumpulkan Time Fragment pertama! Candi dan istana di masa ini menjadi saksi kejayaan kerajaan-kerajaan Indonesia.",
    // 4 tantangan berbeda — dipakai bergiliran tiap kali kamu menamatkan game (lihat computeChallenge()).
    variants: [
      { type: "memory", hint: "Cocokkan dua kartu artefak kerajaan yang sama.",
        icons: ["👑", "🏯", "⚔️", "📜", "🛡️", "🏹", "💍"] },
      { type: "sequence", hint: "Susun tata cara menghadap raja sesuai urutan yang benar.",
        steps: [
          { icon: "🙇", label: "Beri hormat pada penjaga gerbang" },
          { icon: "🗣️", label: "Sampaikan maksud kedatangan" },
          { icon: "🚶", label: "Melangkah menuju balairung" },
          { icon: "🎗️", label: "Serahkan tanda pengenal kerajaan" },
          { icon: "⏳", label: "Tunggu giliran dipanggil" },
          { icon: "👑", label: "Menghadap sang raja" }
        ] },
      { type: "tap", hint: "Berlatih pedang secepat mungkin sebelum waktu habis!",
        target: 20, timeLimit: 6, buttonLabel: "⚔️ BERLATIH!", visual: "meter", meterIcon: "⚔️" },
      { type: "simon", hint: "Ingat kode lonceng penjaga menara, lalu ulangi.",
        pads: ["🔔", "🕯️", "📯", "🚩"], length: 4 },
      { type: "quiz", hint: "Jawab pertanyaan tentang kehidupan kerajaan.",
        question: "Apa sebutan untuk pemimpin tertinggi sebuah kerajaan?",
        options: ["Perdana Menteri", "Raja atau Ratu", "Gubernur", "Camat"], correct: 1 },
      { type: "scramble", hint: "Susun huruf acak menjadi istilah kerajaan.",
        clue: "Tempat tinggal raja dan keluarganya disebut...", answer: "ISTANA" }
    ],
    dialog: {
      npc: "Seorang penjaga istana menghadangmu. \"Orang asing! Buktikan niatmu sebelum masuk lebih jauh.\"",
      options: [
        { label: "Tunjukkan sikap hormat dan membungkuk", response: "Penjaga itu tersenyum tipis. \"Sopan santunmu mengingatkanku pada pelajaran para tetua,\" katanya sambil membuka gerbang." },
        { label: "Tunjukkan keberanian dan berjalan tegap", response: "Penjaga itu terkesan. \"Keberanianmu pantas dihormati,\" katanya sambil mempersilakanmu masuk." }
      ]
    }
  },
  {
    id: "era2",
    icon: "⛵",
    title: "Jalur Rempah Nusantara",
    bgClass: "bg-explore",
    field: {
      object: { icon: "⚓", label: "Jangkar Tua", lore: "Jangkar ini pernah dipakai kapal dagang yang singgah ratusan tahun lalu.", bonus: 20, pos: 30 },
      echo: { icon: "🧭", label: "Time Echo Pelabuhan", lore: "Bayangan para pelaut muncul, mengikuti bintang untuk menemukan arah pulang.", pos: 45 },
      obstacle: { icon: "🪵", pos: 76 },
      npc: { icon: "🧑‍✈️", label: "Nakhoda Muda", greet: "Angin sedang bagus hari ini, cocok sekali untuk berlayar!", pos: 60 },
      gate: { icon: "⛴️", label: "Dermaga Kapal", pos: 90 }
    },
    story: "Kamu terdampar di pelabuhan Nusantara yang ramai. Kapal-kapal bersiap membawa rempah dan menjelajahi jalur laut antarpulau.",
    completeText: "Layar telah dikembangkan! Kamu mendapatkan Time Fragment kedua. Jalur rempah membuat pelabuhan Nusantara dikenal hingga berbagai penjuru dunia.",
    variants: [
      { type: "sequence", hint: "Tekan langkah persiapan berlayar sesuai urutan yang benar.",
        steps: [
          { icon: "🗺️", label: "Pelajari peta" },
          { icon: "🧭", label: "Siapkan kompas" },
          { icon: "🧑‍🤝‍🧑", label: "Kumpulkan awak kapal" },
          { icon: "📦", label: "Muat perbekalan" },
          { icon: "⚓", label: "Angkat jangkar" },
          { icon: "⛵", label: "Kembangkan layar" }
        ] },
      { type: "memory", hint: "Cocokkan rasi bintang & simbol navigasi yang sama.",
        icons: ["⭐", "🌙", "🧭", "🌊", "⚓", "🐚", "🦑"] },
      { type: "tap", hint: "Dayung secepat mungkin menembus arus deras!",
        target: 20, timeLimit: 6, buttonLabel: "🚣 DAYUNG!", visual: "meter", meterIcon: "🚣" },
      { type: "simon", hint: "Ingat kode bendera semaphore antar kapal, lalu ulangi.",
        pads: ["🚩", "🔵", "🔺", "⚪"], length: 4 },
      { type: "quiz", hint: "Jawab pertanyaan tentang penjelajahan samudra.",
        question: "Alat yang membantu pelaut zaman dulu menentukan arah mata angin adalah?",
        options: ["Kompas", "Termometer", "Mikroskop", "Stetoskop"], correct: 0 },
      { type: "scramble", hint: "Susun huruf acak menjadi istilah pelayaran.",
        clue: "Lautan luas yang dijelajahi para pelaut zaman dulu disebut...", answer: "SAMUDRA" }
    ],
    dialog: {
      npc: "Seorang nakhoda tua menawarimu ikut berlayar. \"Badai bisa datang kapan saja. Bagaimana sikapmu di laut nanti?\"",
      options: [
        { label: "Tetap tenang dan percaya pada rencana", response: "Nakhoda mengangguk. \"Ketenangan adalah bekal terbaik seorang pelaut,\" ujarnya sambil menepuk pundakmu." },
        { label: "Waspada dan terus mengawasi langit", response: "Nakhoda tertawa kecil. \"Mata yang jeli menyelamatkan banyak kapal,\" katanya setuju." }
      ]
    }
  },
  {
    id: "era3",
    icon: "🇮🇩",
    title: "Perjuangan Kemerdekaan",
    bgClass: "bg-struggle",
    field: {
      object: { icon: "🥁", label: "Kentongan Tua", lore: "Kentongan ini dulu dipakai memberi tanda bahaya kepada warga desa.", bonus: 20, pos: 30 },
      echo: { icon: "📜", label: "Time Echo Perjuangan", lore: "Kamu mendengar gema pidato yang membakar semangat para pejuang.", pos: 45 },
      obstacle: { icon: "🧱", pos: 76 },
      npc: { icon: "🎖️", label: "Prajurit Muda", greet: "Tetap waspada, keadaan di sini masih genting.", pos: 60 },
      gate: { icon: "🚩", label: "Garis Depan", pos: 90 }
    },
    story: "Suasana penuh semangat juang menyelimuti udara. Kamu berada di tengah masa perjuangan kemerdekaan Indonesia.",
    completeText: "Merdeka! Kamu mendapatkan Time Fragment ketiga. Semangat persatuan seperti inilah yang mengantarkan Indonesia pada Proklamasi 17 Agustus 1945.",
    variants: [
      { type: "tap", hint: "Tekan tombol secepat mungkin untuk mengibarkan bendera sebelum waktu habis!",
        target: 22, timeLimit: 6, buttonLabel: "🇮🇩 KIBARKAN!", visual: "flag" },
      { type: "memory", hint: "Cocokkan simbol pasukan perjuangan yang sama.",
        icons: ["🎖️", "🪖", "📯", "🚩", "🥁", "✊", "🔫"] },
      { type: "sequence", hint: "Susun siasat perjuangan sesuai urutan yang benar.",
        steps: [
          { icon: "🕵️", label: "Amati pergerakan musuh" },
          { icon: "🗺️", label: "Susun rencana serangan" },
          { icon: "🤝", label: "Koordinasi dengan pasukan" },
          { icon: "🌙", label: "Bergerak saat malam hari" },
          { icon: "💥", label: "Lancarkan serangan kejut" },
          { icon: "🏳️", label: "Amankan wilayah" }
        ] },
      { type: "simon", hint: "Ingat kode sandi rahasia antar pejuang, lalu ulangi.",
        pads: ["📡", "🔴", "⚫", "📻"], length: 4 },
      { type: "quiz", hint: "Jawab pertanyaan tentang perjuangan kemerdekaan.",
        question: "Indonesia memproklamasikan kemerdekaannya pada tanggal berapa?",
        options: ["17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928", "10 November 1945"], correct: 0 },
      { type: "scramble", hint: "Susun huruf acak menjadi kata perjuangan.",
        clue: "Kata yang diteriakkan rakyat Indonesia setelah proklamasi kemerdekaan", answer: "MERDEKA" }
    ],
    dialog: {
      npc: "Seorang pejuang muda menatapmu penuh semangat. \"Kita semua punya peran. Apa yang akan kau lakukan untuk perjuangan ini?\"",
      options: [
        { label: "Membantu menyampaikan kabar antar pejuang", response: "\"Kabar yang cepat sampai bisa menyelamatkan banyak nyawa,\" katanya sambil tersenyum bangga." },
        { label: "Menjaga semangat kawan-kawan yang lelah", response: "\"Semangat yang terjaga adalah senjata paling kuat,\" ujarnya sambil mengangguk haru." }
      ]
    }
  },
  {
    id: "era4",
    icon: "🚀",
    title: "Masa Depan Indonesia",
    bgClass: "bg-future",
    field: {
      object: { icon: "💻", label: "Terminal Data", lore: "Terminal ini menyimpan arsip sejarah dari seluruh zaman yang pernah kau kunjungi.", bonus: 20, pos: 30 },
      echo: { icon: "🔮", label: "Time Echo Masa Depan", lore: "Sebuah rekaman hologram memperlihatkan bumi yang tetap hijau dan terawat.", pos: 45 },
      obstacle: { icon: "🔋", pos: 76 },
      npc: { icon: "🤖", label: "Asisten AI", greet: "Selamat datang di pusat kendali. Sistem menunggu kalibrasi darimu.", pos: 60 },
      gate: { icon: "🚪", label: "Pintu Laboratorium", pos: 90 }
    },
    story: "Kota-kota Indonesia bercahaya neon menjulang tinggi. Teknologi canggih dan budaya Nusantara hidup berdampingan — inilah masa depan.",
    completeText: "Sistem mesin waktu akhirnya stabil! Kamu mengumpulkan Time Fragment terakhir. Masa depan Indonesia akan ditentukan oleh teknologi, lingkungan, dan jati diri bangsa.",
    variants: [
      { type: "simon", hint: "Perhatikan pola cahaya, lalu ulangi dengan menekan panel yang sama.",
        pads: ["⚡", "🔷", "⭐", "🔺"], length: 4 },
      { type: "memory", hint: "Cocokkan modul sirkuit yang sama.",
        icons: ["🔋", "💾", "🧩", "🔧", "💡", "📡", "🛰️"] },
      { type: "sequence", hint: "Kalibrasi ulang mesin waktu sesuai urutan yang benar.",
        steps: [
          { icon: "🔍", label: "Diagnosa kerusakan sistem" },
          { icon: "🧯", label: "Dinginkan reaktor" },
          { icon: "🔧", label: "Ganti komponen yang rusak" },
          { icon: "🔌", label: "Sambungkan ulang kabel" },
          { icon: "💾", label: "Unggah data waktu" },
          { icon: "🚀", label: "Aktifkan mesin waktu" }
        ] },
      { type: "tap", hint: "Isi daya reaktor secepat mungkin sebelum waktu habis!",
        target: 20, timeLimit: 6, buttonLabel: "🔋 ISI DAYA!", visual: "meter", meterIcon: "🔋" },
      { type: "quiz", hint: "Jawab pertanyaan tentang teknologi masa depan.",
        question: "Sumber energi ramah lingkungan yang bisa diperbarui disebut energi...?",
        options: ["Fosil", "Nuklir", "Terbarukan", "Baterai"], correct: 2 },
      { type: "scramble", hint: "Susun huruf acak menjadi istilah masa depan.",
        clue: "Ilmu terapan yang terus berkembang untuk mempermudah kehidupan manusia", answer: "TEKNOLOGI" }
    ],
    dialog: {
      npc: "Sebuah AI pemandu muncul di layar holografik. \"Masa depan dibentuk oleh pilihan hari ini. Apa fokusmu?\"",
      options: [
        { label: "Mengembangkan teknologi ramah lingkungan", response: "\"Pilihan bijak,\" kata AI itu. \"Keberlanjutan adalah kunci masa depan yang layak dihuni.\"" },
        { label: "Menjaga teknologi tetap manusiawi", response: "\"Kearifan yang jarang ditemukan,\" balas AI itu. \"Teknologi terbaik tetap melayani manusia.\"" }
      ]
    }
  }
];

const CHALLENGE_LABELS = {
  memory: "Cocokkan Kartu",
  sequence: "Susun Urutan",
  tap: "Tekan Cepat",
  simon: "Ingat Pola",
  quiz: "Kuis Sejarah",
  scramble: "Susun Huruf"
};

const quizQuestionPools = {
  era1: [
    { question: "Kerajaan maritim besar yang pernah berjaya di Sumatra adalah?", options: ["Sriwijaya", "Mataram", "Demak", "Pajajaran"], correct: 0 },
    { question: "Candi Buddha terbesar di Indonesia adalah?", options: ["Prambanan", "Borobudur", "Muaro Jambi", "Gedong Songo"], correct: 1 },
    { question: "Kerajaan yang terkenal dengan Sumpah Palapa adalah?", options: ["Majapahit", "Kutai", "Tarumanegara", "Samudra Pasai"], correct: 0 },
    { question: "Candi Prambanan banyak dikaitkan dengan peninggalan kerajaan?", options: ["Mataram Kuno", "Sriwijaya", "Majapahit", "Aceh"], correct: 0 }
  ],
  era2: [
    { question: "Kepulauan yang terkenal sebagai penghasil cengkih dan pala adalah?", options: ["Maluku", "Bali", "Madura", "Bangka"], correct: 0 },
    { question: "Komoditas yang membuat Nusantara terkenal di dunia adalah?", options: ["Rempah-rempah", "Gandum", "Salju", "Sutra Jepang"], correct: 0 },
    { question: "Apa yang digunakan kapal untuk bergerak memanfaatkan angin?", options: ["Layar", "Roda", "Sayap", "Rantai"], correct: 0 },
    { question: "Apa arti semboyan 3G dalam penjelajahan bangsa Eropa?", options: ["Gold, Gospel, Glory", "Game, Goal, Group", "Guide, Gate, Gift", "Green, Good, Great"], correct: 0 }
  ],
  era3: [
    { question: "Indonesia memproklamasikan kemerdekaannya pada tanggal berapa?", options: ["17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928", "10 November 1945"], correct: 0 },
    { question: "Siapa yang membacakan teks Proklamasi Kemerdekaan Indonesia?", options: ["Ki Hajar Dewantara", "Soekarno", "Jenderal Sudirman", "B.J. Habibie"], correct: 1 },
    { question: "Apa warna bendera Indonesia?", options: ["Merah dan putih", "Biru dan putih", "Hijau dan kuning", "Hitam dan merah"], correct: 0 },
    { question: "Sikap penting dalam perjuangan bersama adalah?", options: ["Persatuan", "Menyerah", "Bermalas-malasan", "Bertengkar"], correct: 0 }
  ],
  era4: [
    { question: "Teknologi yang membantu menjaga hutan dan laut Indonesia adalah?", options: ["Pemantauan satelit", "Merusak terumbu karang", "Membuang limbah", "Membakar hutan"], correct: 0 },
    { question: "Sumber energi bersih yang cocok dikembangkan di Indonesia adalah?", options: ["Surya dan angin", "Batu bara saja", "Bensin", "Minyak tanah"], correct: 0 },
    { question: "Teknologi yang memungkinkan mesin belajar dari data disebut...?", options: ["Kecerdasan buatan", "Mesin tik", "Kompas", "Telepon kabel"], correct: 0 },
    { question: "Kota masa depan yang baik seharusnya menggabungkan teknologi dengan?", options: ["Pelestarian budaya dan lingkungan", "Polusi", "Pemborosan energi", "Penghancuran alam"], correct: 0 }
  ]
};

const scrambleQuestionPools = {
  era1: [
    { clue: "Kerajaan besar yang terkenal dengan Gajah Mada", answer: "MAJAPAHIT" },
    { clue: "Kerajaan maritim besar dari Sumatra", answer: "SRIWIJAYA" },
    { clue: "Candi Buddha terbesar di Indonesia", answer: "BOROBUDUR" },
    { clue: "Bangunan suci peninggalan kerajaan disebut...", answer: "CANDI" }
  ],
  era2: [
    { clue: "Bumbu yang membuat Nusantara terkenal di dunia", answer: "REMPAH" },
    { clue: "Kepulauan penghasil cengkih dan pala", answer: "MALUKU" },
    { clue: "Bagian kapal yang menangkap tenaga angin", answer: "LAYAR" },
    { clue: "Salah satu unsur semboyan 3G yang berarti kekayaan", answer: "GOLD" }
  ],
  era3: [
    { clue: "Kata yang diteriakkan rakyat Indonesia setelah proklamasi kemerdekaan", answer: "MERDEKA" },
    { clue: "Orang yang berjuang membela bangsa disebut...", answer: "PAHLAWAN" },
    { clue: "Kain yang dikibarkan sebagai simbol negara disebut...", answer: "BENDERA" },
    { clue: "Sikap yang dibutuhkan para pejuang saat menghadapi tantangan", answer: "BERANI" }
  ],
  era4: [
    { clue: "Teknologi yang membantu kehidupan manusia di masa depan", answer: "TEKNOLOGI" },
    { clue: "Mesin yang dapat membantu manusia melakukan tugas otomatis", answer: "ROBOT" },
    { clue: "Jaringan global untuk menghubungkan seluruh Indonesia", answer: "INTERNET" },
    { clue: "Energi bersih dari sinar matahari", answer: "SURYA" }
  ]
};

// ================= PENILAIAN TANTANGAN =================
// Tiap tantangan zaman bernilai penuh 250 poin kalau diselesaikan dalam
// satu kali percobaan tanpa kesalahan sama sekali. Tiap kali salah/keliru,
// poinnya dikurangi, dengan batas minimum agar tetap ada hasil.
const CHALLENGE_MAX_SCORE = 250;
const MISTAKE_PENALTY = 40;
const CHALLENGE_MIN_SCORE = 50;
const MEMORY_MISTAKE_PENALTY = 10;

function scoreForMistakes(mistakes) {
  return Math.max(CHALLENGE_MAX_SCORE - mistakes * MISTAKE_PENALTY, CHALLENGE_MIN_SCORE);
}

// ================= LEVEL / DIFFICULTY PERSISTENCE =================
// playLevel bertambah tiap kali pemain menamatkan SELURUH zaman.
// Dipakai untuk (a) memilih varian tantangan tiap zaman secara bergilir,
// (b) menaikkan angka kesulitan tiap kali varian yang sama terulang.

const MAX_PLAY_LEVEL = 9;
let memoryLevelFallback = 0;

function loadLevel() {
  try {
    const v = localStorage.getItem("tt_playLevel");
    return v !== null ? (parseInt(v, 10) || 0) : 0;
  } catch (e) {
    return memoryLevelFallback;
  }
}

function saveLevel(v) {
  try {
    localStorage.setItem("tt_playLevel", String(v));
  } catch (e) {
    memoryLevelFallback = v;
  }
}

let playLevel = Math.min(loadLevel(), MAX_PLAY_LEVEL);

// ================= RANDOM CHALLENGE =================
// Jenis tantangan dikocok sekali setiap putaran/level baru.
let sessionChallengeTypes = {};

function assignSessionChallenges() {
  // Semua zaman punya kumpulan jenis tantangan yang sama (memory, sequence, tap,
  // simon, quiz, scramble), hanya urutannya beda-beda. Ambil daftar jenisnya dari
  // zaman pertama, acak, lalu bagikan satu jenis unik ke tiap zaman.
  const allTypes = eras[0].variants.map(v => v.type);
  const shuffledTypes = shuffle(allTypes.slice());

  sessionChallengeTypes = {};
  eras.forEach((era, i) => {
    sessionChallengeTypes[era.id] = shuffledTypes[i % shuffledTypes.length];
  });
}

assignSessionChallenges(); // undian awal saat game pertama kali dimuat

// Ambil konfigurasi tantangan untuk level ini, lalu terapkan penambahan
// kesulitan sesuai playLevel. Retry dalam level yang sama memakai jenis yang sama.
function computeChallenge(era) {
  const assignedType = sessionChallengeTypes[era.id];
  let variantIndex = era.variants.findIndex(v => v.type === assignedType);
  if (variantIndex < 0) variantIndex = 0;
  const loopCount = playLevel;
  const base = era.variants[variantIndex];
  const config = JSON.parse(JSON.stringify(base));

  if (config.type === "memory") {
    const pairCount = Math.min(4 + loopCount, config.icons.length);
    config.icons = config.icons.slice(0, pairCount);
  } else if (config.type === "sequence") {
    const stepCount = Math.min(4 + loopCount, config.steps.length);
    config.steps = config.steps.slice(0, stepCount);
  } else if (config.type === "tap") {
    config.target = Math.min(config.target + loopCount * 4, config.target + 16);
    config.timeLimit = Math.max(3, config.timeLimit - Math.floor(loopCount / 2));
  } else if (config.type === "simon") {
    config.length = Math.min(config.length + loopCount, config.length + 4);
  }

  return config;
}

// ================= STATE =================

let score = 0;
let currentEraIndex = 0;
let unlockedCount = 1;
let currentStage = "game"; // "game" | "dialog"
let currentChallenge = null;
const quizQuestionHistory = {};
const scrambleQuestionHistory = {};
const discoveredEchoes = new Set();
const completedEras = new Set();
let discoveredObjects = 0;

const achievementDefinitions = [
  { id: "first-fragment", icon: "⏳", title: "Fragmen Pertama", description: "Selesaikan satu zaman.", check: () => completedEras.size >= 1 },
  { id: "time-explorer", icon: "🔍", title: "Penjelajah Waktu", description: "Temukan semua benda tersembunyi.", check: () => discoveredObjects >= eras.length },
  { id: "four-eras", icon: "🗺️", title: "Empat Penjuru Waktu", description: "Selesaikan seluruh zaman.", check: () => completedEras.size === eras.length },
  { id: "perfect-run", icon: "🌟", title: "Lompatan Sempurna", description: "Raih skor minimal 1.250.", check: () => score >= 1250 }
];

// ================= ELEMENTS =================

const pages = document.querySelectorAll(".page");
const startBtn = document.getElementById("startBtn");
const howBtn = document.getElementById("howBtn");
const levelBadge = document.getElementById("levelBadge");
const resetLevelBtn = document.getElementById("resetLevelBtn");
const backFromHow = document.getElementById("backFromHow");
const backHome = document.getElementById("backHome");

const prologScene = document.getElementById("prologScene");
const prologText = document.getElementById("prologText");
const prologDots = document.getElementById("prologDots");
const prologNext = document.getElementById("prologNext");

const eraContainer = document.getElementById("eraContainer");
const fragCount = document.getElementById("fragCount");
const timelineMap = document.getElementById("timelineMap");
const achievementCount = document.getElementById("achievementCount");
const achievementList = document.getElementById("achievementList");
const echoCount = document.getElementById("echoCount");
const echoList = document.getElementById("echoList");

const scoreElement = document.getElementById("score");
const eraIcon = document.getElementById("eraIcon");
const eraTitle = document.getElementById("eraTitle");
const storyText = document.getElementById("storyText");
const eraBg = document.getElementById("eraBg");
const stageLabel = document.getElementById("stageLabel");
const fieldBox = document.getElementById("fieldBox");
const fieldScene = document.getElementById("fieldScene");
const fieldObject = document.getElementById("fieldObject");
const fieldObjectIcon = document.getElementById("fieldObjectIcon");
const fieldEcho = document.getElementById("fieldEcho");
const fieldEchoIcon = document.getElementById("fieldEchoIcon");
const fieldObstacle = document.getElementById("fieldObstacle");
const fieldObstacleIcon = document.getElementById("fieldObstacleIcon");
const fieldNpc = document.getElementById("fieldNpc");
const fieldNpcIcon = document.getElementById("fieldNpcIcon");
const fieldGate = document.getElementById("fieldGate");
const fieldGateIcon = document.getElementById("fieldGateIcon");
const fieldGateLabel = document.getElementById("fieldGateLabel");
const fieldCharacter = document.getElementById("fieldCharacter");
const fieldCharacterSprite = document.getElementById("fieldCharacterSprite");
const fieldToast = document.getElementById("fieldToast");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnJump = document.getElementById("btnJump");
const challengeBox = document.getElementById("challengeBox");
const dialogBox = document.getElementById("dialogBox");
const resultElement = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

const eraCompleteText = document.getElementById("eraCompleteText");
const runningScore = document.getElementById("runningScore");
const continueMapBtn = document.getElementById("continueMapBtn");

const finalScore = document.getElementById("finalScore");
const endingText = document.getElementById("endingText");
const endingBox = document.getElementById("endingBox");
const endingLogo = document.getElementById("endingLogo");
const endingTitle = document.getElementById("endingTitle");
const endingIntro = document.getElementById("endingIntro");
const endingAchievements = document.getElementById("endingAchievements");
const retryEraBtn = document.getElementById("retryEraBtn");
const playAgain = document.getElementById("playAgain");

// Skor total minimum yang harus terkumpul di akhir zaman terakhir
// supaya Rei dianggap berhasil mengumpulkan cukup Time Fragment untuk pulang.
// Tiap zaman: tantangan (maks 250, tanpa kesalahan) + pilihan dialog (50) = 300.
// Bonus eksplorasi benda tersembunyi membuat skor maksimal satu putaran 1280.
// Batas 1000 memberi ruang untuk beberapa kesalahan dalam satu kali bermain.
function getMinScoreToReturn(level) {
  return 1000 + Math.min(Math.floor(level / 2) * 50, 250);
}

const companion = document.getElementById("companion");
const companionBubble = document.getElementById("companionBubble");
const flashOverlay = document.getElementById("flashOverlay");
const portalOverlay = document.getElementById("portalOverlay");
const portalIcon = document.getElementById("portalIcon");
const portalLabel = document.getElementById("portalLabel");
const homeStars = document.getElementById("homeStars");

// ================= HELPERS =================

function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sayCompanion(text) {
  companion.style.display = "flex";
  companionBubble.classList.remove("show");
  void companionBubble.offsetWidth;
  companionBubble.classList.add("show");
  typeGibberish(companionBubble, text);
}

function flashScreen(callback) {
  flashOverlay.classList.remove("flash");
  void flashOverlay.offsetWidth;
  flashOverlay.classList.add("flash");
  setTimeout(callback, 280);
}

// Portal waktu — dipakai tiap kali pemain melompat antar zaman / kembali ke peta.
// iconEmoji = ikon yang tampak "melayang masuk" ke pusaran (biasanya ikon zaman tujuan).
// labelText = teks kecil di bawah pusaran (misal "Menuju Zaman Kerajaan...").
// callback  = dijalankan tepat saat layar tertutup penuh, untuk mengganti konten di baliknya.
function playPortalTransition(iconEmoji, labelText, callback) {
  portalIcon.textContent = iconEmoji;
  portalLabel.textContent = labelText || "Melintasi Waktu...";
  portalOverlay.className = "portal-overlay show";
  sfx.portal();

  requestAnimationFrame(() => {
    portalOverlay.classList.add("open");
  });

  setTimeout(() => {
    portalOverlay.classList.add("suck");
  }, 600);

  setTimeout(() => {
    callback();
  }, 950);

  setTimeout(() => {
    portalOverlay.classList.remove("open");
    portalOverlay.classList.add("close");
  }, 1000);

  setTimeout(() => {
    portalOverlay.classList.remove("show", "open", "suck", "close");
  }, 1500);
}

// ================= HOME STARS =================

(function buildHomeStars() {
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 2.5) + "s";
    homeStars.appendChild(s);
  }
})();

// ================= HOME =================

startBtn.addEventListener("click", function () {
  score = 0;
  currentEraIndex = 0;
  unlockedCount = 1;
  completedEras.clear();
  discoveredObjects = 0;
  discoveredEchoes.clear();
  Object.keys(quizQuestionHistory).forEach(eraId => delete quizQuestionHistory[eraId]);
  Object.keys(scrambleQuestionHistory).forEach(eraId => delete scrambleQuestionHistory[eraId]);
  scoreElement.textContent = score;
  companion.style.display = "none";
  assignSessionChallenges();
  bgMusic.start();
  startProlog();
});

howBtn.addEventListener("click", function () {
  showPage("howTo");
});

backFromHow.addEventListener("click", function () {
  showPage("home");
});

backHome.addEventListener("click", function () {
  bgMusic.stop();
  showPage("home");
});

// ================= PROLOG LOGIC =================

let prologIndex = 0;
let typeInterval = null;

function startProlog() {
  prologIndex = 0;
  buildPrologDots();
  showPage("prolog");
  renderPrologSlide();
}

function buildPrologDots() {
  prologDots.innerHTML = "";
  prologSlides.forEach(() => {
    const d = document.createElement("span");
    prologDots.appendChild(d);
  });
}

function updatePrologDots() {
  [...prologDots.children].forEach((d, i) => {
    d.classList.toggle("on", i === prologIndex);
  });
}

function renderPrologSlide() {
  const slide = prologSlides[prologIndex];
  prologScene.innerHTML = slide.scene;
  updatePrologDots();
  typeText(prologText, slide.text);
  prologNext.textContent =
    prologIndex === prologSlides.length - 1 ? "MULAI PERJALANAN →" : "LANJUT →";
}

function typeText(el, text) {
  clearInterval(typeInterval);
  el.innerHTML = '<span class="cursor"></span>';
  let i = 0;
  typeInterval = setInterval(() => {
    if (i < text.length) {
      el.innerHTML = text.slice(0, i + 1) + '<span class="cursor"></span>';
      if (text[i] !== " " && text[i] !== "\n") sfx.voice(text[i]);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 16);
}

prologNext.addEventListener("click", function () {
  if (typeInterval) {
    clearInterval(typeInterval);
    prologText.innerHTML = prologSlides[prologIndex].text + '<span class="cursor"></span>';
    typeInterval = null;
    return;
  }

  if (prologIndex < prologSlides.length - 1) {
    prologIndex++;
    renderPrologSlide();
  } else {
    playPortalTransition("🧒", "Membuka Peta Waktu...", () => {
      renderEraSelect();
      showPage("eraSelect");
    });
  }
});

// ================= ERA SELECT RENDER =================

function renderTimelineMap() {
  timelineMap.innerHTML = eras.map((era, index) => {
    const isUnlocked = index < unlockedCount;
    const isDone = completedEras.has(era.id);
    const stateClass = isDone ? "done" : (isUnlocked ? "available" : "locked");
    const stateText = isDone ? "SELESAI" : (isUnlocked ? "TERBUKA" : "TERKUNCI");
    return `
      <div class="timeline-stop ${stateClass}">
        <div class="timeline-line"></div>
        <div class="timeline-orb">${isDone ? "✓" : era.icon}</div>
        <strong>${era.title}</strong>
        <span>${stateText}</span>
      </div>
    `;
  }).join("");
}

function renderAchievements() {
  const unlockedAchievements = achievementDefinitions.filter(achievement => achievement.check());
  achievementCount.textContent = `${unlockedAchievements.length} / ${achievementDefinitions.length}`;
  achievementList.innerHTML = achievementDefinitions.map(achievement => {
    const unlocked = unlockedAchievements.includes(achievement);
    return `
      <div class="achievement ${unlocked ? "unlocked" : "locked"}">
        <span class="achievement-icon">${achievement.icon}</span>
        <div><strong>${achievement.title}</strong><small>${achievement.description}</small></div>
        <b>${unlocked ? "✓" : "🔒"}</b>
      </div>
    `;
  }).join("");
}

function renderEchoJournal() {
  echoCount.textContent = `${discoveredEchoes.size} / ${eras.length}`;
  echoList.innerHTML = eras.map(era => {
    const discovered = discoveredEchoes.has(era.id);
    return `
      <div class="echo-entry ${discovered ? "found" : "locked"}">
        <span class="echo-icon">${discovered ? era.field.echo.icon : "❔"}</span>
        <strong>${discovered ? era.field.echo.label : "Echo belum ditemukan"}</strong>
        <small>${discovered ? era.field.echo.lore : "Jelajahi zaman ini untuk membuka catatannya."}</small>
      </div>
    `;
  }).join("");
}

function renderEndingAchievements() {
  const unlockedAchievements = achievementDefinitions.filter(achievement => achievement.check());
  endingAchievements.innerHTML = unlockedAchievements.length
    ? `<strong>Achievement terbuka</strong><div>${unlockedAchievements.map(achievement => `<span>${achievement.icon} ${achievement.title}</span>`).join("")}</div>`
    : "Belum ada achievement yang terbuka.";
}

function renderEraSelect() {
  eraContainer.innerHTML = "";
  fragCount.textContent = Math.min(unlockedCount - 1, eras.length);
  renderTimelineMap();
  renderAchievements();
  renderEchoJournal();

  eras.forEach((era, index) => {
    const card = document.createElement("div");
    const isUnlocked = index < unlockedCount;
    const isDone = completedEras.has(era.id);
    const challengeType = sessionChallengeTypes[era.id] || era.variants[0].type;
    const challengeLabel = CHALLENGE_LABELS[challengeType];
    card.className = "era-card " + (isUnlocked ? "available" : "locked") + (isDone ? " done" : "");
    card.innerHTML = `
      <div class="era-icon">${era.icon}</div>
      <h3>${era.title}</h3>
      <p>${era.story}</p>
      <p class="era-challenge-tag">🎯 Tantangan level ini: <b>${challengeLabel}</b></p>
      <span>${isUnlocked ? "🔓 TERSEDIA" : "🔒 TERKUNCI"}</span>
    `;

    card.addEventListener("click", function () {
      if (!isUnlocked) {
        alert(`🔒 ${era.title} masih terkunci!\n\nSelesaikan zaman sebelumnya terlebih dahulu.`);
        return;
      }
      currentEraIndex = index;
      playPortalTransition("🧒", "Menuju " + era.title + "...", () => enterEra(index));
    });

    eraContainer.appendChild(card);
  });
}

// ================= ENTER ERA =================

function enterEra(index) {
  const era = eras[index];

  eraBg.className = "era-bg " + era.bgClass;
  buildEraDecor(eraBg, era.bgClass);

  eraIcon.textContent = era.icon;
  eraTitle.textContent = era.title;
  storyText.textContent = era.story;

  sayCompanion(companionEraIntro[era.id] || "Semangat, Rei!");

  currentStage = "field";
  resultElement.textContent = "";
  nextBtn.style.display = "none";
  dialogBox.style.display = "none";
  challengeBox.style.display = "none";
  challengeBox.innerHTML = "";
  stageLabel.textContent = "JELAJAHI ZAMAN";

  startFieldStage(era);
  showPage("game");
}

// ================= FIELD STAGE (karakter berjalan) =================

let currentFieldEra = null;
let charPos = 5;
let facingLeft = false;
let moveLeftFlag = false;
let moveRightFlag = false;
let isJumping = false;
let fieldObjectDone = false;
let fieldEchoDone = false;
let fieldNpcDone = false;
let gateTriggered = false;
let obstaclePassed = false;
let fieldAnimFrame = null;
let fieldActive = false;

function startFieldStage(era) {
  stopFieldStage(); // bersihkan listener/loop sesi sebelumnya kalau ada

  currentFieldEra = era;
  fieldActive = true;
  charPos = 5;
  facingLeft = false;
  moveLeftFlag = false;
  moveRightFlag = false;
  isJumping = false;
  fieldObjectDone = false;
  fieldEchoDone = false;
  fieldNpcDone = false;
  gateTriggered = false;
  obstaclePassed = false;

  fieldObjectIcon.textContent = era.field.object.icon;
  fieldEchoIcon.textContent = era.field.echo.icon;
  fieldObstacleIcon.textContent = era.field.obstacle.icon;
  fieldNpcIcon.textContent = era.field.npc.icon;
  fieldGateIcon.textContent = era.field.gate.icon;
  fieldGateLabel.textContent = era.field.gate.label;

  fieldObject.style.left = era.field.object.pos + "%";
  fieldEcho.style.left = era.field.echo.pos + "%";
  fieldObstacle.style.left = era.field.obstacle.pos + "%";
  fieldNpc.style.left = era.field.npc.pos + "%";
  fieldGate.style.left = era.field.gate.pos + "%";
  fieldObject.classList.remove("near", "done");
  fieldEcho.classList.remove("near", "done");
  fieldNpc.classList.remove("near", "done");
  fieldToast.style.display = "none";

  fieldCharacterSprite.className = "field-character-sprite idle";
  updateCharacterPosition();

  challengeBox.style.display = "none";
  dialogBox.style.display = "none";
  fieldBox.style.display = "block";

  document.addEventListener("keydown", handleFieldKeyDown);
  document.addEventListener("keyup", handleFieldKeyUp);

  fieldAnimFrame = requestAnimationFrame(fieldLoop);
}

function stopFieldStage() {
  fieldActive = false;
  if (fieldAnimFrame) cancelAnimationFrame(fieldAnimFrame);
  document.removeEventListener("keydown", handleFieldKeyDown);
  document.removeEventListener("keyup", handleFieldKeyUp);
}

function handleFieldKeyDown(e) {
  if (!fieldActive) return;
  if (e.code === "ArrowLeft" || e.code === "KeyA") moveLeftFlag = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") moveRightFlag = true;
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    e.preventDefault();
    triggerJump();
  }
}

function handleFieldKeyUp(e) {
  if (e.code === "ArrowLeft" || e.code === "KeyA") moveLeftFlag = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") moveRightFlag = false;
}

function triggerJump() {
  if (isJumping || !fieldActive) return;
  isJumping = true;
  fieldCharacterSprite.classList.remove("idle", "walking");
  fieldCharacterSprite.classList.add("jumping");
  setTimeout(() => {
    isJumping = false;
    fieldCharacterSprite.classList.remove("jumping");
    if (fieldActive) {
      fieldCharacterSprite.classList.add(moveLeftFlag || moveRightFlag ? "walking" : "idle");
    }
  }, 500);
}

function updateCharacterPosition() {
  fieldCharacter.style.left = charPos + "%";
}

function fieldLoop() {
  if (!fieldActive) return;
  const speed = 0.9;
  let moved = false;

  if (moveLeftFlag) { charPos -= speed; facingLeft = true; moved = true; }
  if (moveRightFlag) { charPos += speed; facingLeft = false; moved = true; }
  charPos = Math.max(3, Math.min(96, charPos));
  updateCharacterPosition();

  if (!isJumping) {
    fieldCharacterSprite.classList.toggle("walking", moved);
    fieldCharacterSprite.classList.toggle("idle", !moved);
  }
  fieldCharacterSprite.classList.toggle("facing-left", facingLeft);

  checkFieldProximity();

  fieldAnimFrame = requestAnimationFrame(fieldLoop);
}

function fieldDistanceTo(pos) {
  return Math.abs(charPos - pos);
}

function checkFieldProximity() {
  const era = currentFieldEra;
  if (!era) return;

  const objNear = fieldDistanceTo(era.field.object.pos) < 6;
  const echoNear = fieldDistanceTo(era.field.echo.pos) < 6;
  const npcNear = fieldDistanceTo(era.field.npc.pos) < 6;
  fieldObject.classList.toggle("near", objNear && !fieldObjectDone);
  fieldEcho.classList.toggle("near", echoNear && !fieldEchoDone);
  fieldNpc.classList.toggle("near", npcNear && !fieldNpcDone);

  const obstacleNear = fieldDistanceTo(era.field.obstacle.pos) < 4;
  if (obstacleNear && !isJumping && !obstaclePassed) {
    obstaclePassed = true;
    charPos = Math.max(3, charPos - 4);
    updateCharacterPosition();
    showFieldToast("⚠️ Rintangan di depan! Tekan LOMPAT untuk melewatinya.");
  } else if (!obstacleNear && fieldDistanceTo(era.field.obstacle.pos) > 8) {
    obstaclePassed = false;
  }

  if (!gateTriggered && fieldDistanceTo(era.field.gate.pos) < 5) {
    gateTriggered = true;
    enterGate(era);
  }
}

function showFieldToast(text) {
  fieldToast.style.display = "block";
  typeGibberish(fieldToast, text);
}

fieldNpc.addEventListener("click", function () {
  const era = currentFieldEra;
  if (!era || !fieldActive) return;

  if (fieldNpc.classList.contains("near") && !fieldNpcDone) {
    fieldNpcDone = true;
    fieldNpc.classList.remove("near");
    showFieldToast("💬 " + era.field.npc.label + ": \u201c" + era.field.npc.greet + "\u201d");
    sayCompanion("Sepertinya penduduk zaman ini ramah, ya.");
  } else if (!fieldNpcDone) {
    showFieldToast("Dekati dulu NPC-nya untuk bisa bicara.");
  }
});

fieldEcho.addEventListener("click", function () {
  const era = currentFieldEra;
  if (!era || !fieldActive) return;

  if (fieldEcho.classList.contains("near") && !fieldEchoDone) {
    fieldEchoDone = true;
    fieldEcho.classList.remove("near");
    fieldEcho.classList.add("done");
    discoveredEchoes.add(era.id);
    score += 10;
    scoreElement.textContent = score;
    showFieldToast("✨ " + era.field.echo.label + ": " + era.field.echo.lore + " (+10 poin)");
  } else if (!fieldEchoDone) {
    showFieldToast("Dekati dulu Time Echo itu untuk melihat bayangannya.");
  }
});

fieldObject.addEventListener("click", function () {
  const era = currentFieldEra;
  if (!era || !fieldActive) return;

  if (fieldObject.classList.contains("near") && !fieldObjectDone) {
    fieldObjectDone = true;
    fieldObject.classList.remove("near");
    fieldObject.classList.add("done");
    const bonus = era.field.object.bonus || 20;
    discoveredObjects++;
    score += bonus;
    scoreElement.textContent = score;
    showFieldToast("🔍 " + era.field.object.label + ": " + era.field.object.lore + " (+" + bonus + " poin)");
  } else if (!fieldObjectDone) {
    showFieldToast("Dekati dulu benda itu untuk memeriksanya.");
  }
});

function bindHoldButton(btn, onDown, onUp) {
  btn.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    onDown();
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(evt => btn.addEventListener(evt, onUp));
}

bindHoldButton(btnLeft, () => { moveLeftFlag = true; }, () => { moveLeftFlag = false; });
bindHoldButton(btnRight, () => { moveRightFlag = true; }, () => { moveRightFlag = false; });
btnJump.addEventListener("click", function () { triggerJump(); });

function enterGate(era) {
  stopFieldStage();
  fieldBox.style.display = "none";

  const challenge = computeChallenge(era);
  currentChallenge = challenge;

  currentStage = "game";
  challengeBox.style.display = "block";
  stageLabel.textContent = "TANTANGAN — " + CHALLENGE_LABELS[challenge.type];
  resultElement.textContent = "";

  sayCompanion("Ayo masuk, saatnya tantangan dimulai!");
  loadMinigame(era, challenge);
}

function buildEraDecor(container, bgClass) {
  container.innerHTML = "";

  if (bgClass === "bg-kingdom") {
    container.innerHTML = `
      <div class="castle">🏰</div>
      <div class="torch left">🔥</div>
      <div class="torch right">🔥</div>
      <div class="banner b1">🚩</div>
      <div class="banner b2">🚩</div>
    `;
  } else if (bgClass === "bg-explore") {
    container.innerHTML = `
      <div class="wave"></div>
      <div class="wave w2"></div>
      <div class="ship">⛵</div>
      <div class="cloud" style="top:10%;">☁️</div>
      <div class="cloud" style="top:22%;animation-delay:-6s;">☁️</div>
    `;
  } else if (bgClass === "bg-struggle") {
    container.innerHTML = `
      <div class="flag">🇮🇩</div>
      <div class="spark" style="left:15%;top:30%;">✨</div>
      <div class="spark" style="left:75%;top:40%;animation-delay:.7s;">✨</div>
      <div class="spark" style="left:40%;top:60%;animation-delay:1.3s;">✨</div>
    `;
  } else if (bgClass === "bg-future") {
    let stars = "";
    for (let i = 0; i < 25; i++) {
      stars += `<div class="neon-star" style="left:${Math.random()*100}%;top:${Math.random()*70}%;animation-delay:${Math.random()*2}s;"></div>`;
    }
    container.innerHTML = `
      ${stars}
      <div class="ufo">🛸</div>
      <div class="city"></div>
    `;
  }
}

// ================= MINIGAME DISPATCH =================

function loadMinigame(era, challenge) {
  challengeBox.innerHTML = "";
  resultElement.textContent = challenge.hint;

  if (challenge.type === "quiz") {
    const questions = quizQuestionPools[era.id] || [];
    const usedIndexes = quizQuestionHistory[era.id] || [];
    let available = questions.map((question, index) => ({ question, index }))
      .filter(item => !usedIndexes.includes(item.index));
    if (!available.length) {
      quizQuestionHistory[era.id] = [];
      available = questions.map((question, index) => ({ question, index }));
    }
    const selected = pickRandom(available);
    quizQuestionHistory[era.id] = [...(quizQuestionHistory[era.id] || []), selected.index];
    Object.assign(challenge, selected.question);
  }

  if (challenge.type === "scramble") {
    const questions = scrambleQuestionPools[era.id] || [];
    const usedIndexes = scrambleQuestionHistory[era.id] || [];
    let available = questions.map((question, index) => ({ question, index }))
      .filter(item => !usedIndexes.includes(item.index));
    if (!available.length) {
      scrambleQuestionHistory[era.id] = [];
      available = questions.map((question, index) => ({ question, index }));
    }
    const selected = pickRandom(available);
    scrambleQuestionHistory[era.id] = [...(scrambleQuestionHistory[era.id] || []), selected.index];
    Object.assign(challenge, selected.question);
  }

  if (challenge.type === "memory") startMemoryGame(challenge);
  else if (challenge.type === "sequence") startSequenceGame(challenge);
  else if (challenge.type === "tap") startTapGame(challenge);
  else if (challenge.type === "simon") startSimonGame(challenge);
  else if (challenge.type === "quiz") startQuizGame(challenge);
  else if (challenge.type === "scramble") startScrambleGame(challenge);
}

function onMinigameComplete(bonus) {
  score += bonus;
  scoreElement.textContent = score;
  sayCompanion(pickRandom(companionSuccess));
  resultElement.textContent = `✅ Tantangan selesai! +${bonus} poin`;

  sfx.complete();
  popConfetti(challengeBox);

  nextBtn.textContent = "LANJUT KE DIALOG →";
  nextBtn.style.display = "inline-block";
  nextBtn.onclick = function () {
    startDialogStage(eras[currentEraIndex]);
  };
}

// ---- 1. MEMORY MATCH (era1) ----

function startMemoryGame(challenge) {
  const iconPairs = shuffle([...challenge.icons, ...challenge.icons]);
  let flipped = [];
  let matchedCount = 0;
  let flipCount = 0;
  let mistakes = 0;
  let lock = false;

  const grid = document.createElement("div");
  grid.className = "memory-grid";

  const meta = document.createElement("div");
  meta.className = "memory-meta";
  meta.textContent = "Percobaan: 0";

  iconPairs.forEach((icon, i) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.icon = icon;
    card.dataset.index = i;
    card.textContent = "❔";

    card.addEventListener("click", function () {
      if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;

      card.textContent = icon;
      card.classList.add("flipped");
      flipped.push(card);

      if (flipped.length === 2) {
        flipCount++;
        meta.textContent = "Percobaan: " + flipCount;
        lock = true;

        const a = flipped[0];
        const b = flipped[1];
        if (a.dataset.icon === b.dataset.icon) {
          a.classList.add("matched");
          b.classList.add("matched");
          matchedCount += 2;
          flipped = [];
          lock = false;

          sfx.correct();
          flashCorrect(a);
          flashCorrect(b);

          if (matchedCount === iconPairs.length) {
            const bonus = Math.max(CHALLENGE_MAX_SCORE - mistakes * MEMORY_MISTAKE_PENALTY, CHALLENGE_MIN_SCORE);
            setTimeout(() => onMinigameComplete(bonus), 300);
          }
        } else {
          mistakes++;
          sfx.wrong();
          a.classList.add("wrong");
          b.classList.add("wrong");

          setTimeout(() => {
            a.textContent = "❔";
            b.textContent = "❔";
            a.classList.remove("flipped", "wrong");
            b.classList.remove("flipped", "wrong");
            flipped = [];
            lock = false;
          }, 700);
        }
      }
    });

    grid.appendChild(card);
  });

  challengeBox.appendChild(grid);
  challengeBox.appendChild(meta);
}

// ---- 2. SEQUENCE ORDER (era2) ----

function startSequenceGame(challenge) {
  const correctOrder = challenge.steps;
  const shuffled = shuffle(correctOrder);
  let expectedIndex = 0;
  let mistakes = 0;

  const list = document.createElement("div");
  list.className = "seq-list";

  const progress = document.createElement("div");
  progress.className = "seq-progress";
  progress.textContent = `Langkah 0 / ${correctOrder.length}`;

  shuffled.forEach(step => {
    const btn = document.createElement("button");
    btn.className = "seq-btn";
    btn.innerHTML = `<span style="font-size:20px;">${step.icon}</span> ${step.label}`;

    btn.addEventListener("click", function () {
      if (btn.classList.contains("locked")) return;

      if (step.label === correctOrder[expectedIndex].label) {
        btn.classList.add("correct", "locked");
        sfx.correct();
        expectedIndex++;
        progress.textContent = `Langkah ${expectedIndex} / ${correctOrder.length}`;

        if (expectedIndex === correctOrder.length) {
          const bonus = scoreForMistakes(mistakes);
          setTimeout(() => onMinigameComplete(bonus), 300);
        }
      } else {
        mistakes++;
        btn.classList.add("wrong");
        sfx.wrong();
        sayCompanion(pickRandom(companionRetry));
        setTimeout(() => btn.classList.remove("wrong"), 350);
      }
    });

    list.appendChild(btn);
  });

  challengeBox.appendChild(list);
  challengeBox.appendChild(progress);
}

// ---- 3. TAP CHALLENGE (era3) ----

function startTapGame(challenge) {
  const target = challenge.target;
  let taps = 0;
  let timeLeft = challenge.timeLimit;
  let ticking = null;
  let finished = false;
  let mistakes = challenge._mistakes || 0;
  const isFlag = challenge.visual === "flag";

  const wrap = document.createElement("div");
  wrap.className = "tap-wrap";

  const timerEl = document.createElement("div");
  timerEl.className = "tap-timer";
  timerEl.textContent = `⏱️ ${timeLeft}s`;

  let progressWrap, fillEl;

  if (isFlag) {
    const pole = document.createElement("div");
    pole.className = "flag-pole";
    const cloth = document.createElement("div");
    cloth.className = "flag-cloth";
    cloth.style.bottom = "0px";
    pole.appendChild(cloth);
    progressWrap = pole;
    fillEl = cloth;
  } else {
    const meter = document.createElement("div");
    meter.className = "tap-meter";
    const fill = document.createElement("div");
    fill.className = "tap-meter-fill";
    const icon = document.createElement("div");
    icon.className = "tap-meter-icon";
    icon.textContent = challenge.meterIcon || "💪";
    fill.appendChild(icon);
    meter.appendChild(fill);
    progressWrap = meter;
    fillEl = fill;
  }

  const tapBtn = document.createElement("button");
  tapBtn.className = "tap-btn";
  tapBtn.textContent = challenge.buttonLabel || "👊 TEKAN!";

  const hint = document.createElement("div");
  hint.className = "tap-hint";
  hint.textContent = `Tekan ${target}x sebelum waktu habis`;

  function startTimer() {
    ticking = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `⏱️ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(ticking);
        if (!finished && taps < target) {
          mistakes++;
          challenge._mistakes = mistakes;
          hint.textContent = "Waktu habis, coba lagi!";
          sfx.wrong();
          sayCompanion(pickRandom(companionRetry));
          setTimeout(() => {
            challengeBox.innerHTML = "";
            startTapGame(challenge);
          }, 900);
        }
      }
    }, 1000);
  }

  tapBtn.addEventListener("click", function () {
    if (finished) return;
    if (!ticking) startTimer();

    taps++;
    const heightPct = Math.min(100, (taps / target) * 100);
    if (isFlag) {
      fillEl.style.bottom = (heightPct * 1.1) + "px";
    } else {
      fillEl.style.height = heightPct + "%";
    }

    if (taps >= target) {
      finished = true;
      clearInterval(ticking);
      onMinigameComplete(scoreForMistakes(mistakes));
    }
  });

  wrap.appendChild(timerEl);
  wrap.appendChild(progressWrap);
  wrap.appendChild(tapBtn);
  wrap.appendChild(hint);
  challengeBox.appendChild(wrap);
}

// ---- 4. SIMON MEMORY ----

function startSimonGame(challenge) {
  const pads = challenge.pads;
  const sequence = [];
  for (let i = 0; i < challenge.length; i++) {
    sequence.push(Math.floor(Math.random() * pads.length));
  }

  let playerIndex = 0;
  let showing = true;
  let mistakes = 0;

  const grid = document.createElement("div");
  grid.className = "simon-grid";

  const status = document.createElement("div");
  status.className = "simon-status";
  status.textContent = "Perhatikan pola cahaya...";

  const padEls = pads.map((icon, i) => {
    const pad = document.createElement("div");
    pad.className = "simon-pad";
    pad.textContent = icon;
    pad.addEventListener("click", function () {
      if (showing) return;

      if (i === sequence[playerIndex]) {
        sfx.correct();
        flashPad(pad, "correctPad");
        playerIndex++;
        if (playerIndex === sequence.length) {
          status.textContent = "Sempurna!";
          setTimeout(() => onMinigameComplete(scoreForMistakes(mistakes)), 400);
        }
      } else {
        mistakes++;
        sfx.wrong();
        flashPad(pad, "wrong");
        status.textContent = "Kurang tepat, ayo ulangi polanya!";
        sayCompanion(pickRandom(companionRetry));
        playerIndex = 0;
        showing = true;
        setTimeout(() => playSequence(), 900);
      }
    });
    grid.appendChild(pad);
    return pad;
  });

  function flashPad(pad, variant) {
    const cls = variant || "active";
    pad.classList.add(cls);
    setTimeout(() => pad.classList.remove(cls), 280);
  }

  function playSequence() {
    showing = true;
    status.textContent = "Perhatikan pola cahaya...";
    let i = 0;
    const interval = setInterval(() => {
      flashPad(padEls[sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          showing = false;
          status.textContent = "Giliranmu! Ulangi polanya.";
        }, 500);
      }
    }, 650);
  }

  challengeBox.appendChild(grid);
  challengeBox.appendChild(status);
  setTimeout(() => playSequence(), 500);
}

// ---- 5. QUIZ SEJARAH (semua era) ----

function startQuizGame(challenge) {
  let mistakes = 0;
  let answered = false;

  const wrap = document.createElement("div");
  wrap.className = "quiz-wrap";

  const q = document.createElement("div");
  q.className = "quiz-question";
  q.textContent = challenge.question;

  const optWrap = document.createElement("div");
  optWrap.className = "quiz-options";

  challenge.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;

    btn.addEventListener("click", function () {
      if (answered) return;

      if (i === challenge.correct) {
        answered = true;
        btn.classList.add("correct");
        sfx.correct();
        flashCorrect(btn);
        [...optWrap.children].forEach(b => (b.disabled = true));

        const bonus = scoreForMistakes(mistakes);
        setTimeout(() => onMinigameComplete(bonus), 350);
      } else {
        mistakes++;
        btn.classList.add("wrong");
        btn.disabled = true;
        sfx.wrong();
        sayCompanion(pickRandom(companionRetry));
        setTimeout(() => btn.classList.remove("wrong"), 350);
      }
    });

    optWrap.appendChild(btn);
  });

  wrap.appendChild(q);
  wrap.appendChild(optWrap);
  challengeBox.appendChild(wrap);
}

// ---- 6. SUSUN HURUF / SCRAMBLE (semua era) ----

function startScrambleGame(challenge) {
  const answer = challenge.answer.toUpperCase();
  const letters = shuffle(answer.split(""));
  let guess = new Array(answer.length).fill(null);
  let mistakes = 0;

  const wrap = document.createElement("div");
  wrap.className = "scramble-wrap";

  const clue = document.createElement("div");
  clue.className = "scramble-clue";
  clue.textContent = challenge.clue;

  const guessRow = document.createElement("div");
  guessRow.className = "scramble-guess";

  const bankRow = document.createElement("div");
  bankRow.className = "scramble-bank";

  function renderGuessSlots() {
    guessRow.innerHTML = "";
    guess.forEach((tileObj, i) => {
      const slot = document.createElement("div");
      slot.className = "scramble-slot" + (tileObj ? " filled" : "");
      slot.textContent = tileObj ? tileObj.char : "";

      if (tileObj) {
        slot.addEventListener("click", function () {
          tileObj.el.classList.remove("used");
          guess[i] = null;
          renderGuessSlots();
        });
      }

      guessRow.appendChild(slot);
    });
  }

  letters.forEach(ch => {
    const tile = document.createElement("button");
    tile.className = "scramble-tile";
    tile.textContent = ch;
    const tileObj = { char: ch, el: tile };

    tile.addEventListener("click", function () {
      if (tile.classList.contains("used")) return;

      const emptyIndex = guess.findIndex(g => !g);
      if (emptyIndex === -1) return;

      guess[emptyIndex] = tileObj;
      tile.classList.add("used");
      renderGuessSlots();

      if (guess.every(Boolean)) checkScramble();
    });

    bankRow.appendChild(tile);
  });

  function checkScramble() {
    const attempt = guess.map(g => g.char).join("");

    if (attempt === answer) {
      sfx.correct();
      flashCorrect(guessRow);
      const bonus = scoreForMistakes(mistakes);
      setTimeout(() => onMinigameComplete(bonus), 400);
    } else {
      mistakes++;
      sfx.wrong();
      flashWrong(guessRow);
      sayCompanion(pickRandom(companionRetry));

      setTimeout(() => {
        guess.forEach(g => g && g.el.classList.remove("used"));
        guess = new Array(answer.length).fill(null);
        renderGuessSlots();
      }, 750);
    }
  }

  renderGuessSlots();
  wrap.appendChild(clue);
  wrap.appendChild(guessRow);
  wrap.appendChild(bankRow);
  challengeBox.appendChild(wrap);
}

// ================= DIALOG STAGE =================

function startDialogStage(era) {
  currentStage = "dialog";
  stageLabel.textContent = "PILIHAN CERITA";
  challengeBox.style.display = "none";
  dialogBox.style.display = "block";
  dialogBox.innerHTML = "";
  resultElement.textContent = "";
  nextBtn.style.display = "none";

  const npcText = document.createElement("div");
  npcText.className = "dialog-npc";
  dialogBox.appendChild(npcText);
  typeDialogText(npcText, era.dialog.npc);

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "dialog-options";

  era.dialog.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "dialog-option";
    btn.textContent = option.label;

    btn.addEventListener("click", function () {
      [...optionsWrap.children].forEach(b => (b.disabled = true));

      const responseEl = document.createElement("div");
      responseEl.className = "dialog-response";
      dialogBox.appendChild(responseEl);
      typeDialogText(responseEl, option.response);

      score += 50;
      scoreElement.textContent = score;
      sayCompanion("Pilihan yang menarik, Rei.");

      nextBtn.textContent = "SELESAIKAN ZAMAN INI →";
      nextBtn.style.display = "inline-block";
      nextBtn.onclick = function () {
        finishEra();
      };
    });

    optionsWrap.appendChild(btn);
  });

  dialogBox.appendChild(optionsWrap);
}

// ================= FINISH ERA =================

function finishEra() {
  const era = eras[currentEraIndex];
  const isLastEra = currentEraIndex === eras.length - 1;
  completedEras.add(era.id);

  if (currentEraIndex + 1 > unlockedCount - 1) {
    unlockedCount = Math.min(currentEraIndex + 2, eras.length);
  }

  if (isLastEra) {
    finalScore.textContent = score;
    const minScoreToReturn = getMinScoreToReturn(playLevel);
    const madeItHome = score >= minScoreToReturn;

    if (madeItHome) {
      sfx.complete();
      bgMusic.stop();
      popConfetti(null, ["✨", "⭐", "🎉", "⏳"]);
      endingLogo.textContent = "🏆";
      endingTitle.textContent = "MESIN WAKTU DIPERBAIKI!";
      endingIntro.textContent = "Kronos tersenyum. Time Fragment yang terkumpul sudah cukup, dan mesin waktu bersinar terang kembali.";
      endingBox.classList.remove("ending-fail");
      retryEraBtn.style.display = "none";
      renderEndingAchievements();

      if (score >= 1250) {
        endingTitle.textContent = "LOMPATAN WAKTU SEMPURNA!";
        endingIntro.textContent = "Semua tantangan ditaklukkan dengan gemilang. Mesin waktu pulih dengan energi penuh.";
        endingText.textContent = "🌟 Luar biasa! Kamu menaklukkan setiap tantangan tanpa satu pun kesalahan.";
      } else if (score >= 1200) {
        endingText.textContent = "👍 Bagus! Kamu berhasil melewati semua zaman dengan baik.";
      } else {
        endingText.textContent = "💡 Kamu berhasil pulang setelah melewati beberapa tantangan sulit. Setiap kesalahan menjadi pelajaran untuk putaran berikutnya.";
      }

      // Naikkan level kesulitan untuk playthrough berikutnya, dan simpan.
      playLevel = Math.min(playLevel + 1, MAX_PLAY_LEVEL);
      saveLevel(playLevel);
      updateLevelBadge();

      if (playLevel >= MAX_PLAY_LEVEL) {
        endingTitle.textContent = "MASTER OF TIME!";
        endingIntro.textContent = "Sepuluh putaran telah kamu taklukkan. Kronos mengakui kamu sebagai penguasa sejati perjalanan waktu.";
        endingText.textContent = "🏆 Semua tingkat kesulitan telah dikuasai. Kamu masih bisa bermain ulang, tetapi level tidak akan naik lagi.";
      }

      sayCompanion("Kita berhasil, Rei! Terima kasih sudah menemaniku menjelajah waktu. Lain kali zamannya akan terasa berbeda!");
      showPage("ending");
    } else {
      sfx.wrong();
      endingTitle.textContent = "MESIN WAKTU BELUM STABIL";
      endingIntro.textContent = "Kronos menemukan jalan pulang, tetapi mesin masih kekurangan energi untuk melompat dengan aman.";
      endingText.textContent = "💡 Jelajahi ulang zaman dan temukan benda tersembunyi untuk menambah skor.";
      endingBox.classList.add("ending-fail");
      retryEraBtn.style.display = "inline-block";
      renderEndingAchievements();

      const missing = minScoreToReturn - score;
      sayCompanion(`Belum cukup, Rei... kita butuh sekitar ${missing} poin lagi sebelum mesin waktu bisa membawa kita pulang. Ayo jelajahi lagi zaman-zaman yang ada!`);
      alert(
        `⏳ Time Fragment belum cukup!\n\n` +
        `Skor kamu sekarang: ${score} poin\n` +
        `Dibutuhkan: ${minScoreToReturn} poin\n` +
        `Kurang: ${missing} poin\n\n` +
        `Masuk lagi ke zaman mana pun buat kumpulin poin tambahan (periksa benda-benda tersembunyi & kurangi kesalahan di tantangan), lalu selesaikan zaman terakhir lagi.`
      );

      showPage("ending");
    }
  } else {
    sfx.complete();
    popConfetti(null, ["✨", "⭐", "🎉", "⏳"]);

    eraCompleteText.textContent = era.completeText;
    runningScore.textContent = score;
    showPage("eraComplete");
  }
}

continueMapBtn.addEventListener("click", function () {
  playPortalTransition("🧒", "Kembali ke Peta Waktu...", () => {
    renderEraSelect();
    showPage("eraSelect");
  });
});

retryEraBtn.addEventListener("click", function () {
  endingBox.classList.remove("ending-fail");
  renderEraSelect();
  showPage("eraSelect");
});

// ================= PLAY AGAIN =================

playAgain.addEventListener("click", function () {
  score = 0;
  currentEraIndex = 0;
  unlockedCount = 1;
  completedEras.clear();
  discoveredObjects = 0;
  discoveredEchoes.clear();
  Object.keys(quizQuestionHistory).forEach(eraId => delete quizQuestionHistory[eraId]);
  Object.keys(scrambleQuestionHistory).forEach(eraId => delete scrambleQuestionHistory[eraId]);
  scoreElement.textContent = score;
  companion.style.display = "none";
  assignSessionChallenges();
  showPage("home");
});

// ================= LEVEL BADGE (HOME) =================

function difficultyLabel(level) {
  if (level <= 0) return "Pemula";
  if (level <= 3) return "Menengah";
  if (level <= 7) return "Sulit";
  if (level >= MAX_PLAY_LEVEL) return "Master of Time";
  return "Ahli Waktu";
}

function updateLevelBadge() {
  if (!levelBadge) return;
  levelBadge.textContent = `🔁 Putaran ke-${playLevel + 1} • Kesulitan: ${difficultyLabel(playLevel)}`;
}

if (resetLevelBtn) {
  resetLevelBtn.addEventListener("click", function () {
    if (!confirm("Atur ulang tingkat kesulitan ke awal?")) return;
    playLevel = 0;
    saveLevel(playLevel);
    updateLevelBadge();
  });
}

updateLevelBadge();