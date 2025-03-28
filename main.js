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
  const target = (5 + slotIndex) * slot.items.length + result;
  const delay = 100 * slotIndex;
  const duration = ((target - slot.offset) / slot.items.length) * 200;

  console.log(duration);

  anime({
    targets: slot,
    offset:
      slotIndex < 2
        ? [
            {
              value: target - 1,
              duration: duration,
              delay: delay,
              easing: "linear",
            },
            {
              value: target,
              duration: 200,
              easing: "easeOutElastic",
            },
          ]
        : [
            {
              value: target,
              duration: duration,
              delay: delay,
              easing: "linear",
            },
            {
              value: target + slot.items.length,
              duration: 1000,
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
