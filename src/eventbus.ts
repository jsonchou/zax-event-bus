/**
 * eventbus module
 */

export type EventHandler = (param?: any) => any
export type EventHandlers = EventHandler[]
export type EventOptions = {
	channel: string
	debug: boolean
}

export type EventSource = {
	[name: string]: EventHandlers
}

export default class EventBus {
	channel: string
	debug: boolean
	constructor(opts: Partial<EventOptions>) {
		this.channel = opts.channel || 'default'
		this.debug = opts.debug || false
	}
	private formatKey(name: string): string {
		return `@${this.channel}/${name}`
	}
	private log(flag: string): void {
		if (this.debug) {
			console.log(flag + '='.repeat(50))
			console.info(this.eventSource)
			console.log('='.repeat(50))
		}
	}
	/**
	 * event source
	 */
	eventSource: EventSource = {}
	/**
	 * subscribe
	 */
	on(name: string, handler: EventHandlers | EventHandler): EventBus {
		name = this.formatKey(name)
		if (Object.keys(this.eventSource).includes(name)) {
			console.info('duplicate function name', name)
		}
		if (!this.eventSource[name]) {
			this.eventSource[name] = []
		}
		this.eventSource[name] = this.eventSource[name].concat(Array.isArray(handler) ? handler : [handler])
		this.log('on')
		return this
	}
	/**
	 * cancle the subscribe
	 */
	off(name: string, handler?: EventHandlers | EventHandler): EventBus {
		name = this.formatKey(name)
		if (!handler) {
			this.eventSource[name] = []
		} else {
			let handlers = Array.isArray(handler) ? handler : [handler]
			let tmp = this.eventSource[name]

			tmp.forEach((item, index) => {
				handlers.forEach(sub => {
					if (item === sub) {
						tmp.splice(index, 1)
					}
				})
			})
		}
		this.log('off')
		return this
	}
	/**
	 * subscribe once
	 */
	once(name: string, handler: EventHandlers | EventHandler): EventBus {
		let tmp: EventHandlers = Array.isArray(handler) ? handler : [handler]
		tmp.push((...params) => {
			this.off(name, ...params)
		})
		this.on(name, tmp)
		this.log('once')
		return this
	}
	/**
	 * pubscribe
	 */
	emit(name: string, ...params: any[]): EventBus {
		name = this.formatKey(name)
		let events = this.eventSource[name]
		if (events && events.length) {
			events.map(item => {
				item(...params)
			})
		}
		this.log('emit')
		return this
	}
	/**
	 * has key
	 */
	has(name: string): boolean {
		name = this.formatKey(name)
		this.log('has')
		return !!this.eventSource[name]
	}
	/**
	 * get key
	 */
	get(name: string): EventHandler | EventHandlers {
		name = this.formatKey(name)
		this.log('get')
		return this.eventSource[name]
	}
	/**
	 * get all keys
	 */
	keys(): string[] {
		this.log('keys')
		return Object.keys(this.eventSource)
	}
	/**
	 * get all functions
	 */
	values(): EventHandlers[] {
		let res = Object.values(this.eventSource)
		this.log('values')
		return res
	}
	/**
	 * remove subscribe
	 */
	remove(...name: string[]): EventBus {
		name.map(item => {
			item = this.formatKey(item)
			delete this.eventSource[item]
		})
		this.log('remove')
		return this
	}
	/**
	 * remove all subscribes
	 */
	removeAll(): EventBus {
		this.eventSource = {}
		this.log('removeAll')
		return this
	}
}
