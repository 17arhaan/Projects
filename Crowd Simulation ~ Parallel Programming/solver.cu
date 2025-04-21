#include <iostream>
#include <vector>
#include <queue>
#include <fstream>
#include <cuda_runtime.h>
#include <mpi.h>

#define GRID_SIZE 100
#define NUM_AGENTS 50
#define INF 1000000

using namespace std;

struct Point {
    int x, y;
};

__device__ bool isValid(int x, int y, int* d_obstacles) {
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
    return d_obstacles[x * GRID_SIZE + y] == 0;
}

__global__ void dijkstra(int* d_obstacles, Point* d_starts, Point* d_goals, Point* d_paths, int num_agents) {
    int id = blockIdx.x * blockDim.x + threadIdx.x;
    if (id >= num_agents) return;

    int dist[GRID_SIZE][GRID_SIZE];
    Point prev[GRID_SIZE][GRID_SIZE];

    for (int i = 0; i < GRID_SIZE; i++) {
        for (int j = 0; j < GRID_SIZE; j++) {
            dist[i][j] = INF;
            prev[i][j] = {-1, -1};
        }
    }

    Point start = d_starts[id];
    Point goal = d_goals[id];

    struct Node {
        int x, y, cost;
        __host__ __device__ bool operator>(const Node& n) const {
            return cost > n.cost;
        }
    };

    __shared__ Node heap[GRID_SIZE * GRID_SIZE];
    int heap_size = 0;
    dist[start.x][start.y] = 0;
    heap[heap_size++] = {start.x, start.y, 0};

    int dx[] = {-1, 1, 0, 0};
    int dy[] = {0, 0, -1, 1};

    while (heap_size > 0) {
        Node current = heap[--heap_size];

        if (current.x == goal.x && current.y == goal.y) break;

        for (int i = 0; i < 4; i++) {
            int nx = current.x + dx[i];
            int ny = current.y + dy[i];

            if (isValid(nx, ny, d_obstacles)) {
                int new_cost = dist[current.x][current.y] + 1;
                if (new_cost < dist[nx][ny]) {
                    dist[nx][ny] = new_cost;
                    prev[nx][ny] = {current.x, current.y};
                    heap[heap_size++] = {nx, ny, new_cost};
                }
            }
        }
    }

    Point path[GRID_SIZE * GRID_SIZE];
    int path_length = 0;
    Point p = goal;
    while (p.x != -1 && p.y != -1) {
        path[path_length++] = p;
        p = prev[p.x][p.y];
    }

    for (int i = 0; i < path_length; i++)
        d_paths[id * GRID_SIZE + i] = path[i];
}

void loadEnvironment(const string& filename, int* h_obstacles, vector<Point>& starts, vector<Point>& goals) {
    ifstream file(filename);
    int num_agents, num_obstacles;
    file >> num_agents >> num_obstacles;

    for (int i = 0; i < num_obstacles; i++) {
        int x, y;
        file >> x >> y;
        h_obstacles[x * GRID_SIZE + y] = -1;
    }

    for (int i = 0; i < num_agents; i++) {
        int sx, sy, gx, gy;
        file >> sx >> sy >> gx >> gy;
        starts.push_back({sx, sy});
        goals.push_back({gx, gy});
    }
}

void saveSolution(const string& filename, Point* paths, int num_agents) {
    ofstream file(filename);
    for (int i = 0; i < num_agents; i++) {
        file << "Agent " << i << ": ";
        for (int j = 0; j < GRID_SIZE; j++) {
            if (paths[i * GRID_SIZE + j].x == -1) break;
            file << "(" << paths[i * GRID_SIZE + j].x << "," << paths[i * GRID_SIZE + j].y << ") -> ";
        }
        file << "END\n";
    }
}

int main(int argc, char** argv) {
    MPI_Init(&argc, &argv);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int agents_per_proc = NUM_AGENTS / size;

    int* h_obstacles = new int[GRID_SIZE * GRID_SIZE]();
    vector<Point> starts, goals;

    if (rank == 0) {
        loadEnvironment("environment.txt", h_obstacles, starts, goals);
    }

    MPI_Bcast(h_obstacles, GRID_SIZE * GRID_SIZE, MPI_INT, 0, MPI_COMM_WORLD);

    vector<Point> local_starts(agents_per_proc);
    vector<Point> local_goals(agents_per_proc);
    vector<Point> local_paths(agents_per_proc * GRID_SIZE);

    MPI_Scatter(starts.data(), agents_per_proc * sizeof(Point), MPI_BYTE,
                local_starts.data(), agents_per_proc * sizeof(Point), MPI_BYTE, 0, MPI_COMM_WORLD);

    MPI_Scatter(goals.data(), agents_per_proc * sizeof(Point), MPI_BYTE,
                local_goals.data(), agents_per_proc * sizeof(Point), MPI_BYTE, 0, MPI_COMM_WORLD);

    int* d_obstacles;
    Point *d_starts, *d_goals, *d_paths;

    cudaMalloc(&d_obstacles, GRID_SIZE * GRID_SIZE * sizeof(int));
    cudaMalloc(&d_starts, agents_per_proc * sizeof(Point));
    cudaMalloc(&d_goals, agents_per_proc * sizeof(Point));
    cudaMalloc(&d_paths, agents_per_proc * GRID_SIZE * sizeof(Point));

    cudaMemcpy(d_obstacles, h_obstacles, GRID_SIZE * GRID_SIZE * sizeof(int), cudaMemcpyHostToDevice);
    cudaMemcpy(d_starts, local_starts.data(), agents_per_proc * sizeof(Point), cudaMemcpyHostToDevice);
    cudaMemcpy(d_goals, local_goals.data(), agents_per_proc * sizeof(Point), cudaMemcpyHostToDevice);

    int blockSize = 32;
    int gridSize = (agents_per_proc + blockSize - 1) / blockSize;
    dijkstra<<<gridSize, blockSize>>>(d_obstacles, d_starts, d_goals, d_paths, agents_per_proc);

    cudaMemcpy(local_paths.data(), d_paths, agents_per_proc * GRID_SIZE * sizeof(Point), cudaMemcpyDeviceToHost);

    vector<Point> global_paths(NUM_AGENTS * GRID_SIZE);
    MPI_Gather(local_paths.data(), agents_per_proc * GRID_SIZE * sizeof(Point), MPI_BYTE,
               global_paths.data(), agents_per_proc * GRID_SIZE * sizeof(Point), MPI_BYTE, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        saveSolution("solution.txt", global_paths.data(), NUM_AGENTS);
        cout << "Pathfinding complete! Solution saved to solution.txt\n";
    }

    MPI_Finalize();
    return 0;
}
