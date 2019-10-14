import EventBus from '../src/eventbus'

const eventbus = new EventBus({
	channel: 'jsonchou',
	debug: true
})

describe('eventbus', () => {
	describe('on', () => {
		beforeEach(() => {
			eventbus.eventSource = {}
		})

		it('should hava on method', () => {
			expect(eventbus).toHaveProperty('on')
			expect(eventbus.on).toBeInstanceOf(Function)
		})

		it('should register a callback', () => {
			const fn1 = jest.fn()
			eventbus.on('foo', fn1)
			expect(eventbus.eventSource).toHaveProperty('foo')
			expect(eventbus.eventSource.foo).toEqual([fn1])
		})

		it('should register handlers for any strings', () => {
			const fn1 = jest.fn()
			const fn2 = jest.fn()
			const fn3 = jest.fn()
			eventbus.on('delete', fn1)
			eventbus.on(':90098089--', fn2)
			eventbus.on('default', fn3)
			expect(eventbus.eventSource['delete']).toContain(fn1)
			expect(eventbus.eventSource[':90098089--']).toContain(fn2)
			expect(eventbus.eventSource['default']).toContain(fn3)
			eventbus.on(1, fn3)
			expect(eventbus.eventSource[1]).toContain(fn3)
		})

		it('should support append multi handlers for one event', () => {
			const fn1 = jest.fn()
			eventbus.on('foo', () => {})
			eventbus.on('foo', fn1)
			eventbus.on('foo', fn1)
			eventbus.on('foo', fn1)
			expect(eventbus.eventSource.foo.length).toBe(4)
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

		it('should call handler by eventName', () => {
			const fn1 = jest.fn()
			eventbus.on('foo', fn1)
			eventbus.emit('foo')
			expect(fn1).toHaveBeenCalled()
			expect(fn1).toHaveBeenCalledTimes(1)
			eventbus.emit('foo')
			expect(fn1).toHaveBeenCalledTimes(2)
		})

		it('should support call handler by eventName with params', () => {
			const fn1 = jest.fn()
			eventbus.on('foo', fn1)
			eventbus.emit('foo', 'bar')
			expect(fn1).toHaveBeenCalled()
			expect(fn1).toHaveBeenCalledWith('bar')
			eventbus.emit('foo', 'bar', 'abc')
			expect(fn1).toHaveBeenCalledWith('bar', 'abc')
			expect(fn1).toHaveBeenLastCalledWith('bar', 'abc')
		})

		it('should call all handlers by eventName', () => {
			const fn1 = jest.fn()
			const fn2 = jest.fn()
			const fn3 = jest.fn()
			const fn4 = jest.fn()
			eventbus.on('foo', fn1)
			eventbus.on('foo', fn2)
			eventbus.on('foo', fn3)
			eventbus.on('foo', fn4)

			eventbus.emit('foo', 'bar')

			expect(fn1).toBeCalledWith('bar')
			expect(fn2).toBeCalledWith('bar')
			expect(fn3).toBeCalledWith('bar')
			expect(fn4).toBeCalledWith('bar')
		})

		it('should call emit normal if no handler', () => {
			const fn1 = jest.fn()
			eventbus.on('foo', fn1)
			expect(eventbus.emit('boo')).toBeFalsy()
			expect(fn1).not.toHaveBeenCalled()
			expect(fn1).toHaveBeenCalledTimes(0)
			eventbus.on('boo', fn1)
			eventbus.emit('boo')
			expect(fn1).toHaveBeenCalled()
			expect(fn1).toHaveBeenCalledTimes(1)
		})
	})

	describe('off', () => {
		let fn1: jest.EmptyFunction, fn2: jest.EmptyFunction, fn3: jest.EmptyFunction

		beforeEach(() => {
			fn1 = jest.fn()
			fn2 = jest.fn()
			fn3 = jest.fn()
			eventbus.on('foo', fn1)
			eventbus.on('foo', fn2)
			eventbus.on('foo', fn3)
			eventbus.emit('foo', 'bar')
		})

		it('should have off method', () => {
			expect(eventbus).toHaveProperty('off')
			expect(eventbus.off).toBeInstanceOf(Function)
		})

		it('should remove all handlers by eventName', () => {
			eventbus.off('foo')
			expect(eventbus.eventSource.foo).toEqual([])
		})

		it('should remove a handler by eventName with handler param', () => {
			eventbus.off('foo', fn1)
			expect(eventbus.eventSource.foo).not.toContain(fn1)
			eventbus.off('foo', fn3)
			expect(eventbus.eventSource.foo).not.toContain(fn3)
			expect(eventbus.eventSource).toHaveProperty('foo')
			expect(eventbus.eventSource['foo']).toContain(fn2)
		})

		it('should return false if without registered handlers', () => {
			eventbus.off('foo')
			expect(eventbus.off('foo')).toBeFalsy()
		})
	})
})
