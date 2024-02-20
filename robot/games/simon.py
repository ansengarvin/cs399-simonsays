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
    droid.set_stabilization(True)
    mistake = 0
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
    droid.play_matrix_animation(0)
    getAction(droid_history)

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


human_actions = {
    "1": is_falling,
    "2": is_spinning,
    "3": is_lit
}
human_action_names = {
    "1": "Drop",
    "2": "Spin",
    "3": "Light"
}

def check_correct_action(droid: SpheroEduAPI, command: str):
    """
    Checks if the player has done the correct action.
    If they have, return 1.
    If they have returned the incorrect action (or there's a bug), return -1.
    If they haven't done either a correct or an incorrect action, return 0.
    """
    try:
        for i in range(1, 4):
            if human_actions[str(i)](droid):
                print("Action detected! The action is", human_action_names[str(i)])
                if str(i) == command:
                    return 1
                else:
                    return -1
        return 0
    except Exception as e:
        print("Bug detected:", e)
        return -1


def human_turn(droid: SpheroEduAPI, human_history: ActionHistory):
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
    droid.set_stabilization(False)
    droid.play_matrix_animation(7)
    getAction(human_history)
    print("New action is", human_action_names[human_history.get_recent_action()])
    sleep(2)

    actions_list = human_history.get_actions()
    for i in range(human_history.get_count()):
        droid.play_matrix_animation(9+i)
        status = 0
        print("The action the person is supposed to do right now is", human_action_names[actions_list[i]])
        while True:
            status = check_correct_action(droid, actions_list[i])
            if status == 1:
                print("Yay!")
                droid.play_matrix_animation(8)
                sleep(2)
                break
            if status == -1:
                print("Boo!")
                droid.play_matrix_animation(7)
                return "Failure"
        
    return "Success"


def simon_robot(droid: SpheroEduAPI):
    """
    Simon game, where only the robot plays.
    """
    # Initializing animation
    register_all_anims(droid)

    droid_history = ActionHistory()

    while(True):
        droid_turn(droid, droid_history)


def simon_human(droid: SpheroEduAPI):
    """
    Simon game, where only the human plays.
    """
    register_all_anims(droid)

    human_history = ActionHistory()

    for i in range(9):
        result = human_turn(droid, human_history)
        sendResponse(str(i+1))
        if result == "Failure":
            sendResponse("failure")
            return
    sendResponse("success")