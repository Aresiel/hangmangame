import {ServerMessage} from "./messageTypes";
import {error} from "elysia";

type Message = { topic: string, message: ServerMessage }

export class MessageDistributor {
    private subscribers: Map<string, ((message: ServerMessage) => void)[]>;

    constructor() {
        this.subscribers = new Map();
    }

    public subscribe(topic: string, callback: (message: ServerMessage) => void): void {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, []);
        }
        this.subscribers.get(topic)!.push(callback);
    }

    public publish(topic: string, message: ServerMessage): void {
        if (this.subscribers.has(topic)) {
            this.subscribers.get(topic)!.forEach(subscriber => {
                try {
                    subscriber(message)
                } catch (error: unknown) {

                    if(error instanceof Error) {
                        subscriber({
                            type: "ERROR",
                            message: error.message + "\n You have been unsubscribed from the topic " + topic
                        })
                    }

                    const index = this.subscribers.get(topic)!.indexOf(subscriber);
                    this.subscribers.get(topic)!.splice(index, 1);
                }
            });
        }
    }
}