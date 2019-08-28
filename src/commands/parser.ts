import { BaseCommand } from "./base"
import { MouseMoveCommand } from "./mouse"
import { KeyboardPressCommand } from "./keyboard"

export function parse(file: string): { first: string, commands: { [key: string]: BaseCommand }} {
    const FIRST_NAME = "FirstCommand"
    const SECOND_NAME = "SecondCommand"
    
    const first = new KeyboardPressCommand()
    first.name = FIRST_NAME
    first.next = SECOND_NAME

    const second = new MouseMoveCommand()
    second.name = SECOND_NAME

    return {
        first: "FirstCommand",
        commands: {
            "FirstCommand": first,
            "SecondCommand": second
        }
    }
}