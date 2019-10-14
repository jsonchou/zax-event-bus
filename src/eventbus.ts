/**
 * eventbus module
 */

export type EventSource = {
	[name: string]: any
}

export type EventHandler = (param?: any) => any
export type EventHandlers = EventHandler[]
export type EventOptions = {
	channel: string
	debug: boolean
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
	private log(): void {
		if (this.debug) {
			console.info(this.eventSource)
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
		this.eventSource = this.eventSource.concat(Array.isArray(handler) ? handler : [handler])
		this.log()
		return this
	}
	/**
	 * cancle the subscribe
	 */
	off(name: string): EventBus {
		name = this.formatKey(name)
		delete this.eventSource[name]
		this.log()
		return this
	}
	/**
	 * subscribe once
	 */
	once(name: string, handler: EventHandlers | EventHandler): EventBus {
		name = this.formatKey(name)
		let tmp: EventHandler[] = Array.isArray(handler) ? handler : [handler]
		tmp.push(() => {
			this.off(name)
		})
		this.on(name, tmp)
		this.log()
		return this
	}
	/**
	 * pubscribe
	 */
	emit(name: string, ...params: any[]): EventBus {
		name = this.formatKey(name)
		let events: EventHandler | EventHandlers = this.eventSource[name]
		if (events) {
			if (typeof events === 'function') {
				events = [events]
			}
			events.map(item => {
				item(...params)
			})
		}
		this.log()
		return this
	}
	/**
	 * has key
	 */
	has(name: string): boolean {
		name = this.formatKey(name)
		this.log()
		return !!this.eventSource[name]
	}
	/**
	 * get key
	 */
	get(name: string): EventHandler | EventHandlers {
		name = this.formatKey(name)
		this.log()
		return this.eventSource[name]
	}
	/**
	 * get all keys
	 */
	keys(): string[] {
		this.log()
		return Object.keys(this.eventSource)
	}
	/**
	 * get all functions
	 */
	funcs(): EventHandler | EventHandlers {
		this.log()
		return Object.values(this.eventSource)
	}
	/**
	 * remove subscribe
	 */
	remove(...name: string[]): EventBus {
		name.map(item => {
			item = this.formatKey(item)
			delete this.eventSource[item]
		})
		this.log()
		return this
	}
	/**
	 * remove all subscribes
	 */
	removeAll(): EventBus {
		this.eventSource = {}
		this.log()
		return this
	}
}
