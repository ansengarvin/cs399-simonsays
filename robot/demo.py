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
from actionhistory import ActionHistory

SPEED = 90
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


def roll_until_collision(droid: SpheroEduAPI, heading):
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
    droid.play_matrix_animation(4)
    while 1:
        droid.roll(heading, SPEED, 2)
        if not_moving(droid):
            return


if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    cmd = None
    with SpheroEduAPI(toy) as droid:
        # Initializing animation
        register_all_anims(droid)
        heading = 0
        movement_count = 0
        print(droid.get_location())

        history = ActionHistory()

        while(True):
            droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
            droid.play_matrix_animation(0)
            command = getCommand(history)

            print("Droid has new command:", history.get_recent_action())

            # Immediately exits program if the user sent exit.
            if history.get_recent_action() == '0':
                sendResponse()
                exit()

            # Goes through every previous action in order.
            actions = history.get_actions()
            droid
            for i in range(history.get_count()):
                sleep(1)
                action = actions[i]
                print("This action:", action)

                # Red Action:
                if action == '1':
                    droid.play_matrix_animation(1)
                    droid.spin(90, 1)
                    droid.spin(-90, 1)
                    droid.spin(-90, 1)
                    droid.spin(90, 1)

                # Blue Action:
                elif action == '2':
                    droid.play_matrix_animation(2)
                    droid.roll(-heading, int(SPEED/2), 2)

                # Green Action:
                elif action == '3':
                    droid.play_matrix_animation(3)
                    droid.spin(90, 2)
                    heading += 90
                    droid.roll(heading, int(SPEED/2), 2)

                # Orange Action:
                elif action == '4':
                    heading = heading + 180
                    roll_until_collision(droid, heading)

                # Purple Action:
                elif action == '5':
                    droid.play_matrix_animation(5)
                    droid.spin(990, 1)
                    heading = (heading + 990) % 360

                # Action to play if there's a bug
                else:
                    droid.play_matrix_animation(6)
                    sleep(2)

            sendResponse()