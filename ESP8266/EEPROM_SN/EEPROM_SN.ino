
#include <EEPROM.h>

const char* SN = "A8137F680C62CCCB"; //MAX 32

void setup() {
     Serial.begin(115200);

     EEPROM_ESP8266_GRABAR(SN, 64); //Primero de 0 al 32, del 32 al 64, etc

     Serial.println();
     Serial.println(EEPROM_ESP8266_LEER(0, 32));//Primero de 0 al 32, del 32 al 64, etc
     Serial.println(EEPROM_ESP8266_LEER(32, 64));
     Serial.println(EEPROM_ESP8266_LEER(64, 96));//Primero de 0 al 32, del 32 al 64, etc

}

//
void loop() {}

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
       if (isAlphaNumeric(EEPROM.read(L)))
         buffer += char(EEPROM.read(L));
     return buffer;
}
