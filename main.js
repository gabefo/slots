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

const game = {
  slots: [],
  loading: false,
  result: [],
  playBtn: null,
};

game.calculateDistance = function (from, to, min) {
  return (
    min + ((TOTAL_ITEMS + to - ((from + min) % TOTAL_ITEMS)) % TOTAL_ITEMS)
  );
};

game.calculateDuration = function (distance) {
  return distance * 10;
};

game.updateTransform = function (slot) {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const y =
      ((TOTAL_ITEMS - i + slot.offset + TOTAL_ITEMS / 2) % TOTAL_ITEMS) -
      TOTAL_ITEMS / 2;
    slot.nodes[i].style.transform = `translateY(${y * 100}%)`;
  }
};

game.createSlot = function (element) {
  const nodes = [];

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const div = document.createElement("div");
    div.className = "item";

    const img = document.createElement("img");
    img.src = ITEMS[i].src;
    img.alt = ITEMS[i].name;

    div.appendChild(img);
    element.appendChild(div);

    nodes.push(div);
  }

  const slot = {
    nodes: nodes,
    offset: 0,
  };

  this.updateTransform(slot);

  return slot;
};

game.spinSlot = function (slotIndex) {
  const slot = this.slots[slotIndex];
  const distance = this.calculateDistance(
    slot.offset,
    this.result[slotIndex],
    50 + 25 * slotIndex
  );
  const to = slot.offset + distance;

  anime({
    targets: slot,
    offset:
      slotIndex < this.slots.length - 1
        ? [
            {
              value: to - 3,
              duration: this.calculateDuration(distance - 3),
              easing: "linear",
            },
            {
              value: to,
              duration: this.calculateDuration(3) * 4.7,
              easing: "easeOutBack",
            },
          ]
        : [
            {
              value: to - 50,
              duration: this.calculateDuration(distance - 50),
              easing: "linear",
            },
            {
              value: to,
              duration: this.calculateDuration(50) * 5,
              easing: "easeOutQuint",
            },
          ],
    update: () => {
      this.updateTransform(slot);
    },
    complete: () => {
      slot.offset = slot.offset % TOTAL_ITEMS;

      if (slotIndex === this.slots.length - 1) {
        this.onStopSpinning();
      }
    },
  });
};

game.init = function (container) {
  const playBtn = (this.playBtn = container.querySelector(".play-btn"));

  playBtn.addEventListener("click", () => {
    this.play();
  });

  const elements = container.querySelectorAll(".slot");

  for (let i = 0; i < elements.length; i++) {
    this.slots.push(this.createSlot(elements[i]));
  }
};

game.fetchResult = function () {
  this.loading = true;

  const values = [];

  for (let i = 0; i < this.slots.length; i++) {
    values.push(Math.floor(Math.random() * TOTAL_ITEMS));
  }

  this.result = values;
  this.loading = false;
};

game.onStopSpinning = function () {
  this.playBtn.removeAttribute("disabled");
  console.log(this.result.map((result) => ITEMS[result].name));
};

game.play = function () {
  this.playBtn.setAttribute("disabled", "");

  this.fetchResult();

  for (let i = 0; i < this.slots.length; i++) {
    this.spinSlot(i);
  }
};

game.init(document.getElementById("game"));
