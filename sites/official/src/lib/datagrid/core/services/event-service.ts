import type { GridEventCallback, GridEventType } from "../types";

export class EventService {
    private listeners = new Map<GridEventType, GridEventCallback[]>();

    on(event: GridEventType, callback: GridEventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: GridEventType, callback: GridEventCallback) {
        const callbacks = this.listeners.get(event) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event: GridEventType, data: any) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }
}