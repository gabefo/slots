class Game {
  static ITEMS = [
    { name: "Bell", src: "/assets/bell.png" },
    { name: "Cherries", src: "/assets/cherries.png" },
    { name: "Clover", src: "/assets/clover.png" },
    { name: "Gem", src: "/assets/gem.png" },
    { name: "Lemon", src: "/assets/lemon.png" },
    { name: "Pig", src: "/assets/pig.png" },
    { name: "Nose", src: "/assets/pig_nose.png" },
    { name: "Star", src: "/assets/star.png" },
  ];
  static TOTAL_ITEMS = Game.ITEMS.length;

  constructor(container) {
    this.container = container;
    this.slots = [];
    this.result = [];
    this.playBtn = null;

    this.init();
  }

  init() {
    const container = this.container;

    const playBtn = (this.playBtn = container.querySelector(".play-btn"));

    playBtn.addEventListener("click", () => {
      this.onSpin();
    });

    const elements = container.querySelectorAll(".slot");

    for (let i = 0; i < elements.length; i++) {
      this.slots.push(this.createSlot(elements[i], i));
    }

    this.result = Array(elements.length).fill(0);
  }

  calculateDistance(from, to, min) {
    return (
      min +
      ((Game.TOTAL_ITEMS + to - ((from + min) % Game.TOTAL_ITEMS)) %
        Game.TOTAL_ITEMS)
    );
  }

  calculateDuration(distance) {
    return distance * 30;
  }

  updateTransform(slot) {
    for (let i = 0; i < Game.TOTAL_ITEMS; i++) {
      const y =
        ((Game.TOTAL_ITEMS - i + slot.offset + Game.TOTAL_ITEMS / 2) %
          Game.TOTAL_ITEMS) -
        Game.TOTAL_ITEMS / 2;
      slot.nodes[i].style.transform = `translateY(${y * 100}%)`;
    }
  }

  createSlot(element, index) {
    const nodes = [];

    for (let i = 0; i < Game.TOTAL_ITEMS; i++) {
      const div = document.createElement("div");
      div.className = "item";

      const img = document.createElement("img");
      img.src = Game.ITEMS[i].src;
      img.alt = Game.ITEMS[i].name;

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
  }

  startSpinning() {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];

      slot.animation = anime({
        targets: slot,
        offset: slot.offset + Game.TOTAL_ITEMS,
        duration: this.calculateDuration(Game.TOTAL_ITEMS),
        easing: "linear",
        loop: true,
        update: () => {
          this.updateTransform(slot);
        },
      });
    }
  }

  async stopSpinning() {
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
  }

  onSpin() {
    this.playBtn.setAttribute("disabled", "");

    this.startSpinning();

    window.setTimeout(() => {
      const result = [];

      for (let i = 0; i < this.slots.length; i++) {
        result.push(Math.floor(Math.random() * Game.TOTAL_ITEMS));
      }

      this.result = result;

      this.stopSpinning();
    }, 500);
  }

  onStopSpinning() {
    this.playBtn.removeAttribute("disabled");
    console.log(this.result.map((result) => Game.ITEMS[result].name));
  }

  destroy() {
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].animation.pause();
    }
  }
}

const game = new Game(document.getElementById("game"));
