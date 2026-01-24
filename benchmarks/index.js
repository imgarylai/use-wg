/* eslint-disable no-undef */
/**
 * Performance benchmark for use-wg
 *
 * Run with: npm run benchmark
 */

import { toWadeGiles } from "../dist/index.mjs";

const ITERATIONS = 10000;

const testCases = [
  { name: "Short (2 chars)", input: "台灣" },
  { name: "Medium (8 chars)", input: "這是一個測試句子" },
  { name: "Long (11 chars)", input: "台北市信義區忠孝東路四段" },
  { name: "Mixed text", input: "Hello 世界! This is a test 測試" },
  { name: "With numbers", input: "2024年台灣之旅" },
];

const urlSafeTestCases = [
  { name: "URL-safe short", input: "台灣", options: { urlSafe: true } },
  {
    name: "URL-safe mixed",
    input: "My 台灣 Trip 2024年",
    options: { urlSafe: true },
  },
];

function runBenchmark(name, input, options = {}) {
  // Warmup
  for (let i = 0; i < 100; i++) {
    toWadeGiles(input, options);
  }

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    toWadeGiles(input, options);
  }
  const end = performance.now();

  const totalMs = end - start;
  const avgMs = totalMs / ITERATIONS;
  const opsPerSec = Math.round(1000 / avgMs);

  return { name, input, totalMs, avgMs, opsPerSec };
}

function formatResults(results) {
  console.log("\n## use-wg Performance Benchmark\n");
  console.log(`Iterations per test: ${ITERATIONS.toLocaleString()}\n`);

  console.log("| Test | Input | Avg (ms) | Ops/sec |");
  console.log("|------|-------|----------|---------|");

  for (const r of results) {
    const inputDisplay =
      r.input.length > 28 ? r.input.slice(0, 25) + "..." : r.input;
    console.log(
      `| ${r.name} | \`${inputDisplay}\` | ${r.avgMs.toFixed(4)} | ${r.opsPerSec.toLocaleString()} |`,
    );
  }

  // Summary statistics
  const avgOps = Math.round(
    results.reduce((sum, r) => sum + r.opsPerSec, 0) / results.length,
  );
  console.log(`\n**Average: ${avgOps.toLocaleString()} ops/sec**\n`);
}

// Run benchmarks
console.log("Running benchmarks...\n");

const results = [];

for (const tc of testCases) {
  const result = runBenchmark(tc.name, tc.input, tc.options);
  results.push(result);
  process.stdout.write(".");
}

for (const tc of urlSafeTestCases) {
  const result = runBenchmark(tc.name, tc.input, tc.options);
  results.push(result);
  process.stdout.write(".");
}

formatResults(results);
