# Sources:
# https://docs.python.org/3/library/csv.html
# https://stackoverflow.com/questions/27779845/how-to-plot-one-single-data-point
# https://stackoverflow.com/questions/34977746/in-python-how-can-square-shaped-images-be-saved-using-matplotlib
# https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.figure.html

import csv
import matplotlib.pyplot as plt

class Locations:
    def __init__(self, filename):
        self.length = 0
        self.Xs = []
        self.Ys = []
        self.filename = filename

    def add(self, loc):
        self.Xs.append(loc['x'])
        self.Ys.append(loc['y'])
        self.length += 1

    def add_multiple(self, locs: list):
        for i in range(len(locs)):
            self.add(locs[i])

    def add_tuple(self, loc: tuple):
        self.Xs.append(loc[0])
        self.Ys.append(loc[1])
        
    def write_to_csv(self, name: str):
        with open(name, 'w', newline='') as csvfile:
            w = csv.writer(csvfile)
            for i in range(self.length):
                w.writerow([str(self.Xs[i])] + [str(self.Ys[i])])
    
    def graph(self):
        figure = plt.figure(figsize=(10,10), dpi=800.0)
        plt.axis([-40, 40, -10, 70])
        plt.plot(0, 0, label = "Start", color='b', marker='s', markersize=12)
        plt.plot(0, 64, label = "Goal", color='g', marker='*', markersize=24)
        plt.plot(self.Xs, self.Ys, label = "Droid Path", color='k', marker='o', markersize=8)
        plt.xlabel("X Axis")
        plt.ylabel("Y Axis")
        plt.legend()
        #plt.show()
        figure.savefig(self.filename)
        

    
if __name__ == '__main__':
    pass