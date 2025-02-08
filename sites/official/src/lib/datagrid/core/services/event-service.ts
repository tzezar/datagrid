import type { GridEventType, EventPayloadMap } from "../types";

export class EventService {
    private listeners = new Map<GridEventType, ((data: any) => void)[]>(); 

    // Constrain T to keys of EventPayloadMap
    on<T extends keyof EventPayloadMap>(event: T, callback: (data: EventPayloadMap[T]) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    // Constrain T to keys of EventPayloadMap
    off<T extends keyof EventPayloadMap>(event: T, callback: (data: EventPayloadMap[T]) => void) {
        const callbacks = this.listeners.get(event) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    // Constrain T to keys of EventPayloadMap
    emit<T extends keyof EventPayloadMap>(event: T, data: EventPayloadMap[T]) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }
}
