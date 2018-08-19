import { IWordTransformer } from "./WordTransformer";

/**
 * Converts a series of words to ./File/System/Upper/Case.
 */
export class FileSystemUpperCaseTransformer implements IWordTransformer {
    /**
     * @returns Filler between words in a conversion.
     */
    public getBetweenWords(): string {
        return "/";
    }

    /**
     * Applies post-conversion processing to a merged name.
     *
     * @param converted   Merged name of joined transformed words.
     * @returns Postprocessed equivalent of the name.
     */
    public finalize(converted: string): string {
        return "./" + converted;
    }

    /**
     * Applies this style's transformation to a word.
     *
     * @param word   A word to convert.
     * @returns The word after this style's transformation.
     */
    public transformWord(word: string): string {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }
}
