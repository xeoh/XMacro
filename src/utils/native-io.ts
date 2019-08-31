const mouse = require('../../build/Release/native-io.node');
export const getMousePos = () => {
    try {
        const pos = mouse.getMousePos()
        return JSON.parse(pos)
    } catch {
        return undefined
    }
}
