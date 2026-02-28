# Agent.md — KARL-30 SME Red-Team Audit (MVP)

## 1) Mission
Build a **single-page, serverless survey app** using **Vanilla HTML, CSS, and JavaScript only**.

- **No frameworks**
- **No build steps**
- Hosted on **GitHub Pages**
- Audience: **10–20 SME judges**
- This is an **MVP prototype** (a “glorified Google Form” with better branching + autosave)

Primary goals:
1. **No data loss** (autosave on every change; instant restore on reload)
2. **Strict logic gates** (cannot proceed unless required fields are complete)
3. **Clean, analysis-ready state** (explicit fields; consistent schema)
4. **Terminal/IDE vibe UI** (dark, high contrast, precise)

---

## 2) Files to generate
Generate these files at repo root:

- `index.html`
- `styles.css`
- `app.js`

No bundlers, no package.json, no tooling required.

---

## 3) Data structure (MVP dummy items)
In `app.js`, create a dummy items array for testing:

```javascript
const items = [
  { id: "I47", domain: "Extraversion", facet: "Activity Level", text: "Am always on the go." },
  { id: "I192", domain: "Extraversion", facet: "Assertiveness", text: "Keep in the background." },
  { id: "I28", domain: "Openness", facet: "Liberalism", text: "Tend to vote for liberal political candidates." }
];
```
*(We will replace with the full 30-item set later.)*

---

## 4) App state model (required)
Maintain a single `state` object and persist it to `localStorage` on **every** input change.

### 4.1 State shape (required)
```javascript
state = {
  version: 1,
  judge_token: null,        // from URL: ?t=...
  judge_id: "uuid",         // generated once per browser
  submission_id: "uuid",    // generated once per survey session
  current_index: 0,
  started_at: "ISO",
  updated_at: "ISO",
  general_comments: "",
  responses: {
    "I47": { ...per-item fields... },
    // ...
  }
}
```

### 4.2 Per-item fields (explicit, analysis-ready)
For each item id, store:

**Required for all items:**
* `tripwire_status`: `"Pass"` | `"Flag"` | `null`
* `forecast_detection`: integer `0–100` | `null` *(Prompt always: “Out of 100 typical SMEs, how many would flag this item?”)*

**Flag-only fields (nullable if Pass):**
* `rank_1_vector`: `"Proxy"` | `"State"` | `"Ambiguity"` | `"Fakability"` | `"Drift"` | `"Other"` | `null`
* `rank_2_vector`: same or `null`
* `rank_3_vector`: same or `null`

**Other-only details:**
* `other_parent_vector`: `"Proxy"` | `"State"` | `"Ambiguity"` | `"Fakability"` | `"Drift"` | `null`
* `other_text`: string | `null`

**Primary mechanism fields (only one family filled; others null based on rank_1_vector):**
* **Proxy:**
  * `proxy_source`: string | `null`
  * `proxy_mechanism`: string | `null`
  * `proxy_context`: string | `null`
* **State:**
  * `state_driver`: string | `null`
  * `state_timescale`: string | `null`
* **Ambiguity:**
  * `ambiguity_type`: string | `null`
* **Fakability:**
  * `fake_direction`: string | `null`
  * `fake_transparency`: string | `null`
* **Drift (taxonomy, NOT competitor facet):**
  * `drift_type`: string | `null`
  * `drift_domain`: string | `null`
  * `drift_context_class`: string | `null`

**Disposition + lethality (Flag-only):**
* `disposition`: `"Acceptable"` | `"Fatal"` | `null`
* `forecast_lethality`: integer `0–100` | `null`
* `witness_text`: string | `null` *(required if disposition = Fatal)*

---

## 5) localStorage behavior (CRITICAL)

### 5.1 Save rules
Persist `state` to `localStorage` on **every** change event (radio, slider, rank click, select, textarea).
Update `state.updated_at` each time you save.

### 5.2 Hydration rules
On page load:
1. Read `?t=` URL parameter into `state.judge_token` (store it).
2. If stored state exists in `localStorage`, hydrate and render immediately.
3. If none exists, initialize new state with fresh UUIDs and timestamps.

### 5.3 Clearing rules (IMPORTANT)
**Do NOT clear `localStorage` on submit in the MVP.**
In MVP: `console.log` the final payload and show it on screen; keep localStorage intact.
Provide a separate “Clear saved progress” button in the UI.
*(Later, when backend POST exists, we will clear only after a 200 OK).*

---

## 6) UI requirements (terminal/IDE vibe)
* Dark theme, high contrast, monospace font.
* Subtle green accents are allowed.
* Large click targets; strong focus outlines; keyboard-friendly.
* No flicker/glitch effects; no tiny text.
* Use CSS variables for palette (slate/zinc base + green accent).

---

## 7) Page layout (single page)

### 7.1 Core layout
* **Center panel:** item card + form controls.
* **Top:** progress indicator (e.g., `12 / 30`).
* **Bottom:** navigation buttons (`Previous`, `Next`).
* **Right drawer (collapsed by default):**
  * IPIP-style respondent preamble (static text placeholder).
  * KARL-30 list (placeholder list for now).
  * Vector definitions (placeholder).
  *(Drawer content can be minimal text for MVP).*

