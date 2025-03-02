export class Player {
    public readonly name: string;
    public readonly public_id: string;
    public readonly private_id: string;

    constructor(name: string) {
        this.name = name;
        this.public_id = crypto.randomUUID();
        this.private_id = crypto.randomUUID();
    }

    public equals(other: Player) {
        return this.public_id === other.public_id && this.private_id === other.private_id;
    }
}