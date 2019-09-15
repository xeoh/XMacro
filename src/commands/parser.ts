import * as fs from "fs"
import * as path from "path"

import { BaseCommand } from "./base"
import { groupDataToCommand, GroupCommand } from "./group" 

export interface Commands {
    name: string,
    first: string,
    commands: { [key: string]: BaseCommand | undefined }
}

export function parseFile(fileName: string) {
    const dataBuffer = fs.readFileSync(path.join(process.cwd(), fileName))
    const data = JSON.parse(dataBuffer.toString())

    return groupDataToCommand(data)
}
