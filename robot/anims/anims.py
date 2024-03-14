"""
Author: Ansen D. Garvin
Description:
    A list of matrix animations, placed in their own file to avoid clutter.
"""

from spherov2.sphero_edu import SpheroEduAPI
from spherov2.types import Color

from anims.nums import nums
from anims.simon import simon
from anims.spheropoly import spheropoly_anims

O = Color(120, 54, 0)
R = Color(105, 0, 0)
G = Color(0, 105, 7)
B = Color(0, 5, 105)
K = Color(0, 0, 0)
W = Color(200, 200, 200)
P = Color(51, 0, 105)
palette = [O, R, G, B, K, W, P]


def register_all_anims(droid: SpheroEduAPI):
    for i in range(len(simon)):
        droid.register_matrix_animation(simon[i], palette, 1, False)
    for i in range(len(nums)):
        droid.register_matrix_animation(nums[i], palette, 1, False)


def register_spheropoly_anims(droid: SpheroEduAPI):
    for i in range(len(spheropoly_anims)):
        droid.register_matrix_animation(spheropoly_anims[i], palette, 1, False)
