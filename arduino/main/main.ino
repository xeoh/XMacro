#include <Keyboard.h>
#include <Mouse.h>
#include <math.h>

char receivedChar;
const byte numChars = 32;
char receivedChars[numChars][numChars];
boolean newData = false;

void setup() {
    Serial.begin(9600);
    Keyboard.begin();
    Mouse.begin();
    for (int idx = 0; idx < numChars; ++idx) {
        receivedChars[idx][0] = '\0';
    }   
}

void recvWithStartEndMarkers() {
    static boolean recvInProgress = false;
    static byte ndx = 0;
    static byte mdx = 0;
    char startMarker = '<';
    char endMarker = '>';
    char seperator = ',';
    char rc;
 
    while (Serial.available() > 0 && newData == false) {
        rc = Serial.read();

        if (recvInProgress == true) {
            if (rc == seperator) {
                receivedChars[mdx][ndx] = '\0'; // terminate the string
                ndx = 0;
                mdx++;
                if (mdx >= numChars) {
                    mdx = numChars - 1;
                }
            } else if (rc != endMarker) {
                receivedChars[mdx][ndx] = rc;
                ndx++;
                if (ndx >= numChars) {
                    ndx = numChars - 1;
                }
            } else {
                receivedChars[mdx][ndx] = '\0'; // terminate the string
                recvInProgress = false;
                mdx = 0;
                ndx = 0;
                newData = true;
            }
        } else if (rc == startMarker) {
            recvInProgress = true;
        }
    }
}

void moveMouse(String command) {
    if (command == "mouse_move") {
        String x(receivedChars[1]);
        String y(receivedChars[2]);

        Mouse.move(x.toInt(), y.toInt(), 0);
    }
}

void mouseClick(String command) {
    if (command == "mouse_click") {
        String x(receivedChars[1]);

        if (x == "left") {
            Mouse.click(MOUSE_LEFT);
        } else if (x == "right") {
            Mouse.click(MOUSE_RIGHT);
        }
    }
}

void mouseDown(String command) {
    if (command == "mouse_down") {
        String x(receivedChars[1]);

        if (x == "left") {
            Mouse.press(MOUSE_LEFT);
        } else if (x == "right") {
            Mouse.press(MOUSE_RIGHT);
        }
    }
}

void mouseUp(String command) {
    if (command == "mouse_up") {
        String x(receivedChars[1]);

        if (x == "left") {
            Mouse.release(MOUSE_LEFT);
        } else if (x == "right") {
            Mouse.release(MOUSE_RIGHT);
        }
    }
}

void keyboardPress(String command) {
    if (command == "key_press") {
        String key(receivedChars[1]);
        Keyboard.press('n');
        Keyboard.release('n');
    }
}

void keyboardDown(String command) {
    if (command == "key_down") {
        String key(receivedChars[1]);
        Keyboard.press('n');
    }
}

void keyboardUp(String command) {
    if (command == "key_up") {
        String key(receivedChars[1]);
        Keyboard.release('n');
    }
}

void evalData() {
    if (newData == true) {
        // Serial.println("Input: ");
        // int i = 0;
        
        // while (receivedChars[i][0] != '\0') {
        //     Serial.println(receivedChars[i]);
        //     i++;
        // }
        String command(receivedChars[0]);
        
        moveMouse(command);
        mouseClick(command);
        mouseDown(command);
        mouseUp(command);

        for (int idx = 0; idx < numChars; ++idx) {
            receivedChars[idx][0] = '\0';
        }
        newData = false;
        Serial.println("<end>");
    }
}

void loop() {
    recvWithStartEndMarkers();
    evalData();
}