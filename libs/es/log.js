const func = (...info) => {
    return function decorator(target, key, descriptor) {
        const original = descriptor.value;
        if (typeof original === 'function') {
            descriptor.value = function (...args) {
                let me = this;
                if (me.debug) {
                    console.log(info[0] + '='.repeat(50), `${args}`);
                    console.info(me.eventSource);
                    console.log('='.repeat(50));
                }
                return original.apply(this, args);
            };
        }
        return descriptor;
    };
};
export default func;
//# sourceMappingURL=log.js.map