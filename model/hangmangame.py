from model.player import Player


class HangmanGame:
    word: list[str]
    guessed_word: list[str]
    hint: str
    allowed_letters = set[str]
    guessed_letters = set[str]
    remaining_guesses: int
    host: Player
    turn_order: list[Player]

    def __init__(self, word: str, hint: str, host: Player, max_guesses: int):
        self.word = list(word)
        self.hint = hint
        self.host = host
        self.remaining_guesses = max_guesses
        self.allowed_letters = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        self.guessed_letters = set()
        self.guessed_word = ["_" if char in self.allowed_letters else char for char in self.word]

    def guess_letter(self, player: Player, letter: str) -> bool:
        letter = letter.upper()

        if letter in self.guessed_letters or letter not in self.allowed_letters:
            return False

        self.guessed_letters.add(letter)

        if letter in self.word:
            self.guessed_word = [letter if pair[0] == letter else pair[1] for pair in zip(self.word, self.guessed_word)]
            player.score += 1
            return True
        else:
            player.score -= 1
            self.remaining_guesses -= 1
            return False

    def guess_word(self, player: Player, word: str) -> bool:
        if word.upper() == "".join(self.word).upper():
            for letter in word:
                self.guess_letter(player, letter)
            return True
        else:
            player.score -= 1
            self.remaining_guesses -= 1
            return False

    def is_game_over(self) -> bool:
        return self.remaining_guesses <= 0 or "_" not in self.guessed_word
