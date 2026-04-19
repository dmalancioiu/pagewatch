import {
  __commonJS,
  __require,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// C:/Users/danim/AppData/Local/npm-cache/_npx/21a2a9e5e1237ee0/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/execAsync.js
var require_execAsync = __commonJS({
  "C:/Users/danim/AppData/Local/npm-cache/_npx/21a2a9e5e1237ee0/node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/execAsync.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execAsync = void 0;
    var child_process = __require("child_process");
    var util = __require("util");
    exports.execAsync = util.promisify(child_process.exec);
  }
});

export {
  require_execAsync
};
//# sourceMappingURL=chunk-5DANO5Q2.mjs.map
