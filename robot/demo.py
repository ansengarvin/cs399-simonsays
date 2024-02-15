"""
Author: Ansen D. Garvin
Description:
    The Sphero wants to move in a straight line toward some goal.
    This simple pathfinding algorithm might help him avoid obstacles in his way.
"""

from time import sleep
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
from anims import *
from locations import Locations
from spherov2.commands.io import FrameRotationOptions
import numpy as np
import random
from pipeline import getCommand, sendResponse
from actions import Actions

SPEED = 15

if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    cmd = None
    with SpheroEduAPI(toy) as droid:
        # Initializing animation
        droid.register_matrix_animation(anim0, palette, 1, False)
        droid.register_matrix_animation(anim1, palette, 1, False)
        droid.register_matrix_animation(anim2, palette, 1, False)
        droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)

        heading = 0
        movement_count = 0
        print(droid.get_location())

        history = Actions()

        droid.play_matrix_animation(0)
        command = getCommand(history)

        print("Droid has command:")
        history.print_most_recent_action()

        droid.play_matrix_animation(1)

        sendResponse()