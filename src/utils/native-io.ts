const nativeio = require('../../build/Release/native-io.node');
export const getMousePos: () => { x: number, y: number } = nativeio.getMousePos

