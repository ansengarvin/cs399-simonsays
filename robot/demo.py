"""
Author: Ansen D. Garvin
Description:
    The Sphero wants to move in a straight line toward some goal.
    This simple pathfinding algorithm might help him avoid obstacles in his way.
"""

from time import sleep
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
from robot.anims.anims import *
from locations import Locations
from spherov2.commands.io import FrameRotationOptions
import numpy as np
import random
from pipeline import getCommand, sendResponse
from actionhistory import ActionHistory

SPEED = 45
V_THRESH = 2 # Velocity Threshold
MISTAKE_CHANCE = 15


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


# Returns true if the droid's vertical acceleration is 0 (e.g. if the )
def is_dropped(droid: SpheroEduAPI):
    if droid.get_vertical_acceleration() < 0.02:
        return True
    else:
        return False

def is_spinning(droid: SpheroEduAPI):
    pass

def is_lit(droid: SpheroEduAPI):
    pass

def check_all_actions(droid: SpheroEduAPI):
    pass


if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    cmd = None
    mistake = 0
    with SpheroEduAPI(toy) as droid:
        # Initializing animation
        register_all_anims(droid)
        heading = 0
        movement_count = 0
        print(droid.get_location())

        droid_history = ActionHistory()
        player_history = ActionHistory()

        while(True):
            droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
            droid.play_matrix_animation(0)
            command = getCommand(droid_history)

            print("Droid has new command:", droid_history.get_recent_action())

            # Immediately exits program if the user sent exit.
            if droid_history.get_recent_action() == '0':
                sendResponse("Quit")
                exit()

            # Goes through every previous action in order.
            actions = droid_history.get_actions()
            droid
            for i in range(droid_history.get_count()):
                sleep(1)
                action = actions[i]
                print("This action:", action)
                # The robot makes a mistake and does the wrong action!
                # Source: https://stackoverflow.com/questions/42999093/generate-random-number-in-range-excluding-some-numbers
                if random.randint(0, 100) < MISTAKE_CHANCE:
                    print("Intentionally making mistake")
                    prev_action = actions[i]
                    while action == prev_action:
                        action = str(random.randint(1, 5))
                        print(action)
                    mistake = 1

                # Red Action:
                if action == '1':
                    droid.play_matrix_animation(1)
                    droid.spin(90, 1)
                    droid.spin(-90, 1)
                    droid.spin(-90, 1)
                    droid.spin(90, 1)

                # Green Action:
                elif action == '2':
                    droid.play_matrix_animation(2)
                    droid.roll(heading, -int(SPEED), 1)

                # Blue Action:
                elif action == '3':
                    droid.play_matrix_animation(3)
                    droid.spin(90, 2)
                    heading += 90
                    droid.roll(heading, int(SPEED), 1)

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
            
                if mistake == 1:
                    print("Uh oh! We made a mistake!")
                    droid.play_matrix_animation(7)
                    sendResponse("Mistake")
                    sleep(2)
                    exit()
                
            else:
                print("No mistake yet!")
                sendResponse("OK")

            # Instructing the player to do a new action
            player_history.add_action("0")
                
            # Awaiting player actions
            player_actions = player_history.get_actions()
            for i in range(player_history.get_count()):
                if player_actions[i] == "0":
                    print("Drop")
                
                elif player_actions[i] == "1":
                    print("Spin")

                elif player_actions[i] == "2":
                    print("Light")