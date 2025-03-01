export class Word {
    /**
     * The word to guess, represented as a list of characters.
     * Characters are represented as strings for compatibility.
     */
    public readonly word: string[];
    /**
     * The progress of the word, represented as a list of characters where _ represents a character that has not been guessed yet.
     */
    public progress: string[];
    /**
     * The list of characters that have been guessed.
     */
    public readonly guessed: string[];

    private constructor(word: string[]) {
        this.word = word;
        this.progress = this.word.map(c => c === ' ' ? ' ' : '_');
        this.guessed = [];
    }

    static fromString(word: string): Word {
        return new Word(word.split(""));
    }

    /**
     * Guess a character in the word.
     * @param character The character to guess.
     * @return Whether the character was in the word.
     */
    public guessCharacter(character: string): boolean {
        if (this.isCharacterGuessed(character)) {
            throw new Error("Character has already been guessed");
        }

        if (!this.word.includes(character)) {
            this.guessed.push(character);
            return false;
        }

        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i] === character) {
                this.progress[i] = character;
            }
        }
        return true;
    }

    /**
     * Guess the entire word.
     * @param word The word to guess.
     * @return Whether the guessed word was correct.
     */
    public guessWord(word: string): boolean {
        if (this.getWord() === word) {
            this.progress = this.word;
            return true;
        } else {
            return false;
        }
    }

    public isWordGuessed(): boolean {
        return this.progress === this.word;
    }

    public isCharacterGuessed(character: string): boolean {
        return this.guessed.includes(character);
    }

    public getProgress(): string {
        return this.progress.join("");
    }

    public getWord(): string {
        return this.word.join("");
    }
}