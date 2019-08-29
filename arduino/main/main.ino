#include <Keyboard.h>
#include <Mouse.h>

char receivedChar;
const byte numChars = 32;
char receivedChars[numChars][numChars];
boolean newData = false;
unsigned long old_time = 0;
unsigned long new_time = 0;
int dx = 0;
int dy = 0;
int rmx = 0;
int rmy = 0;
unsigned long dt = 0;

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

void moveMosue(int x, int y) {
    new_time = millis();
    int min = abs(x);
    if (abs(x) > abs(y)) {
        min = abs(y);
    }

    dt = new_time - old_time;
    dx = x / min;
    dy = y / min;
    rmx = x % min;
    rmy = y % min;

    for (int i = 0; i < min; ++i) {
        Mouse.move(dx, dy, 0);
    }

    Mouse.move(rmx, rmy, 0);

    old_time = new_time;
}

void evalData() {
    if (newData == true) {
        // Serial.println("Input: ");
        // int i = 0;
        
        // while (receivedChars[i][0] != '\0') {
        //     Serial.println(receivedChars[i]);
        //     i++;
        // }

        if (String(receivedChars[0]) == "mouse_move") {
            old_time = millis();

            String x(receivedChars[1]);
            String y(receivedChars[2]);

            moveMosue(x.toInt(), y.toInt());
            Serial.println("mouse_move end");
        } else if (String(receivedChars[0]) == "mouse_click") {
            Serial.println("Mouse Click Command");
            Serial.println(receivedChars[1]);
        }

        // Keyboard.print(receivedChars);
        for (int idx = 0; idx < numChars; ++idx) {
            receivedChars[idx][0] = '\0';
        }
        newData = false;
    }
}

void loop() {
    recvWithStartEndMarkers();
    evalData();
}