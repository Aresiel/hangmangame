import {Player} from "./Player";
import {TurnOrder} from "./TurnOrder";
import {Game} from "./Game";
import {ok, Result} from "../shared/util";

export class Session {
    public readonly id: string;
    public maxGuesses: number;
    private turnOrder: TurnOrder<Player>;
    public game: Game | undefined;

    constructor(maxGuesses: number) {
        this.id = crypto.randomUUID();
        this.maxGuesses = maxGuesses;
        this.turnOrder = new TurnOrder([]);
        this.game = undefined;
    }

    public startGame(host: Player, word: string): Result<void> {
        if(this.game !== undefined) {
            return new Error("A game is already in progress");
        }
        if(!this.getPlayers().includes(host)) {
            return new Error("Player is not in session");
        }
        const currentTurn  = this.turnOrder.currentTurn();
        if(!ok(currentTurn)){
            return new Error("Illegal state! Player in session but turnOrder is empty");
        }
        if(!currentTurn.equals(host)){
            return new Error("It is not the host's turn");
        }

        this.game = new Game(host, this.getPlayers().filter(p => !p.equals(host)), word, this.maxGuesses);
        this.turnOrder.takeTurn();
    }

    public getPlayerByPublicId(public_id: string): Player | undefined {
        return this.getPlayers().find(p => p.public_id === public_id);
    }

    public getPlayerByPrivateId(private_id: string): Player | undefined {
        return this.getPlayers().find(p => p.private_id === private_id);
    }

    public addPlayer(player: Player): Result<void> {
        if(this.getPlayers().find(p => p.equals(player)) !== undefined){
            return new Error("Player is already in session");
        }

        this.turnOrder.add(player);
        if(this.game !== undefined){
            return this.game.addPlayer(player);
        }
    }

    public removePlayer(player: Player): Result<void>{
        if(!this.getPlayers().includes(player)){
            return new Error("Player is not in session");
        }

        this.turnOrder.remove(player, (a, b) => a.equals(b));
        if(this.game !== undefined){
            this.game.removePlayer(player);
        }
    }

    public getPlayers(): Player[] {
        return this.turnOrder.getObjects();
    }
}