import ComponentFactory from './ComponentFactory.js';
import Icons from './utils/Icons.js';

class Main {
  constructor() {
    this.init();
  }

  init() {
    // On ajoute une classe sur le html
    // pour qu'on puisse savoir si le JavaScript est
    // supporté dans notre css

    new ComponentFactory();

    Icons.load();
  }
}
new Main();
