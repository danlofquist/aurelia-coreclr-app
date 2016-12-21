import 'bootstrap';
import {inject} from 'aurelia-framework';

export class App {

  constructor() {
    this.message = 'Aurelia';
  }

  configureRouter(config, router) {

    config.title = 'Aurelia/coreclr boilerplate';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'home/index', nav: true },
    ]);
    this.router = router;
  }

}
