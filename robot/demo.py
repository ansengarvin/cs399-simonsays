"""
Author: Ansen D. Garvin
Description:
    The Sphero wants to move in a straight line toward some goal.
    This simple pathfinding algorithm might help him avoid obstacles in his way.
"""

from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
from spherov2.sphero_edu import EventType
from anims.anims import *
from games.simon import simon_robot, simon_human, simon_versus
from games.spheropoly import spheropoly
from lib.commands import do_nothing
from lib.gametype import GameType
from lib.pipeline import getGame

# Returns true if the droid's vertical acceleration is 0 (e.g. if the )
def is_dropped(droid: SpheroEduAPI):
    if droid.get_vertical_acceleration() < 0.02:
        return True
    else:
        return False

    
if __name__ == "__main__":
    print("Finding Sphero.")
    toy = scanner.find_toy()
    print("Toy found.")
    cmd = None
    mistake = 0
    #print("Getting game type.")
    #game_type = GameType()
    #getGame(game_type)
    #print("Game type is", game_type.get_game())
    with SpheroEduAPI(toy) as droid:
        droid.register_event(EventType.on_collision, do_nothing)
        
        """"""
        """
        game = game_type.get_game()
        if (game == "1"):
            simon_robot(droid)
        elif (game == "2"):
            simon_human(droid)
        elif (game == "3"):
            simon_versus(droid)
        else:
            print("Bug detected.")
        """
        spheropoly(droid)