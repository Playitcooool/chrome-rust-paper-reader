import test from "node:test";
import assert from "node:assert/strict";

function summarizeImportResult(result, path) {
  const imported = result.imported?.length || 0;
  const duplicate = (result.duplicates || []).find((entry) => entry.path === path);
  const failed = (result.failed || []).find((entry) => entry.path === path);

  if (failed) return { status: "failed", message: failed.message || "Import failed." };
  if (duplicate) return { status: "duplicate", message: duplicate.message || "Duplicate item." };
  if (imported > 0) return { status: "imported", message: `Imported ${imported} file.` };
  return { status: "unknown", message: "Import finished with no matching result." };
}

test("summarizeImportResult reports duplicate for matching path", () => {
  const result = summarizeImportResult(
    {
      imported: [],
      duplicates: [{ path: "/tmp/example.pdf", message: "Already imported" }],
      failed: []
    },
    "/tmp/example.pdf"
  );

  assert.equal(result.status, "duplicate");
});

test("summarizeImportResult reports failure before imported count", () => {
  const result = summarizeImportResult(
    {
      imported: [{ id: 1 }],
      duplicates: [],
      failed: [{ path: "/tmp/example.pdf", message: "collection missing" }]
    },
    "/tmp/example.pdf"
  );

  assert.equal(result.status, "failed");
  assert.equal(result.message, "collection missing");
});
