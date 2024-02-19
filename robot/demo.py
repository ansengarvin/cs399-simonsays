"""
Author: Ansen D. Garvin
Description:
    The Sphero wants to move in a straight line toward some goal.
    This simple pathfinding algorithm might help him avoid obstacles in his way.
"""

from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
from anims.anims import *
from simon.single import *
from simon.multi import *

MISTAKE_CHANCE = 1

# Returns true if the droid's vertical acceleration is 0 (e.g. if the )
def is_dropped(droid: SpheroEduAPI):
    if droid.get_vertical_acceleration() < 0.02:
        return True
    else:
        return False
    
if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    cmd = None
    mistake = 0
    with SpheroEduAPI(toy) as droid:
        simon_single(droid)