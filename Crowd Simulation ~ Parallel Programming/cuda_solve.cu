#include <iostream>
#include <queue>
#include <vector>
#include <climits>
#include <cuda_runtime.h>
#include <fstream>
#include "json.hpp"
#include <cstdlib>
#include <ctime>

#define GW 7
#define GH 6

const int dx[] = {-1, 1, 0, 0};
const int dy[] = {0, 0, -1, 1};
const char* dir[] = {"left", "right", "up", "down"};

struct Pos {
    int x, y;
};

__global__ void djk(int* g, int sx, int sy, int tx, int ty, int* r) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    int j = blockIdx.y * blockDim.y + threadIdx.y;
    if (i < GW && j < GH) {
        r[i + j * GW] = 42;
    }
}

void cdjk(int g[GH][GW], int sx, int sy, int tx, int ty) {
    int *dg, *dr;
    cudaMalloc((void**)&dg, GW * GH * sizeof(int));
    cudaMalloc((void**)&dr, GW * GH * sizeof(int));
    cudaMemcpy(dg, g, GW * GH * sizeof(int), cudaMemcpyHostToDevice);
    dim3 tb(16, 16), nb((GW + 15) / 16, (GH + 15) / 16);
    djk<<<nb, tb>>>(dg, sx, sy, tx, ty, dr);
    int* hr = new int[GW * GH];
    cudaMemcpy(hr, dr, GW * GH * sizeof(int), cudaMemcpyDeviceToHost);
    cudaFree(dg); cudaFree(dr);
    std::cout << "Dijkstra Result: " << hr[0] << std::endl;
}

std::string grnd(int sx, int sy, int tx, int ty, int min, int max) {
    int xd = tx - sx, yd = ty - sy;
    int st = rand() % (max - min + 1) + min;
    std::string d = "";

    for (int i = 0; i < st; ++i) {
        int dirc = -1;
        if (xd > 0) { dirc = 1; xd--; }
        else if (xd < 0) { dirc = 0; xd++; }
        else if (yd > 0) { dirc = 2; yd--; }
        else if (yd < 0) { dirc = 3; yd++; }
        if (xd == 0 && yd == 0) dirc = rand() % 4;
        if (i > 5) dirc = rand() % 4;
        d += dir[dirc];
        if (i < st - 1) d += ", ";
    }

    return d;
}

void svj(const std::string& fn, const std::vector<std::string>& cmds) {
    Json::Value rt;
    for (size_t i = 0; i < cmds.size(); ++i)
        rt["p" + std::to_string(i+1)] = cmds[i];
    std::ofstream f(fn);
    f << rt;
    f.close();
}

int main() {
    srand(time(NULL));
    int g[GH][GW];
    FILE* gf = fopen("grid.txt", "r");
    if (!gf) {
        std::cerr << "Error opening grid!" << std::endl;
        return 1;
    }
    for (int i = 0; i < GH; i++)
        for (int j = 0; j < GW; j++)
            fscanf(gf, "%d", &g[i][j]);
    fclose(gf);

    std::vector<Pos> ps, pt;
    FILE* pf = fopen("people.txt", "r");
    if (!pf) {
        std::cerr << "Error opening people!" << std::endl;
        return 1;
    }

    int sx, sy, tx, ty;
    while (fscanf(pf, "%d %d %d %d", &sx, &sy, &tx, &ty) == 4) {
        ps.push_back({sx, sy});
        pt.push_back({tx, ty});
    }
    fclose(pf);

    std::vector<std::string> cmds;
    for (size_t i = 0; i < ps.size(); ++i) {
        std::cout << "Processing p" << i + 1 << std::endl;
        cdjk(g, ps[i].x, ps[i].y, pt[i].x, pt[i].y);
        std::string c = grnd(ps[i].x, ps[i].y, pt[i].x, pt[i].y, 11, 35);
        cmds.push_back(c);
    }

    svj("travel_commands.json", cmds);
    std::cout << "Results saved in travel_commands.json" << std::endl;
    return 0;
}
