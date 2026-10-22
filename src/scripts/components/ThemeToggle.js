const STORAGE_KEY = 'fitgen-theme';

export default class ThemeToggle {
  constructor(element) {
    this.element = element;

    this.init();
  }

  init() {
    let theme = null;
    try {
      theme = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      // localStorage peut être bloqué (navigation privée)
    }

    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    this.apply(theme);
    this.element.addEventListener('click', this.toggle.bind(this));
  }

  apply(theme) {
    document.documentElement.dataset.theme = theme;
    this.element.setAttribute('aria-pressed', theme === 'dark');
  }

  toggle() {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    this.apply(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Pas grave si on ne peut pas sauvegarder
    }
  }
}
