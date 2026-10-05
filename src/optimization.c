#include <stdio.h>
#include "graph.h"

#define MAX_ITEMS 10
#define MAX_BUDGET 100

/*
 * Dynamic Programming + 0/1 Knapsack
 *
 * Each emission-reduction activity has:
 * - cost
 * - expected emission reduction
 *
 * The algorithm selects the best combination
 * without exceeding the available budget.
 */

void knapsack(int costs[], int reductions[], int n, int budget) {

    int dp[MAX_ITEMS + 1][MAX_BUDGET + 1];

    /* Build DP table */
    for (int i = 0; i <= n; i++) {

        for (int w = 0; w <= budget; w++) {

            if (i == 0 || w == 0) {
                dp[i][w] = 0;
            }

            else if (costs[i - 1] <= w) {

                int include =
                    reductions[i - 1] +
                    dp[i - 1][w - costs[i - 1]];

                int exclude =
                    dp[i - 1][w];

                if (include > exclude)
                    dp[i][w] = include;
                else
                    dp[i][w] = exclude;
            }

            else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    printf("\n========== 0/1 KNAPSACK ==========\n");

    printf("Available Budget = %d\n", budget);

    printf("Maximum Expected Emission Reduction = %d\n",
           dp[n][budget]);

    /* Find selected activities */
    int remainingBudget = budget;

    printf("\nSelected Emission-Reduction Activities:\n");

    for (int i = n; i > 0; i--) {

        if (dp[i][remainingBudget] !=
            dp[i - 1][remainingBudget]) {

            printf("Activity %d -> Cost: %d, Reduction: %d\n",
                   i,
                   costs[i - 1],
                   reductions[i - 1]);

            remainingBudget -= costs[i - 1];
        }
    }

    printf("==================================\n");
}