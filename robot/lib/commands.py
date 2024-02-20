from spherov2.sphero_edu import SpheroEduAPI
from spherov2.commands.io import FrameRotationOptions
from lib.actionhistory import ActionHistory
from lib.status import *

SPEED = 45

def do_nothing():
    return


def roll_until_collision(droid: SpheroEduAPI, heading):
    """
    Roll forward at input heading until the droid is no longer moving.
    """
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
    droid.play_matrix_animation(4)
    while 1:
        droid.roll(heading, SPEED, 2)
        if not_moving(droid):
            return
        
def orange_roll(droid: SpheroEduAPI, hist: ActionHistory):
    hist.set_heading(hist.get_heading() + 180)
    roll_until_collision(droid, hist.get_heading())


def look_left_and_right(droid: SpheroEduAPI, hist: ActionHistory):
    """
    Simple function which makes the droid look left and right.
    """
    droid.play_matrix_animation(1)
    droid.spin(90, 1)
    droid.spin(-90, 1)
    droid.spin(-90, 1)
    droid.spin(90, 1)


def short_roll_backwards(droid: SpheroEduAPI, hist: ActionHistory):
    """
    Green Action.
    Roll backwards away from heading for one second.
    """
    droid.play_matrix_animation(2)
    droid.roll(hist.get_heading(), -int(SPEED), 1)
    hist.set_heading(hist.get_heading() + 90)


def turn_right_and_roll(droid: SpheroEduAPI, hist: ActionHistory):
    """
    Blue Action.
    Turns the droid right and rolls forward in the new heading.
    """
    droid.play_matrix_animation(3)
    droid.spin(90, 2)
    hist.set_heading(hist.get_heading() + 90)
    droid.roll(hist.get_heading(), int(SPEED), 1)


def spin_spin_spin(droid: SpheroEduAPI, hist: ActionHistory):
    """
    Purple Action.
    Spins the droid three times, and faces it in a new direction.
    """
    droid.play_matrix_animation(5)
    droid.spin(990, 1)
    hist.set_heading((hist.get_heading() + 990) % 360)