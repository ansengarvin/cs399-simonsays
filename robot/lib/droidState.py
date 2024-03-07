class DroidState:
    def __init__(self):
        self.heading = 0
        self.pos = 0
        self.board = {}

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