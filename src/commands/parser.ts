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

const TYPE_MOUSE_MOVE = "MouseMove"

export interface CommandData {
    name: string
    nextCommand: string
    preDelay: number
    postDelay: number
    type: typeof TYPE_MOUSE_MOVE | "KeyboardPress"
}

export interface MouseMoveCommandData extends CommandData {
    type: typeof TYPE_MOUSE_MOVE
    x: number | string
    y: number | string
    offsetX: number | string
    offsetY: number | string
}

export function parseSingleData(data: any) {
    switch (data.type) {
        case TYPE_MOUSE_MOVE:
            return parseMouseMoveCommandData(data)
        default:
            return undefined
    }
}

export function parseMouseMoveCommandData(data: MouseMoveCommandData) {
    if (data.type !== TYPE_MOUSE_MOVE) return undefined
    if (!data.name) return undefined

    const command = new MouseMoveCommand()
    command.name = data.name
    command.next = data.nextCommand

    return command
}