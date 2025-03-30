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
  result: [],
  playBtn: null,
};

game.init = function (container) {
  const playBtn = (this.playBtn = container.querySelector(".play-btn"));

  playBtn.addEventListener("click", () => {
    this.onSpin();
  });

  const elements = container.querySelectorAll(".slot");

  for (let i = 0; i < elements.length; i++) {
    this.slots.push(this.createSlot(elements[i], i));
  }
};

game.calculateDistance = function (from, to, min) {
  return (
    min + ((TOTAL_ITEMS + to - ((from + min) % TOTAL_ITEMS)) % TOTAL_ITEMS)
  );
};

game.calculateDuration = function (distance) {
  return distance * 30;
};

game.updateTransform = function (slot) {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const y =
      ((TOTAL_ITEMS - i + slot.offset + TOTAL_ITEMS / 2) % TOTAL_ITEMS) -
      TOTAL_ITEMS / 2;
    slot.nodes[i].style.transform = `translateY(${y * 100}%)`;
  }
};

game.createSlot = function (element, index) {
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
    index: index,
    offset: 0,
    animation: null,
    nodes: nodes,
  };

  this.updateTransform(slot);

  return slot;
};

game.startSpinning = function () {
  for (let i = 0; i < this.slots.length; i++) {
    const slot = this.slots[i];

    slot.animation = anime({
      targets: slot,
      offset: slot.offset + TOTAL_ITEMS,
      duration: this.calculateDuration(TOTAL_ITEMS),
      easing: "linear",
      loop: true,
      update: () => {
        this.updateTransform(slot);
      },
    });
  }
};

game.stopSpinning = async function () {
  for (let i = 0; i < this.slots.length; i++) {
    const slot = this.slots[i];

    const distance = this.calculateDistance(
      slot.offset,
      this.result[slot.index],
      1
    );

    const to = slot.offset + distance;

    if (slot.animation) {
      slot.animation.pause();
    }

    slot.animation = anime({
      targets: slot,
      offset: [
        {
          value: to - 1,
          duration: this.calculateDuration(distance - 1),
          easing: "linear",
        },
        {
          value: to,
          duration: this.calculateDuration(1) * 4.7,
          easing: "easeOutBack",
        },
      ],
      endDelay: i < this.slots.length - 1 ? 200 : 0,
      update: () => {
        this.updateTransform(slot);
      },
    });

    await slot.animation.finished;
  }

  this.onStopSpinning();
};

game.onSpin = function () {
  this.playBtn.setAttribute("disabled", "");

  this.startSpinning();

  window.setTimeout(() => {
    const result = [];

    for (let i = 0; i < this.slots.length; i++) {
      result.push(Math.floor(Math.random() * TOTAL_ITEMS));
    }

    this.result = result;

    this.stopSpinning();
  }, 500);
};

game.onStopSpinning = function () {
  this.playBtn.removeAttribute("disabled");
  console.log(this.result.map((result) => ITEMS[result].name));
};

game.init(document.getElementById("game"));
