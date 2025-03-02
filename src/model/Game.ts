import {Player} from "./Player";
import {TurnOrder} from "./TurnOrder";
import {Word} from "./Word";
import {ok, Result} from "../shared/util";

export class Game {
    public readonly id: string;
    public host: Player;
    private readonly turnOrder: TurnOrder<Player>;
    public readonly word: Word;
    public readonly maxGuesses: number;
    public guesses: number;

    constructor(host: Player, players: Player[], word: string, maxGuesses: number) {
        this.id = crypto.randomUUID();
        this.host = host;
        this.turnOrder = new TurnOrder(players);
        this.word = Word.fromString(word);
        this.maxGuesses = maxGuesses;
        this.guesses = 0;
    }

    public guessCharacter(player: Player, char: string): Result<boolean> {
        const currentTurnPlayer = this.turnOrder.currentTurn();
        if(!ok(currentTurnPlayer)){
            return new Error("Illegal state! No player in turn order");
        }
        if(!currentTurnPlayer.equals(player)){
            return new Error("It is not the player's turn");
        }

        let correct = this.word.guessCharacter(char);

        this.turnOrder.takeTurn();

        return correct;
    }

    public guessWord(player: Player, word: string): Result<boolean>  {
        const currentTurnPlayer = this.turnOrder.currentTurn();
        if(!ok(currentTurnPlayer)){
            return new Error("Illegal state! No player in turn order");
        }
        if(!currentTurnPlayer.equals(player)){
            return new Error("It is not the player's turn");
        }

        let correct = this.word.guessCharacter(word);

        this.turnOrder.takeTurn();

        return correct;
    }

    public isGameOver(): boolean {
        return this.word.isWordGuessed() || this.guesses >= this.maxGuesses;
    }

    public addPlayer(player: Player): Result<void> {
        if(this.getPlayers().find(p => p.equals(player)) !== undefined){
            return new Error("Player is already in session");
        }

        this.turnOrder.add(player);
    }

    public removePlayer(player: Player): Result<void>{
        if(!this.getPlayers().includes(player)){
            return new Error("Player is not in session");
        }

        this.turnOrder.remove(player, (a, b) => a.equals(b));
    }

    public getPlayers(): Player[] {
        return this.turnOrder.getObjects();
    }
}