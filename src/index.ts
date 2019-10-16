/**
 * EventBus module
 * @see https://github.com/jsonchou/zax-eventbus
 */

import EventBus, { EventHandler, EventHandlers, EventOptions, EventSource } from './eventbus'
const EventBusSingleton = new EventBus({})

export default EventBus
export { EventBusSingleton, EventHandler, EventHandlers, EventOptions, EventSource }
