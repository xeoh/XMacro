import * as ioHook from "iohook"

import { KEY_MAP } from "./keymap"

interface KeyOption {
    altKey?: boolean
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
}

interface KeydownEvent extends KeyOption {
    keycode: number
    rawcode: number
    type: "keydown"
}

export class IOHookManager {
    private static _instance: IOHookManager
    private static hotkeys: ({ key: string, callback: () => any } & KeyOption)[] = []

    public static getInstance() {
        if (!IOHookManager._instance) {
            this._instance = new IOHookManager()
            ioHook.start(false)

            ioHook.on("keydown", (event: KeydownEvent) => {
                const key = KEY_MAP[event.keycode]
                if (!key) { return }
                
                for (const hotkey of IOHookManager.hotkeys) {
                    const match = hotkey.key === key
                        && !!hotkey.altKey === !!event.altKey
                        && !!hotkey.ctrlKey === !!event.ctrlKey
                        && !!hotkey.metaKey === !!event.metaKey
                        && !!hotkey.shiftKey === !!event.shiftKey

                    if (match) {
                        hotkey.callback()
                    }
                }
            })
        }

        return this._instance
    }

    registerHotKey(key: string, options: KeyOption, callback: () => any) {
        IOHookManager.hotkeys.push({
            key,
            ...options,
            callback
        })
    }
}
