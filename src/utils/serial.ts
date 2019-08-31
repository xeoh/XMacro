import Serial from "serialport"
import * as os from "os"

interface SerialPort {
    comName: string
    manufacturer?: string   
}

export class SerialManager {
    private static _instance: SerialManager

    public static getInstance() {
        if (!SerialManager._instance) {
            this._instance = new SerialManager()
        }

        return this._instance
    }

    private _serial: Serial | undefined
    get serial() {
        return this._serial
    }
    private rcvData: string = ""
    private writeResolver: (() => void) | undefined

    async connect() {
        if (os.platform() !== "win32") {
            this._serial = new SerialMock() as unknown as Serial
        } else {
            const port = (await this.getSerialPorts())
                .find((port) => !!port && !!port.manufacturer && port.manufacturer.includes("Arduino LLC"))
            
            if (!port) {
                console.error("Cannot find COM Port")
                return
            }
            
            const serial = new Serial(port.comName, {
                baudRate: 9600,
                dataBits: 8, 
                parity: "none",
                stopBits: 1,
                autoOpen: true
            });
    
            await new Promise((resolve, reject) => {
                serial.on("open", () => {
                    console.log(`Serial Communication Started: ${port.comName} ${port.manufacturer || ""}`)
                    this._serial = serial
                    resolve()
                })
            })
        }

        if (!this.serial) {
            console.error("Cannot Initialize Serial Communication")
            return
        }

        this.serial.on('data', (data) => {
            this.onSerialData(data.toString())
        })
    }

    async write(data: string) {
        await new Promise((resolve) => {
            if (!this._serial) {
                console.log("Serial Communication Not Connected")
                return
            }

            this.writeResolver = resolve
            this._serial.write(data)
        })
    }

    private onSerialData(data: string | Buffer) {
        const strData = data.toString().trim()
        this.rcvData += strData

        const dataStart = this.rcvData.indexOf("<")
        const dataEnd = this.rcvData.indexOf(">")

        if (dataStart !== -1 && dataEnd !== -1) {
            const message = this.rcvData.slice(dataStart + 1, dataEnd)
            this.rcvData = this.rcvData.slice(dataEnd + 1)

            if (message === "end") {
                if (this.writeResolver) {
                    this.writeResolver()
                    this.writeResolver = undefined
                }
            }
        }

        // console.log(`Device Log: ${data.toString()}`)
    }

    private async getSerialPorts() {
        const ports = await new Promise((resolve, reject) => {
            Serial.list((err, ports) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(ports)
            })
        })

        return ports as SerialPort[]
    }
}

class SerialMock {
    private callbacks = {
        data: (msg: string | Buffer) => {}
    }

    write(msg: string | Buffer) {
        // console.log(`Serial Mock Write: ${msg.toString()}`)

        setTimeout(() => {
            this.callbacks.data("<end>")
        }, 500)
    }

    on(event: string, callback: (msg: string | Buffer) => void) {
        if (event === "data") {
            this.callbacks.data = callback
        }
    }
}
