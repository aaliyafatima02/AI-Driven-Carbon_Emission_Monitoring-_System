#include <stdio.h>
#include "graph.h"

void dijkstra(const Graph *g, int start) {
    int distance[MAX_VERTICES];
    int visited[MAX_VERTICES] = {0};

    for (int i = 0; i < g->vertices; i++) {
        distance[i] = INF;
    }

    distance[start] = 0;

    for (int count = 0; count < g->vertices - 1; count++) {

        int minimum = INF;
        int current = -1;

        for (int i = 0; i < g->vertices; i++) {
            if (!visited[i] && distance[i] < minimum) {
                minimum = distance[i];
                current = i;
            }
        }

        if (current == -1)
            break;

        visited[current] = 1;

        for (int i = 0; i < g->vertices; i++) {

            if (!visited[i] &&
                g->adjacency[current][i] != INF &&
                g->adjacency[current][i] != 0 &&
                distance[current] + g->adjacency[current][i] < distance[i]) {

                distance[i] =
                    distance[current] + g->adjacency[current][i];
            }
        }
    }

    printf("\n========== DIJKSTRA SHORTEST PATH ==========\n");

    printf("Starting Location: %s\n\n", g->location[start]);

    for (int i = 0; i < g->vertices; i++) {

        if (distance[i] == INF) {
            printf("%s -> Unreachable\n", g->location[i]);
        } else {
            printf("%s -> %s : Minimum Cost = %d\n",
                   g->location[start],
                   g->location[i],
                   distance[i]);
        }
    }

    printf("=============================================\n");
}