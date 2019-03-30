from simpletest import temp
import RPi.GPIO as GPIO
import urllib
from time import sleep
import requests
from bs4 import BeautifulSoup


GPIO.setmode(GPIO.BOARD)     
GPIO.setup(3, GPIO.OUT)
fan = GPIO.PWM(3, 100)
fan.start(0)

def RPM(duty):   
    fan.ChangeDutyCycle(duty)
    print "Changed duty to", duty


def thing_update(temp, humid, rpm):
    data="https://api.thingspeak.com/update?api_key=PWVT3YG8Z9ETBEHC&field1="+str(rpm)+"&field2="+str(temp)+"&field3="+str(humid)
    response=urllib.urlopen(data);
    if not response is None:
        print "Data Written on ThingsSpeak"

def get_slider():
    html = requests.get("http://192.168.43.38:3000/slider")
    return html.text

initial_temp,humid = temp()
print "Initial Temp = ",initial_temp
rpm = 100
RPM(rpm)
thing_update(temp,humid, rpm)
flag =0
while True:
    if get_slider()=="-1":
        print "Monitoring RPM according to Temp"
        new_temp,humid  = temp()
        if new_temp - initial_temp >= 1.0 :
            rpm = rpm-10
            if rpm< 0:
                print "High Temp: Shutting down"
                rpm = 0
                break
            RPM(rpm)
            print "Temp Increased to ",new_temp
            initial_temp = new_temp
            thing_update(initial_temp,humid,rpm)
            sleep(5)
        
                     
        elif initial_temp- new_temp >= 1.0 and rpm < 100:
            rpm = rpm+10
            if rpm >100:
                rpm =100
            RPM(rpm)
            print "Temp Decreased to", new_temp
            initial_temp = new_temp
            thing_update(initial_temp,humid,rpm)
            sleep(5)
        else:
            print "No change in Temperature detected"
            thing_update(initial_temp,humid,rpm)
            sleep(5)
        flag = 0
            
    elif get_slider() == "0":
        print "Manual Shutdown detected"
        RPM(0.0)
        break
    else:
        if flag ==0 :
            print "Manual  Value Detected"
        new_temp,humid  = temp()
        rpm = int(get_slider())
        RPM(rpm)
        thing_update(initial_temp,humid,rpm)
        sleep(5)
        flag = 1
        