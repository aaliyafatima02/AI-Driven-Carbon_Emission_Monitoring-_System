/**
 * ============================================================================
 * CarbonIQ - Carbon Emission Monitoring and Reduction Planning
 * Core Environmental Analytics Engine & Interface Controller
 * ============================================================================
 */

'use strict';

// ----------------------------------------------------------------------------
// 1. DATASET DEFINITION (Verified Baseline Data)
// ----------------------------------------------------------------------------

const EMISSION_DATA = {
  locations: [
    { id: 0, name: "Industrial Area", emission: 82.50, x: 160, y: 160, type: "Industrial", risk: "High Output" },
    { id: 1, name: "Power Plant",     emission: 95.20, x: 380, y: 90,  type: "Energy",     risk: "Critical Hotspot" },
    { id: 2, name: "Residential Area", emission: 48.70, x: 250, y: 310, type: "Residential", risk: "Moderate" },
    { id: 3, name: "Commercial Zone",  emission: 67.40, x: 530, y: 230, type: "Commercial",  risk: "High-Moderate" },
    { id: 4, name: "Transport Hub",    emission: 73.80, x: 400, y: 440, type: "Transport",   risk: "High Output" },
    { id: 5, name: "Green Zone",       emission: 25.60, x: 700, y: 360, type: "Eco-Reserve", risk: "Baseline Anchor" }
  ],
  edges: [
    { u: 0, v: 1, cost: 4 },
    { u: 0, v: 2, cost: 3 },
    { u: 1, v: 2, cost: 2 },
    { u: 1, v: 3, cost: 5 },
    { u: 2, v: 3, cost: 4 },
    { u: 2, v: 4, cost: 6 },
    { u: 3, v: 4, cost: 2 },
    { u: 3, v: 5, cost: 7 },
    { u: 4, v: 5, cost: 3 }
  ],
  activities: [
    { id: 1, cost: 20, reduction: 25, label: "Industrial Flue Scrubbers", sector: "Industrial", desc: "Chemical absorption filters for flue exhaust." },
    { id: 2, cost: 30, reduction: 40, label: "Substation Solar Integration", sector: "Energy", desc: "Photovoltaic grid augmentation for local substations." },
    { id: 3, cost: 40, reduction: 50, label: "Fleet Hybridization Initiative", sector: "Transport", desc: "Conversion of regional municipal transit to hybrid powertrains." },
    { id: 4, cost: 50, reduction: 70, label: "Combined Heat & Power Retrofit", sector: "Energy", desc: "Cogen turbine installations recycling industrial waste heat." },
    { id: 5, cost: 25, reduction: 30, label: "Building Management Automation", sector: "Commercial", desc: "Smart environmental HVAC controls in dense commercial corridors." }
  ],
  totalBaselineEmissions: 393.20,
  inf: 99999
};

// ----------------------------------------------------------------------------
// 2. GRAPH DATA STRUCTURE & REPOSITORY
// ----------------------------------------------------------------------------

class CarbonGraph {
  constructor(vertices = 6) {
    this.vertices = vertices;
    this.adjacency = Array.from({ length: vertices }, () => Array(vertices).fill(EMISSION_DATA.inf));
    this.locations = [];
    this.emission = [];

    for (let i = 0; i < vertices; i++) {
      this.adjacency[i][i] = 0;
      this.locations[i] = "";
      this.emission[i] = 0.0;
    }

    this.initFromBenchmark();
  }

  initFromBenchmark() {
    EMISSION_DATA.locations.forEach(loc => {
      this.locations[loc.id] = loc.name;
      this.emission[loc.id] = loc.emission;
    });

    EMISSION_DATA.edges.forEach(edge => {
      this.adjacency[edge.u][edge.v] = edge.cost;
      this.adjacency[edge.v][edge.u] = edge.cost;
    });
  }

  getCost(u, v) {
    return this.adjacency[u][v];
  }

