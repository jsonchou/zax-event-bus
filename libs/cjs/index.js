"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventbus_1 = __importDefault(require("./eventbus"));
var EventBusSingleton = new eventbus_1.default({});
exports.EventBusSingleton = EventBusSingleton;
exports.default = eventbus_1.default;
//# sourceMappingURL=index.js.map