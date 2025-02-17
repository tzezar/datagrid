---
editUrl: false
next: true
prev: true
title: "EventService"
---

Defined in: core/services/event-service.ts:8

Service for handling events, including registering event listeners, emitting events, and removing listeners.

## Template

The type of the event name, constrained to keys of `EventPayloadMap`.

## Constructors

### new EventService()

> **new EventService**(): [`EventService`](/api/classes/eventservice/)

#### Returns

[`EventService`](/api/classes/eventservice/)

## Methods

### emit()

> **emit**\<`T`\>(`event`, `data`): `void`

Defined in: core/services/event-service.ts:47

Emits an event with the specified data, triggering all registered listeners for that event.

#### Type Parameters

• **T** *extends* keyof [`EventPayloadMap`](/api/type-aliases/eventpayloadmap/)

The type of the event, constrained to keys of `EventPayloadMap`.

#### Parameters

##### event

`T`

The name of the event to emit.

##### data

[`EventPayloadMap`](/api/type-aliases/eventpayloadmap/)\[`T`\]

The data to pass to the event listeners.

#### Returns

`void`

***

### off()

> **off**\<`T`\>(`event`, `callback`): `void`

Defined in: core/services/event-service.ts:32

Removes an event listener for the specified event.

#### Type Parameters

• **T** *extends* keyof [`EventPayloadMap`](/api/type-aliases/eventpayloadmap/)

The type of the event, constrained to keys of `EventPayloadMap`.

#### Parameters

##### event

`T`

The name of the event to remove the listener from.

##### callback

(`data`) => `void`

The callback function to remove from the event listener list.

#### Returns

`void`

***

### on()

> **on**\<`T`\>(`event`, `callback`): `void`

Defined in: core/services/event-service.ts:18

Registers an event listener for the specified event.

#### Type Parameters

• **T** *extends* keyof [`EventPayloadMap`](/api/type-aliases/eventpayloadmap/)

The type of the event, constrained to keys of `EventPayloadMap`.

#### Parameters

##### event

`T`

The name of the event to listen for.

##### callback

(`data`) => `void`

The callback function to invoke when the event is emitted.

#### Returns

`void`
