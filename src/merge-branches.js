const { SOURCE_BRANCH, targetBranches } = require("./config/branches.js");
const askQuestion = require("./ask-user.js");
const shell = require("shelljs");
const path = require("path");

// Run git commands from the parent repo root (git-batcher lives inside the CRM repo)
shell.cd(path.resolve(__dirname, "../../"));
shell.config.fatal = false;

function run(cmd) {
  console.log(`  $ ${cmd}`);
  const result = shell.exec(cmd, { silent: false });
  return result;
}

async function mergeBranches() {
  if (!targetBranches.length) {
    console.log("No target branches configured. Edit src/config/branches.js");
    return;
  }

  console.log(`\n=== Branch Merge ===`);
  console.log(`Source: ${SOURCE_BRANCH}`);
  console.log(`Targets: ${targetBranches.map((t) => t.branch).join(", ")}\n`);

  // 1. Fetch all remote branches
  console.log("--- Fetching all remote branches ---");
  run("git fetch --all --prune");

  // 2. Make sure source branch is up to date
  console.log(`\n--- Updating ${SOURCE_BRANCH} ---`);
  run(`git checkout ${SOURCE_BRANCH}`);
  run(`git pull origin ${SOURCE_BRANCH}`);

  const sourceHash = shell.exec("git rev-parse --short HEAD", { silent: true }).stdout.trim();
  console.log(`  ${SOURCE_BRANCH} is at ${sourceHash}\n`);

  // 3. Merge into each target branch
  const results = [];

  for (const target of targetBranches) {
    console.log(`\n--- [${target.name}] Merging ${SOURCE_BRANCH} → ${target.branch} ---`);

    // Checkout the target branch (create tracking branch if it doesn't exist locally)
    const checkout = run(`git checkout ${target.branch}`);
    if (checkout.code !== 0) {
      // Try to create local tracking branch from remote
      const trackResult = run(`git checkout -b ${target.branch} origin/${target.branch}`);
      if (trackResult.code !== 0) {
        console.log(`  ⚠️  Branch ${target.branch} not found locally or remotely. Skipping.`);
        results.push({ name: target.name, branch: target.branch, status: "SKIPPED (branch not found)" });
        continue;
      }
    }

    // Pull latest
    run(`git pull origin ${target.branch}`);

    // Merge source branch
    const mergeResult = run(`git merge ${SOURCE_BRANCH}`);

    if (mergeResult.code !== 0) {
      console.log(`\n  ⚠️  CONFLICT in ${target.branch}!`);
      console.log(`  Resolve conflicts, then press Enter to continue (or type 'skip' to abort).`);
      const ans = await askQuestion("  > ");
      if (ans.toLowerCase() === "skip") {
        run("git merge --abort");
        results.push({ name: target.name, branch: target.branch, status: "SKIPPED (conflict)" });
        continue;
      }
    }

    // Push the merged branch
    const pushResult = run(`git push origin ${target.branch}`);
    if (pushResult.code === 0) {
      console.log(`  ✅ ${target.branch} updated and pushed.`);
      results.push({ name: target.name, branch: target.branch, status: "OK" });
    } else {
      console.log(`  ❌ Push failed for ${target.branch}.`);
      results.push({ name: target.name, branch: target.branch, status: "PUSH FAILED" });
    }
  }

  // 4. Return to source branch
  run(`git checkout ${SOURCE_BRANCH}`);

  // 5. Summary
  console.log("\n=== Summary ===");
  for (const r of results) {
    const icon = r.status === "OK" ? "✅" : "⚠️";
    console.log(`  ${icon} ${r.name} (${r.branch}): ${r.status}`);
  }
  console.log("");
}

mergeBranches();
