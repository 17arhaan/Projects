#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>

#define MP 5

void gen_g(int w, int h, const char* fn) {
    FILE *f = fopen(fn, "w");
    if (!f) {
        printf("Err: %s\n", fn);
        exit(1);
    }
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            fprintf(f, "%d ", rand() % 100);
        }
        fprintf(f, "\n");
    }
    fclose(f);
}

void gen_p(int w, int h, int n, const char* fn, const char* df) {
    FILE *f = fopen(fn, "w");
    FILE *d = fopen(df, "w");
    if (!f || !d) {
        printf("Err: %s or %s\n", fn, df);
        exit(1);
    }

    for (int i = 0; i < n; i++) {
        int sx = rand() % w, sy = rand() % h, tx, ty;
        do {
            tx = rand() % w;
            ty = rand() % h;
        } while (abs(tx - sx) < w / 4 || abs(ty - sy) < h / 4);

        fprintf(f, "%d %d %d %d\n", sx, sy, tx, ty);
        int xd = tx - sx, yd = ty - sy;
        fprintf(d, "\"p%d\": \"", i + 1);
        while (xd != 0) {
            if (xd > 0) { fprintf(d, "right, "); xd--; }
            else { fprintf(d, "left, "); xd++; }
        }
        while (yd != 0) {
            if (yd > 0) { fprintf(d, "up, "); yd--; }
            else { fprintf(d, "down, "); yd++; }
        }
        fseek(d, -2, SEEK_CUR);
        fprintf(d, "\"\n");
    }

    fclose(f);
    fclose(d);
}

int main() {
    srand(time(NULL));
    int w, h, n;
    printf("Grid width: ");
    scanf("%d", &w);
    printf("Grid height: ");
    scanf("%d", &h);
    printf("People: ");
    scanf("%d", &n);
    if (n > MP) {
        printf("Warn: High people count (%d)\n", n);
    }

    gen_g(w, h, "grid.txt");
    gen_p(w, h, n, "people.txt", "directions.json");

    printf("Done. Files: grid.txt, people.txt, directions.json\n");
    return 0;
}
