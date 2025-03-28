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
};

const slot2 = {
  items: document.querySelectorAll(".slot-2 > .item"),
  offset: 0,
};

const slot3 = {
  items: document.querySelectorAll(".slot-3 > .item"),
  offset: 0,
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

  spinSlot(slot1, 0, results[0]);
  spinSlot(slot2, 1, results[1]);
  spinSlot(slot3, 2, results[2], () => {
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

const spinSlot = (slot, slotIndex, result, cb) => {
  const to = (4 + slotIndex * 2) * slot.items.length + result;
  const diff = to - slot.offset;

  const startAnimation = {
    value: to - 1,
    duration: (diff - 1) * 25,
    delay: 150 * slotIndex,
    easing: "linear",
  };

  anime({
    targets: slot,
    offset:
      slotIndex < 2
        ? [
            startAnimation,
            {
              value: to,
              duration: 300,
              easing: "easeOutElastic",
            },
          ]
        : [
            startAnimation,
            {
              value: to + slot.items.length,
              duration: 100 * (slot.items.length + 1),
              easing: "easeOutQuad",
            },
          ],
    update: () => {
      updatePosition(slot);
    },
    complete: () => {
      slot.offset = slot.offset % slot.items.length;

      if (cb) {
        cb();
      }
    },
  });
};

init();

playBtn.addEventListener("click", play);
