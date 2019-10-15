var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./log"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var log_1 = __importDefault(require("./log"));
    var EventBus = (function () {
        function EventBus(opts) {
            this.eventSource = {};
            this.channel = opts.channel || 'default';
            this.debug = opts.debug || false;
        }
        EventBus.prototype.formatKey = function (name) {
            return "@" + this.channel + "/" + name;
        };
        EventBus.prototype.on = function (name, handler) {
            name = this.formatKey(name);
            if (Object.keys(this.eventSource).includes(name)) {
                console.info('duplicate function name', name);
            }
            if (!this.eventSource[name]) {
                this.eventSource[name] = [];
            }
            this.eventSource[name] = this.eventSource[name].concat(Array.isArray(handler) ? handler : [handler]);
            return this;
        };
        EventBus.prototype.off = function (name, handler) {
            name = this.formatKey(name);
            if (!handler) {
                this.eventSource[name] = [];
            }
            else {
                var handlers_1 = Array.isArray(handler) ? handler : [handler];
                var tmp_1 = this.eventSource[name];
                tmp_1.forEach(function (item, index) {
                    handlers_1.forEach(function (sub) {
                        if (item === sub) {
                            tmp_1.splice(index, 1);
                        }
                    });
                });
            }
            return this;
        };
        EventBus.prototype.once = function (name, handler) {
            var _this = this;
            var tmp = Array.isArray(handler) ? handler : [handler];
            tmp.push(function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                _this.off.apply(_this, __spreadArrays([name], params));
            });
            this.on(name, tmp);
            return this;
        };
        EventBus.prototype.emit = function (name) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            name = this.formatKey(name);
            var events = this.eventSource[name];
            if (events && events.length) {
                events.map(function (item) {
                    item.apply(void 0, params);
                });
            }
            return this;
        };
        EventBus.prototype.has = function (name) {
            name = this.formatKey(name);
            return !!this.eventSource[name];
        };
        EventBus.prototype.get = function (name) {
            name = this.formatKey(name);
            return this.eventSource[name];
        };
        EventBus.prototype.keys = function () {
            return Object.keys(this.eventSource);
        };
        EventBus.prototype.values = function () {
            var res = Object.values(this.eventSource);
            return res;
        };
        EventBus.prototype.remove = function () {
            var _this = this;
            var name = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                name[_i] = arguments[_i];
            }
            name.map(function (item) {
                item = _this.formatKey(item);
                delete _this.eventSource[item];
            });
            return this;
        };
        EventBus.prototype.removeAll = function () {
            this.eventSource = {};
            return this;
        };
        __decorate([
            log_1.default('on'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String, Object]),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "on", null);
        __decorate([
            log_1.default('off'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String, Object]),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "off", null);
        __decorate([
            log_1.default('once'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String, Object]),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "once", null);
        __decorate([
            log_1.default('emit'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String, Object]),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "emit", null);
        __decorate([
            log_1.default('has'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", Boolean)
        ], EventBus.prototype, "has", null);
        __decorate([
            log_1.default('get'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", Object)
        ], EventBus.prototype, "get", null);
        __decorate([
            log_1.default('keys'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Array)
        ], EventBus.prototype, "keys", null);
        __decorate([
            log_1.default('values'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", Array)
        ], EventBus.prototype, "values", null);
        __decorate([
            log_1.default('remove'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "remove", null);
        __decorate([
            log_1.default('removeAll'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", EventBus)
        ], EventBus.prototype, "removeAll", null);
        return EventBus;
    }());
    exports.default = EventBus;
});
//# sourceMappingURL=eventbus.js.map