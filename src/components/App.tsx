import React from "react"

import { parseFile } from "../commands/parser"
import { SerialManager } from "../utils/serial"

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
        // SerialManager.getInstance().connect()
    }

    render() {
        return (
            <div>
                <button onClick={() => { this.toggleActive() }} >{this.state.active ? "비활성화" : "활성화" }</button>
                <button onClick={() => { this.start() }} >시작</button>
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
        
        const command = parseFile("./datafiles/test.json")
        
        if (command) {
            await command.run()
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