import { IWordTransformer } from "./WordTransformer";

/**
 * Converts a series of words to snake_case.
 */
export class SnakeCaseTransformer implements IWordTransformer {
    /**
     * @returns Filler between words in a conversion.
     */
    public getBetweenWords(): string {
        return "_";
    }

    /**
     * Applies no post-conversion processing to a merged name.
     *
     * @param converted   Merged name of joined transformed words.
     * @returns Postprocessed equivalent of the name.
     */
    public finalize(converted: string): string {
        return converted;
    }

    /**
     * Applies this style's transformation to a word.
     *
     * @param word   A word to convert.
     * @returns The word after this style's transformation.
     */
    public transformWord(word: string): string {
        return word.toLowerCase();
    }
}
