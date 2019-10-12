#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <EEPROM.h>
#include <ArduinoJson.h>
#include <DHT.h>

//
#define DHTPIN 12
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
float t;
float h;
long previousTime = 0;
long interval = 1000;

// WiFi AP
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

ESP8266WebServer server(80);


// Socket Server
const char* host = "esp8266.hoyo.idv.tw";
const int port = 3003;

// Use web browser to view and copy SHA1 fingerprint of the certificate
const char fingerprint[] PROGMEM = "24 42 DB E8 31 4E 1E C4 EB 4D 78 B4 EB 74 D0 D1 F0 2D 96 44";

// Use WiFiClientSecure class to create TLS connection
WiFiClientSecure client;

void(* resetFunc) (void) = 0;

void setup() {

  Serial.begin(57600);

  // 繼電器
  pinMode(D2, OUTPUT);
  digitalWrite(D2, HIGH);

  pinMode(D4, OUTPUT);
  pinMode(D5, INPUT_PULLUP);

  // 溫濕度初始
  dht.begin();

  WiFi.mode(WIFI_STA);
  delay(500);

  Serial.println(EEPROM_ESP8266_LEER(0, 32));

  if ( EEPROM_ESP8266_LEER(0, 32).length() > 0 ) {
    WiFi.begin(EEPROM_ESP8266_LEER(0, 32).c_str(), EEPROM_ESP8266_LEER(32, 64).c_str());
    //    digitalWrite(D4, LOW);
  }

  Serial.printf("Using fingerprint '%s'\n", fingerprint);
  client.setFingerprint(fingerprint);

  // 逾時時間
  client.setTimeout(200);

  // 加入 socket server
  //  client.println("{\"player\":\"" + EEPROM_ESP8266_LEER(64, 96) + "\",\"command\":\"join\",\"value\":\"" + EEPROM_ESP8266_LEER(64, 96) + "\"}");
  //  String line = client.readStringUntil('\n');
  //  Serial.println("setup:" + line);
}

//
void loop() {

  // 按 3 秒進入 SmartConfig 模式
  unsigned long pushButton = millis();

  while (1) {

    if (digitalRead(D3) == LOW) {
      Serial.println(millis() - pushButton);

      // 按超過 3 秒
      if ( millis() - pushButton  >= 1500 ) {
        smartConfig();
        break;
      }
      else {

        if ( millis() - pushButton  >= 100 ) {
          digitalWrite(D2, !digitalRead(D2));
        }
      }
    }
    else {
      pushButton = millis();
      //      digitalWrite(D4, LOW);
      break;
    }

    yield();
  }

  //
  if (!client.connected()) {
    client.connect(host, port);
    client.println("{\"player\":\"" + EEPROM_ESP8266_LEER(64, 96) + "\",\"command\":\"join\",\"value\":\"" + EEPROM_ESP8266_LEER(64, 96) + "\"}");
  }

  //
  dht11();

  // wifi 主動控制
  String jsonControl = client.readStringUntil('\n');
  Serial.println("loop: " + jsonControl);

  if ( jsonControl.length() >= 1) {
    Serial.println("loop: " + jsonControl);
    digitalWrite(D4, LOW);
  }

  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(jsonControl);

  String relay = root[String("switch")];
  uint8_t pin = root[String("pin")];

  if (relay == "on") {
    digitalWrite(pin, HIGH);
  }

  if (relay == "off") {
    digitalWrite(pin, LOW);
  }

}

void dht11() {
  unsigned long currentTime = millis();

  if (currentTime - previousTime > interval) {
    h = dht.readHumidity();
    t = dht.readTemperature();
    //Serial.println("h: " + String(h, 1) + " t:" + String(t));

    Serial.println("{\"Temperature\":\"" + String(t, 0) + "\",\"Humidity\":\"" + String(h, 0) + "\"}");

    client.println("{\"player\":\"" + EEPROM_ESP8266_LEER(64, 96) + "\",\"command\":\"data\",\"value\":{\"Temperature\":" + String(t, 0) + ",\"Humidity\":" + String(h, 0) + "}}");

    // 記錄更新時間
    previousTime = currentTime;
  }
}

//
void smartConfig() {
  WiFi.mode(WIFI_STA);
  delay(500);
  Serial.println("\r\nWait for Smartconfig");
  WiFi.beginSmartConfig();

  Serial.println(WiFi.status());

  // WiFi.status() != WL_CONNECTED
  while (1) {
    digitalWrite(D4, !digitalRead(D4) ); // ESP8266 上的藍色指示燈閃爍
    Serial.print(".");

    if ( WiFi.smartConfigDone() ) {
      Serial.println("\nSmartConfig Success");
      Serial.printf("SSID : %s\r\n", WiFi.SSID().c_str() );
      Serial.printf("PassWord : %s\r\n", WiFi.psk().c_str() );

      EEPROM_ESP8266_GRABAR(WiFi.SSID().c_str(), 0); //Primero de 0 al 32, del 32 al 64, etc
      EEPROM_ESP8266_GRABAR(WiFi.psk().c_str(), 32); //SAVE
      WiFi.begin(EEPROM_ESP8266_LEER(0, 32).c_str(), EEPROM_ESP8266_LEER(32, 64).c_str());
      client.connect(host, port);

      // 建立 wifi ap
      wifiap();

      break;
    }

    delay(500); //勿刪
  }

  Serial.println("\nWiFi connected");
  //  digitalWrite(D4, LOW);

}

//
void wifiap() {
  delay(6000);
  WiFi.mode(WIFI_AP);
  Serial.println("Configuring access point...");
  WiFi.softAP( "HoyoIoT_" + EEPROM_ESP8266_LEER(64, 96) );

  IPAddress myIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(myIP);
  server.on("/", handleRoot);
  server.begin();
  Serial.println("HTTP server started");

  delay(10000);
  resetFunc();
}

void handleRoot() {
  server.send(200, "text/html", "<h1>You are connected</h1>");
}

//
void EEPROM_ESP8266_GRABAR(String buffer, int N) {
  EEPROM.begin(512); delay(10);
  for (int L = 0; L < 32; ++L) {
    EEPROM.write(N + L, buffer[L]);
  }
  EEPROM.commit();
}


//
String EEPROM_ESP8266_LEER(int min, int max) {
  EEPROM.begin(512); delay(10); String buffer;
  for (int L = min; L < max; ++L)
    //    if (isAlphaNumeric(EEPROM.read(L)))
    if (EEPROM.read(L))
      buffer += char(EEPROM.read(L));
  return buffer;
}
