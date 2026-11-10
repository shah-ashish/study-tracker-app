import { StudyDay, StudyTask, Phase } from '../types';
import { TIME_BLOCKS } from '../constants';

// Helper to generate tasks for a day
function makeTasks(day: number, readTitle: string, codeTitle: string, reviewTitle: string, readTitle2: string, dsaTitle: string, projectTitle: string): StudyTask[] {
  return [
    { id: `d${day}-morning-read`, dayNumber: day, blockId: 'morning-read', title: readTitle, description: `Deep read: ${readTitle}`, type: 'read' },
    { id: `d${day}-morning-code`, dayNumber: day, blockId: 'morning-code', title: codeTitle, description: `Code lab: ${codeTitle}`, type: 'code' },
    { id: `d${day}-afternoon-review`, dayNumber: day, blockId: 'afternoon-review', title: reviewTitle, description: `Spaced recall: ${reviewTitle}`, type: 'review' },
    { id: `d${day}-afternoon-read`, dayNumber: day, blockId: 'afternoon-read', title: readTitle2, description: `Deep read #2: ${readTitle2}`, type: 'read' },
    { id: `d${day}-evening-dsa`, dayNumber: day, blockId: 'evening-dsa', title: dsaTitle, description: `DSA practice: ${dsaTitle}`, type: 'dsa' },
    { id: `d${day}-evening-project`, dayNumber: day, blockId: 'evening-project', title: projectTitle, description: `Project: ${projectTitle}`, type: 'project' },
    { id: `d${day}-evening-journal`, dayNumber: day, blockId: 'evening-journal', title: 'Daily Journal', description: 'Write what you learned, what confused you, what to review', type: 'journal' },
  ];
}

function makeDay(day: number, phase: Phase, phaseLabel: string, section: string, readFocus: string, practiceFocus: string, readTitle: string, codeTitle: string, reviewTitle: string, readTitle2: string, dsaTitle: string, projectTitle: string): StudyDay {
  return {
    day, phase, phaseLabel, section, readFocus, practiceFocus,
    tasks: makeTasks(day, readTitle, codeTitle, reviewTitle, readTitle2, dsaTitle, projectTitle),
  };
}

// ─── Phase 1: Foundations (Days 1–25) ────────────────────────

