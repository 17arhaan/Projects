import numpy as np

# Grid size
GRID_SIZE = 100

# Number of agents and obstacles
NUM_AGENTS = 50
NUM_OBSTACLES = 500

# Create an empty grid
grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)

# Place random obstacles (marked as -1)
obstacle_positions = set()
while len(obstacle_positions) < NUM_OBSTACLES:
    x, y = np.random.randint(0, GRID_SIZE, size=2)
    obstacle_positions.add((x, y))

for x, y in obstacle_positions:
    grid[x, y] = -1

# Generate random agent start and goal positions
agents = []
for _ in range(NUM_AGENTS):
    while True:
        start_x, start_y = np.random.randint(0, GRID_SIZE, size=2)
        goal_x, goal_y = np.random.randint(0, GRID_SIZE, size=2)
        if (start_x, start_y) not in obstacle_positions and (goal_x, goal_y) not in obstacle_positions:
            agents.append(((start_x, start_y), (goal_x, goal_y)))
            break

# Save data to a file
file_path = "./environment.txt"
with open(file_path, "w") as f:
    f.write(f"{GRID_SIZE} {NUM_AGENTS} {NUM_OBSTACLES}\n")

    # Write obstacle positions
    for x, y in obstacle_positions:
        f.write(f"{x} {y}\n")

    # Write agent start and goal positions
    for (start, goal) in agents:
        f.write(f"{start[0]} {start[1]} {goal[0]} {goal[1]}\n")

file_path
