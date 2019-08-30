import React from "react"
import SerialPort from "serialport"
import * as os from "os"

import { parse } from "../commands/parser"
import { SerialManager } from "../utils/serial"

export class App extends React.Component {
    render() {
        return (
            <div>
                <button onClick={() => { this.connect() }} >Connect</button>
                <button onClick={() => { this.start() }} >Start</button>
            </div>
        )
    }

    private async connect() {
        SerialManager.getInstance().connect()
    }

    private async start() {
        console.log("Start of Command\n")
        
        const { first, commands } = parse("./datafiles/test.json")
        let command = commands[first]
        while(!!command) {
            await command.run()

            if (!command.nextCommand) break
            command = commands[command.nextCommand]
        }

        console.log("End of Command\n")
    }
}