const phase1: StudyDay[] = [
  // Days 1-2: CS & Networking Foundations
  makeDay(1, 'foundations', 'Phase 1: Foundations', '§1 CS & Networking',
    'CPU, RAM, processes, threads, user space vs kernel space, system calls',
    'Draw diagrams, terminal exploration',
    'CPU, RAM, disk, I/O, processes & threads', 'Explore system info via terminal commands', 'Start fresh — set up study tools', 'Networking: Client-server, IP, ports, DNS', 'Warm-up: Array traversal basics', 'Set up project repo & dev environment'),
  makeDay(2, 'foundations', 'Phase 1: Foundations', '§1 CS & Networking',
    'TCP/IP, sockets, TLS, HTTP lifecycle, proxies',
    'Use ping, traceroute, dig, curl',
    'TCP handshake, UDP, sockets, packet flow', 'Use ping, traceroute, dig, curl to inspect network', 'Review: CPU, RAM, processes, threads', 'Web: Browser lifecycle, URL anatomy, HTTPS, CDN, cookies', 'Array problems: Two sum, reverse array', 'Create first README & project structure'),

  // Days 3-5: JavaScript Fundamentals
  makeDay(3, 'foundations', 'Phase 1: Foundations', '§2 JavaScript',
    'Variables, scope, types, operators, coercion',
    'Code exercises for each concept',
    'var/let/const, scope, primitive vs reference', 'Write 20 scope & variable exercises', 'Review: Networking, TCP, DNS', 'Operators, equality, coercion, truthy/falsy', 'Easy: String reversal, palindrome check', 'Plan portfolio project structure'),
  makeDay(4, 'foundations', 'Phase 1: Foundations', '§2 JavaScript',
    'Functions, closures, hoisting, this, prototypes',
    'Build closure demos, prototype chain',
    'Functions, arrow functions, callbacks, closures', 'Implement closures, higher-order functions', 'Review: var/let/const, scope, types', 'this binding, call/apply/bind, prototypes', 'Easy: Anagram check, char frequency', 'Start utility module with helper functions'),
  makeDay(5, 'foundations', 'Phase 1: Foundations', '§2 JavaScript',
    'Objects, classes, arrays, Map/Set, iterators',
    'Build class hierarchies, use collections',
    'Objects, classes, getters/setters, inheritance', 'Build a class hierarchy, practice property access', 'Review: Closures, this, prototypes', 'Arrays, Map, Set, WeakMap, iterators, generators', 'Easy: Two pointers on sorted arrays', 'Add typed data models to project'),

  // Days 6-7: JS Async & Modern
  makeDay(6, 'foundations', 'Phase 1: Foundations', '§2 JavaScript',
    'Event loop, promises, async/await, concurrency',
    'Build promise chains, race conditions demo',
    'Event loop, task/microtask queues, promises', 'Build promise chain, implement Promise.all from scratch', 'Review: Objects, classes, Map/Set', 'async/await, Promise.allSettled/race/any, fetch', 'Easy: Sliding window (max subarray)', 'Add async data loading to project'),
  makeDay(7, 'foundations', 'Phase 1: Foundations', '§2 JavaScript',
    'Array methods, immutability, modules, practical skills',
    'Implement debounce, throttle, memoize',
    'map/filter/reduce, sorting, immutability', 'Implement debounce, throttle, memoize, curry', 'Review: Event loop, promises, async/await', 'Modules (CJS vs ESM), JSON, regex, error handling', 'Easy: Prefix sums, difference arrays', 'Create reusable utility module'),

  // Days 8-9: TypeScript
  makeDay(8, 'foundations', 'Phase 1: Foundations', '§3 TypeScript',
    'Type system, unions, intersections, narrowing, generics',
    'Convert JS files to TS',
    'Type annotations, inference, any/unknown/never', 'Convert 3 JS files to TypeScript', 'Review: Array methods, modules', 'Unions, intersections, type guards, generics', 'Easy: Hash map problems (two sum, group anagrams)', "Type your project's data models"),
  makeDay(9, 'foundations', 'Phase 1: Foundations', '§3 TypeScript',
    'Advanced types, utility types, tsconfig, Express typing',
    'Type Express routes, build generic utilities',
    'Mapped types, conditional types, utility types', 'Build generic type utilities, type Express routes', 'Review: TS type system, generics', 'tsconfig, ESM config, declaration files', 'Easy: Set operations, lookup patterns', 'Configure tsconfig for project'),

  // Days 10-13: DSA Deep Dive
  makeDay(10, 'foundations', 'Phase 1: Foundations', '§4 DSA — Arrays & Strings',
    'Two pointers, sliding window, binary search',
    '4-5 LeetCode problems per day',
    'Two pointers technique, sliding window pattern', 'Solve 5 two-pointer / sliding window problems', 'Review: TypeScript generics, utility types', 'Binary search, prefix sums, matrix traversal', 'Medium: Container with most water, 3Sum', 'Implement sorting algorithms from scratch'),
  makeDay(11, 'foundations', 'Phase 1: Foundations', '§4 DSA — Arrays & Strings',
    'String matching, frequency counting, subarrays',
    'Pattern-based problem solving',
    'Frequency counting, subarrays, subsequences', 'Solve 5 frequency / subarray problems', 'Review: Two pointers, sliding window', 'String matching, binary search on answer', 'Medium: Longest substring without repeats', 'Build a CLI data structure visualizer'),
  makeDay(12, 'foundations', 'Phase 1: Foundations', '§4 DSA — Hashing',
    'Hash maps, hash sets, collision, grouping patterns',
    'Implement hash map from scratch',
    'Hash functions, hash maps, collision handling', 'Implement a basic hash map from scratch in TS', 'Review: Frequency counting, string matching', 'Grouping patterns, lookup optimization', 'Medium: Group anagrams, valid sudoku', 'Extend project with caching logic'),
  makeDay(13, 'foundations', 'Phase 1: Foundations', '§4 DSA — Hashing + Review',
    'Advanced hashing patterns, complexity analysis',
    'Timed problem solving sessions',
    'Advanced hashing patterns, frequency maps', 'Solve 5 hash-based medium problems (timed)', 'Review: Hash maps, collision resolution', 'Big-O deep dive, amortized analysis', 'Medium: Top K frequent elements, longest consecutive', 'Profile and optimize hash implementations'),

  // Days 14-15: Linked Lists, Stacks, Queues
  makeDay(14, 'foundations', 'Phase 1: Foundations', '§4 DSA — Linked Lists, Stacks',
    'Linked lists, reversal, cycle detection, stacks',
    'Implement data structures from scratch',
    'Singly/doubly linked lists, reversal, cycle detection', 'Implement linked list + stack from scratch in TS', 'Review: Hashing patterns, Big-O', 'Monotonic stack, queue, deque, circular queue', 'Medium: Reverse linked list, detect cycle, valid parens', 'Add linked list operations to data structures module'),
  makeDay(15, 'foundations', 'Phase 1: Foundations', '§4 DSA — Queues & Heaps',
    'Priority queue, heap, fast/slow pointers',
    'Implement heap, solve priority queue problems',
    'Priority queue, min/max heap implementation', 'Implement a min-heap from scratch in TS', 'Review: Linked lists, stacks', 'Fast/slow pointers, heap applications', 'Medium: Merge K sorted lists, Kth largest', 'Add queue-based task processing to project'),

  // Days 16-17: Trees & Graphs
  makeDay(16, 'foundations', 'Phase 1: Foundations', '§4 DSA — Trees',
    'Binary trees, BST, traversals, tries',
    'Implement BST operations',
    'Binary trees, traversals (in/pre/post/level order)', 'Implement BST with insert/delete/search', 'Review: Heaps, priority queue', 'BST validation, LCA, balanced-tree intuition, tries', 'Medium: Max depth, validate BST, level order traversal', 'Build a tree-based autocomplete feature'),
  makeDay(17, 'foundations', 'Phase 1: Foundations', '§4 DSA — Graphs',
    'Graph representations, BFS, DFS, topological sort',
    'Implement graph algorithms',
    'Adjacency list/matrix, BFS, DFS', 'Implement BFS + DFS on a graph in TS', 'Review: Trees, BST, traversals', 'Topological sort, shortest paths, Dijkstra, union-find', 'Medium: Number of islands, course schedule', 'Model project entities as a graph'),

  // Days 18-19: Algorithmic Techniques
  makeDay(18, 'foundations', 'Phase 1: Foundations', '§4 DSA — Techniques',
    'Recursion, backtracking, divide and conquer, greedy',
    'Solve pattern-based problems',
    'Recursion patterns, backtracking, divide & conquer', 'Solve 4 backtracking problems (permutations, subsets)', 'Review: Graphs, BFS, DFS, topological sort', 'Greedy algorithms, interval problems', 'Medium: Combination sum, word search', 'Refactor project using recursive patterns'),
  makeDay(19, 'foundations', 'Phase 1: Foundations', '§4 DSA — DP',
    'Dynamic programming, memoization, tabulation',
    'Build DP solutions step by step',
    'DP fundamentals, memoization vs tabulation', 'Solve 3 DP problems (climbing stairs, coin change, LCS)', 'Review: Backtracking, greedy', 'Bit manipulation, sorting algorithms', 'Medium: House robber, unique paths', 'Document all DSA implementations'),

  // Days 20-21: Git
  makeDay(20, 'foundations', 'Phase 1: Foundations', '§5 Git & Collaborative Dev',
    'Git model, branches, merge vs rebase',
    'Practice branching workflows',
    'Working tree, staging, commits, branches, HEAD', 'Init repo, practice branch/merge/rebase workflows', 'Review: DP patterns, memoization', 'Feature branches, PRs, code review, cherry-pick', 'Medium: DP on strings', 'Set up Git workflow for portfolio project'),
  makeDay(21, 'foundations', 'Phase 1: Foundations', '§5 Git & Team Practices',
    'Commit conventions, .gitignore, semantic versioning',
    'Set up professional repo practices',
    'Commit messages, .gitignore, README standards', 'Write conventional commits, set up .gitignore, README', 'Review: Git branching, merge vs rebase', 'Protected branches, semantic versioning, GitHub issues', 'Medium: Graph DFS problems', 'Configure project with professional Git practices'),

  // Days 22-23: Linux & Shell
  makeDay(22, 'foundations', 'Phase 1: Foundations', '§6 Linux & Shell',
    'Filesystem, commands, permissions, processes',
    'Terminal exercises in WSL/VM',
    'Directory hierarchy, ls/cd/cp/mv/rm, pipes, redirect', 'Run 30 Linux commands in WSL, practice pipes', 'Review: Git team practices', 'Permissions, chmod/chown, processes, ps/top/kill', 'Medium: Stack-based problems', 'Write a shell script for project automation'),
  makeDay(23, 'foundations', 'Phase 1: Foundations', '§6 Linux Networking & Ops',
    'Networking commands, SSH, troubleshooting',
    'Network diagnostics, SSH setup',
    'curl, wget, ping, ss, dig, SSH key pairs', 'Set up SSH keys, practice SCP, network diagnostics', 'Review: Linux filesystem, permissions', 'systemd, cron, package managers, troubleshooting', 'Medium: Queue & deque problems', 'Automate project tasks with cron-style scripts'),

  // Days 24-25: Review
  makeDay(24, 'foundations', 'Phase 1: Foundations', 'Phase 1 Review',
    'Re-read weakest areas from all Phase 1 topics',
    'Redo hardest problems, practice explaining',
    'Review weak areas: JS closures, event loop, prototypes', 'Redo 10 hardest DSA problems', 'Review: Linux networking, SSH', 'Review weak areas: TS generics, Git rebasing', 'Mixed: 5 problems from all categories', 'Review & clean up all Phase 1 code'),
  makeDay(25, 'foundations', 'Phase 1: Foundations', 'Phase 1 Final Review',
    'Practice explaining all concepts aloud',
    'Full mock: explain + code any Phase 1 topic',
    'Explain closures, event loop, promises aloud', 'Code challenge: build a mini-project using all JS/TS skills', 'Review: All Phase 1 flashcards', 'Explain TCP, DNS, HTTP, Git branching aloud', 'Mixed: 5 medium problems (timed 45 min)', 'Phase 1 checkpoint: ensure all code is committed'),
];