  getNeighbors(u) {
    const neighbors = [];
    for (let v = 0; v < this.vertices; v++) {
      if (u !== v && this.adjacency[u][v] !== EMISSION_DATA.inf && this.adjacency[u][v] !== 0) {
        neighbors.push({
          targetId: v,
          targetName: this.locations[v],
          cost: this.adjacency[u][v],
          emission: this.emission[v]
        });
      }
    }
    return neighbors;
  }
}

// ----------------------------------------------------------------------------
// 3. CORE ANALYTIC ALGORITHMS
// ----------------------------------------------------------------------------

function runDFS(graph, startVertex = 0) {
  const visited = Array(graph.vertices).fill(false);
  const traversalOrder = [];
  const logSteps = [];

  function dfsUtil(v) {
    visited[v] = true;
    traversalOrder.push(v);
    logSteps.push(`Explored corridor to station ${v} (${graph.locations[v]})`);

    for (let i = 0; i < graph.vertices; i++) {
      if (
        graph.adjacency[v][i] !== EMISSION_DATA.inf &&
        graph.adjacency[v][i] !== 0 &&
        !visited[i]
      ) {
        dfsUtil(i);
      }
    }
  }

  dfsUtil(startVertex);
  return {
    startVertex,
    traversalOrder,
    traversalNames: traversalOrder.map(v => graph.locations[v]),
    logSteps,
    visitedCount: traversalOrder.length
  };
}

function runBFS(graph, startVertex = 0) {
  const visited = Array(graph.vertices).fill(false);
  const queue = [];
  const traversalOrder = [];
  const logSteps = [];

  visited[startVertex] = true;
  queue.push(startVertex);

  while (queue.length > 0) {
    const current = queue.shift();
    traversalOrder.push(current);
    logSteps.push(`Audited station ${current} (${graph.locations[current]})`);

    for (let i = 0; i < graph.vertices; i++) {
      if (
        graph.adjacency[current][i] !== EMISSION_DATA.inf &&
        graph.adjacency[current][i] !== 0 &&
        !visited[i]
      ) {
        visited[i] = true;
        queue.push(i);
        logSteps.push(`  Linked adjacent station ${i} (${graph.locations[i]}) via corridor weight ${graph.adjacency[current][i]}`);
      }
    }
  }

  return {
    startVertex,
    traversalOrder,
    traversalNames: traversalOrder.map(v => graph.locations[v]),
    logSteps,
    visitedCount: traversalOrder.length
  };
}

function runConnectedComponents(graph) {
  const visited = Array(graph.vertices).fill(false);
  const components = [];

  for (let i = 0; i < graph.vertices; i++) {
    if (!visited[i]) {
      const currentComponent = [];
      const explore = (v) => {
        visited[v] = true;
        currentComponent.push(v);
        for (let j = 0; j < graph.vertices; j++) {
          if (
            graph.adjacency[v][j] !== EMISSION_DATA.inf &&
            graph.adjacency[v][j] !== 0 &&
            !visited[j]
          ) {
            explore(j);
          }
        }
      };
      explore(i);
      components.push(currentComponent);
    }
  }

  return {
    totalComponents: components.length,
    components: components.map((comp, idx) => ({
      componentNumber: idx + 1,
      vertices: comp,
      names: comp.map(v => graph.locations[v])
    }))
  };
}

function runPrimMST(graph) {
  const selected = Array(graph.vertices).fill(false);
  selected[0] = true; // Start from Industrial Area (0)
  
  let edgeCount = 0;
  let totalCost = 0;
  const mstEdges = [];
  const logSteps = [];

  while (edgeCount < graph.vertices - 1) {
    let minimum = EMISSION_DATA.inf;
    let source = -1;
    let destination = -1;

    for (let i = 0; i < graph.vertices; i++) {
      if (selected[i]) {
        for (let j = 0; j < graph.vertices; j++) {
          if (!selected[j] && graph.adjacency[i][j] < minimum) {
            minimum = graph.adjacency[i][j];
            source = i;
            destination = j;
          }
        }
      }
    }

    if (source === -1) {
      return { success: false, message: "Network is partitioned." };
    }

    selected[destination] = true;
    edgeCount++;
    totalCost += minimum;

    mstEdges.push({
      source,
      destination,
      sourceName: graph.locations[source],
      destinationName: graph.locations[destination],
      cost: minimum
    });

    logSteps.push(`Integrated Backbone Corridor: ${graph.locations[source]} -- ${graph.locations[destination]} [Cost: ${minimum}]`);
  }

  return {
    success: true,
    totalCost,
    mstEdges,
    logSteps
  };
}

