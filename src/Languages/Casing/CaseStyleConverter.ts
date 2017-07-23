/**
 * Converts series of words to a case.
 */
export class CaseStyleConverter {
    /**
     * Combines a series of words to the equivalent case style.
     * 
     * @param word   Words to convert.
     * @returns The word's equivalent in this converter's case style.
     */
    public convert(words: string[]): string {
        let result = "";

        for (let i = 0; i < words.length - 1; i += 1) {
            let word = words[i];

            result += this.transformWord(word);
            result += this.getBetweenWords();
        }

        result += this.transformWord(words[words.length - 1]);
        return result;
    }

    /**
     * @returns Filler between words in a conversion (by default, nothing).
     */
    protected getBetweenWords(): string {
        return "";
    }

    /**
     * Applies this style's transformation to a word (by default, none).
     * 
     * @param word   A word to convert.
     * @returns The word after this style's transformation.
     */
    protected transformWord(word: string): string {
        return word;
    }
}
