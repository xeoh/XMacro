import React from "react"
import * as cp from "child_process"
import SerialPort from "serialport"

export class App extends React.Component {
    private serialPort: SerialPort | undefined

    render() {
        return (
            <div>
                <button onClick={() => { this.connect() }} >Connect</button>
                <button onClick={() => { this.sendMessage() }} >Send Message</button>
            </div>
        )
    }

    private async connect() {
        if (!!this.serialPort) return

        const portName = await this.getSerialPortName()

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

    private async sendMessage() {
        if (!this.serialPort) {
            console.error("No device connected")
            return
        }
        
        console.log("start send message")
        await new Promise((resolve) => {
            setTimeout(() => { resolve() }, 3000)
        })
        console.log(this.serialPort.writable)
        console.log("sending signal <1234>")
        this.serialPort.write("<1234>")
    }

    private async getSerialPortName() {
        const portName: string = await new Promise((resolve) => {
            SerialPort.list((err, ports) => {
                ports.forEach(port => {
                    if (port.manufacturer.includes("Arduino LLC")) {
                        resolve(port.comName)
                    }
                })
            })
        })
        return portName
    }
}