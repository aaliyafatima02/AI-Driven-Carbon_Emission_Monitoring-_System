#include <stdio.h>
#include <string.h>
#include "graph.h"

void initializeGraph(Graph *g, int vertices) {
    g->vertices = vertices;

    for (int i = 0; i < vertices; i++) {
        for (int j = 0; j < vertices; j++) {
            if (i == j)
                g->adjacency[i][j] = 0;
            else
                g->adjacency[i][j] = INF;
        }

        g->location[i][0] = '\0';
        g->emission[i] = 0.0;
    }
}

void addLocation(Graph *g, int index, const char *name, float emission) {
    if (index >= 0 && index < g->vertices) {
        strcpy(g->location[index], name);
        g->emission[index] = emission;
    }
}

void addEdge(Graph *g, int source, int destination, int cost) {
    if (source >= 0 && source < g->vertices &&
        destination >= 0 && destination < g->vertices) {

        g->adjacency[source][destination] = cost;
        g->adjacency[destination][source] = cost;
    }
}

void displayGraph(const Graph *g) {
    printf("\n========== CARBON EMISSION MONITORING GRAPH ==========\n");

    printf("\nMonitoring Locations:\n");

    for (int i = 0; i < g->vertices; i++) {
        printf("%d. %-20s Emission: %.2f units\n",
               i,
               g->location[i],
               g->emission[i]);
    }

    printf("\nWeighted Connections:\n");

    for (int i = 0; i < g->vertices; i++) {
        for (int j = i + 1; j < g->vertices; j++) {
            if (g->adjacency[i][j] != INF &&
                g->adjacency[i][j] != 0) {

                printf("%s <-> %s : Cost %d\n",
                       g->location[i],
                       g->location[j],
                       g->adjacency[i][j]);
            }
        }
    }

    printf("======================================================\n");
}