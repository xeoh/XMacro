import { BaseCommand, BaseCommandData } from "./base"
import { mouseDataToCommand, MOUSE_TYPE } from "./mouse"
import { KEYBOARD_TYPE, keyboardDataToCommand } from "./keyboard"

export const GROUP_TYPE = "GROUP"

export interface GroupCommandData extends BaseCommandData {
    first: string,
    loopCount: number
    childs: { [key: string]: BaseCommand | undefined }
}

export class KeyboardCommand extends BaseCommand {
    private loopCount: number
    private childs: { [key: string]: BaseCommand | undefined }

    constructor(data: GroupCommandData) {
        super(data)

        this.loopCount = data.loopCount
        const { name, childs } = this.parseChilds(data.childs, data.name)
        this.childs = childs
    }
    
    async main() {
        this.setProgress("main")
    }

    private parseChilds(childs: { [key: string]: any }, key: string) {
        const parsed: { [key: string]: BaseCommand | undefined } = {}

        for (const key of Object.keys(childs)) {
            parsed[key] = this.parseChild(childs[key], key)
        }

        return { childs, name: key }
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
                return this.parseChilds()
            default:
                alert(`UNKNOWN DATA TYPE:\n${JSON.stringify(data)}`)
                throw new TypeError("DataParseError")
        }
    }
}

export function GroupDataToCommand(data: any) {
    if (!data || !data.type || data.type !== GROUP_TYPE) return undefined


    
}