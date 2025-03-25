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
const ITEM_HEIGHT = 50;
const VISIBLE_HEIGHT = ITEM_HEIGHT * 3;
const TOTAL_HEIGHT = ITEMS.length * ITEM_HEIGHT;
const SPEED = 1.5;

const slot1 = {
  items: document.querySelectorAll(".slot-1 > .item"),
  offset: 0,
  offsetTarget: 0,
  lastUpdate: Date.now(),
};

const slot2 = {
  items: document.querySelectorAll(".slot-2 > .item"),
  offset: 0,
  offsetTarget: 0,
  lastUpdate: Date.now(),
};

const slot3 = {
  items: document.querySelectorAll(".slot-3 > .item"),
  offset: 0,
  offsetTarget: 0,
  lastUpdate: Date.now(),
};

const playBtn = document.getElementById("play-btn");
const resultEl = document.getElementById("result");

const getRandomResult = () => Math.floor(Math.random() * ITEMS.length);

const play = () => {
  const results = [getRandomResult(), getRandomResult(), getRandomResult()];

  playBtn.setAttribute("disabled", "");
  resultEl.innerHTML = "";

  spinSlot(slot1, results[0], 5);
  spinSlot(slot2, results[1], 10);
  spinSlot(slot3, results[2], 15, () => {
    playBtn.removeAttribute("disabled");
    resultEl.innerHTML = results.map((i) => ITEMS[i]).join(", ");
  });
};

const spinSlot = (slot, result, turn, cb) => {
  const update = () => {
    const currentTime = Date.now();

    if (slot.offset < slot.offsetTarget) {
      const ellapsedTime = currentTime - slot.lastUpdate;
      slot.offset += SPEED * ellapsedTime;
      window.requestAnimationFrame(update);
    } else {
      slot.offset = slot.offsetTarget % TOTAL_HEIGHT;
      if (cb) {
        cb();
      }
    }

    slot.lastUpdate = currentTime;

    for (let i = 0; i < slot.items.length; i++) {
      let y =
        ((VISIBLE_HEIGHT - ITEM_HEIGHT) / 2 - i * ITEM_HEIGHT + slot.offset) %
        TOTAL_HEIGHT;

      if (y <= -TOTAL_HEIGHT / 2) {
        y += TOTAL_HEIGHT;
      } else if (y >= TOTAL_HEIGHT / 2) {
        y -= TOTAL_HEIGHT;
      }

      slot.items[i].style.top = `${y}px`;
    }
  };

  slot.lastUpdate = Date.now();
  slot.offsetTarget =
    slot.offset +
    turn * TOTAL_HEIGHT +
    (TOTAL_HEIGHT + result * ITEM_HEIGHT) -
    slot.offset;

  window.requestAnimationFrame(update);
};

playBtn.addEventListener("click", play);
