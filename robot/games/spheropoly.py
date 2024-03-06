from spherov2.sphero_edu import SpheroEduAPI
from lib.status import not_moving


SPEED = 35


class droidState:
    def __init__(self):
        self.heading = 0
        self.pos = 0

    def set_heading_left(self):
        self.heading = (self.heading - 90) % 360

    def set_heading_right(self):
        self.heading = (self.heading + 90) % 360

    def set_position(self, pos):
        self.pos = pos

    def get_heading(self):
        return self.heading
    
    def get_position(self):
        return self.pos
        

def roll_until_collision(droid: SpheroEduAPI, heading):
    """
    Roll forward at input heading until the droid is no longer moving.
    """
    while 1:
        droid.roll(heading, SPEED, 2)
        if not_moving(droid):
            return


def left(droid: SpheroEduAPI, state: droidState):
    state.set_heading_left()
    roll_until_collision(droid, state.get_heading())


def right(droid: SpheroEduAPI, state: droidState):
    state.set_heading_right()
    roll_until_collision(droid, state.get_heading())


def jail(droid: SpheroEduAPI, state: droidState):
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
    state = droidState()
    while True:
        roll = get_roll()
        if roll == 'x':
            exit()
        else:
            roll = int(roll)
            for i in range(roll):
                current_square = (state.get_position() + i) % 12
                print("At square ", i)
                map_instructions[current_square](droid, state)
            state.set_position((state.get_position() + roll) % 12)