const IMAGE_PATH = 'assets/images/clothes';

// Chaque catégorie a une ou plusieurs variantes (ex: chandails ou crewnecks).
// `count` = nombre d'images numérotées 0..count-1 dans le dossier de la variante.
// `empty` = image affichée quand la catégorie est vide (après un delete).
const CATEGORIES = {
  heads: {
    variants: [{ name: 'heads', label: 'Heads', count: 17 }],
  },
  shirts: {
    variants: [
      { name: 'shirts', label: 'Shirts', count: 30, empty: 'ShirtsDefault.png' },
      { name: 'crewnecks', label: 'Crewnecks', count: 7, empty: 'CrewneckDefault.png' },
    ],
  },
  pants: {
    variants: [
      { name: 'pants', label: 'Pants', count: 10, empty: 'PantsDefault.png' },
      { name: 'shorts', label: 'Shorts', count: 8, empty: 'ShortsDefault.png' },
    ],
  },
  shoes: {
    variants: [
      { name: 'shoes', label: 'Shoes', count: 3, empty: 'ShoesDefault.png', thumbs: 'shoes/sides' },
    ],
  },
};

export default class Clothes {
  constructor(element) {
    this.element = element;
    this.picker = element.querySelector('.js-picker');
    this.pickerGrid = element.querySelector('.js-picker-grid');
    this.pickerTitle = element.querySelector('.js-picker-title');
    this.pickerVariant = element.querySelector('.js-picker-variant');
    this.pickerToggle = element.querySelector('.js-picker-toggle');
    this.pickerVariantLabel = element.querySelector('.js-picker-variant-label');
    this.shuffleButton = element.querySelector('.js-shuffle-all');
    this.pickerCategory = null;
    this.state = {};

    this.init();
  }

  init() {
    const cards = this.element.querySelectorAll('[data-category]');

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      this.state[card.dataset.category] = {
        variant: 0,
        index: null,
        locked: false,
        image: card.querySelector('.js-image'),
        lockButton: card.querySelector('.js-lock'),
      };
    }

    this.element.addEventListener('click', this.onClick.bind(this));
    this.pickerToggle.addEventListener('change', this.onVariantChange.bind(this));

    this.shuffleAll();
  }

  onClick(event) {
    const target = event.target;

    if (target === this.picker) {
      // Clic sur le fond du dialog
      this.closePicker();
      return;
    }

    if (target.closest('.js-shuffle-all')) {
      this.shuffleAll();
      return;
    }

    if (target.closest('.js-picker-close')) {
      this.closePicker();
      return;
    }

    const thumb = target.closest('.js-picker-item');
    if (thumb) {
      this.pick(parseInt(thumb.dataset.index, 10));
      return;
    }

    const card = target.closest('[data-category]');
    if (!card) return;
    const category = card.dataset.category;

    if (target.closest('.js-lock')) this.toggleLock(category);
    else if (target.closest('.js-prev')) this.step(category, -1);
    else if (target.closest('.js-next')) this.step(category, 1);
    else if (target.closest('.js-clear')) this.clear(category);
    else if (target.closest('.js-pick')) this.openPicker(category);
    else if (target.closest('.js-image')) this.shuffle(category);
  }

  variantOf(category) {
    return CATEGORIES[category].variants[this.state[category].variant];
  }

  // Retourne false (et fait trembler le cadenas) si la catégorie est barrée
  isFree(category) {
    const state = this.state[category];
    if (!state.locked) return true;

    this.shake(state.lockButton, 'is-shaking');
    return false;
  }

  render(category) {
    const state = this.state[category];
    const variant = this.variantOf(category);
    const isEmpty = state.index === null;
    const file = isEmpty ? variant.empty : `${state.index}.png`;

    state.image.src = `${IMAGE_PATH}/${variant.name}/${file}`;
    state.image.alt = isEmpty ? `No ${variant.label.toLowerCase()}` : `${variant.label} ${state.index + 1}`;
    state.image.classList.toggle('is-empty', isEmpty);
  }

  step(category, direction) {
    if (!this.isFree(category)) return;

    const state = this.state[category];
    const count = this.variantOf(category).count;

    if (state.index === null) {
      state.index = direction > 0 ? 0 : count - 1;
    } else {
      state.index = (state.index + direction + count) % count;
    }
    this.render(category);
  }

  shuffle(category) {
    if (!this.isFree(category)) return;

    const state = this.state[category];
    const count = this.variantOf(category).count;
    let index = Math.floor(Math.random() * count);

    // Évite de retomber sur le même vêtement
    if (count > 1 && index === state.index) {
      index = (index + 1 + Math.floor(Math.random() * (count - 1))) % count;
    }

    state.index = index;
    this.render(category);
  }

  shuffleAll() {
    for (const category in this.state) {
      this.shuffle(category);
    }
    this.shake(this.shuffleButton, 'is-bouncing');
  }

  clear(category) {
    if (!this.isFree(category)) return;

    this.state[category].index = null;
    this.render(category);
  }

  toggleLock(category) {
    const state = this.state[category];
    state.locked = !state.locked;

    const label = this.variantOf(category).label.toLowerCase();
    state.lockButton.setAttribute('aria-pressed', state.locked);
    state.lockButton.setAttribute('aria-label', `${state.locked ? 'Unlock' : 'Lock'} ${label}`);
    state.lockButton.querySelector('use').setAttribute('href', state.locked ? '#icon-lock' : '#icon-lock-open');
    state.lockButton.closest('[data-category]').classList.toggle('is-locked', state.locked);
  }

  openPicker(category) {
    if (!this.isFree(category)) return;

    this.pickerCategory = category;
    this.renderPicker();
    this.picker.showModal();
  }

  closePicker() {
    this.picker.close();
    this.pickerCategory = null;
  }

  renderPicker() {
    const category = this.pickerCategory;
    const { variants } = CATEGORIES[category];
    const variant = this.variantOf(category);
    const folder = variant.thumbs || variant.name;

    this.pickerTitle.textContent = `Your ${variant.label.toLowerCase()}`;

    // La case à cocher ne sert que pour les catégories à deux variantes
    this.pickerVariant.hidden = variants.length < 2;
    if (variants.length > 1) {
      this.pickerVariantLabel.textContent = variants[1].label;
      this.pickerToggle.checked = this.state[category].variant === 1;
    }

    this.pickerGrid.classList.toggle('picker__grid--wide', Boolean(variant.thumbs));
    this.pickerGrid.innerHTML = '';

    for (let i = 0; i < variant.count; i++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'picker__item js-picker-item';
      button.dataset.index = i;
      button.classList.toggle('is-selected', i === this.state[category].index);
      button.innerHTML = `<img src="${IMAGE_PATH}/${folder}/${i}.png" alt="${variant.label} ${i + 1}" loading="lazy" />`;
      this.pickerGrid.appendChild(button);
    }
  }

  onVariantChange() {
    const category = this.pickerCategory;
    const state = this.state[category];

    state.variant = this.pickerToggle.checked ? 1 : 0;
    state.index = null;
    this.render(category);
    this.renderPicker();
  }

  pick(index) {
    this.state[this.pickerCategory].index = index;
    this.render(this.pickerCategory);
    this.closePicker();
  }

  // Relance une animation CSS même si elle est déjà en cours
  shake(element, className) {
    if (!element) return;

    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    element.addEventListener('animationend', () => element.classList.remove(className), { once: true });
  }
}
