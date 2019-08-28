import { BaseCommand } from "./base"

export class MouseMoveCommand extends BaseCommand {
    async main(serial: any) {
        this.setProgress("main")
        console.log("MouseMoveCommand")

        if (!serial) {
            console.error("No device connected")
            return
        }
    
        console.log("start send message")
        serial.write("<mouse>")
    }
}
