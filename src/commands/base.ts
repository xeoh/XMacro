import Serial from "serialport"

export abstract class BaseCommand {
    protected preDelay = 1000
    protected postDelay = 2000

    private _name: string = ""
    get name() { return this._name }
    set name(name: string) { this._name = name }

    private _next: string | undefined
    get next(): string | undefined { return this._next}
    set next(name: string | undefined) { this._next = name }

    private _progress: string = "initialized"
    private progressCallback: ((name: string) => void) | undefined
    get progress(): string { return this._progress}
    protected setProgress(name: string) {
        this._progress = name
        if (!!this.progressCallback) {
            this.progressCallback(name)
        }
    }

    public onProgressChange(callback: (state: string) => void) {
        this.progressCallback = callback
    }

    public async run(serial: Serial) {
        await this.preRun()
        await this.main(serial)
        await this.postRun()
    }

    protected abstract async main(serial: Serial): Promise<void>
    
    protected async preRun() {
        this.setProgress("preRun")
        await new Promise((resolve) => {
            setTimeout(() => resolve(), this.preDelay)
        })
    }

    protected async postRun() {
        this.setProgress("postRun")
        await new Promise((resolve) => {
            setTimeout(() => resolve(), this.postDelay)
        })
    }
}