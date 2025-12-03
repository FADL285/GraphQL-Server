import { PubSub } from "graphql-subscriptions";

// Create PubSub instance for subscriptions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pubsub = new PubSub<Record<string, any>>();

// Event names
export const EVENTS = {
  MESSAGE_ADDED: "MESSAGE_ADDED",
} as const;
