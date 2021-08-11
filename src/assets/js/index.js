import '../scss/index.scss';

const dataModules = [...document.querySelectorAll('[data-module]')];

dataModules.forEach((element) => {
  element.dataset.module.split(' ').forEach(function (moduleName) {
    import(`./modules/${moduleName}`).then((Module) => {
      new Module.default(element);
    });
  });
});