// ─── Phase 2: Core Backend Engineering (Days 26–55) ──────────

const phase2: StudyDay[] = [
  // Days 26-28: Node.js
  makeDay(26, 'core-backend', 'Phase 2: Core Backend', '§7 Node.js Runtime',
    'V8, libuv, event-driven I/O, event loop phases',
    'Build file reader with streams',
    'What Node.js is, V8, libuv, event loop phases', 'Trace event loop phases, build a timer demo', 'Review: Phase 1 weak spots', 'Core modules: fs, path, http, events', 'Medium: Binary search variants', 'Scaffold Express app (Project 1)'),
  makeDay(27, 'core-backend', 'Phase 2: Core Backend', '§7 Node.js Internals',
    'Streams, buffers, worker threads, cluster',
    'Build streaming file processor',
    'Streams (readable/writable/transform), buffers', 'Build a streaming CSV processor', 'Review: Node.js event loop, V8', 'worker_threads, child_process, cluster', 'Medium: Tree problems', 'Add streaming endpoints to Project 1'),
  makeDay(28, 'core-backend', 'Phase 2: Core Backend', '§7 Node.js Modules & Perf',
    'Modules, npm, packages, memory, profiling',
    'Profile Node.js app, detect blocking',
    'CJS vs ESM, require/import, package.json, npm', 'Profile a Node app with --inspect, detect event loop blocking', 'Review: Streams, buffers, worker_threads', 'Memory usage, heap snapshots, graceful shutdown', 'Medium: Graph problems', 'Configure Project 1 package.json & scripts'),

  // Days 29-30: HTTP & CORS
  makeDay(29, 'core-backend', 'Phase 2: Core Backend', '§8 HTTP & Networking',
    'HTTP methods, status codes, headers, caching',
    'Build raw HTTP server, inspect headers',
    'HTTP request/response, methods, status codes, headers', 'Build a raw HTTP server with http module, inspect with curl', 'Review: Node.js modules, profiling', 'Cache-Control, ETag, If-None-Match, 304 responses', 'Medium: Linked list problems', 'Add proper HTTP headers to Project 1'),
  makeDay(30, 'core-backend', 'Phase 2: Core Backend', '§8 CORS & Security',
    'CORS, TLS, reverse proxy, load balancing',
    'Configure CORS, test cross-origin requests',
    'CORS preflight, OPTIONS, allowed origins, credentials', 'Configure CORS middleware, test with cross-origin requests', 'Review: HTTP methods, caching headers', 'TLS handshake, HTTPS, reverse proxy, load balancers', 'Medium: String problems', 'Add CORS & security headers to Project 1'),

  // Days 31-32: API Design
  makeDay(31, 'core-backend', 'Phase 2: Core Backend', '§9 Routing & Serialization',
    'Resource URLs, routing patterns, JSON serialization',
    'Design REST API spec',
    'Resource-oriented URLs, path vs query params, versioning', 'Design a REST API on paper, define routes', 'Review: CORS, TLS', 'JSON structure, parsing, validation, dates, payload size', 'Medium: Hash map problems', 'Design Project 1 API routes'),
  makeDay(32, 'core-backend', 'Phase 2: Core Backend', '§9 REST API Design',
    'REST semantics, pagination, OpenAPI documentation',
    'Write OpenAPI spec for your API',
    'Method semantics, idempotency, pagination (offset/cursor)', 'Write OpenAPI YAML spec for Project 1', 'Review: Routing, serialization', 'API contracts, Swagger, error format, deprecation', 'Medium: Sorting & searching problems', 'Generate API docs for Project 1'),

  // Days 33-35: Express.js & Architecture
  makeDay(33, 'core-backend', 'Phase 2: Core Backend', '§10 Express.js Foundations',
    'Express setup, routers, handlers, middleware',
    'Build Express app with layered architecture',
    'App setup, routers, route handlers, req/res objects', 'Set up Express with routers, JSON parsing, async handlers', 'Review: REST API design, OpenAPI', 'Middleware: order, types, authentication, logging', 'Medium: Array medium problems', 'Build Project 1 Express app structure'),
  makeDay(34, 'core-backend', 'Phase 2: Core Backend', '§10 Application Layers',
    'Controllers, services, repositories, DTOs',
    'Implement layered architecture',
    'Routes → controllers → services → repositories → models', 'Implement controller + service + repository layers', 'Review: Express middleware pipeline', 'Separation of concerns, DI, modular monolith', 'Medium: Stack / queue problems', 'Add controllers & services to Project 1'),
  makeDay(35, 'core-backend', 'Phase 2: Core Backend', '§10 Request Lifecycle',
    'Full request lifecycle, project structure',
    'Trace a request through all layers',
    'Incoming socket → parsing → middleware → route → response', 'Trace & log a request through every layer', 'Review: Application layers, separation of concerns', 'Feature-based vs layer-based org, typed errors', 'Medium: DP easy-medium', 'Organize Project 1 into feature modules'),

  // Days 36-37: Auth
  makeDay(36, 'core-backend', 'Phase 2: Core Backend', '§11 Validation & Auth',
    'Validation, JWT, sessions, password hashing',
    'Implement auth system',
    'Schema validation, DTOs, sanitization, trust boundaries', 'Add Zod/Joi validation to Project 1 routes', 'Review: Request lifecycle, project structure', 'Password hashing (bcrypt), JWT, access/refresh tokens', 'Medium: Tree traversal problems', 'Add user registration & login to Project 1'),
  makeDay(37, 'core-backend', 'Phase 2: Core Backend', '§11 Authorization & OAuth',
    'RBAC, authorization, OAuth 2.0, OIDC',
    'Build role-based access control',
    'RBAC, permissions, ownership checks, BOLA/IDOR', 'Add role-based middleware & resource authorization', 'Review: JWT, sessions, password hashing', 'OAuth 2.0 flows, OIDC, PKCE, scopes', 'Medium: Graph BFS/DFS problems', 'Add RBAC to Project 1 endpoints'),

  // Days 38-40: PostgreSQL
  makeDay(38, 'core-backend', 'Phase 2: Core Backend', '§12 PostgreSQL Foundations',
    'Tables, keys, constraints, normalization, SQL basics',
    'Design schemas, write queries',
    'Tables, primary/foreign keys, constraints, normalization', 'Design a normalized schema for Project 1', 'Review: Auth, RBAC, JWT', 'SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY', 'Medium: DP problems', 'Install PostgreSQL, create Project 1 database'),
  makeDay(39, 'core-backend', 'Phase 2: Core Backend', '§12 SQL Deep Dive',
    'Joins, CTEs, window functions, views',
    'Write complex queries',
    'JOINs (inner, left, right, full), subqueries, CTEs', 'Write 20 complex SQL queries with joins & CTEs', 'Review: Schema design, normalization', 'Window functions, aggregates, views, set operations', 'Medium: Heap / priority queue problems', 'Add complex queries to Project 1 repos'),
  makeDay(40, 'core-backend', 'Phase 2: Core Backend', '§12 PostgreSQL Performance',
    'Indexes, EXPLAIN, transactions, MVCC',
    'Analyze query plans, add indexes',
    'B-tree indexes, composite, partial, covering indexes', 'Run EXPLAIN ANALYZE, add indexes, measure improvement', 'Review: SQL joins, CTEs, window functions', 'ACID, isolation levels, MVCC, locks, deadlocks', 'Medium: Backtracking problems', 'Optimize Project 1 queries with indexes'),

  // Days 41-43: Data Access
  makeDay(41, 'core-backend', 'Phase 2: Core Backend', '§13 Node DB Integration',
    'Connection pooling, parameterized queries, ORMs',
    'Connect Node to PostgreSQL',
    'Connection lifecycle, pool config, SQL injection prevention', 'Connect Project 1 to PostgreSQL with pg/pool', 'Review: Indexes, EXPLAIN, transactions', 'Repository patterns, ORM vs query builder vs raw SQL', 'Medium: Trie problems', 'Add database layer to Project 1'),
  makeDay(42, 'core-backend', 'Phase 2: Core Backend', '§13 ORM & Migrations',
    'Prisma/Drizzle, schemas, migrations, relations',
    'Set up ORM with migrations',
    'Prisma/Drizzle: schema, models, migrations, relations', 'Set up Prisma, create migrations, define relations', 'Review: Connection pooling, parameterized queries', 'Eager/lazy loading, generated types, hidden N+1', 'Medium: Binary search variants', 'Migrate Project 1 to Prisma/Drizzle'),
  makeDay(43, 'core-backend', 'Phase 2: Core Backend', '§13 Data Consistency',
    'Optimistic locking, idempotent writes, outbox pattern',
    'Implement transaction boundaries',
    'Constraints, atomic updates, optimistic locking', 'Implement transaction boundaries in Project 1', 'Review: ORM, migrations, eager/lazy loading', 'Idempotent writes, race conditions, outbox pattern', 'Medium: Graph shortest path problems', 'Add transaction logic to Project 1 orders'),

  // Days 44-45: Redis & Caching
  makeDay(44, 'core-backend', 'Phase 2: Core Backend', '§14 Caching & Redis',
    'Cache strategies, Redis data structures',
    'Add Redis to your project',
    'Cache-aside, read/write-through, TTL, eviction', 'Install Redis, practice SET/GET/HSET/LPUSH/ZADD', 'Review: Data consistency, transactions', 'Redis: strings, hashes, lists, sets, sorted sets, pub/sub', 'Medium: Greedy problems', 'Add Redis connection to Project 1'),
  makeDay(45, 'core-backend', 'Phase 2: Core Backend', '§14 Cache Correctness',
    'Invalidation, stampede, consistency trade-offs',
    'Implement caching layer',
    'Invalidation, stale data, stampede, thundering herd', 'Add cache-aside caching to Project 1 API responses', 'Review: Redis data structures, TTL', 'API caching, session storage, rate limiting with Redis', 'Medium: Interval problems', 'Add rate limiting with Redis to Project 1'),

  // Days 46-47: Queues
  makeDay(46, 'core-backend', 'Phase 2: Core Backend', '§15 Background Jobs & Queues',
    'Producers/consumers, retries, dead-letter queues',
    'Set up BullMQ job processing',
    'Why background processing, task lifecycle, retries', 'Set up BullMQ with Redis, create producer/consumer', 'Review: Redis caching, invalidation', 'At-least-once, idempotency keys, dead-letter queues', 'Medium: DP medium problems', 'Add background email job to Project 1'),
  makeDay(47, 'core-backend', 'Phase 2: Core Backend', '§15 Message Brokers & Events',
    'Queue vs pub/sub, Kafka concepts, saga pattern',
    'Implement event-driven processing',
    'Queue vs pub/sub vs event log, Kafka concepts', 'Build event-driven processing with Redis pub/sub', 'Review: BullMQ, retries, dead-letter queues', 'Saga pattern, transactional outbox, eventual consistency', 'Medium: Bit manipulation problems', 'Add event-driven notifications to Project 1'),

  // Days 48-49: WebSockets & Real-Time
  makeDay(48, 'core-backend', 'Phase 2: Core Backend', '§16 Search & WebSockets',
    'Full-text search, WebSocket protocol, rooms',
    'Build real-time chat (Project 3)',
    'Full-text search, PostgreSQL FTS, Elasticsearch basics', 'Add PostgreSQL full-text search to Project 1', 'Review: Message brokers, event-driven patterns', 'WebSocket handshake, frames, lifecycle, auth', 'Medium: Tree depth/height problems', 'Start Project 3: WebSocket server setup'),
  makeDay(49, 'core-backend', 'Phase 2: Core Backend', '§16 Real-Time Architecture',
    'Presence, broadcast, reconnect, horizontal scaling',
    'Build rooms, presence, reconnect logic',
    'Rooms, channels, presence, broadcast, heartbeat', 'Build chat rooms with presence & reconnect in Project 3', 'Review: Full-text search, WebSocket protocol', 'Horizontal scaling, Redis pub/sub backplane', 'Medium: Graph cycle detection', 'Add Redis pub/sub backplane to Project 3'),

  // Days 50-51: Error Handling & Reliability
  makeDay(50, 'core-backend', 'Phase 2: Core Backend', '§17 Errors & Reliability',
    'Error taxonomy, central error handler, circuit breakers',
    'Implement error handling system',
    'Programmer vs operational errors, typed/custom errors', 'Build central error handler with typed errors', 'Review: WebSocket architecture, scaling', 'Retries, exponential backoff, circuit breaker, bulkhead', 'Medium: String DP problems', 'Add typed error classes to Project 1'),
  makeDay(51, 'core-backend', 'Phase 2: Core Backend', '§17 Resilience & Graceful Lifecycle',
    'Health checks, graceful shutdown, load shedding',
    'Add graceful shutdown to your apps',
    'Health checks, readiness vs liveness, dependency health', 'Add health endpoint & graceful shutdown to Project 1', 'Review: Error handling, retries, circuit breaker', 'SIGTERM handling, drain requests, close pools', 'Medium: Sliding window medium', 'Add health checks to all projects'),

  // Days 52-53: Config & Security
  makeDay(52, 'core-backend', 'Phase 2: Core Backend', '§18 Config & §19 Security',
    'Environment management, 12-factor, threat modeling',
    'Secure your application',
    'Env-specific config, validation, feature flags, 12-factor', 'Set up config validation with fail-fast startup', 'Review: Graceful shutdown, health checks', 'Threat modeling, SQL injection, XSS, CSRF, SSRF', 'Medium: Two pointers medium', 'Add config validation & .env management'),
  makeDay(53, 'core-backend', 'Phase 2: Core Backend', '§19 Security Deep Dive',
    'API security, data protection, security headers',
    'Security audit your project',
    'BOLA/IDOR, JWT pitfalls, session fixation, CORS traps', 'Audit Project 1 for OWASP vulnerabilities', 'Review: Config management, secrets', 'Helmet, CSP, rate limiting, dependency scanning', 'Medium: Hash map medium', 'Add Helmet & security hardening to Project 1'),

  // Days 54-55: Review
  makeDay(54, 'core-backend', 'Phase 2: Core Backend', 'Phase 2 Review',
    'Re-read weakest backend topics',
    'Polish Project 1',
    'Review weak areas from Phase 2', 'Fix bugs, add missing error handling in Project 1', 'Review: Security, config management', 'Review: PostgreSQL, Redis, auth deep spots', 'Mixed: 5 medium problems', 'Add tests to Project 1'),
  makeDay(55, 'core-backend', 'Phase 2: Core Backend', 'Phase 2 Final Review',
    'Explain the full request lifecycle aloud',
    'Finish & deploy Project 1',
    'Trace full request lifecycle from memory', 'Write final tests, Dockerize Project 1', 'Review: All Phase 2 flashcards', 'Review: Express architecture, DB, caching, queues', 'Mixed: 5 medium problems (timed)', 'Phase 2 checkpoint: Project 1 complete'),
];

