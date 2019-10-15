export declare type EventHandler = (param?: any) => any;
export declare type EventHandlers = EventHandler[];
export declare type EventOptions = {
    channel: string;
    debug: boolean;
};
export declare type EventSource = {
    [name: string]: EventHandlers;
};
export default class EventBus {
    channel: string;
    debug: boolean;
    constructor(opts: Partial<EventOptions>);
    private formatKey;
    eventSource: EventSource;
    on(name: string, handler: EventHandlers | EventHandler): EventBus;
    off(name: string, handler?: EventHandlers | EventHandler): EventBus;
    once(name: string, handler: EventHandlers | EventHandler): EventBus;
    emit(name: string, ...params: any[]): EventBus;
    has(name: string): boolean;
    get(name: string): EventHandler | EventHandlers;
    keys(): string[];
    values(): EventHandlers[];
    remove(...name: string[]): EventBus;
    removeAll(): EventBus;
}
