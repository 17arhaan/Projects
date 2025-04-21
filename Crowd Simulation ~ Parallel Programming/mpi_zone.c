#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mpi.h>
#define GRID_WIDTH 7
#define GRID_HEIGHT 6
#define MAX_PEOPLE 100
#define MAX_ZONES 10
typedef struct {
    int start_x, start_y, target_x, target_y;
} Person;
typedef struct {
    int top_left_x, top_left_y, bottom_right_x, bottom_right_y;
} Zone;
void read_grid(const char* filename, int grid[GRID_HEIGHT][GRID_WIDTH]) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Error opening file: %s\n", filename);
        exit(1);
    }

    for (int i = 0; i < GRID_HEIGHT; i++) {
        for (int j = 0; j < GRID_WIDTH; j++) {
            fscanf(file, "%d", &grid[i][j]);
        }
    }
    fclose(file);
}
int read_people(const char* filename, Person people[MAX_PEOPLE]) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Error opening file: %s\n", filename);
        exit(1);
    }

    int num_people = 0;
    while (fscanf(file, "%d %d %d %d", 
                   &people[num_people].start_x, &people[num_people].start_y, 
                   &people[num_people].target_x, &people[num_people].target_y) == 4) {
        num_people++;
    }
    fclose(file);
    return num_people;
}
int read_zones(const char* filename, Zone zones[MAX_ZONES]) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Error opening file: %s\n", filename);
        exit(1);
    }

    int num_zones = 0;
    while (fscanf(file, "%d %d %d %d", 
                   &zones[num_zones].top_left_x, &zones[num_zones].top_left_y, 
                   &zones[num_zones].bottom_right_x, &zones[num_zones].bottom_right_y) == 4) {
        num_zones++;
    }
    fclose(file);
    return num_zones;
}
void process_zone(int rank, int num_zones, Zone zones[MAX_ZONES], int grid[GRID_HEIGHT][GRID_WIDTH], Person people[MAX_PEOPLE], int num_people) {
    Zone current_zone = zones[rank];
    printf("Process %d is handling zone: (%d,%d) to (%d,%d)\n", rank, 
            current_zone.top_left_x, current_zone.top_left_y, 
            current_zone.bottom_right_x, current_zone.bottom_right_y);
    for (int i = 0; i < num_people; i++) {
        if (people[i].start_x >= current_zone.top_left_x && people[i].start_y >= current_zone.top_left_y &&
            people[i].start_x <= current_zone.bottom_right_x && people[i].start_y <= current_zone.bottom_right_y) {
            printf("Processing person %d: Start = (%d,%d), Target = (%d,%d)\n", i+1, 
                    people[i].start_x, people[i].start_y, 
                    people[i].target_x, people[i].target_y);
        }
    }
}
int main(int argc, char *argv[]) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    int grid[GRID_HEIGHT][GRID_WIDTH];
    Person people[MAX_PEOPLE];
    Zone zones[MAX_ZONES];
    read_grid("grid.txt", grid);
    int num_people = read_people("people.txt", people);
    int num_zones = read_zones("zones.txt", zones);
    if (size > num_zones) {
        printf("Error: More MPI processes than zones. Adjust the number of processes.\n");
        MPI_Abort(MPI_COMM_WORLD, 1);
    }
    process_zone(rank, num_zones, zones, grid, people, num_people);
    MPI_Finalize();
    return 0;
}
