import * as fs from "fs"
import * as path from "path"

import { BaseCommand } from "./base"
import { mouseDataToCommand, MOUSE_TYPE } from "./mouse"

export interface Commands {
    name: string,
    first: string,
    commands: { [key: string]: BaseCommand | undefined }
}

export function parse(file: string): Commands {
    const dataBuffer = fs.readFileSync(path.join(process.cwd(), file))
    const data = JSON.parse(dataBuffer.toString())

    const commands: Commands["commands"] = {}

    for (const key of Object.keys(data.commands)) {
        const commandData = data.commands[key]
        commands[key] = dataToCommand(commandData)
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

function dataToCommand(data: any) {
    if (!data || !data.type) {
        alert(`NO TYPE FIELD:\n${JSON.stringify(data)}`)
        throw new TypeError("DataParseError")
    }

    switch (data.type) {
        case MOUSE_TYPE:
            return mouseDataToCommand(data)
        default:
            alert(`UNKNOWN DATA TYPE:\n${JSON.stringify(data)}`)
            throw new TypeError("DataParseError")
    }
}

function validate(commands: any) {
    return true
}
