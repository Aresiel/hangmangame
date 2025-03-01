import {Player} from "./Player";
import {TurnOrder} from "./TurnOrder";
import {Word} from "./Word";

export class Game {
    public readonly id: string;
    public host: Player;
    public readonly players: Player[];
    public readonly turnOrder: TurnOrder<Player>;
    public readonly word: Word;
    public readonly maxGuesses: number;
    public guesses: number;

    constructor(host: Player, players: Player[], word: string, maxGuesses: number) {
        this.id = crypto.randomUUID();
        this.host = host;
        this.players = players;
        this.turnOrder = new TurnOrder(players);
        this.word = Word.fromString(word);
        this.maxGuesses = maxGuesses;
        this.guesses = 0;
    }

    public guessCharacter(player: Player, char: string) {
        if(!this.turnOrder.currentTurn().equals(player)){
            throw new Error("It is not the player's turn");
        }

        let correct = this.word.guessCharacter(char);

        this.turnOrder.takeTurn();
    }

    public guessWord(player: Player, word: string) {
        if(!this.turnOrder.currentTurn().equals(player)){
            throw new Error("It is not the player's turn");
        }

        let correct = this.word.guessWord(word);

        this.turnOrder.takeTurn();
    }

    public isGameOver(): boolean {
        return this.word.isWordGuessed() || this.guesses >= this.maxGuesses;
    }
}