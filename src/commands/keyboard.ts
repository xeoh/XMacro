import { BaseCommand } from "./base"

export class KeyboardPressCommand extends BaseCommand {
    async main(serial: any) {
        this.setProgress("main")
        console.log("KeyboardPressCommand")

        if (!serial) {
            console.error("No device connected")
            return
        }
    
        console.log("start send message")
        serial.write("<keyboard>")
    }
}
