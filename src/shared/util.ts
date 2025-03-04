import * as assert from "node:assert";
import * as inspector from "node:inspector";

export function assertNonNull<T>(value: T | null, message: string = "Value is null"): T {
    if(value === null) {
        throw new Error(message)
    }
    return value
}

export function assertNonUndefined<T>(value: T | undefined, message: string = "Value is undefined"): T {
    if(value === undefined) {
        throw new Error(message)
    }
    return value
}

export function castTo<T>(clazz: { new(...args: never): T }, instance: unknown): T {
    if(instance instanceof clazz) {
        return instance as T;
    } else {
        throw new Error(`Value is not of type ${clazz}`);
    }
}

export type Result<T> = T | Error;

export function ok<T>(result: Result<T>): result is T {
    return !(result instanceof Error);
}