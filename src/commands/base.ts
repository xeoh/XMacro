export interface BaseCommandData {
    name: string
    preDelay: number
    postDelay: number
    nextCommand?: string
}

export abstract class BaseCommand {
    protected _name: string = ""
    protected _nextCommand: string | undefined
    protected _preDelay = 0
    protected _postDelay = 0
    private _progress: string = "initialized"
    private progressCallback: ((name: string) => void) | undefined
    
    constructor(data: BaseCommandData) {
        this._name = data.name
        this._nextCommand = data.nextCommand
        this._preDelay = data.preDelay
        this._postDelay = data.postDelay
    }

    get name() { return this._name }
    get nextCommand(): string | undefined { return this._nextCommand}
    get preDelay() { return this._preDelay }
    get postDelay() { return this._postDelay }
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

    public async run() {
        await this.preRun()
        await this.main()
        await this.postRun()
    }
    
    protected async preRun() {
        this.setProgress("preRun")
        await new Promise((resolve) => {
            setTimeout(() => resolve(), this.preDelay)
        })
    }

    protected async postRun() {
        this.setProgress("postRun")
        await new Promise((resolve) => {
            setTimeout(() => resolve(), this._postDelay)
        })
    }

    protected abstract async main(): Promise<void>
}
