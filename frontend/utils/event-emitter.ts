export interface IEventEmitter {
  on: (eventId: string, callback: EventEmitterEventCallback) => void;
  off: (eventId: string) => void;
  emit: (eventId: string, payload: any) => void;
}

type EventEmitterEventCallback = (payload: any) => any;

type EventEmitterEvent = {
  id: string;
  callback: EventEmitterEventCallback;
};

const useEventEmitter = (): IEventEmitter => {
  let events: EventEmitterEvent[] = [];

  return {
    on(eventId: string, callback: EventEmitterEventCallback) {
      events.push({
        id: eventId,
        callback,
      });
    },
    off(eventId: string) {
      events = events.filter((e) => e.id !== eventId);
    },
    async emit(eventId: string, payload: any) {
      const eventsToEmit = events.filter((e) => e.id === eventId);

      for await (const event of eventsToEmit) {
        await event.callback(payload);
      }
    },
  };
};

export default useEventEmitter;
