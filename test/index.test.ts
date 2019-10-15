import EventBus, { EventHandler } from '../src/eventbus'
import log from '../src/log'

const eventbus = new EventBus({
	channel: 'jsonchou',
	debug: false
})

const attributeMembers = ['channel', 'debug']
const funcMembers = ['on', 'once', 'off', 'emit', 'has', 'get', 'keys', 'values', 'remove', 'removeAll']
const chainfuncMembers = ['on', 'once', 'off', 'emit', 'remove', 'removeAll']

const prefix = '@' + eventbus.channel + '/'

describe('eventbus', () => {

	it('should have channel', () => {
		expect(eventbus).toHaveProperty('channel')
	})

	it('should have debug', () => {
		expect(eventbus).toHaveProperty('debug')
	})

	describe('formatKey', () => {
		it('should not be visited', () => {
			expect(eventbus).toHaveProperty('formatKey')
			expect(eventbus['formatKey']).toBeInstanceOf(Function)
		})

		it('should invoke success', () => {
			expect(eventbus['formatKey']('test')).toEqual(prefix + 'test')
		})
	})

	describe('channel', () => {
		it('should have attribute channel', () => {
			expect(eventbus).toHaveProperty('channel')
		})
	})

	describe('debug', () => {
		it('should have attribute debug', () => {
			expect(eventbus).toHaveProperty('debug')
		})
	})

	describe('on', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have on method', () => {
			expect(eventbus).toHaveProperty('on')
			expect(eventbus.on).toBeInstanceOf(Function)
		})

		it('should have a hook', () => {
			const fn1 = jest.fn
			eventbus.on('bar', fn1)
			expect(eventbus.eventSource).toHaveProperty(prefix + 'bar')
			expect(eventbus.eventSource[prefix + 'bar']).toEqual([fn1])
		})

		it('should register a subscribe', () => {
			const fn1 = jest.fn
			const fn2 = jest.fn
			const fn3 = jest.fn
			const fn4 = jest.fn

			eventbus.on('add', fn1)
			eventbus.on('delete', fn2)
			eventbus.on('modify', fn3)
			eventbus.on('view', fn4)
			expect(eventbus.eventSource[prefix + 'add']).toContain(fn1)
			expect(eventbus.eventSource[prefix + 'delete']).toContain(fn2)
			expect(eventbus.eventSource[prefix + 'modify']).toContain(fn3)
			expect(eventbus.eventSource[prefix + 'view']).toContain(fn4)
		})

		it('should register a duplicate subscribe', () => {
			const foo1 = jest.fn
			const foo2 = jest.fn
			const foo3 = jest.fn

			eventbus.on('foo', foo1)
			eventbus.on('foo', foo2)
			eventbus.on('foo', foo3)
			expect(eventbus.eventSource[prefix + 'foo'].length).toBe(3)
		})
	})

	describe('once', () => {
		beforeEach(() => {
			// reset EventSource
			eventbus.eventSource = {}
		})
		it('should have once method', () => {
			expect(eventbus).toHaveProperty('once')
			expect(eventbus.once).toBeInstanceOf(Function)
		})

		it('should have a hook', () => {
			const fn1 = jest.fn
			eventbus.once('bar', fn1)
			expect(eventbus.eventSource).toHaveProperty(prefix + 'bar')
			expect(eventbus.eventSource[prefix + 'bar'].length).toBe(2)
		})

		it('should register a subscribe for once', () => {
			let fn1 = jest.fn
			eventbus.once('once_fn', fn1)

			expect(eventbus.eventSource[prefix + 'once_fn']).toContain(fn1)
		})
	})

	describe('off', () => {
		it('should have off method', () => {
			expect(eventbus).toHaveProperty('off')
			expect(eventbus.off).toBeInstanceOf(Function)
		})

		it('should remove a subscribe', () => {
			let fn1 = console.log
			let fn2 = jest.fn
			eventbus.on('off_fn', [fn1, fn2])
			eventbus.off('off_fn', fn1)
			expect(eventbus.eventSource[prefix + 'off_fn']).not.toContain(fn1)
			expect(eventbus.eventSource[prefix + 'off_fn']).toContain(fn2)

			eventbus.off('off_fn', fn2)
			expect(eventbus.eventSource[prefix + 'off_fn']).not.toContain(fn2)
			expect(eventbus.eventSource[prefix + 'off_fn']).toEqual([])

			eventbus.on('off_fn2', [fn1, fn2])
			eventbus.off('off_fn2')
			expect(eventbus.eventSource[prefix + 'off_fn2']).toEqual([])
		})
	})

	describe('emit', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have emit method', () => {
			expect(eventbus).toHaveProperty('emit')
			expect(eventbus.emit).toBeInstanceOf(Function)
		})

		it('should emit a handler', () => {
			let fn1 = jest.fn()
			eventbus.on('emit_fn', fn1)
			eventbus.emit('emit_fn')
			expect(fn1).toHaveBeenCalled()
			expect(fn1).toHaveBeenCalledTimes(1)
			eventbus.emit('emit_fn', 'param1', 'param2', 'param3')
			expect(fn1).toHaveBeenCalledTimes(2)
			expect(fn1).toHaveBeenCalledWith('param1', 'param2', 'param3')
		})

		it('should emit a once handler', () => {
			let fn2 = jest.fn()
			eventbus.once('once_fn', fn2)
			eventbus.emit('once_fn')
			expect(fn2).toHaveBeenCalled()
			expect(fn2).toHaveBeenCalledTimes(1)
			expect(eventbus.get('once_fn')).toEqual([])
		})
	})

	describe('has', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have has method', () => {
			expect(eventbus).toHaveProperty('has')
			expect(eventbus.has).toBeInstanceOf(Function)
		})

		it('should have a key', () => {
			let fn1 = jest.fn()
			eventbus.on('has_fn', fn1)
			expect(eventbus.has('has_fn')).toBeTruthy()
			expect(eventbus.has('has_fn_fake')).not.toBeTruthy()
		})
	})

	describe('get', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have get method', () => {
			expect(eventbus).toHaveProperty('get')
			expect(eventbus.get).toBeInstanceOf(Function)
		})

		it('should get a key', () => {
			let fn1 = jest.fn()
			eventbus.on('get_fn', fn1)
			expect(eventbus.get('get_fn')).toBeTruthy()
			expect(eventbus.has('get_fn_fake')).not.toBeTruthy()
		})
	})

	describe('keys', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have keys method', () => {
			expect(eventbus).toHaveProperty('keys')
			expect(eventbus.keys).toBeInstanceOf(Function)
		})

		it('should get keys', () => {
			let fn1 = jest.fn()
			eventbus.on('keys_fn', fn1)
			expect(eventbus.keys()).toBeTruthy()
		})
	})

	describe('values', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have values method', () => {
			expect(eventbus).toHaveProperty('values')
			expect(eventbus.values).toBeInstanceOf(Function)
		})

		it('should get all of values', () => {
			let fn1 = jest.fn()
			eventbus.on('keys_fn', fn1)
			expect(eventbus.values()).toBeTruthy()
		})
	})

	describe('remove', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have remove method', () => {
			expect(eventbus).toHaveProperty('remove')
			expect(eventbus.remove).toBeInstanceOf(Function)
		})

		it('should remove a key', () => {
			let fn1 = jest.fn()
			let fn2 = jest.fn()
			let fn3 = jest.fn()
			let fn4 = jest.fn()
			let fn5 = jest.fn()

			eventbus.on('remove_fn1', fn1)
			eventbus.on('remove_fn2', fn2)
			eventbus.on('remove_fn3', fn3)
			eventbus.on('remove_fn4', fn4)
			eventbus.on('remove_fn5', fn5)

			eventbus.remove('remove_fn1')
			eventbus.remove('remove_fn2')

			expect(eventbus.get('remove_fn3')).toBeTruthy()
			expect(eventbus.get('remove_fn4')).toBeTruthy()
			expect(eventbus.get('remove_fn5')).toBeTruthy()

			eventbus.remove('remove_fn3', 'remove_fn4', 'remove_fn5')

			expect(eventbus.get('remove_fn3')).toBeFalsy()
			expect(eventbus.get('remove_fn4')).toBeFalsy()
			expect(eventbus.get('remove_fn5')).toBeFalsy()
		})

		it('should remove a unexist key', () => {
			let fn1 = jest.fn()
			expect(eventbus.remove('remove_unexist_fn1')).toBeTruthy()
		})
	})

	describe('removeAll', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should have removeAll method', () => {
			expect(eventbus).toHaveProperty('removeAll')
			expect(eventbus.removeAll).toBeInstanceOf(Function)
		})

		it('should remove all of keys', () => {
			let fn1 = jest.fn()
			let fn2 = jest.fn()
			let fn3 = jest.fn()
			let fn4 = jest.fn()
			let fn5 = jest.fn()

			eventbus.on('remove_fn1', fn1)
			eventbus.on('remove_fn2', fn2)
			eventbus.on('remove_fn3', fn3)

			eventbus.removeAll()

			expect(eventbus.get('remove_fn1')).toBeFalsy()
			expect(eventbus.get('remove_fn2')).toBeFalsy()
			expect(eventbus.get('remove_fn3')).toBeFalsy()
		})
	})
})

describe('log', () => {
	it('should invoke success', () => {
		let res = log('test')
		expect(log).toBeInstanceOf(Function)
		expect(res).toBeTruthy()
	})

	it('should return a function', () => {
		let res = log('test')
		expect(log).toBeInstanceOf(Function)
		expect(res).toBeTruthy()
		expect(res).toBeInstanceOf(Function)

		let res2 = log()
		expect(res2).toBeTruthy()
		expect(res2).toBeInstanceOf(Function)

	})
})
