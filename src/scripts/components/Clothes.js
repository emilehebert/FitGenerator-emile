export default class Clothes {
  constructor(element) {
    this.element = element;
    this.types = element.querySelectorAll('.js-button-delete');

    this.init();
  }

  init() {
    for (let i = 0; i < this.types.length; i++) {
      const buttons = this.types[i];
      buttons.addEventListener('click', this.event.bind(this));
    }
  }

  event(){
    console.log('tryiong');
  }
}
