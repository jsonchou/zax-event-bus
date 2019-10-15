const func = (...info: any[]) => {
	return function decorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const original = descriptor.value
		/* istanbul ignore next */
		if (typeof original === 'function') {
			descriptor.value = function(...args: any[]): any {
				let me: any = this
				/* istanbul ignore next */
				if (me.debug) {
					console.log(info[0] + '='.repeat(50), `${args}`)
					console.info(me.eventSource)
					console.log('='.repeat(50))
				}
				return original.apply(this, args)
			}
		}
		return descriptor
	}
}

export default func
