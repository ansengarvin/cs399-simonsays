from time import sleep
from spherov2.sphero_edu import SpheroEduAPI
from anims.anims import *
from spherov2.commands.io import FrameRotationOptions
import random
from lib.pipeline import getAction, sendResponse
from lib.actionhistory import ActionHistory
from lib.commands import *
from lib.status import *

MISTAKE_CHANCE = 1

droid_gameplay_actions = {
    '1': look_left_and_right,
    '2': short_roll_backwards,
    '3': turn_right_and_roll,
    '4': orange_roll,
    '5': spin_spin_spin
}

def droid_turn(droid: SpheroEduAPI, droid_history: ActionHistory):
    mistake = 0
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
    droid.play_matrix_animation(0)
    command = getAction(droid_history)

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

        # Instruct the droid to play the action.
        try:
            droid_gameplay_actions[action](droid, droid_history)
        except Exception as e:
            print("Bug detected:", e)
            droid.play_matrix_animation(6)
            sleep(2)
            
        # If the droid made a mistake, the player won! Exit the program.
        if mistake == 1:
            print("Uh oh! We made a mistake!")
            droid.play_matrix_animation(7)
            sendResponse("Mistake")
            sleep(2)
            exit()
        
    else:
        print("No mistake yet!")
        sendResponse("OK")

def simon_robot(droid: SpheroEduAPI):
    # Initializing animation
    register_all_anims(droid)

    droid_history = ActionHistory()

    while(True):
        droid_turn(droid, droid_history)