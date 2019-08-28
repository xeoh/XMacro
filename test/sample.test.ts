import { suite, test } from '@testdeck/jest';
import { MOUSE_ACTION_TYPE, MouseClickCommandData, MouseMoveCommandData, MouseMoveCommand, MousePressCommand } from '../src/commands/mouse'

@suite
class CommandParserSuite {

  @test
  async test() {
    const data1: MouseMoveCommandData = {
      name: "1",
      preDelay: 0,
      postDelay: 0,
      nextCommand: "2",
      action: MOUSE_ACTION_TYPE.MOVE,
      x: 100,
      y: 100
    }

    const data2: MouseClickCommandData = {
      name: "2",
      preDelay: 0,
      postDelay: 0,
      nextCommand: "3",
      action: MOUSE_ACTION_TYPE.LEFT_CLICK
    }

    const command1 = new MouseMoveCommand(data1)
    const command2 = new MousePressCommand(data2)
  }
}