// ─── Phase 3: Production, DevOps & System Design (Days 56–80) ─

const phase3: StudyDay[] = [
  // Days 56-57: Observability
  makeDay(56, 'production-devops', 'Phase 3: Production & DevOps', '§20 Logging & Observability',
    'Structured logs, metrics, traces, correlation IDs',
    'Add logging & tracing',
    'Three pillars: logs, metrics, traces, correlation IDs', 'Add Pino structured logging to Project 1', 'Review: Phase 2 weak spots', 'Latency percentiles, RED/USE methods, SLI/SLO/SLA', 'Medium: Tree/graph medium', 'Add request-id tracing to Project 1'),
  makeDay(57, 'production-devops', 'Phase 3: Production & DevOps', '§20 Node Diagnostics',
    'Pino, profiling, event-loop lag, OpenTelemetry',
    'Profile and diagnose Node.js app',
    'Pino/Winston, log levels, JSON logs, profiling', 'Profile Project 1: CPU, memory, event-loop lag', 'Review: Structured logging, metrics', 'OpenTelemetry basics, health endpoints, incident response', 'Medium: DP medium', 'Add health endpoints & metrics to Project 1'),

  // Days 58-59: Performance & Scaling
  makeDay(58, 'production-devops', 'Phase 3: Production & DevOps', '§21 Performance & Concurrency',
    'Load testing, profiling, bottleneck identification',
    'Load test your API',
    'Latency vs throughput, percentiles, load testing', 'Run autocannon/k6 against Project 1, find bottlenecks', 'Review: Node diagnostics, OpenTelemetry', 'Node concurrency, worker_threads, cluster, race conditions', 'Medium: Backtracking medium', 'Optimize Project 1 based on load test results'),
  makeDay(59, 'production-devops', 'Phase 3: Production & DevOps', '§21 Scaling & Distributed Systems',
    'Horizontal scaling, CAP theorem, consistency models',
    'Design for scale',
    'N+1, indexes, pooling, caching, compression, pagination', 'Optimize DB queries, add compression & streaming', 'Review: Load testing, concurrency', 'Vertical vs horizontal scaling, CAP, distributed systems', 'Medium: Union-find problems', 'Document scaling strategy for Project 1'),

  // Days 60-61: Testing
  makeDay(60, 'production-devops', 'Phase 3: Production & DevOps', '§22 Testing & Quality',
    'Unit, integration, API tests, mocking',
    'Write tests for Project 1',
    'Test levels, arrange-act-assert, mocks/stubs/fakes', 'Write 15 unit tests for Project 1 services', 'Review: Scaling, distributed systems basics', 'Jest, Supertest, test containers, TDD basics', 'Medium: Greedy medium', 'Add integration tests for API endpoints'),
  makeDay(61, 'production-devops', 'Phase 3: Production & DevOps', '§22 Testing Deep Dive',
    'Test isolation, coverage, linting, static analysis',
    'Reach 80%+ test coverage',
    'Test isolation, deterministic tests, coverage limits', 'Write 15+ more tests, add coverage reporting', 'Review: Testing fundamentals, mocking', 'Linting (ESLint), formatting (Prettier), type checking', 'Medium: Interval medium', 'Set up ESLint + Prettier + coverage in Project 1'),

  // Days 62-64: Docker
  makeDay(62, 'production-devops', 'Phase 3: Production & DevOps', '§23 Docker Fundamentals',
    'Containers vs VMs, images, layers, registries',
    'Write your first Dockerfile',
    'Containers vs VMs, namespaces, cgroups, image lifecycle', 'Write a Dockerfile for Project 1', 'Review: Testing, coverage, linting', 'Dockerfile: COPY, RUN, CMD vs ENTRYPOINT, ports, volumes', 'Medium: Tree medium', 'Build & run Project 1 in Docker'),
  makeDay(63, 'production-devops', 'Phase 3: Production & DevOps', '§23 Production Containers',
    'Multi-stage builds, security, health checks',
    'Optimize Docker image',
    'Multi-stage builds, small base images, non-root user', 'Optimize Project 1 Dockerfile (multi-stage, slim)', 'Review: Docker fundamentals, Dockerfile', 'Health checks in Docker, image scanning, signal handling', 'Medium: Graph medium', 'Reduce Project 1 Docker image size'),
  makeDay(64, 'production-devops', 'Phase 3: Production & DevOps', '§23 Docker Compose & Orchestration',
    'Compose, multi-service, Kubernetes awareness',
    'Write docker-compose.yml',
    'Docker Compose: services, networks, volumes, depends_on', 'Write docker-compose.yml with API + PostgreSQL + Redis', 'Review: Production containers, multi-stage builds', 'Kubernetes awareness: pods, deployments, services, ingress', 'Medium: DP medium', 'Full docker-compose dev environment for Project 1'),

  // Days 65-66: CI/CD
  makeDay(65, 'production-devops', 'Phase 3: Production & DevOps', '§24 CI/CD & Release',
    'Pipeline stages, GitHub Actions, deployment strategies',
    'Build CI pipeline',
    'Pipeline: checkout, install, lint, type-check, test, build', 'Create GitHub Actions workflow for Project 1', 'Review: Docker Compose, Kubernetes awareness', 'Rolling, blue-green, canary releases, rollback', 'Medium: String medium', 'Add CI pipeline (lint + test + build + Docker push)'),
  makeDay(66, 'production-devops', 'Phase 3: Production & DevOps', '§24 Pipeline Security & Tools',
    'Secrets in CI, scanning, artifact retention',
    'Secure your pipeline',
    'Secrets in CI, least-privilege tokens, dependency scanning', 'Add security scanning to CI pipeline', 'Review: CI/CD pipeline, deployment strategies', 'Workflow YAML, jobs, steps, runners, environment protection', 'Medium: Heap medium', 'Add deployment step to CI pipeline'),

  // Days 67-69: AWS
  makeDay(67, 'production-devops', 'Phase 3: Production & DevOps', '§25 AWS Cloud Fundamentals',
    'Regions, IAM, VPC, EC2',
    'Set up AWS free tier',
    'Regions, availability zones, IAM, least privilege', 'Create AWS free-tier account, set up IAM', 'Review: CI/CD pipeline security', 'EC2, security groups, VPC, public/private subnets', 'Medium: Binary search medium', 'Explore AWS console, launch EC2 instance'),
  makeDay(68, 'production-devops', 'Phase 3: Production & DevOps', '§25 Storage & Databases',
    'S3, RDS, Route 53, load balancers',
    'Deploy database on AWS',
    'S3 buckets, object lifecycle, RDS PostgreSQL', 'Set up RDS PostgreSQL, S3 bucket', 'Review: AWS fundamentals, IAM, VPC', 'Route 53, load balancers, managed DB connectivity', 'Medium: Sorting algorithm problems', 'Connect Project 1 to RDS'),
  makeDay(69, 'production-devops', 'Phase 3: Production & DevOps', '§25 Deployment & Serverless',
    'CloudWatch, autoscaling, Lambda, API Gateway',
    'Deploy app to AWS',
    'CloudWatch logs, autoscaling, health checks, TLS certs', 'Deploy Project 1 to EC2 with Docker', 'Review: S3, RDS, Route 53', 'Lambda, API Gateway, cold starts, execution limits', 'Medium: Graph shortest path', 'Full AWS deployment of Project 1'),

  // Days 70-73: System Design
  makeDay(70, 'production-devops', 'Phase 3: Production & DevOps', '§26 System Design — Basics',
    'Requirements, estimation, building blocks',
    'Design systems on paper',
    'Functional vs non-functional reqs, traffic estimation', 'Design a URL shortener (full design session)', 'Review: AWS deployment, serverless', 'Core blocks: API gateway, LB, DB, cache, CDN, queue', 'Medium: DP medium', 'Document Project 1 architecture diagram'),
  makeDay(71, 'production-devops', 'Phase 3: Production & DevOps', '§26 System Design — Data & Scale',
    'SQL vs NoSQL, sharding, replication, caching',
    '2 system design practice sessions',
    'SQL vs NoSQL, indexing, replication, sharding', 'Design a rate limiter + notification service', 'Review: System design basics, estimation', 'Cache strategy, consistency, data lifecycle', 'Medium: Trie / string matching', 'Update Project 1 with design documentation'),
  makeDay(72, 'production-devops', 'Phase 3: Production & DevOps', '§26 System Design — Reliability',
    'SPOFs, redundancy, failover, trade-offs',
    '2 system design practice sessions',
    'Single points of failure, redundancy, failover', 'Design a chat/messaging system + file upload service', 'Review: Data scaling, sharding', 'Cost, operational complexity, graceful degradation', 'Medium: Advanced graph problems', 'Practice explaining designs aloud (record yourself)'),
  makeDay(73, 'production-devops', 'Phase 3: Production & DevOps', '§26 System Design — Practice',
    'Full design sessions with all concepts',
    '2 full timed design sessions',
    'Design a news feed system (45-min timed session)', 'Design an e-commerce order workflow (45-min timed)', 'Review: Reliability, trade-offs', 'Design a job processing platform (review)', 'Medium: Mixed hard problems', 'Compile system design cheat sheet'),

  // Days 74-78: Projects
  makeDay(74, 'production-devops', 'Phase 3: Production & DevOps', '§27 Project 2 — E-commerce',
    'Products, inventory, carts, orders, transactions',
    'Build e-commerce backend',
    'E-commerce domain: products, carts, orders, payments', 'Scaffold Project 2: schema, routes, controllers', 'Review: System design patterns', 'Transaction boundaries, idempotent checkout', 'Medium: DP medium', 'Project 2: Product & cart CRUD'),
  makeDay(75, 'production-devops', 'Phase 3: Production & DevOps', '§27 Project 2 — Checkout & Audit',
    'Payment integration, audit trail, background jobs',
    'Build checkout flow',
    'Payment-provider integration concepts, idempotency', 'Implement checkout with transaction boundaries', 'Review: E-commerce domain modeling', 'Background email, audit trail, order lifecycle', 'Medium: Advanced DP', 'Project 2: Checkout + audit trail'),
  makeDay(76, 'production-devops', 'Phase 3: Production & DevOps', '§27 Project 3 — Real-Time',
    'WebSocket auth, rooms, persistence, reconnect',
    'Polish real-time chat app',
    'Review & refine Project 3 WebSocket architecture', 'Add message persistence & reconnect strategy', 'Review: E-commerce checkout flow', 'Redis pub/sub scaling, connection scaling', 'Medium: Tree hard', 'Project 3: Complete with integration tests'),
  makeDay(77, 'production-devops', 'Phase 3: Production & DevOps', '§27 Project 4 — Async Processing',
    'Queue producer/consumer, retries, DLQ, metrics',
    'Build async processing platform',
    'Queue architecture, producer/consumer pattern', 'Build Project 4: queue with retries & dead-letter', 'Review: Real-time architecture', 'Backoff, idempotent worker, scheduled jobs, metrics', 'Medium: Graph hard', 'Project 4: Worker with retry & DLQ'),
  makeDay(78, 'production-devops', 'Phase 3: Production & DevOps', '§27 Project Delivery',
    'READMEs, architecture diagrams, ER diagrams',
    'Document all projects',
    'Project delivery checklist review', 'Add READMEs, arch diagrams, ER diagrams to all projects', 'Review: Async processing patterns', 'OpenAPI specs, Docker Compose, CI, deployment docs', 'Medium: Mixed medium-hard', 'Complete all project documentation'),

  // Days 79-80: Review
  makeDay(79, 'production-devops', 'Phase 3: Production & DevOps', 'Phase 3 Review',
    'Re-read weakest production/DevOps topics',
    'Practice system design explanations',
    'Review weak areas: Docker, CI/CD, AWS', 'Do 2 timed system design sessions', 'Review: All Phase 3 flashcards', 'Review: Testing, observability, security', 'Mixed: 5 medium-hard problems', 'Polish all 4 projects with final tweaks'),
  makeDay(80, 'production-devops', 'Phase 3: Production & DevOps', 'Phase 3 Final Review',
    'Full stack review — can you explain everything?',
    'Final project polish',
    'Explain Docker, CI/CD, AWS deployment aloud', 'Ensure all 4 projects have: tests, Docker, CI, README', 'Review: System design patterns', 'Run through all system design topics', 'Mixed: 5 medium-hard (timed 45 min)', 'Phase 3 checkpoint: all projects complete & documented'),
];

