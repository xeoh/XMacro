import { BaseCommand, BaseCommandData } from "./base"
import { SerialManager } from "../utils/serial"
import { getMousePos } from "../utils/native-io"

const MOUSE_DURATION = 300

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
    x: number
    y: number
}

export class MouseMoveCommand extends BaseCommand {
    private _x: number
    private _y: number

    constructor(data: MouseMoveCommandData) {
        super(data)

        this._x = data.x
        this._y = data.y
    }

    async main() {
        this.setProgress("main")

        let smx = 0
        let smy = 0

        for (let i = 0; i < MOUSE_DURATION; i++) {
            const { x: x0, y : y0 } = getMousePos()
            const X = this._x - x0
            const Y = this._y - y0
            const signX = Math.sign(X)
            const signY = Math.sign(Y)
            const dx = Math.floor(Math.abs(X) / (MOUSE_DURATION - i))
            const dy = Math.floor(Math.abs(Y) / (MOUSE_DURATION - i))

            const command = `<mouse_move,${dx * signX},${dy * signY}>`
            await SerialManager.getInstance().write(command)
        }
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

    async main() {
        this.setProgress("main")
        let command = ""

        switch(this.action) {
            case MOUSE_ACTION_TYPE.LEFT_CLICK:
                command = `<mouse_click,left>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case MOUSE_ACTION_TYPE.RIGHT_CLICK:
                command = `<mouse_click,right>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case MOUSE_ACTION_TYPE.LEFT_DOWN:
                command = `<mouse_down,left>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case MOUSE_ACTION_TYPE.RIGHT_DOWN:
                command = `<mouse_down,right>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case MOUSE_ACTION_TYPE.LEFT_UP:
                command = `<mouse_up,left>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
            case MOUSE_ACTION_TYPE.RIGHT_UP:
                command = `<mouse_up,right>`
                console.log(command)
                await SerialManager.getInstance().write(command)
                break
        }
    }
}

export function mouseDataToCommand(data: any) {
    if (!data || !data.type || data.type !== MOUSE_TYPE) return undefined

    switch (data.action) {
        case MOUSE_ACTION_TYPE.MOVE:
            return new MouseMoveCommand(data)
        case MOUSE_ACTION_TYPE.LEFT_CLICK:
        case MOUSE_ACTION_TYPE.RIGHT_CLICK:
        case MOUSE_ACTION_TYPE.LEFT_DOWN:
        case MOUSE_ACTION_TYPE.RIGHT_DOWN:
        case MOUSE_ACTION_TYPE.LEFT_UP:
        case MOUSE_ACTION_TYPE.RIGHT_UP:
            return new MousePressCommand(data)
        default:
            return undefined
    }
}