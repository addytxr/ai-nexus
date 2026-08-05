# AI Nexus

**The definitive knowledge graph of the AI ecosystem.**

AI Nexus is a modern, canvas-first graph exploration platform that allows researchers, engineers, and product managers to map and understand the rapidly evolving artificial intelligence ecosystem. By visualizing connections between Companies, Models, Frameworks, and Tools, AI Nexus provides a bird's-eye view of how the industry operates and integrates.

---

## 🎯 Product Overview

Unlike traditional dashboard applications, AI Nexus uses a **Canvas-First** design philosophy. The graph is the product.

Inspired by tools like Excalidraw, Figma, and Raycast, the application drops users immediately into an interactive WebGL visualization, providing powerful tools to navigate deeply complex relationships without the clutter of heavy sidebars and menus.

### Key Features
- **Immersive WebGL Graph**: A high-performance physics-based node simulation (powered by `react-force-graph-2d` and `d3-force`) capable of rendering thousands of nodes and edges smoothly.
- **N-Hop Neighbor Exploration**: Dynamically expand a node's ecosystem by visualizing its 1-hop, 2-hop, or 3-hop connections in real-time.
- **Shortest Path Explorer**: Select any two nodes in the ecosystem (e.g., `Cursor` and `Stripe API`) and the application will traverse the graph to find the shortest integration path connecting them.
- **Smart Global Search**: A fast, keyboard-accessible command palette (`Cmd + K`) that instantly searches the graph and highlights the target node.
- **Dynamic Context Panels**: Click on any node to slide out a comprehensive information drawer containing its metadata, official logo, and a breakdown of incoming/outgoing dependencies.
- **Automatic Logo Resolution**: Integrated with the Clearbit Logo API to automatically fetch and display official company/tool logos based on their website domain.

---

## 🏗️ Architecture & Tech Stack

AI Nexus is built using a modern, scalable, and type-safe stack:

**Frontend (Client)**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **State & Data Fetching**: React Query & React Context API
- **Visualization**: `react-force-graph-2d` (HTML5 Canvas / WebGL)

**Backend & Database**
- **API**: Next.js Route Handlers
- **Database**: **Neo4j** (Native Graph Database)
- **Driver**: `neo4j-driver`
- **Query Language**: Cypher

---

## 🔌 API Documentation (Route Handlers)

The Next.js backend acts as a secure proxy to the Neo4j database, exposing the following REST API routes:

| Endpoint | Method | Query Params | Description |
|---|---|---|---|
| `/api/search` | `GET` | `?q=<string>` | Full-text fuzzy search across node names and descriptions. |
| `/api/nodes/[id]` | `GET` | - | Returns full metadata for a specific node, including all 1st-degree incoming and outgoing edges with relationship context. |
| `/api/graph/neighbors` | `GET` | `?nodeId=<id>&depth=<num>` | Traverses the graph from the source node up to N-hops and returns the localized subgraph (nodes and edges). |
| `/api/graph/path` | `GET` | `?source=<id>&target=<id>` | Calculates the shortest relationship path between two nodes (up to 6 hops) and returns the traversal steps. |
| `/api/graph/similar` | `GET` | `?nodeId=<id>` | Finds "Similar Tools" by calculating nodes that share the highest number of common dependencies. |
| `/api/graph/stats` | `GET` | - | Aggregates the total number of nodes, relationships, and category breakdowns across the entire Neo4j database. |

---

## 🚀 Local Setup & Demo Environment

To run AI Nexus locally, you will need Node.js and access to a Neo4j instance (either local via Docker/Desktop or cloud via Neo4j Aura).

### 1. Clone & Install
```bash
git clone <repository-url>
cd ai-nexus
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with your Neo4j credentials:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

### 3. Seed the Database
AI Nexus includes a powerful seeding script that populates the Neo4j graph with hundreds of initial nodes and thousands of relationships based on the current AI ecosystem.
```bash
npm run seed
```
*(Optional)*: If you want to fetch and inject the latest website domains for official logos, you can run:
```bash
npx tsx --env-file=.env.local scripts/add-websites.ts
```

### 4. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The application defaults to Light Theme, with an ultra-minimal, canvas-first interface.
