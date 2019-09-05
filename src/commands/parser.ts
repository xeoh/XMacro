import * as fs from "fs"
import * as path from "path"

import { BaseCommand } from "./base"
import { mouseDataToCommand, MOUSE_TYPE } from "./mouse"
import { KEYBOARD_TYPE, keyboardDataToCommand } from "./keyboard"

export interface Commands {
    name: string,
    first: string,
    commands: { [key: string]: BaseCommand | undefined }
}

export function parseFile(fileName: string): Commands {
    const dataBuffer = fs.readFileSync(path.join(process.cwd(), file))
    const data = JSON.parse(dataBuffer.toString())

    return parse(data)
}

export function parse(data: any): Commands {
    const commands: Commands["commands"] = {}

    for (const key of Object.keys(data.commands)) {
        const commandData = data.commands[key]
        commands[key] = dataToCommand(commandData, key)
    }

    const result = {
        name: data.name,
        first: data.first,
        commands
    }

    if (validate(result)) {
        return result
    }

    return {
        name: data.name,
        first: data.first,
        commands: {}
    }
}

function dataToCommand(data:  { [key: string]: any }, key: string) {
    if (!data || !data.type) {
        alert(`NO TYPE FIELD:\n${JSON.stringify(data)}`)
        throw new TypeError("DataParseError")
    }

    switch (data.type) {
        case MOUSE_TYPE:
            return mouseDataToCommand({ ...data, name: key })
        case KEYBOARD_TYPE:
            return keyboardDataToCommand({ ...data, name: key })
        default:
            alert(`UNKNOWN DATA TYPE:\n${JSON.stringify(data)}`)
            throw new TypeError("DataParseError")
    }
}

function validate(commands: any) {
    return true
}
