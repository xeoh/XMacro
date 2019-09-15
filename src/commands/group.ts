import { BaseCommand, BaseCommandData } from "./base"
import { mouseDataToCommand, MOUSE_TYPE } from "./mouse"
import { KEYBOARD_TYPE, keyboardDataToCommand } from "./keyboard"
import { CommandRunner } from "../utils/runner"

export const GROUP_TYPE = "GROUP"

export interface GroupCommandData extends BaseCommandData {
    first: string,
    loopCount: number | undefined
    commands: { [key: string]: BaseCommand | undefined }
}

export class GroupCommand extends BaseCommand {
    private loopCount: number
    private first: string
    private childs: { [key: string]: BaseCommand | undefined }

    constructor(data: GroupCommandData) {
        super(data)

        this.loopCount = data.loopCount || 1
        this.first = data.first
        this.childs = this.parseChilds(data.commands)
        console.log(this.childs)
    }
    
    async main() {
        this.setProgress("main")

        for (let i = 0; i < this.loopCount; i++) {
            let command = this.childs[this.first]
            while (!!command) {
                if (!CommandRunner.getInstance().runnable) return
                
                await command.run()
    
                if (!command.nextCommand) break
                command = this.childs[command.nextCommand]

                console.log("nextCommand", command)
            }
        }
    }

    private parseChilds(childs: { [key: string]: any }) {
        const parsed: { [key: string]: BaseCommand | undefined } = {}

        for (const key of Object.keys(childs)) {
            parsed[key] = this.parseChild(childs[key], key)
        }

        return parsed
    }

    private parseChild(data: { [key: string]: any }, key: string) {
        if (!data || !data.type) {
            alert(`NO TYPE FIELD:\n${JSON.stringify(data)}`)
            throw new TypeError("DataParseError")
        }
    
        switch (data.type) {
            case MOUSE_TYPE:
                return mouseDataToCommand({ ...data, name: key })
            case KEYBOARD_TYPE:
                return keyboardDataToCommand({ ...data, name: key })
            case GROUP_TYPE:
                return groupDataToCommand(data)
            default:
                alert(`UNKNOWN DATA TYPE:\n${JSON.stringify(data)}`)
                throw new TypeError("DataParseError")
        }
    }
}

export function groupDataToCommand(data: any) {
    if (!data || !data.type || data.type !== GROUP_TYPE) return undefined
    console.log(data)
    return new GroupCommand(data)
}