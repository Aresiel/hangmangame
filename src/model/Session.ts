import {Player} from "./Player";
import {TurnOrder} from "./TurnOrder";
import {Game} from "./Game";

export class Session {
    public readonly id: string;
    public maxGuesses: number;
    public players: Player[];
    public turnOrder: TurnOrder<Player>;
    public game: Game | undefined;

    constructor(maxGuesses: number, players: Player[]) {
        this.id = crypto.randomUUID();
        this.maxGuesses = maxGuesses;
        this.players = players;
        this.turnOrder = new TurnOrder(players);
        this.game = undefined;
    }

    public startGame(host: Player, word: string): void {
        if(this.game !== undefined) {
            throw new Error("A game is already in progress");
        } else if(!this.turnOrder.currentTurn().equals(host)) {
            throw new Error("It is not the host's turn");
        } else {
            this.game = new Game(host, this.players.filter(p => !p.equals(host)), word, this.maxGuesses);
            this.turnOrder.takeTurn();
        }
    }

    public addPlayer(player: Player){
        if(this.players.includes(player)){
            throw new Error("Player is already in session");
        }

        this.players.push(player);
        this.turnOrder.add(player);
    }

    public removePlayer(player: Player){
        if(!this.players.includes(player)){
            throw new Error("Player is not in session");
        }

        this.players = this.players.filter(p => !p.equals(player));
        this.turnOrder.remove(player);
    }
}