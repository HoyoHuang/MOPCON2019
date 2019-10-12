cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-smartconfig.espSmartconfig",
      "file": "plugins/cordova-plugin-smartconfig/www/espSmartconfig.js",
      "pluginId": "cordova-plugin-smartconfig",
      "clobbers": [
        "espSmartconfig"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-smartconfig": "1.0.4",
    "cordova-plugin-whitelist": "1.3.3"
  };
});