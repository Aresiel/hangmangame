import {Result} from "../shared/util";

export class TurnOrder<T> {
    private queue: T[];

    constructor(objects: T[]) {
        this.queue = objects;
    }

    /**
     * Take a turn and then return whose turn it is
     * @return the next object
     */
    public takeTurn(): Result<T> {
        const object = this.queue.shift();
        if (object === undefined) {
            return new Error("No objects in the turn order");
        }
        this.queue.push(object);
        return object;
    }

    /**
     * Get whose turn it is
     * Calling this method multiple times will return the same object.
     * Calling this after calling next() will return the same object.
     * @return the current object
     */
    public currentTurn(): Result<T> {
        if (this.queue.length === 0) {
            return new Error("No objects in the turn order");
        }
        return this.queue[0];
    }

    /**
     * Add an object to the turn order
     * @param object the object to add
     */
    public add(object: T): void {
        this.queue.push(object);
    }

    /**
     * Remove an object from the turn order
     * @param object the object to remove
     * @param equality_test a function that returns true if two objects are equal
     */
    public remove(object: T, equality_test: ((a: T, b: T) => boolean) = (a, b) => a === b): void {
        this.queue = this.queue.filter(o => !equality_test(o, object));
    }

    /**
     * Get the objects in the turn order
     * @return the objects in the turn order
     */
    public getObjects(): T[] {
        return this.queue;
    }
}