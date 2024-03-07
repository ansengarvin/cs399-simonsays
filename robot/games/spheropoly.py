from spherov2.sphero_edu import SpheroEduAPI
from lib.status import not_moving
from lib.pipeline import getCommand, sendResponse
from lib.droidState import DroidState
from lib.commandHelper import CommandHelper


SPEED = 35

def roll_until_collision(droid: SpheroEduAPI, heading):
    """
    Roll forward at input heading until the droid is no longer moving.
    """
    while 1:
        droid.roll(heading, SPEED, 2)
        if not_moving(droid):
            return


def left(droid: SpheroEduAPI, state: DroidState):
    state.set_heading_left()
    roll_until_collision(droid, state.get_heading())


def right(droid: SpheroEduAPI, state: DroidState):
    state.set_heading_right()
    roll_until_collision(droid, state.get_heading())


def jail(droid: SpheroEduAPI, state: DroidState):
    print("Jail")

def get_roll():
    #TODO: Make this get the number from the server
    return input("Enter number")


map_instructions = [
    left,
    left,
    right,
    left,
    left,
    right,
    left,
    left,
    right,
    left,
    left,
    right
]

def spheropoly(droid: SpheroEduAPI):
    print("Welcome to Spheropoly!")
    state = DroidState()
    commandHelper = CommandHelper()
    while True:

        getCommand(commandHelper)
        print(commandHelper.command)

        roll = commandHelper.command["roll"]

        if roll == 'x':
            exit()
        else:
            roll = int(roll)
            for i in range(roll):
                current_square = (state.get_position() + i) % 12
                print("At square ", i)
                map_instructions[current_square](droid, state)
            state.set_position((state.get_position() + roll) % 12)

        sendResponse("Done")