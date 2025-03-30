const ITEMS = [
  { name: "Bell", src: "/assets/bell.png" },
  { name: "Cherries", src: "/assets/cherries.png" },
  { name: "Clover", src: "/assets/clover.png" },
  { name: "Gem", src: "/assets/gem.png" },
  { name: "Lemon", src: "/assets/lemon.png" },
  { name: "Pig", src: "/assets/pig.png" },
  { name: "Nose", src: "/assets/pig_nose.png" },
  { name: "Star", src: "/assets/star.png" },
];

const TOTAL_ITEMS = ITEMS.length;

const slots = [];

const playBtn = document.getElementById("play-btn");

const calculateDistance = (from, to, min) =>
  min + ((TOTAL_ITEMS + to - ((from + min) % TOTAL_ITEMS)) % TOTAL_ITEMS);

const calculateDuration = (distance) => distance * 10;

const updateTransform = (slot) => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const y =
      ((TOTAL_ITEMS - i + slot.offset + TOTAL_ITEMS / 2) % TOTAL_ITEMS) -
      TOTAL_ITEMS / 2;
    slot.nodes[i].style.transform = `translateY(${y * 100}%)`;
  }
};

const getRandomResult = () => {
  const result = [];
  for (let i = 0; i < slots.length; i++) {
    result.push(Math.floor(Math.random() * TOTAL_ITEMS));
  }
  return result;
};

const createSlot = (element) => {
  const nodes = [];

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const item = document.createElement("div");
    item.className = "item";

    const img = document.createElement("img");
    img.src = ITEMS[i].src;
    img.alt = ITEMS[i].name;

    item.appendChild(img);
    element.appendChild(item);

    nodes.push(item);
  }

  const slot = {
    nodes: nodes,
    offset: 0,
  };

  updateTransform(slot);

  return slot;
};

const spinSlot = (slot, slotIndex, result, instant, cb) => {
  const from = slot.offset;
  const distance = calculateDistance(from, result, 50 + 25 * slotIndex);
  const to = from + distance;
  const delay = calculateDuration(5) * slotIndex;

  anime({
    targets: slot,
    offset: instant
      ? [
          {
            value: to - 3,
            duration: calculateDuration(distance - 3),
            delay: delay,
            easing: "linear",
          },
          {
            value: to,
            duration: calculateDuration(3) * 4.7,
            easing: "easeOutBack",
          },
        ]
      : [
          {
            value: to - 50,
            duration: calculateDuration(distance - 50),
            delay: delay,
            easing: "linear",
          },
          {
            value: to,
            duration: calculateDuration(50) * 5,
            easing: "easeOutQuint",
          },
        ],
    update: () => {
      updateTransform(slot);
    },
    complete: () => {
      slot.offset = slot.offset % TOTAL_ITEMS;

      if (cb) {
        cb();
      }
    },
  });
};

const init = () => {
  const elements = document.querySelectorAll(".slot");
  for (let i = 0; i < elements.length; i++) {
    slots.push(createSlot(elements[i]));
  }
};

const play = () => {
  const result = getRandomResult();

  playBtn.setAttribute("disabled", "");

  for (let i = 0; i < slots.length; i++) {
    spinSlot(slots[i], i, result[i], i < slots.length - 1, () => {
      if (i === slots.length - 1) {
        playBtn.removeAttribute("disabled");
        console.log(result.map((result) => ITEMS[result].name));
      }
    });
  }
};

init();

playBtn.addEventListener("click", play);
