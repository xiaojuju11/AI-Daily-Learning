# Matplotlib
import matplotlib.pyplot as plot

x = [1, 2, 3]
y = [4, 5, 6]

plot.plot(x, y, marker='o')
plot.plot(y, x, marker='x')
# plot.show()

plot.savefig('demo.png')
