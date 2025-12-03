import { pubsub, EVENTS } from "../pubsub";

export const Subscription = {
  messageAdded: {
    subscribe: () => pubsub.asyncIterableIterator([EVENTS.MESSAGE_ADDED]),
  },
};
