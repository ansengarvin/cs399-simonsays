"""
Author: Ansen D. Garvin
Description:
    A list of matrix animations, placed in their own file to avoid clutter.
"""

from spherov2.types import Color
O = Color(255, 155, 0)
R = Color(255, 0, 0)
G = Color(37, 166, 20)
B = Color(20, 93, 166)
K = Color(0, 0, 0)
palette=[O, R, G, B, K]

# Blue arrow on black background
anim0 = [[
    [4,4,4,3,3,4,4,4],
    [4,4,3,3,3,3,4,4],
    [4,3,3,3,3,3,3,4],
    [3,3,3,3,3,3,3,3],
    [4,4,4,3,3,4,4,4],
    [4,4,4,3,3,4,4,4],
    [4,4,4,3,3,4,4,4],
    [4,4,4,3,3,4,4,4]
]]

## Orange background surrounded by red
anim1 = [[
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
]]

## Green background
anim2 = [[
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2]
]]
