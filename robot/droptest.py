from time import sleep
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI

print("Finding Sphero.")
toy = scanner.find_toy()
cmd = None
mistake = 0

# Returns true if the droid's vertical acceleration is 0 (e.g. if the )
def is_dropped(droid: SpheroEduAPI):
    if droid.get_vertical_acceleration() < 0.02:
        return True
    else:
        return False

with SpheroEduAPI(toy) as droid:
    print("Sphero found.")
    droid.set_stabilization(False)
    while(True):
        #print("Z_Acc:", droid.get_vertical_acceleration())
        print("Yaw:", droid.get_gyroscope()['z'])
        #print("Illumination:", droid.get_luminosity())