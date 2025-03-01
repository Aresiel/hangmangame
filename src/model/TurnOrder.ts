export class TurnOrder<T> {
    private readonly queue: T[];

    constructor(objects: T[]) {
        this.queue = objects;
    }

    /**
     * Take a turn and then return whose turn it is
     * @return the next object
     */
    public takeTurn(): T {
        const object = this.queue.shift();
        if (object === undefined) {
            throw new Error("No objects in the turn order");
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
    public currentTurn(): T {
        if (this.queue.length === 0) {
            throw new Error("No objects in the turn order");
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
     * @param object
     */
    public remove(object: T): void {
        const index = this.queue.indexOf(object);
        if (index === -1) {
            throw new Error("Object not in turn order");
        }
        this.queue.splice(index, 1);
    }
}