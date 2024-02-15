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

SPEED = 15

if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    cmd = None
    with SpheroEduAPI(toy) as droid:
        # Initializing animation
        register_all_anims(droid)
        droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)

        heading = 0
        movement_count = 0
        print(droid.get_location())

        history = ActionHistory()

        while(True):
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
                    sleep(2)

                # Blue Action:
                elif action == '2':
                    droid.play_matrix_animation(2)
                    sleep(2)

                # Green Action:
                elif action == '3':
                    droid.play_matrix_animation(3)
                    sleep(2)

                # Orange Action:
                elif action == '4':
                    droid.play_matrix_animation(4)
                    sleep(2)

                # Purple Action:
                elif action == '5':
                    droid.play_matrix_animation(5)
                    sleep(2)

                # Action to play if there's a bug
                else:
                    droid.play_matrix_animation(6)
                    sleep(2)
                
                # Plays an animation in between actions
                droid.play_matrix_animation(7)
                sleep(1)
                
            sendResponse()