#include <stdio.h>
#include "graph.h"

void primMST(const Graph *g) {
    int selected[MAX_VERTICES] = {0};
    int edgeCount = 0;
    int totalCost = 0;

    selected[0] = 1;

    printf("\n========== PRIM'S MINIMUM SPANNING TREE ==========\n");

    while (edgeCount < g->vertices - 1) {
        int minimum = INF;
        int source = -1;
        int destination = -1;

        for (int i = 0; i < g->vertices; i++) {
            if (selected[i]) {
                for (int j = 0; j < g->vertices; j++) {
                    if (!selected[j] &&
                        g->adjacency[i][j] < minimum) {

                        minimum = g->adjacency[i][j];
                        source = i;
                        destination = j;
                    }
                }
            }
        }

        if (source == -1) {
            printf("The graph is disconnected. MST cannot be formed.\n");
            return;
        }

        selected[destination] = 1;
        edgeCount++;
        totalCost += minimum;

        printf("%s -- %s : Cost = %d\n",
               g->location[source],
               g->location[destination],
               minimum);
    }

    printf("Total Minimum Network Cost = %d\n", totalCost);
    printf("=================================================\n");
}