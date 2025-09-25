export default function solver(Z) {
  let bestSolution = null;

  function recurse(edges, costs) {
    // prune if already worse than best
    if (bestSolution && edges.length >= bestSolution.length) return;

    // find first supplier
    let sId = costs.findIndex(v => v > 0);
    if (sId === -1) {

      // no supplier left -> all matched
      if (costs.every(v => v === 0)) {
        bestSolution = edges.slice();
      }
      return;
    }

    const sAmount = costs[sId];

    // try matching with each demander
    for (let dId = 0; dId < costs.length; dId++) {
      const dAmount = costs[dId];
      if (dAmount >= 0) continue; // skip non-demanders

      const amt = Math.min(sAmount, -dAmount);

      costs[sId] -= amt;
      costs[dId] += amt;
      edges.push([sId, dId, amt]);

      recurse(edges, costs);

      edges.pop();
      costs[sId] += amt;
      costs[dId] -= amt;
    }
  }

  recurse([], Z);
  return bestSolution;
}