---

## 8) Per-item UI flow (strict gates)

### Step 0 — Tripwire (required)
Radio buttons:
* Pass (No vulnerability detected)
* Flag (Vulnerability detected)

### Step 1 — Detection forecast (required for ALL items)
Range slider `0–100` (step 1).
Prompt ALWAYS (constant): *"Out of 100 typical subject-matter experts, how many would flag this item?"*

**Gate:** `Next`/`Previous` must not advance forward unless `tripwire_status` is set AND `forecast_detection` is set.

### Logic Path Branching
* **If Pass:** Do NOT render Red-Team panel. Enable `Next` once Step 1 is complete.
* **If Flag:** Render Steps 2–5 below.

---

## 9) Red-Team panel (Flag only)

### Step 2 — Ranked failure vectors (rank-click mechanic)
Vectors: `Proxy`, `State`, `Ambiguity`, `Fakability`, `Drift`, `Other`.

**Mechanic:**
* Clicking an unranked vector assigns the next available rank: `1`, then `2`, then `3`.
* Max 3 ranked vectors.
* Clicking a ranked vector again clears it.
* **No auto-shift** (if rank 1 is cleared, ranks 2/3 do not automatically move down).
* If user tries to rank a 4th vector: Block and show message: *"Max 3 reached"*.

**Gate:** Rank 1 is required to proceed.

**Other Logic:** If `Other` is ranked (at any rank), render:
* dropdown `other_parent_vector` (required)
* short text `other_text` (required)

### Step 3 — Primary mechanism micro-panel (required)
Show ONLY the micro-panel for the **rank 1** vector. Use placeholder `<select>` tags in MVP with reasonable option stubs. IDs must map cleanly to the state fields.

* **Proxy micro-panel:** `proxy_source` | `proxy_mechanism` | `proxy_context`
* **State micro-panel:** `state_driver` | `state_timescale` (optional)
* **Ambiguity micro-panel:** `ambiguity_type`
* **Fakability micro-panel:** `fake_direction` | `fake_transparency`
* **Drift micro-panel (taxonomy only):**
  * `drift_type` (within-domain / cross-domain / non-trait-contextual)
  * If cross-domain: `drift_domain` select (A/C/E/N/O)
  * If non-trait: `drift_context_class` select (politics/ideology, institutional constraint, socioeconomic circumstance, other)

**Gate:** The required fields for the active primary panel must be selected before proceeding.

### Step 4 — Disposition + lethality (required)
* **Disposition radio:** `Acceptable Risk` | `Fatal Risk`
* **Lethality forecast slider (0–100, step 1):**
  * Prompt: *"Among experts who flag this item, how many would mark it Fatal risk?"*

**Gate:** Both Disposition and lethality slider are required.

### Step 5 — Witness (conditional requirement)
Textarea with character counter (Limit: 300 characters).
* **Required** if disposition = `Fatal`
* **Optional** if disposition = `Acceptable`

**Dynamic placeholder depends on rank 1 vector:**
* Proxy: *"Group/context scenario: Two respondents with equal trait level answer differently because…"*
* State: *"State scenario: Trait stable, but current state drives the response because…"*
* Ambiguity: *"Meaning split: Same trait level, different interpretation leads to different answers because…"*
* Fakability: *"Gaming strategy: A respondent could fake-good/fake-bad by…"*
* Drift: *"Boundary collapse: This item mainly reflects something else because…"*

---

## 10) Navigation rules
* `Previous` always allowed (but do not allow index < 0).
* `Next` allowed only if current item passes all validation gates.
* On the last item, `Next` becomes `Review & Submit`.

---

## 11) Submit behavior (MVP)
On "Submit":
1. Create a flat JSON array with **one object per item** (30 rows total). Each row should include:
   * `judge_id`, `judge_token`, `submission_id`, `submitted_at`
   * `item_id`, `domain`, `facet`, `item_text`
   * All per-item fields listed in Section 4.2.
2. `console.log` the array.
3. Display it in a `<pre>` area on the screen for visual verification.
4. **DO NOT** clear `localStorage`.

---

## 12) Implementation constraints
* No external libraries (No React, Vue, jQuery, etc.).
* Keep code readable and deterministic.
* Validate gates explicitly (do not rely purely on HTML "disabled" attributes; verify in JS before advancing index).
* Avoid implicit behavior; make edge cases intentional.
* No speculative features.

---

## 13) Acceptance checklist
- [ ] Reload at item 3 restores state perfectly.
- [ ] Detection forecast is required for EVERY item (Pass and Flag).
- [ ] Flag panel gates strictly enforce: rank 1 + primary mechanism + disposition + lethality.
- [ ] Witness text is forced required ONLY for Fatal.
- [ ] Ranked-click is deterministic (max 3, no auto-shift on clear).
- [ ] Submit logs a correct, flattened JSON payload array (1 row per item).
- [ ] UI is dark, high-contrast, readable, and keyboard-friendly.