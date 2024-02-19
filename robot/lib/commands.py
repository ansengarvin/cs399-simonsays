from time import sleep
from spherov2.sphero_edu import SpheroEduAPI
from anims.anims import *
from spherov2.commands.io import FrameRotationOptions
from lib.pipeline import getAction, sendResponse
from lib.actionhistory import ActionHistory
from lib.status import *
from simon.single import *

SPEED = 45


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


def look_left_and_right(droid: SpheroEduAPI, heading):
    """
    Simple function which makes the droid look left and right.
    """
    droid.play_matrix_animation(1)
    droid.spin(90, 1)
    droid.spin(-90, 1)
    droid.spin(-90, 1)
    droid.spin(90, 1)


def short_roll_backwards(droid: SpheroEduAPI, heading):
    """
    Roll backwards away from heading for one second.
    """
    droid.play_matrix_animation(2)
    droid.roll(heading, -int(SPEED), 1)


def turn_right_and_roll(droid: SpheroEduAPI, heading):
    """
    Turns the droid right and rolls forward in the new heading.
    """
    droid.play_matrix_animation(3)
    droid.spin(90, 2)
    droid.roll(heading, int(SPEED), 1)


def spin_spin_spin(droid: SpheroEduAPI):
    """
    Spins the droid three times, and faces it in a new direction.
    """
    droid.play_matrix_animation(5)
    droid.spin(990, 1)