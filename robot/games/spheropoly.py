from spherov2.sphero_edu import SpheroEduAPI
from lib.status import not_moving
from lib.pipeline import getCommand, sendResponse
from lib.droidState import DroidState
from lib.commandHelper import CommandHelper
from anims.anims import register_spheropoly_anims
from spherov2.commands.io import FrameRotationOptions


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
    right,
]


def spheropoly(droid: SpheroEduAPI):
    register_spheropoly_anims(droid)
    droid.set_stabilization(False)
    print("Welcome to Spheropoly!")
    state = DroidState()
    commandHelper = CommandHelper()
    droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
    droid.play_matrix_animation(2)
    while True:
        getCommand(commandHelper)
        print(commandHelper.command)

        roll = commandHelper.command["roll"]

        if roll == "x":
            exit()
        else:
            droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
            droid.play_matrix_animation(1)  # Play green smiley
            roll = int(roll)
            droid.set_stabilization(True)
            for i in range(roll):
                current_square = (state.get_position() + i) % 12
                print("At square ", i)
                map_instructions[current_square](droid, state)
            state.set_position((state.get_position() + roll) % 12)
            droid.set_stabilization(False)

            # If jailed is set to true, then the robot must be on tile 3. Roll forward 6 squares to arrive to jail.
            if commandHelper.command["jailed"]:
                droid.set_matrix_rotation(FrameRotationOptions.ROTATE_90_DEGREES)
                droid.play_matrix_animation(0)  # Play purple arrow
                for i in range(6):
                    current_square = (state.get_position() + i) % 12
                    print("At square ", i)
                    map_instructions[current_square](droid, state)
                state.set_position(9)
                droid.set_matrix_rotation(FrameRotationOptions.ROTATE_270_DEGREES)
                droid.play_matrix_animation(3)  # Play red frowny

        sendResponse("Done")