function runDijkstra(graph, startVertex = 0, targetVertex = null) {
  const distance = Array(graph.vertices).fill(EMISSION_DATA.inf);
  const visited = Array(graph.vertices).fill(false);
  const parent = Array(graph.vertices).fill(-1);

  distance[startVertex] = 0;

  for (let count = 0; count < graph.vertices - 1; count++) {
    let minimum = EMISSION_DATA.inf;
    let current = -1;

    for (let i = 0; i < graph.vertices; i++) {
      if (!visited[i] && distance[i] < minimum) {
        minimum = distance[i];
        current = i;
      }
    }

    if (current === -1) break;
    visited[current] = true;

    for (let i = 0; i < graph.vertices; i++) {
      if (
        !visited[i] &&
        graph.adjacency[current][i] !== EMISSION_DATA.inf &&
        graph.adjacency[current][i] !== 0 &&
        distance[current] + graph.adjacency[current][i] < distance[i]
      ) {
        distance[i] = distance[current] + graph.adjacency[current][i];
        parent[i] = current;
      }
    }
  }

  const routes = [];
  for (let i = 0; i < graph.vertices; i++) {
    const path = [];
    if (distance[i] !== EMISSION_DATA.inf) {
      let curr = i;
      while (curr !== -1) {
        path.unshift(curr);
        curr = parent[curr];
      }
    }

    routes.push({
      targetId: i,
      targetName: graph.locations[i],
      cost: distance[i],
      path,
      pathNames: path.map(nodeId => graph.locations[nodeId])
    });
  }

  let selectedRoute = null;
  if (targetVertex !== null && targetVertex >= 0 && targetVertex < graph.vertices) {
    selectedRoute = routes[targetVertex];
  }

  return {
    startVertex,
    startName: graph.locations[startVertex],
    routes,
    selectedRoute
  };
}

