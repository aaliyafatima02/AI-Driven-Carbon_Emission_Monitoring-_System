# AI-Driven Carbon Emission Monitoring System

## Project Overview

The **AI-Driven Carbon Emission Monitoring System** is a Data Structures and Algorithms-II project designed to represent, analyze, and optimize a carbon-emission monitoring network.

The system models emission sources and monitoring locations as vertices of a weighted graph. Different graph algorithms are used to analyze connectivity, minimum-cost network construction, and shortest paths. Dynamic Programming and the 0/1 Knapsack algorithm are used for budget-based emission-reduction optimization.

## Objectives

- Represent carbon-emission sources and monitoring locations using a graph.
- Analyze connectivity using DFS and BFS.
- Identify independent monitoring regions using Connected Components.
- Construct a minimum-cost monitoring network using Prim's MST.
- Find minimum-cost paths using Dijkstra's algorithm.
- Optimize emission-reduction activities under a limited budget using Dynamic Programming and 0/1 Knapsack.
- Demonstrate the practical application of DSA-II concepts to a carbon-emission monitoring problem.

## Technologies Used

- Programming Language: C
- Data Structures: Graph, Adjacency Matrix, Arrays
- Algorithms: DFS, BFS, Connected Components, Prim's MST, Dijkstra, Dynamic Programming, 0/1 Knapsack
- Compiler: GCC
- Development Environment: Visual Studio Code

## Project Structure

```text
AI-Driven-Carbon_Emission_Monitoring_System/
│
├── data/
│   └── emission_data.txt
│
├── results/
│   └── sample_output.txt
│
├── screenshots/
│
├── src/
│   ├── graph.c
│   ├── graph.h
│   ├── main.c
│   ├── mst.c
│   ├── optimization.c
│   ├── shortest_path.c
│   └── traversal.c
│
├── .gitignore
└── README.md

## DSA Concepts Implemented

| Algorithm / Concept  | Application                                           |
| -------------------- | ----------------------------------------------------- |
| Graph Representation | Represents emission sources and monitoring locations  |
| DFS                  | Traverses reachable monitoring locations              |
| BFS                  | Performs level-by-level connectivity analysis         |
| Connected Components | Identifies separate monitoring regions                |
| Prim's MST           | Builds a minimum-cost monitoring network              |
| Dijkstra             | Finds minimum-cost paths between locations            |
| Dynamic Programming  | Solves the budget-based optimization problem          |
| 0/1 Knapsack         | Selects emission-reduction activities within a budget |

## Sample Dataset

The current implementation uses a sample dataset containing:

6 monitoring locations
9 weighted connections
Emission values for each location
5 emission-reduction activities

The sample data is stored in:
data/emission_data.txt
The dataset is used for testing and demonstrating the implemented algorithms. Real-world carbon-emission data can be integrated in future development.

## Implementation Results

The implemented system was tested successfully using the sample dataset.

## Graph Traversal

DFS and BFS were executed from Industrial Area and successfully traversed all six monitoring locations.

## Connected Components

The current sample network contains 1 connected component containing all six locations.

## Prim's Minimum Spanning Tree
Prim's algorithm generated a minimum-cost monitoring network with a total connection cost of:
14

## Dijkstra's Shortest Path
Dijkstra's algorithm was executed from Industrial Area and calculated the minimum costs to the other monitoring locations.
| Location         | Minimum Cost |
| ---------------- | -----------: |
| Industrial Area  |            0 |
| Power Plant      |            4 |
| Residential Area |            3 |
| Commercial Zone  |            7 |
| Transport Hub    |            9 |
| Green Zone       |           12 |
## 0/1 Knapsack Optimization

For a budget of 75, the system selected the following emission-reduction activities:

Activity 5 — Cost: 25, Reduction: 30
Activity 4 — Cost: 50, Reduction: 70

Maximum expected emission reduction: 100

## How to Compile

From the project root directory, run:
gcc src/main.c src/graph.c src/traversal.c src/mst.c src/shortest_path.c src/optimization.c -o carbon_monitor

## How to Run
On Windows:
.\carbon_monitor.exe

To save the output:

.\carbon_monitor.exe > results\sample_output.txt

## Future Scope
-Integration of real-time carbon-emission data.
-Integration of AI/ML-based emission prediction.
-Dynamic monitoring of emission levels.
-Visualization of the monitoring network.
-Expansion of optimization features.
-Integration with real environmental monitoring systems.

## Project Status

Month 2 Implementation Completed

The selected DSA-II concepts have been implemented and tested using a sample carbon-emission dataset. Further work will focus on integration, testing, documentation, visualization, and final demonstration.

## Author

Aaliya Fatima
B.Tech CSE
Data Structures and Algorithms-II

