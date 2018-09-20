import { LineResults } from "../LineResults";
import { CommandNames } from "../Names/CommandNames";
import { Command } from "./Command";
import { CommandResult } from "./CommandResult";
import { CommandMetadata } from "./Metadata/CommandMetadata";
import { SingleParameter } from "./Metadata/Parameters/SingleParameter";

/**
 * Starts a foreach loop over a container's pairs.
 */
export class ForEachPairStartCommand extends Command {
    /**
     * Metadata on the command.
     */
    private static metadata: CommandMetadata = new CommandMetadata(CommandNames.ForEachPairStart)
        .withDescription("Starts a foreach loop over a container's pairs")
        .withIndentation([1])
        .withParameters([
            new SingleParameter("container", "A container to iterate over.", true),
            new SingleParameter("pairName", "The name of the pair variable", true),
            new SingleParameter("keyName", "The name of the key variable.", true),
            new SingleParameter("keyType", "The type of the key variable.", true),
            new SingleParameter("valueName", "The name of the value variable.", true),
            new SingleParameter("valueType", "The type of the value variable.", true),
        ]);

    /**
     * @returns Metadata on the command.
     */
    public getMetadata(): CommandMetadata {
        return ForEachPairStartCommand.metadata;
    }

    /**
     * Renders the command for a language with the given parameters.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @returns Line(s) of code in the language.
     */
    public render(parameters: string[]): LineResults {
        if (this.language.syntax.loops.forEachAsMethod) {
            return this.renderForEachAsMethod(parameters);
        }

        return this.renderForEachAsLoop(parameters);
    }

    /**
     * Renders a traditional foreach loop.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @returns Line(s) of code in the language.
     * @remarks Usage: (container, pairName, keyName, keyType, valueName, valueType).
     */
    public renderForEachAsLoop(parameters: string[]): LineResults {
        let line: string = this.language.syntax.loops.foreach;
        let output: CommandResult[];

        line += this.language.syntax.conditionals.startLeft;

        // This assumes that all languages that require declared variables (like C#) use
        // KeyValuePair<T, U> while languages that don't (like Python) use key, value
        if (this.language.syntax.variables.declarationRequired) {
            let typeName: string;
            let iteratorName: string;

            if (this.language.syntax.loops.forEachPairsAsKeys) {
                iteratorName = parameters[3];
            } else {
                iteratorName = parameters[2];
            }

            if (this.language.syntax.loops.forEachPairsAsPair) {
                typeName = this.language.syntax.loops.forEachPairsPairClass;
                typeName += "<" + parameters[4];
                typeName += ", " + parameters[6] + ">";
            } else {
                typeName = parameters[4];
            }

            line += this.language.syntax.variables.declaration;
            line += this.context.convertParsed([CommandNames.VariableInline, iteratorName, typeName]).commandResults[0].text;
        } else {
            line += parameters[3];

            if (this.language.syntax.loops.forEachPairsAsPair) {
                line += ", " + parameters[5];
            }
        }

        line += this.language.syntax.loops.forEachMiddle;
        line += parameters[1];
        line += this.language.syntax.loops.forEachGetPairs;
        line += this.language.syntax.loops.forEachRight;

        output = [new CommandResult(line, 0)];
        this.addLineEnder(output, this.language.syntax.conditionals.startRight, 1);

        if (this.language.syntax.loops.forEachPairsAsPair && this.language.syntax.variables.declarationRequired) {
            this.addPairKeyLookup(parameters, output);
            this.addPairValueLookup(parameters, output);
        } else if (this.language.syntax.loops.forEachPairsAsKeys) {
            this.addKeyedValueLookup(parameters, output);
        }

        return new LineResults(output, false);
    }

    /**
     * Renders a Ruby-style method iteration.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @returns Line(s) of code in the language.
     * @remarks Usage: (container, pairName, keyName, keyType, valueName, valueType).
     */
    public renderForEachAsMethod(parameters: string[]): LineResults {
        let output: string = parameters[1];
        output += this.language.syntax.loops.forEachGetPairs;
        output += parameters[3];
        output += ", ";
        output += parameters[5];
        output += this.language.syntax.loops.forEachRight;

        return new LineResults([new CommandResult(output, 1)], false);
    }

    /**
     * Adds the retrieval of a container's value from a key.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @param output Line(s) of code in the language.
     * @remarks Usage: (container, pairName, keyName, keyType, valueName, valueType).
     */
    private addKeyedValueLookup(parameters: string[], output: CommandResult[]): void {
        const valueName: string = this.context.convertCommon(CommandNames.Type, parameters[5]);
        const valueType: string = parameters[6];
        const valueLookup: string = this.context.convertParsed([CommandNames.DictionaryIndex, parameters[1], parameters[3]])
            .commandResults[0].text;
        let valueVariable: string = this.context.convertParsed([CommandNames.Variable, valueName, valueType, valueLookup]).commandResults[0]
            .text;

        valueVariable += this.language.syntax.style.semicolon;

        output.push(new CommandResult(valueVariable, 0));
    }

    /**
     * Adds the retrieval of a pair's key.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @param output Line(s) of code in the language.
     * @remarks Usage: (container, pairName, keyName, keyType, valueName, valueType).
     */
    private addPairKeyLookup(parameters: string[], output: CommandResult[]): void {
        const keyName: string = this.context.convertCommon(CommandNames.Type, parameters[3]);
        const keyType: string = parameters[4];
        const keyLookup: string = parameters[2] + this.language.syntax.loops.forEachPairsRetrieveKey;
        let keyVariable: string = this.context.convertParsed([CommandNames.Variable, keyName, keyType, keyLookup]).commandResults[0].text;

        keyVariable += this.language.syntax.style.semicolon;

        output.push(new CommandResult(keyVariable, 0));
    }

    /**
     * Adds the retrieval of a pair's key and value.
     *
     * @param parameters   The command's name, followed by any parameters.
     * @param output Line(s) of code in the language.
     * @remarks Usage: (container, pairName, keyName, keyType, valueName, valueType).
     */
    private addPairValueLookup(parameters: string[], output: CommandResult[]): void {
        const valueName: string = this.context.convertCommon(CommandNames.Type, parameters[5]);
        const valueType: string = parameters[6];
        const valueLookup: string = parameters[2] + this.language.syntax.loops.forEachPairsRetrieveValue;
        let valueVariable: string = this.context.convertParsed([CommandNames.Variable, valueName, valueType, valueLookup]).commandResults[0]
            .text;

        valueVariable += this.language.syntax.style.semicolon;

        output.push(new CommandResult(valueVariable, 0));
    }
}