function runKnapsack(budget = 75) {
  const items = EMISSION_DATA.activities;
  const n = items.length;
  const B = Math.max(0, parseInt(budget, 10) || 0);

  const dp = Array.from({ length: n + 1 }, () => Array(B + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= B; w++) {
      if (i === 0 || w === 0) {
        dp[i][w] = 0;
      } else if (items[i - 1].cost <= w) {
        const include = items[i - 1].reduction + dp[i - 1][w - items[i - 1].cost];
        const exclude = dp[i - 1][w];
        dp[i][w] = Math.max(include, exclude);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const maxReduction = dp[n][B];

  let remainingBudget = B;
  const selectedActivities = [];
  let totalCostUsed = 0;

  for (let i = n; i > 0; i--) {
    if (dp[i][remainingBudget] !== dp[i - 1][remainingBudget]) {
      const item = items[i - 1];
      selectedActivities.push(item);
      totalCostUsed += item.cost;
      remainingBudget -= item.cost;
    }
  }

  const netEmissions = Math.max(0, EMISSION_DATA.totalBaselineEmissions - maxReduction);

  return {
    budget: B,
    maxReduction,
    totalCostUsed,
    remainingBudget: B - totalCostUsed,
    selectedActivities,
    netEmissions: parseFloat(netEmissions.toFixed(2)),
    allActivities: items.map(act => ({
      ...act,
      isSelected: selectedActivities.some(sel => sel.id === act.id)
    }))
  };
}

// ----------------------------------------------------------------------------
// 4. FRONTEND UI CONTROLLER & VIEW LOGIC
// ----------------------------------------------------------------------------

class CarbonIQApp {
  constructor() {
    this.graph = new CarbonGraph();
    this.selectedNodeId = 0;
    this.networkMode = 'full'; // 'full' | 'mst'
    this.currentBudget = 75;
    this.activeShortestPathEdges = new Set();
    this.sortMode = 'emission-desc';
    this.categoryFilter = 'all';
  }

  init() {
    this.renderKPIs();
    this.renderDashboardCharts();
    this.renderMonitoringTable();
    this.renderNetworkGraph();
    this.updateInspector(0);
    this.initEventListeners();
    this.initNetworkAnalysisView();
    this.initKnapsackView();
  }

  // ---------------- Navigation & Page Switching ----------------
  navigateTo(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-panel');

    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    if (targetId === 'network') {
      this.renderNetworkGraph();
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }

  // ---------------- Section 1: Dashboard ----------------
  renderKPIs() {
    const totalEl = document.getElementById('kpi-total-emission');
    const highestEl = document.getElementById('kpi-highest-location');
    const lowestEl = document.getElementById('kpi-lowest-location');
    const densityEl = document.getElementById('kpi-grid-density');

    if (totalEl) totalEl.textContent = EMISSION_DATA.totalBaselineEmissions.toFixed(2);
    if (highestEl) highestEl.textContent = "Power Plant (95.20)";
    if (lowestEl) lowestEl.textContent = "Green Zone (25.60)";
    if (densityEl) densityEl.textContent = "6 Locations / 9 Corridors";
  }

  renderDashboardCharts() {
    const container = document.getElementById('dashboard-bar-chart');
    if (!container) return;

    const maxVal = 100;
    const sorted = [...EMISSION_DATA.locations].sort((a, b) => b.emission - a.emission);

    container.innerHTML = sorted.map(loc => {
      const widthPct = ((loc.emission / maxVal) * 100).toFixed(1);
      let bg = 'var(--accent-emerald)';
      if (loc.emission >= 80) bg = 'var(--accent-red)';
      else if (loc.emission >= 60) bg = 'var(--accent-amber)';

      return `
        <div class="chart-bar-row">
          <div class="chart-bar-name" title="${loc.name}">${loc.name}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-val" style="width: ${widthPct}%; background-color: ${bg};">
              ${loc.emission >= 35 ? loc.emission.toFixed(1) : ''}
            </div>
          </div>
          <div class="chart-bar-stat">${loc.emission.toFixed(2)} units</div>
        </div>
      `;
    }).join('');
  }

  // ---------------- Section 2: Emission Monitoring ----------------
  renderMonitoringTable() {
    const tbody = document.getElementById('monitoring-table-body');
    if (!tbody) return;

    let items = [...EMISSION_DATA.locations];

    // Filter by Category
    if (this.categoryFilter !== 'all') {
      items = items.filter(l => l.type.toLowerCase() === this.categoryFilter.toLowerCase());
    }

    // Sort
    if (this.sortMode === 'emission-desc') {
      items.sort((a, b) => b.emission - a.emission);
    } else if (this.sortMode === 'emission-asc') {
      items.sort((a, b) => a.emission - b.emission);
    } else if (this.sortMode === 'name-asc') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">No locations match the selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((loc, idx) => {
      const pct = ((loc.emission / EMISSION_DATA.totalBaselineEmissions) * 100).toFixed(1);
      let badgeClass = 'badge-info';
      let fillClass = 'var(--accent-blue)';

      if (loc.emission >= 80) {
        badgeClass = 'badge-danger';
        fillClass = 'var(--accent-red)';
      } else if (loc.emission >= 60) {
        badgeClass = 'badge-warning';
        fillClass = 'var(--accent-amber)';
      } else {
        badgeClass = 'badge-success';
        fillClass = 'var(--accent-emerald)';
      }

      const isSelected = loc.id === this.selectedNodeId;

      return `
        <tr class="${isSelected ? 'active-row' : ''}" style="cursor: pointer;" onclick="window.carbonApp.selectStation(${loc.id})">
          <td class="mono" style="font-weight: 700; width: 60px;">#${idx + 1}</td>
          <td style="min-width: 170px;">
            <strong style="color: #ffffff;">${loc.name}</strong>
          </td>
          <td style="width: 120px;">
            <span class="badge-pill ${badgeClass}">${loc.type}</span>
          </td>
          <td class="mono" style="font-weight: 700; color: #ffffff; width: 130px;">${loc.emission.toFixed(2)} units</td>
          <td class="mono" style="width: 80px;">${pct}%</td>
          <td style="min-width: 140px;">
            <div class="emission-progress-bar">
              <div class="emission-progress-fill" style="width: ${pct * 2.8}%; background-color: ${fillClass};"></div>
            </div>
          </td>
          <td style="width: 150px;">
            <span class="badge-pill ${badgeClass}">${loc.risk}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  selectStation(nodeId) {
    this.selectedNodeId = nodeId;
    this.renderMonitoringTable();
    this.renderNetworkGraph();
    this.updateInspector(nodeId);

    // Update monitoring station inspector if on that page
    const detailTitle = document.getElementById('station-detail-title');
    const detailType = document.getElementById('station-detail-type');
    const detailVal = document.getElementById('station-detail-emission');
    const detailShare = document.getElementById('station-detail-share');
    const detailConnections = document.getElementById('station-detail-connections');

    const loc = EMISSION_DATA.locations[nodeId];
    if (loc && detailTitle) {
      detailTitle.textContent = loc.name;
      if (detailType) detailType.textContent = loc.type;
      if (detailVal) detailVal.textContent = `${loc.emission.toFixed(2)} units`;
      if (detailShare) {
        const pct = ((loc.emission / EMISSION_DATA.totalBaselineEmissions) * 100).toFixed(1);
        detailShare.textContent = `${pct}% of regional total`;
      }

      if (detailConnections) {
        const neighbors = this.graph.getNeighbors(nodeId);
        detailConnections.innerHTML = neighbors.map(n => `
          <div class="inspector-stat-row">
            <span class="inspector-stat-label">${n.targetName}:</span>
            <span class="inspector-stat-val">Transmission Cost: ${n.cost} | ${n.emission.toFixed(1)} u</span>
          </div>
        `).join('');
      }
    }
  }

  // ---------------- Section 3: Monitoring Network ----------------
  renderNetworkGraph() {
    const svg = document.getElementById('network-svg');
    if (!svg) return;

    const mstResult = runPrimMST(this.graph);
    const mstEdgeSet = new Set(
      mstResult.mstEdges.map(e => `${Math.min(e.source, e.destination)}-${Math.max(e.source, e.destination)}`)
    );

    let edgesHtml = '';
    EMISSION_DATA.edges.forEach(edge => {
      const uLoc = EMISSION_DATA.locations[edge.u];
      const vLoc = EMISSION_DATA.locations[edge.v];
      const edgeKey = `${Math.min(edge.u, edge.v)}-${Math.max(edge.u, edge.v)}`;

      const isMst = mstEdgeSet.has(edgeKey);
      const isPath = this.activeShortestPathEdges.has(edgeKey);

      let edgeClass = 'graph-edge';
      if (this.networkMode === 'mst') {
        edgeClass += isMst ? ' mst-edge' : ' dimmed';
      } else if (isPath) {
        edgeClass += ' path-edge';
      }

      const midX = (uLoc.x + vLoc.x) / 2;
      const midY = (uLoc.y + vLoc.y) / 2;

      edgesHtml += `
        <g class="edge-group">
          <line x1="${uLoc.x}" y1="${uLoc.y}" x2="${vLoc.x}" y2="${vLoc.y}" class="${edgeClass}" data-edge="${edgeKey}" />
          <rect x="${midX - 11}" y="${midY - 9}" width="22" height="18" class="edge-label-bg" />
          <text x="${midX}" y="${midY}" class="edge-label-text">${edge.cost}</text>
        </g>
      `;
    });

    let nodesHtml = '';
    EMISSION_DATA.locations.forEach(loc => {
      let fillColor = '#10b981';
      let strokeColor = '#059669';

      if (loc.emission >= 80) {
        fillColor = '#ef4444';
        strokeColor = '#b91c1c';
      } else if (loc.emission >= 60) {
        fillColor = '#f59e0b';
        strokeColor = '#d97706';
      }

      const isSelected = loc.id === this.selectedNodeId;
      const nodeClass = `graph-node ${isSelected ? 'selected' : ''}`;

      nodesHtml += `
        <g class="${nodeClass}" data-node-id="${loc.id}" transform="translate(${loc.x}, ${loc.y})">
          <circle r="18" fill="${fillColor}" stroke="${strokeColor}" class="graph-node-circle" />
          <circle r="6" fill="#ffffff" />
          <text y="-25" class="graph-node-text">${loc.name}</text>
          <text y="32" class="graph-node-subtext">${loc.emission.toFixed(1)} u</text>
        </g>
      `;
    });

    svg.innerHTML = `
      <defs>
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#141f33" stroke-width="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" />
      ${edgesHtml}
      ${nodesHtml}
    `;

    svg.querySelectorAll('.graph-node').forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const nodeId = parseInt(nodeEl.getAttribute('data-node-id'), 10);
        this.selectStation(nodeId);
      });
    });
  }

  updateInspector(nodeId) {
    const loc = EMISSION_DATA.locations[nodeId];
    const neighbors = this.graph.getNeighbors(nodeId);

    const nameEl = document.getElementById('inspector-name');
    const idEl = document.getElementById('inspector-id');
    const emissionEl = document.getElementById('inspector-emission');
    const typeEl = document.getElementById('inspector-type');
    const linksEl = document.getElementById('inspector-links');

    if (nameEl) nameEl.textContent = loc.name;
    if (idEl) idEl.textContent = `Zone ID: #${loc.id}`;
    if (emissionEl) emissionEl.textContent = `${loc.emission.toFixed(2)} units`;
    if (typeEl) typeEl.textContent = loc.type;

    if (linksEl) {
      linksEl.innerHTML = neighbors.map(n => `
        <div class="inspector-stat-row">
          <span class="inspector-stat-label">${n.targetName}:</span>
          <span class="inspector-stat-val">Weight: ${n.cost} | ${n.emission.toFixed(1)} u</span>
        </div>
      `).join('');
    }
  }

  // ---------------- Network Analysis Capabilities ----------------
  initNetworkAnalysisView() {
    const modeSelect = document.getElementById('analysis-tool-select');
    const sourceSelect = document.getElementById('analysis-source');
    const targetGroup = document.getElementById('analysis-target-group');
    const targetSelect = document.getElementById('analysis-target');
    const runBtn = document.getElementById('btn-run-analysis');

    const optionsHtml = EMISSION_DATA.locations.map(l => 
      `<option value="${l.id}">${l.id}: ${l.name}</option>`
    ).join('');

    if (sourceSelect) sourceSelect.innerHTML = optionsHtml;
    if (targetSelect) {
      targetSelect.innerHTML = optionsHtml;
      targetSelect.value = "5"; // Default Green Zone
    }

    if (modeSelect) {
      modeSelect.addEventListener('change', () => {
        const isRouting = modeSelect.value === 'routing';
        if (targetGroup) targetGroup.style.display = isRouting ? 'flex' : 'none';
        this.runNetworkAnalysis();
      });
    }

    if (sourceSelect) {
      sourceSelect.addEventListener('change', () => this.runNetworkAnalysis());
    }

    if (targetSelect) {
      targetSelect.addEventListener('change', () => this.runNetworkAnalysis());
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => this.runNetworkAnalysis());
    }

    this.runNetworkAnalysis();
  }

  runNetworkAnalysis() {
    const mode = document.getElementById('analysis-tool-select')?.value || 'routing';
    const source = parseInt(document.getElementById('analysis-source')?.value || '0', 10);
    const target = parseInt(document.getElementById('analysis-target')?.value || '5', 10);
    const logBox = document.getElementById('analysis-log-output');

    this.activeShortestPathEdges.clear();

    if (!logBox) return;

    let output = '';

    if (mode === 'routing') {
      const result = runDijkstra(this.graph, source, target);
      output += `=================================================================\n`;
      output += ` OPTIMAL TRANSMISSION CORRIDOR ROUTING\n`;
      output += ` Origin Station: ${result.startName}\n`;
      output += ` Target Station: ${this.graph.locations[target]}\n`;
      output += `=================================================================\n\n`;

      if (result.selectedRoute) {
        const sel = result.selectedRoute;
        output += `Optimal Path: ${sel.pathNames.join(' -> ')}\n`;
        output += `Cumulative Transmission Cost: ${sel.cost} units\n\n`;

        output += `Route Corridor Breakdown:\n`;
        for (let i = 0; i < sel.path.length - 1; i++) {
          const u = sel.path[i];
          const v = sel.path[i + 1];
          const c = this.graph.getCost(u, v);
          output += `  Segment ${i + 1}: ${this.graph.locations[u]} -> ${this.graph.locations[v]} [Cost: ${c}]\n`;
          this.activeShortestPathEdges.add(`${Math.min(u, v)}-${Math.max(u, v)}`);
        }
      }

      output += `\nAll Available Destination Costs from ${result.startName}:\n`;
      result.routes.forEach(r => {
        output += `  To ${r.targetName.padEnd(20)}: Cost ${r.cost} (via ${r.pathNames.join(' -> ')})\n`;
      });

    } else if (mode === 'connectivity') {
      const result = runBFS(this.graph, source);
      output += `=================================================================\n`;
      output += ` NETWORK REACHABILITY & CONNECTIVITY AUDIT\n`;
      output += ` Source Location: ${this.graph.locations[source]}\n`;
      output += `=================================================================\n\n`;
      result.logSteps.forEach(step => output += `${step}\n`);
      output += `\nReachability Path:\n${result.traversalNames.join(' -> ')} -> COMPLETE\n`;
      output += `\nGrid Connectivity Assessment: 100% Unified Mesh (All ${result.visitedCount} stations linked)\n`;
    }

    logBox.textContent = output;
    this.renderNetworkGraph();
  }

  // ---------------- Section 4: Reduction Planner ----------------
  initKnapsackView() {
    const slider = document.getElementById('budget-slider');
    const input = document.getElementById('budget-input');
    const presetBtns = document.querySelectorAll('.preset-btn');

    const update = (budgetVal) => {
      this.currentBudget = budgetVal;
      if (slider) slider.value = budgetVal;
      if (input) input.value = budgetVal;

      presetBtns.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-budget'), 10);
        if (val === budgetVal) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      this.renderKnapsackResults(budgetVal);
    };

    if (slider) {
      slider.addEventListener('input', (e) => update(parseInt(e.target.value, 10)));
    }

    if (input) {
      input.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 165) val = 165;
        update(val);
      });
    }

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-budget'), 10);
        update(val);
      });
    });

    update(75);
  }

  renderKnapsackResults(budget) {
    const result = runKnapsack(budget);

    const usedEl = document.getElementById('knapsack-used-budget');
    const remainingEl = document.getElementById('knapsack-remaining-budget');
    const reductionEl = document.getElementById('knapsack-reduction');
    const netEl = document.getElementById('knapsack-net-emissions');
    const tbody = document.getElementById('knapsack-table-body');

    if (usedEl) usedEl.textContent = `${result.totalCostUsed} units`;
    if (remainingEl) remainingEl.textContent = `${result.remainingBudget} units`;
    if (reductionEl) reductionEl.textContent = `${result.maxReduction} units`;
    if (netEl) netEl.textContent = `${result.netEmissions.toFixed(2)} units`;

    if (tbody) {
      tbody.innerHTML = result.allActivities.map(act => {
        const ratio = (act.reduction / act.cost).toFixed(2);
        return `
          <tr class="${act.isSelected ? 'active-row' : ''}">
            <td class="mono" style="font-weight: 700; width: 60px;">#${act.id}</td>
            <td style="min-width: 220px;">
              <strong style="color: #ffffff;">${act.label}</strong>
              <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.15rem;">${act.desc}</div>
            </td>
            <td style="width: 110px;">
              <span class="badge-pill badge-info">${act.sector}</span>
            </td>
            <td class="mono" style="width: 90px; color: #ffffff;">${act.cost}</td>
            <td class="mono" style="color: var(--accent-emerald); font-weight: 700; width: 110px;">+${act.reduction}</td>
            <td class="mono" style="width: 100px;">${ratio}</td>
            <td style="width: 130px;">
              ${act.isSelected ? 
                '<span class="badge-pill badge-success">SELECTED</span>' : 
                '<span class="badge-pill" style="background: rgba(30,41,59,0.5); color: #64748b;">EXCLUDED</span>'}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // ---------------- UI Event Listeners ----------------
  initEventListeners() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        this.navigateTo(targetId);
      });
    });

    // Mobile nav toggle
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Monitoring table sort & filter controls
    const sortSelect = document.getElementById('table-sort-select');
    const filterSelect = document.getElementById('table-filter-select');

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortMode = e.target.value;
        this.renderMonitoringTable();
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.categoryFilter = e.target.value;
        this.renderMonitoringTable();
      });
    }

    // Network mode toggle
    const btnFull = document.getElementById('btn-mode-full');
    const btnMst = document.getElementById('btn-mode-mst');

    if (btnFull && btnMst) {
      btnFull.addEventListener('click', () => {
        this.networkMode = 'full';
        btnFull.classList.add('active');
        btnMst.classList.remove('active');
        this.renderNetworkGraph();
      });

      btnMst.addEventListener('click', () => {
        this.networkMode = 'mst';
        btnMst.classList.add('active');
        btnFull.classList.remove('active');
        this.renderNetworkGraph();
      });
    }
  }
}

// ----------------------------------------------------------------------------
// 5. APPLICATION BOOTSTRAP / CLI TEST RUNNER
// ----------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.carbonApp = new CarbonIQApp();
    window.carbonApp.init();
  });
} else {
  // Headless Execution for automated testing
  console.log("==================================================");
  console.log(" CarbonIQ - Verification Assertion Check");
  console.log("==================================================");

  const testGraph = new CarbonGraph();
  const cc = runConnectedComponents(testGraph);
  const mst = runPrimMST(testGraph);
  const sp = runDijkstra(testGraph, 0, 5);
  const ks = runKnapsack(75);

  console.log(`Connected Components Count: ${cc.totalComponents} (Expected: 1)`);
  console.log(`Prim's MST Total Cost: ${mst.totalCost} (Expected: 14)`);
  console.log(`Dijkstra Cost (0 -> 5): ${sp.selectedRoute.cost} (Expected: 12)`);
  console.log(`Knapsack at 75: Cost = ${ks.totalCostUsed}, Reduction = ${ks.maxReduction} (Expected: Cost 75, Reduction 100)`);

  const allPass = (
    cc.totalComponents === 1 &&
    mst.totalCost === 14 &&
    sp.selectedRoute.cost === 12 &&
    ks.totalCostUsed === 75 &&
    ks.maxReduction === 100
  );

  console.log(`\nOVERALL STATUS: ${allPass ? "ALL BENCHMARKS PASSED" : "FAILED"}`);
  if (!allPass) process.exit(1);
}
