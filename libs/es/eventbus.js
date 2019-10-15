var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import log from './log';
export default class EventBus {
    constructor(opts) {
        this.eventSource = {};
        this.channel = opts.channel || 'default';
        this.debug = opts.debug || false;
    }
    formatKey(name) {
        return `@${this.channel}/${name}`;
    }
    on(name, handler) {
        name = this.formatKey(name);
        if (Object.keys(this.eventSource).includes(name)) {
            console.info('duplicate function name', name);
        }
        if (!this.eventSource[name]) {
            this.eventSource[name] = [];
        }
        this.eventSource[name] = this.eventSource[name].concat(Array.isArray(handler) ? handler : [handler]);
        return this;
    }
    off(name, handler) {
        name = this.formatKey(name);
        if (!handler) {
            this.eventSource[name] = [];
        }
        else {
            let handlers = Array.isArray(handler) ? handler : [handler];
            let tmp = this.eventSource[name];
            tmp.forEach((item, index) => {
                handlers.forEach(sub => {
                    if (item === sub) {
                        tmp.splice(index, 1);
                    }
                });
            });
        }
        return this;
    }
    once(name, handler) {
        let tmp = Array.isArray(handler) ? handler : [handler];
        tmp.push((...params) => {
            this.off(name, ...params);
        });
        this.on(name, tmp);
        return this;
    }
    emit(name, ...params) {
        name = this.formatKey(name);
        let events = this.eventSource[name];
        if (events && events.length) {
            events.map(item => {
                item(...params);
            });
        }
        return this;
    }
    has(name) {
        name = this.formatKey(name);
        return !!this.eventSource[name];
    }
    get(name) {
        name = this.formatKey(name);
        return this.eventSource[name];
    }
    keys() {
        return Object.keys(this.eventSource);
    }
    values() {
        let res = Object.values(this.eventSource);
        return res;
    }
    remove(...name) {
        name.map(item => {
            item = this.formatKey(item);
            delete this.eventSource[item];
        });
        return this;
    }
    removeAll() {
        this.eventSource = {};
        return this;
    }
}
__decorate([
    log('on'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "on", null);
__decorate([
    log('off'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "off", null);
__decorate([
    log('once'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "once", null);
__decorate([
    log('emit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "emit", null);
__decorate([
    log('has'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Boolean)
], EventBus.prototype, "has", null);
__decorate([
    log('get'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], EventBus.prototype, "get", null);
__decorate([
    log('keys'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], EventBus.prototype, "keys", null);
__decorate([
    log('values'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], EventBus.prototype, "values", null);
__decorate([
    log('remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "remove", null);
__decorate([
    log('removeAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", EventBus)
], EventBus.prototype, "removeAll", null);
//# sourceMappingURL=eventbus.js.map