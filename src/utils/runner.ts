export class CommandRunner {
    private static _instance: CommandRunner

    public static getInstance() {
        if (!this._instance) {
            this._instance = new CommandRunner()
        }

        return this._instance
    }

    private _runnable = true
    get runnable() {
        return this._runnable
    }

    set runnable(value: boolean) {
        this._runnable = value
    }
}