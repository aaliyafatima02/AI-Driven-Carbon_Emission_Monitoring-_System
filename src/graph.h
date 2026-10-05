#ifndef GRAPH_H
#define GRAPH_H

#define MAX_VERTICES 10
#define INF 99999

typedef struct {
    int vertices;
    int adjacency[MAX_VERTICES][MAX_VERTICES];
    char location[MAX_VERTICES][50];
    float emission[MAX_VERTICES];
} Graph;

void initializeGraph(Graph *g, int vertices);
void addLocation(Graph *g, int index, const char *name, float emission);
void addEdge(Graph *g, int source, int destination, int cost);
void displayGraph(const Graph *g);
void performDFS(const Graph *g, int start);
void performBFS(const Graph *g, int start);
void findComponents(const Graph *g);
void primMST(const Graph *g);
void dijkstra(const Graph *g, int start);
void knapsack(int costs[], int reductions[], int n, int budget);

#endif