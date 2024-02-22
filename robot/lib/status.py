from spherov2.sphero_edu import SpheroEduAPI
from anims.anims import *

V_THRESH = 2 # Velocity Threshold

def not_moving(droid: SpheroEduAPI):
    """
    Tells whether the droid is stuck or not.
    """
    print("Checking movement.")
    print("    Velocity:", droid.get_velocity())
    if (
        abs(droid.get_velocity()['x']) < V_THRESH and
        abs(droid.get_velocity()['y']) < V_THRESH or
        droid.get_vertical_acceleration() > 0.5
    ):
        print("    Not moving.\n")
        return True
    else:
        print("    Are moving.\n")
        print(droid.get_vertical_acceleration())
        return False


def is_falling(droid: SpheroEduAPI):
    if droid.get_vertical_acceleration() < 0.02:
        return True
    else:
        return False


def is_spinning(droid: SpheroEduAPI):
    if (
        droid.get_gyroscope()['z'] >= 1000 or
        droid.get_gyroscope()['z'] <= -1000
        ):
        return True
    else:
        return False


def is_lit(droid: SpheroEduAPI):
    if droid.get_luminosity()['ambient_light'] > 200:
        return True
    else:
        return False