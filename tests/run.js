import assert from "node:assert";
import { liveIn, liveUnion, widestOf } from "../liveness.js";
import { step, close } from "../liverun.js";
import { render } from "../app.js";

const base = {
  budget: 1,
  state: { stmts: [], live: [], runs: 0, ledger: [], applied: [] },
  events: [{ id: 1, kind: "stmt", at: 1, defs: ["x"], uses: ["a"] }],
  bad_at_code: "E_BAD_AT", bad_names_code: "E_BAD_NAMES",
  dup_code: "E_DUP_AT", empty_code: "E_EMPTY",
  event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("liveIn returns a list", () => {
  assert.ok(Array.isArray(liveIn(["a"], ["x"], ["x"])));
});

check("liveUnion returns a list", () => {
  assert.ok(Array.isArray(liveUnion(["a"], ["b"])));
});

check("widestOf returns a number", () => {
  assert.strictEqual(typeof widestOf([[1, ["a"]]]), "number");
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
