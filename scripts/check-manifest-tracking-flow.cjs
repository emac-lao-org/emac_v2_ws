const assert = require("assert");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(
  path.join(__dirname, "../components/manifest/tableManifest.vue"),
  "utf8"
);

for (const combination of [
  ["1", "1", "0"],
  ["1", "1", "1"],
  ["2", "2", "1"],
]) {
  const [wg, wt, wd] = combination;
  const pattern = new RegExp(
    `wg_stt: \\{ _eq: ${wg} \\}, wt_stt: \\{ _eq: ${wt} \\}, wd_stt: \\{ _eq: ${wd} \\}, wr_stt: \\{ _eq: 0 \\}`
  );
  assert.match(source, pattern, `Missing WS Tracking status ${wg}/${wt}/${wd}/0`);
}

console.log("WS manifest tracking flow check passed");
