var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./eventbus"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var eventbus_1 = __importDefault(require("./eventbus"));
    var EventBusSingleton = new eventbus_1.default({});
    exports.EventBusSingleton = EventBusSingleton;
    exports.default = eventbus_1.default;
});
//# sourceMappingURL=index.js.map