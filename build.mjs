#!/usr/bin/env node
// Markdown(SSoT) -> dashboard/data.json 変換スクリプト（Node 標準モジュールのみ・依存ゼロ）
// 使い方: node build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(ROOT, "dashboard");

// 種目名の表記ゆれ正規化（routines.md の正規化マップ準拠）
const ALIAS = {
  "ベントオーバーロウ": "ベントオーバーロー",
  "ベントローイング": "ベントオーバーロー",
  "ベントロー": "ベントオーバーロー",
  "ネガティブ懸垂": "ネガティヴ懸垂",
  "RDL": "ルーマニアンデッドリフト",
};
const canon = (name) => ALIAS[name] || name;

// --- 最小 frontmatter パーサ ---
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    let val = mm[2].trim();
    if (val === "") { fm[key] = null; continue; }
    if (val.startsWith("[") && val.endsWith("]")) {
      fm[key] = val.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
      continue;
    }
    if (/^-?\d+(\.\d+)?$/.test(val)) { fm[key] = Number(val); continue; }
    if (val === "true" || val === "false") { fm[key] = val === "true"; continue; }
    fm[key] = val.replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2] };
}

// --- セッション本文から種目・セットを抽出 ---
function parseSessionBody(body) {
  const exercises = [];
  let cur = null;
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    const h = line.match(/^###\s+(.+?)\s*$/);
    if (h) {
      cur = { name: canon(h[1]), sets: [] };
      exercises.push(cur);
      continue;
    }
    if (!cur) continue;
    // - セット1: 36kg × 11回  /  - セット1: 自重 × 7回
    const s = line.match(/^[-*]\s*セット\s*\d+\s*[:：]\s*(自重|[\d.]+\s*kg)\s*[×x]\s*(\d+)\s*回/);
    if (s) {
      const bw = /自重/.test(s[1]);
      cur.sets.push({
        bodyweight: bw,
        weight: bw ? null : Number(s[1].replace(/\s*kg/, "")),
        reps: Number(s[2]),
      });
    }
  }
  // 種目ごとの集計
  for (const ex of exercises) {
    ex.topWeight = ex.sets.reduce((m, s) => (s.weight != null && s.weight > m ? s.weight : m), 0);
    ex.totalReps = ex.sets.reduce((a, s) => a + s.reps, 0);
    ex.volume = ex.sets.reduce((a, s) => a + (s.weight != null ? s.weight * s.reps : 0), 0);
    ex.bodyweight = ex.sets.length > 0 && ex.sets.every((s) => s.bodyweight);
  }
  return exercises.filter((e) => e.sets.length > 0);
}

function readDir(dir) {
  try { return readdirSync(join(ROOT, dir)); } catch { return []; }
}

// --- sessions ---
const sessions = [];
for (const f of readDir("sessions")) {
  if (!f.endsWith(".md") || f === "README.md") continue;
  const { fm, body } = parseFrontmatter(readFileSync(join(ROOT, "sessions", f), "utf8"));
  if (fm.type !== "training-session") continue;
  sessions.push({
    file: f,
    date: fm.date,
    weekday: fm.weekday ?? null,
    routine: fm.routine ?? null,
    condition: fm.condition ?? null,
    mood: fm.mood ?? null,
    total_volume_kg: fm.total_volume_kg ?? 0,
    status: fm.status ?? null,
    exercises: parseSessionBody(body),
  });
}
sessions.sort((a, b) => String(a.date).localeCompare(String(b.date)));

// --- exercises (種目マスタ) ---
const exercises = [];
for (const f of readDir("exercises")) {
  if (!f.endsWith(".md") || f === "README.md" || f.startsWith("_template")) continue;
  const { fm } = parseFrontmatter(readFileSync(join(ROOT, "exercises", f), "utf8"));
  if (fm.type !== "training-exercise") continue;
  exercises.push({
    name: fm.exercise_name ?? basename(f, ".md"),
    body_part: fm.body_part ?? "その他",
    body_part_detail: fm.body_part_detail ?? null,
    secondary: fm.secondary ?? null,
    default_routine: fm.default_routine ?? null,
    bodyweight: fm.bodyweight ?? (fm.pr_weight === 0),
    pr_weight: fm.pr_weight ?? 0,
    pr_reps: fm.pr_reps ?? 0,
    pr_date: fm.pr_date ?? null,
  });
}

const data = {
  generatedAt: new Date().toISOString(),
  sessions,
  exercises,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "data.json"), JSON.stringify(data, null, 2));
console.log(`✅ dashboard/data.json 生成: sessions=${sessions.length}, exercises=${exercises.length}`);
