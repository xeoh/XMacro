import { BaseCommand, BaseCommandData } from "./base"
import { SerialManager } from "../utils/serial"

export enum KEYBOARD_ACTION_TYPE {
    PRESS = "PRESS",
    DOWN = "DOWN",
    UP = "UP"
}

export const KEYBOARD_TYPE = "KEYBOARD"

export interface KeyboardCommandData extends BaseCommandData {
    action: KEYBOARD_ACTION_TYPE
    key: string
}

export class KeyboardCommand extends BaseCommand {
    private action: KEYBOARD_ACTION_TYPE
    private key: string

    constructor(data: KeyboardCommandData) {
        super(data)
        this.action = data.action
        this.key = data.key
    }
    
    async main() {
        this.setProgress("main")
        let command = ""

        switch(this.action) {
            case KEYBOARD_ACTION_TYPE.PRESS:
                command = `<key_press,${this.key}>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case KEYBOARD_ACTION_TYPE.DOWN:
                command = `<key_down,${this.key}>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case KEYBOARD_ACTION_TYPE.UP:
                command = `<key_up,${this.key}>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
        }
    }
}

export function keyboardDataToCommand(data: any) {
    if (!data || !data.type || data.type !== KEYBOARD_TYPE) return undefined

    switch (data.action) {
        case KEYBOARD_ACTION_TYPE.PRESS:
        case KEYBOARD_ACTION_TYPE.DOWN:
        case KEYBOARD_ACTION_TYPE.UP:
            return new KeyboardCommand(data)
        default:
            return undefined
    }
}