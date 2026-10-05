#include <stdio.h>
#include "graph.h"

/* ---------------- DFS ---------------- */

void dfsUtil(const Graph *g, int vertex, int visited[]) {
    visited[vertex] = 1;

    printf("%s -> ", g->location[vertex]);

    for (int i = 0; i < g->vertices; i++) {
        if (g->adjacency[vertex][i] != INF &&
            g->adjacency[vertex][i] != 0 &&
            !visited[i]) {

            dfsUtil(g, i, visited);
        }
    }
}

void performDFS(const Graph *g, int start) {
    int visited[MAX_VERTICES] = {0};

    printf("\nDFS Traversal:\n");

    dfsUtil(g, start, visited);

    printf("END\n");
}

/* ---------------- BFS ---------------- */

void performBFS(const Graph *g, int start) {
    int visited[MAX_VERTICES] = {0};
    int queue[MAX_VERTICES];

    int front = 0;
    int rear = 0;

    visited[start] = 1;
    queue[rear++] = start;

    printf("\nBFS Traversal:\n");

    while (front < rear) {
        int current = queue[front++];

        printf("%s -> ", g->location[current]);

        for (int i = 0; i < g->vertices; i++) {
            if (g->adjacency[current][i] != INF &&
                g->adjacency[current][i] != 0 &&
                !visited[i]) {

                visited[i] = 1;
                queue[rear++] = i;
            }
        }
    }

    printf("END\n");
}

/* ------------ Connected Components ------------ */

void findComponents(const Graph *g) {
    int visited[MAX_VERTICES] = {0};
    int componentNumber = 0;

    printf("\nConnected Components:\n");

    for (int i = 0; i < g->vertices; i++) {

        if (!visited[i]) {

            componentNumber++;

            printf("Component %d: ", componentNumber);

            dfsUtil(g, i, visited);

            printf("\n");
        }
    }

    printf("Total Connected Components: %d\n", componentNumber);
}