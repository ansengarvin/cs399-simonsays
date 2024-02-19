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
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
    droid.play_matrix_animation(4)
    while 1:
        droid.roll(heading, SPEED, 2)
        if not_moving(droid):
            return