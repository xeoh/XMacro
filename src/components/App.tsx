import React from "react"
import SerialPort from "serialport"

import { parse } from "../commands/parser"

export class App extends React.Component {
    private serialPort: SerialPort | undefined

    render() {
        return (
            <div>
                <button onClick={() => { this.connect() }} >Connect</button>
                <button onClick={() => { this.start() }} >Start</button>
            </div>
        )
    }

    private async connect() {
        if (!!this.serialPort) return

        const portName = await this.getSerialPortName()
        if (!portName) {
            console.error("Cannot find COM port")
            return
        }

        const serialPort = new SerialPort(portName, {
            baudRate: 9600,
            // defaults for Arduino serial communication
            dataBits: 8, 
            parity: 'none', 
            stopBits: 1,
            autoOpen: true
        });

        serialPort.on("open",() => {
            console.log('open serial communication')
            this.serialPort = serialPort
            serialPort.on('data', (data) => {
                console.log(`Device Log: ${data.toString()}`)
            })
        })
    }

    private async start() {
        // if (!this.serialPort) {
        //     console.error("No device connected")
        //     return
        // }

        console.log("Start of Command\n")

        const sampleSerial = {
            write: (message: string) => {
                console.log(message)
            }
        }
        
        const { first, commands } = parse("./datafiles/test.json")
        let command = commands[first]
        while(!!command) {
            command.onProgressChange((progress) => {
                this.setState({ progress: progress })
            })

            this.setState({ current: command.name })
            await command.run(sampleSerial as SerialPort)

            if (!command.nextCommand) break
            command = commands[command.nextCommand]
        }

        this.setState({
            current: "None",
            progress: "None"
        })

        console.log("End of Command\n")
    }

    private async getSerialPortName() {
        const portName: string | undefined = await new Promise((resolve) => {
            SerialPort.list((err, ports) => {
                ports.forEach(port => {
                    if (!!port && !!port.manufacturer && port.manufacturer.includes("Arduino LLC")) {
                        resolve(port.comName)
                        return
                    }
                })
                resolve(undefined)
            })
        })
        return portName
    }
}