const ITEMS = [
  "Bell",
  "Cherries",
  "Clover",
  "Gem",
  "Lemon",
  "Pig",
  "Nose",
  "Star",
];

const slot1 = {
  items: document.querySelectorAll(".slot-1 > .item"),
  offset: 0,
  offsetTarget: 0,
  speed: 0,
  lastUpdate: Date.now(),
};

const slot2 = {
  items: document.querySelectorAll(".slot-2 > .item"),
  offset: 0,
  offsetTarget: 0,
  speed: 0,
  lastUpdate: Date.now(),
};

const slot3 = {
  items: document.querySelectorAll(".slot-3 > .item"),
  offset: 0,
  offsetTarget: 0,
  speed: 0,
  lastUpdate: Date.now(),
};

const playBtn = document.getElementById("play-btn");
const resultEl = document.getElementById("result");

const getRandomResult = () => Math.floor(Math.random() * ITEMS.length);

const init = () => {
  updatePosition(slot1);
  updatePosition(slot2);
  updatePosition(slot3);
};

const play = () => {
  const results = [getRandomResult(), getRandomResult(), getRandomResult()];

  playBtn.setAttribute("disabled", "");
  resultEl.innerHTML = "";

  spinSlot(slot1, results[0], 500);
  spinSlot(slot2, results[1], 1000);
  spinSlot(slot3, results[2], 1500, () => {
    playBtn.removeAttribute("disabled");
    resultEl.innerHTML = results.map((i) => ITEMS[i]).join(", ");
  });
};

const updatePosition = (slot) => {
  const len = slot.items.length;
  for (let i = 0; i < len; i++) {
    const pos = ((len - i + slot.offset + len / 2) % len) - len / 2;
    slot.items[i].style.transform = `translateY(${pos * 100}%)`;
  }
};

const spinSlot = (slot, result, duration, cb) => {
  const update = () => {
    const currentTime = Date.now();

    if (slot.offset < slot.offsetTarget) {
      const ellapsedTime = currentTime - slot.lastUpdate;
      slot.offset += slot.speed * ellapsedTime;
      window.requestAnimationFrame(update);
    } else {
      slot.offset = slot.offsetTarget;
      if (cb) {
        cb();
      }
    }

    updatePosition(slot);

    slot.lastUpdate = currentTime;
  };

  const offset = slot.offset % slot.items.length;
  const offsetTarget =
    (1 + Math.round(duration / 1000) * 3) * slot.items.length + result;
  const speed = (offsetTarget - offset) / duration;

  slot.offset = offset;
  slot.offsetTarget = offsetTarget;
  slot.speed = speed;
  slot.lastUpdate = Date.now();
  window.requestAnimationFrame(update);
};

init();

playBtn.addEventListener("click", play);
