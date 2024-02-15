class Actions:
    def __init__(self):
        self.actions = []

    def add_action(self, new_action):
        self.actions.append(new_action)
    
    def do_all_actions(self):
        pass

    def do_most_recent_action(self):
        pass

    def print_all_actions(self):
        print(self.actions)

    def print_most_recent_action(self):
        print(self.actions[len(self.actions) - 1])