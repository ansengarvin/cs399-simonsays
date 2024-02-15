class ActionHistory:
    def __init__(self):
        self.actions = []
        self.count = 0

    def add_action(self, new_action):
        self.actions.append(new_action)
        self.count += 1
    
    def get_actions(self):
        return self.actions

    def get_recent_action(self):
        return self.actions[self.count - 1]

    def print_all_actions(self):
        print(self.actions)

    def print_recent_action(self):
        print(self.actions[self.count - 1])

    def get_count(self):
        return self.count