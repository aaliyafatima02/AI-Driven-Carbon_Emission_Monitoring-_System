#include <stdio.h>
#include <string.h>
#include "graph.h"

#define DATA_FILE "data/emission_data.txt"
#define MAX_ACTIVITIES 10

int loadData(Graph *g, int costs[], int reductions[], int *activityCount) {

    FILE *file = fopen(DATA_FILE, "r");

    if (file == NULL) {
        printf("Error: Could not open %s\n", DATA_FILE);
        printf("Make sure the program is run from the project folder.\n");
        return 0;
    }

    char line[200];
    int vertices = 0;
    int edges = 0;

    /* Find LOCATIONS section */
    while (fgets(line, sizeof(line), file)) {
        if (strncmp(line, "LOCATIONS", 9) == 0)
            break;
    }

    /* Read number of locations */
    if (fgets(line, sizeof(line), file)) {
        sscanf(line, "%d", &vertices);
    }

    initializeGraph(g, vertices);

    /* Read location information */
    for (int i = 0; i < vertices; i++) {

        if (fgets(line, sizeof(line), file)) {

            int index;
            char name[50];
            float emission;

            if (sscanf(line, "%d|%49[^|]|%f",
                       &index, name, &emission) == 3) {

                addLocation(g, index, name, emission);
            }
        }
    }

    /* Find EDGES section */
    while (fgets(line, sizeof(line), file)) {
        if (strncmp(line, "EDGES", 5) == 0)
            break;
    }

    /* Read number of edges */
    if (fgets(line, sizeof(line), file)) {
        sscanf(line, "%d", &edges);
    }

    /* Read edges */
    for (int i = 0; i < edges; i++) {

        if (fgets(line, sizeof(line), file)) {

            int source, destination, cost;

            if (sscanf(line, "%d|%d|%d",
                       &source, &destination, &cost) == 3) {

                addEdge(g, source, destination, cost);
            }
        }
    }

    /* Find ACTIVITIES section */
    while (fgets(line, sizeof(line), file)) {
        if (strncmp(line, "ACTIVITIES", 10) == 0)
            break;
    }

    /* Read number of activities */
    if (fgets(line, sizeof(line), file)) {
        sscanf(line, "%d", activityCount);
    }

    /* Read activity cost and reduction */
    for (int i = 0; i < *activityCount; i++) {

        if (fgets(line, sizeof(line), file)) {

            int cost, reduction;

            if (sscanf(line, "%d|%d",
                       &cost, &reduction) == 2) {

                costs[i] = cost;
                reductions[i] = reduction;
            }
        }
    }

    fclose(file);

    return 1;
}

int main() {

    Graph g;

    int costs[MAX_ACTIVITIES];
    int reductions[MAX_ACTIVITIES];
    int activityCount = 0;

    /* Load project data from external dataset */
    if (!loadData(&g, costs, reductions, &activityCount)) {
        return 1;
    }

    printf("\n===============================================\n");
    printf(" AI-DRIVEN CARBON EMISSION MONITORING SYSTEM\n");
    printf("===============================================\n");

    /* Display graph */
    displayGraph(&g);

    /* DFS */
    printf("\nStarting DFS from Industrial Area:\n");
    performDFS(&g, 0);

    /* BFS */
    printf("\nStarting BFS from Industrial Area:\n");
    performBFS(&g, 0);

    /* Connected Components */
    findComponents(&g);

    /* Prim's MST */
    primMST(&g);

    /* Dijkstra */
    dijkstra(&g, 0);

    /* Dynamic Programming + 0/1 Knapsack */
    knapsack(costs, reductions, activityCount, 75);

    printf("\n========== PROJECT EXECUTION COMPLETE ==========\n");

    return 0;
}