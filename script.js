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
const TOTAL_ITEMS = ITEMS.length;

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

    slot.lastUpdate = currentTime;

    for (let i = 0; i < slot.items.length; i++) {
      let y =
        ((TOTAL_ITEMS - i + slot.offset + TOTAL_ITEMS / 2) % TOTAL_ITEMS) -
        TOTAL_ITEMS / 2;

      slot.items[i].style.transform = `translateY(${y * 100}%)`;
    }
  };

  const offsetTarget = Math.ceil(duration / 1000) * 5 * TOTAL_ITEMS + result;
  const speed = offsetTarget / duration;

  slot.offset = slot.offset % TOTAL_ITEMS;
  slot.offsetTarget = offsetTarget;
  slot.speed = speed;
  slot.lastUpdate = Date.now();
  window.requestAnimationFrame(update);
};

playBtn.addEventListener("click", play);
