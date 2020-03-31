var loki = require("lokijs");
var database = new loki("webhooks.json", {
  autoload: true,
  autoloadCallback: initialize,
  autosave: true,
  autosaveInterval: 5000
});

function initialize() {
  var webhooks = database.getCollection("webhooks");

  if (webhooks === null) {
    webhooks = database
      .addCollection("webhooks", {
        indices: ['endpoint']
      })
  }
}

module.exports = database;
