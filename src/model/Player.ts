export class Player {
    public readonly name: string;
    public readonly id: string;

    constructor(name: string) {
        this.name = name;
        this.id = crypto.randomUUID();
    }

    public equals(other: Player) {
        return this.id === other.id;
    }
}