// ─── Phase 4: Interview Prep (Days 81–90) ────────────────────

const phase4: StudyDay[] = [
  makeDay(81, 'interview-prep', 'Phase 4: Interview Prep', '§28 Language & Runtime Questions',
    'JS output prediction, closures, event loop, promises',
    'Drill JS tricky questions',
    'JS output prediction drills, scope puzzles', 'Solve 20 JS output prediction questions', 'Review: Closures, this, prototypes', 'Event loop tracing, promise order, microtask quiz', 'Medium-Hard: 4 problems (timed)', 'Compile JS cheat sheet of gotchas'),
  makeDay(82, 'interview-prep', 'Phase 4: Interview Prep', '§28 TypeScript & Node Questions',
    'TS typing challenges, Node internals',
    'Practice explaining with code',
    'TypeScript advanced typing challenges', 'Solve 15 TS type challenges (type-challenges repo)', 'Review: JS output prediction', 'Node internals: event loop phases, libuv, V8', 'Medium-Hard: 4 problems (timed)', 'Write Node.js internals explainer document'),
  makeDay(83, 'interview-prep', 'Phase 4: Interview Prep', '§28 Backend & API Questions',
    'HTTP lifecycle, REST, middleware, validation',
    'Mock interview practice',
    'HTTP lifecycle, REST semantics, middleware order', 'Mock interview: explain middleware, REST, validation', 'Review: TS typing, Node internals', 'Auth vs authz, cookies vs tokens, CORS, idempotency', 'Medium-Hard: 4 problems (timed)', 'Create backend interview answer sheet'),
  makeDay(84, 'interview-prep', 'Phase 4: Interview Prep', '§28 Backend Questions Deep Dive',
    'Error handling, CORS edge cases, security',
    'Scenario-based questioning',
    'Error handling strategies, CORS deep scenarios', 'Practice scenario-based backend questions', 'Review: HTTP, REST, middleware', 'Security questions, JWT pitfalls, session management', 'Medium-Hard: 4 problems (timed)', 'Compile FAQ answers for common questions'),
  makeDay(85, 'interview-prep', 'Phase 4: Interview Prep', '§28 Database Questions',
    'Joins, indexes, query plans, transactions, isolation',
    'SQL puzzle practice',
    'Joins deep dive, indexes, EXPLAIN plans', 'Practice 20 SQL interview questions', 'Review: Backend & API questions', 'Transactions, isolation, locks, normalization, N+1', 'Medium-Hard: 4 problems (timed)', 'Write database knowledge cheat sheet'),
  makeDay(86, 'interview-prep', 'Phase 4: Interview Prep', '§28 Production & System Questions',
    'Logging vs metrics vs traces, Docker, CI/CD, AWS',
    'Operational scenario drills',
    'Logging vs metrics vs traces, graceful shutdown', 'Practice explaining operational scenarios', 'Review: Database questions', 'Docker, CI/CD, AWS deployment, Linux troubleshooting', 'Medium-Hard: 4 problems (timed)', 'Write production operations cheat sheet'),
  makeDay(87, 'interview-prep', 'Phase 4: Interview Prep', 'System Design Mock #1',
    'Full 45-min system design practice',
    'Timed system design session',
    'Design a URL shortener + chat system (45 min each)', 'Record yourself designing, review recording', 'Review: Production & system questions', 'Review building blocks and estimation techniques', 'Hard: 3 problems (timed)', 'Refine system design approach template'),
  makeDay(88, 'interview-prep', 'Phase 4: Interview Prep', 'System Design Mock #2',
    'Full 45-min system design practice',
    'Timed system design session',
    'Design a notification service + e-commerce (45 min each)', 'Record yourself, compare with Day 87 recording', 'Review: System design mock #1 notes', 'Review trade-offs, CAP, consistency patterns', 'Hard: 3 problems (timed)', 'Finalize system design cheat sheet'),
  makeDay(89, 'interview-prep', 'Phase 4: Interview Prep', 'DSA Final Push',
    'Solve under timed conditions, mixed categories',
    'Timed problem solving marathon',
    'Review all DSA patterns: two pointers, sliding window, DP', 'Solve 8–10 medium problems under timed conditions', 'Review: System design mock #2 notes', 'Review: Trees, graphs, DP, greedy patterns', 'Hard: 4 problems (strictly timed)', 'Final DSA strategy document'),
  makeDay(90, 'interview-prep', 'Phase 4: Interview Prep', 'Full Mock Interview Day',
    'Complete simulated interview day',
    'Full mock interview simulation',
    'AM: Solve 2 DSA problems (45 min)', 'PM: Full system design session (45 min)', 'Review: All flashcards one last time', 'Evening: Behavioral + project walkthrough practice', 'Final: 2 hard problems', 'Celebrate! Review everything you built 🎉'),
];

// ─── Export All Days ─────────────────────────────────────────

export const STUDY_PLAN: StudyDay[] = [
  ...phase1,
  ...phase2,
  ...phase3,
  ...phase4,
];

export function getDayByNumber(day: number): StudyDay | undefined {
  return STUDY_PLAN.find(d => d.day === day);
}

export function getDaysByPhase(phase: Phase): StudyDay[] {
  return STUDY_PLAN.filter(d => d.phase === phase);
}

export function getPhaseInfo(phase: Phase) {
  const mapping = {
    'foundations': { label: 'Phase 1: Foundations', days: '1–25', color: '#6C5CE7' },
    'core-backend': { label: 'Phase 2: Core Backend', days: '26–55', color: '#00CEC9' },
    'production-devops': { label: 'Phase 3: Production & DevOps', days: '56–80', color: '#FDCB6E' },
    'interview-prep': { label: 'Phase 4: Interview Prep', days: '81–90', color: '#FF7675' },
  };
  return mapping[phase];
}
