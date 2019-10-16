/**
 * eventbus module
 */

import { log } from './utils'

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

	/* istanbul ignore next */
	constructor(opts: Partial<EventOptions>) {
		this.channel = opts.channel || 'default'
		this.debug = opts.debug || false
	}

	private formatKey(name: string): string {
		return `@${this.channel}/${name}`
	}

	/**
	 * event source
	 */
	eventSource: EventSource = {}
	/**
	 * subscribe
	 */
	@log('on')
	on(name: string, handler: EventHandlers | EventHandler): EventBus {
		name = this.formatKey(name)
		if (Object.keys(this.eventSource).includes(name)) {
			console.info('duplicate function name', name)
		}
		if (!this.eventSource[name]) {
			this.eventSource[name] = []
		}
		this.eventSource[name] = this.eventSource[name].concat(Array.isArray(handler) ? handler : [handler])
		return this
	}
	/**
	 * cancle the subscribe
	 */
	@log('off')
	off(name: string, handler?: EventHandlers | EventHandler): EventBus {
		name = this.formatKey(name)
		if (!handler) {
			this.eventSource[name] = []
		} else {
			/* istanbul ignore next */
			let handlers = Array.isArray(handler) ? handler : [handler]
			let tmp = this.eventSource[name]

			tmp.forEach((item, index) => {
				handlers.forEach(sub => {
					/* istanbul ignore next */
					if (item === sub) {
						tmp.splice(index, 1)
					}
				})
			})
		}
		return this
	}
	/**
	 * subscribe once
	 */
	@log('once')
	once(name: string, handler: EventHandlers | EventHandler): EventBus {
		/* istanbul ignore next */
		let tmp: EventHandlers = Array.isArray(handler) ? handler : [handler]
		tmp.push((...params) => {
			this.off(name, ...params)
		})
		this.on(name, tmp)
		return this
	}
	/**
	 * pubscribe
	 */
	@log('emit')
	emit(name: string, ...params: any[]): EventBus {
		name = this.formatKey(name)
		let events = this.eventSource[name]
		/* istanbul ignore next */
		if (events && events.length) {
			events.map(item => {
				item(...params)
			})
		}
		return this
	}
	/**
	 * has key
	 */
	@log('has')
	has(name: string): boolean {
		name = this.formatKey(name)
		return !!this.eventSource[name]
	}
	/**
	 * get key
	 */
	@log('get')
	get(name: string): EventHandler | EventHandlers {
		name = this.formatKey(name)
		return this.eventSource[name]
	}
	/**
	 * get all keys
	 */
	@log('keys')
	keys(): string[] {
		return Object.keys(this.eventSource)
	}
	/**
	 * get all functions
	 */
	@log('values')
	values(): EventHandlers[] {
		let res = Object.values(this.eventSource)
		return res
	}
	/**
	 * remove subscribe
	 */
	@log('remove')
	remove(...name: string[]): EventBus {
		name.map(item => {
			item = this.formatKey(item)
			delete this.eventSource[item]
		})
		return this
	}
	/**
	 * remove all subscribes
	 */
	@log('removeAll')
	removeAll(): EventBus {
		this.eventSource = {}
		return this
	}
}
