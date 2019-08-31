import React from "react"

import { parse } from "../commands/parser"
import { SerialManager } from "../utils/serial"
import { IOHookManager } from "../utils/hooks"

export interface AppState {
    active: boolean
    running: boolean
}

export class App extends React.Component<{}, AppState> {
    state: AppState = {
        active: false,
        running: false
    }

    componentDidMount() {
        SerialManager.getInstance().connect()
        IOHookManager.getInstance().registerHotKey(
            "s",
            {
                ctrlKey: true,
                shiftKey: true
            },
            () => {
                this.start()
            }
        )
        IOHookManager.getInstance().registerHotKey(
            "d",
            {
                ctrlKey: true,
                shiftKey: true
            },
            () => {
                this.stop()
            }
        )
    }

    render() {
        return (
            <div>
                <button onClick={() => { this.toggleActive() }} >{this.state.active ? "비활성화" : "활성화" }</button>
                <div>
                    press CMD+SHIFT+S to start commands
                </div>
            </div>
        )
    }

    private async toggleActive() {
        this.setState({ active: !this.state.active })
    }

    private async start() {
        if (!this.state.active || this.state.running) {
            return
        }

        this.setState({ running: true })

        console.log("Start of Command\n")
        
        const { first, commands } = parse("./datafiles/test.json")
        let command = commands[first]
        while(!!command) {
            if (!this.state.active) {
                this.setState({ running: false })
                return
            }

            await command.run()

            if (!command.nextCommand) break
            command = commands[command.nextCommand]
        }

        this.setState({
            active: true,
            running: false
        })
        console.log("End of Command\n")
    }

    private async stop() {
        this.setState({
            active: false,
            running: false
        })
    }
}