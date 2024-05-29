#include <Keypad.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Initialize the LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);  // Change the address 0x27 to match your LCD

// Define the Keypad
const byte ROWS = 4; // Four rows
const byte COLS = 4; // Four columns
char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte rowPins[ROWS] = {19, 18, 5, 17}; // Connect to the row pinouts of the keypad
byte colPins[COLS] = {16, 4, 0, 2}; // Connect to the column pinouts of the keypad

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

String inputString = "";  // A string to hold incoming numbers

// Wi-Fi credentials
const char* ssid = "Ethan";
const char* password = "ethanlam";

// Server URL
const char* serverName = "https://tic-track-server.vercel.app/submit-pin";

void setup() {
  Serial.begin(115200);  // Ensure this matches the baud rate in the Serial Monitor

  // Initialize the LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Number:");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" Connected to Wi-Fi");
  lcd.setCursor(0, 1);
  lcd.print("WiFi Connected");
  delay(2000);  // Display the connection message for 2 seconds
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter Number:");
}

void loop() {
  char key = keypad.getKey();

  if (key) {
    if (key == '#') { // Assuming '#' is the 'Enter' key
      Serial.println("You entered:");
      Serial.println(inputString);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("You entered:");
      lcd.setCursor(0, 1);
      lcd.print(inputString);
      sendPinRequest(inputString);  // Send the PIN request
      inputString = "";  // Clear the input string
      delay(2000); // Display the result for 2 seconds
      lcd.clear();
      lcd.setCursor(0, 0); // Reset to input prompt
      lcd.print("Enter Number:");
      Serial.println("Enter Number:");
    } else if (key == '*') { // Assuming '*' is the 'Clear' key
      inputString = "";  // Clear the input string
      Serial.println("Enter Number:");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Enter Number:");
    } else {
      inputString += key;  // Append the key to the input string
      Serial.println(inputString);
      lcd.setCursor(0, 1);
      lcd.print(inputString);
    }
  }
}

void sendPinRequest(String pin) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverName) + "?pin=" + pin;
    http.begin(url.c_str());
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    int httpResponseCode = http.POST("");

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("Response: ");
      Serial.println(response);
      lcd.clear();
      lcd.setCursor(0, 0);
      if (httpResponseCode == 201) {
        lcd.print("Success!");
        Serial.println("Success!");
      } else {
        lcd.print("Error: ");
        lcd.print(response);
        Serial.print("Error: ");
        Serial.println(response);
      }
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Failed!");
      Serial.println("Failed!");
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Disconnected");
  }
}
