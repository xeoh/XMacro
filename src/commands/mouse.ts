import { BaseCommand, BaseCommandData } from "./base"

export enum MOUSE_ACTION_TYPE {
    MOVE = "MOVE",
    LEFT_CLICK = "LEFT_CLICK",
    LEFT_DOWN = "LEFT_DOWN",
    LEFT_UP = "LEFT_UP",
    RIGHT_CLICK = "RIGHT_CLICK",
    RIGHT_DOWN = "RIGHT_DOWN",
    RIGHT_UP = "RIGHT_UP"
}

export const MOUSE_TYPE = "MOUSE"

export interface MouseMoveCommandData extends BaseCommandData {
    action: MOUSE_ACTION_TYPE.MOVE,
    x: number | string
    y: number | string
}

export class MouseMoveCommand extends BaseCommand {
    private _x: number | string
    private _y: number | string

    constructor(data: MouseMoveCommandData) {
        super(data)

        this._x = data.x
        this._y = data.y
    }

    async main(serial: any) {
        this.setProgress("main")
        
        if (!serial) {
            console.error("No device connected")
            return
        }
        console.log(`<mouse_move,${this._x},${this._y}>`)
        serial.write(`<mouse_move,${this._x},${this._y}>`)

        await new Promise((resolve) => {
            setTimeout(() => { resolve() }, 1000)
        })
    }
}

export interface MouseClickCommandData extends BaseCommandData {
    action: MOUSE_ACTION_TYPE.LEFT_CLICK | MOUSE_ACTION_TYPE.RIGHT_CLICK
}

export interface MouseDownCommandData extends BaseCommandData {
    action: MOUSE_ACTION_TYPE.LEFT_DOWN | MOUSE_ACTION_TYPE.RIGHT_DOWN
}

export interface MouseUpCommandData extends BaseCommandData {
    action: MOUSE_ACTION_TYPE.LEFT_UP | MOUSE_ACTION_TYPE.RIGHT_UP
}

export class MousePressCommand extends BaseCommand {
    private action: MouseClickCommandData["action"] | MouseDownCommandData["action"] | MouseUpCommandData["action"]
    constructor(data: MouseClickCommandData | MouseDownCommandData | MouseUpCommandData) {
        super(data)
        this.action = data.action
    }

    async main(serial: any) {
        this.setProgress("main")
        
        if (!serial) {
            console.error("No device connected")
            return
        }
        
        switch(this.action) {
            case MOUSE_ACTION_TYPE.LEFT_CLICK:
                console.log(`<mouse_click,left>`)
                break
            case MOUSE_ACTION_TYPE.RIGHT_CLICK:
                console.log(`<mouse_click,right>`)
                break
            case MOUSE_ACTION_TYPE.LEFT_DOWN:
                console.log(`<mouse_down,left>`)
                break
            case MOUSE_ACTION_TYPE.RIGHT_DOWN:
                console.log(`<mouse_down,right>`)
                break
            case MOUSE_ACTION_TYPE.LEFT_UP:
                console.log(`<mouse_up,left>`)
                break
            case MOUSE_ACTION_TYPE.RIGHT_UP:
                console.log(`<mouse_up,right>`)
                break
        }
    }
}

export function mouseDataToCommand(data: any) {
    if (!data || !data.type || data.type !== MOUSE_TYPE) return undefined

    switch (data.action) {
        case MOUSE_ACTION_TYPE.MOVE:
            return new MouseMoveCommand(data)
        default:
            return new MousePressCommand(data)
    }
}