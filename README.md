# KARL-30 SME Red-Team Audit

This repository contains the frontend architecture for the **KARL-30 Subject Matter Expert (SME) Red-Team Audit**. 

The KARL-30 is an ultra-short distillation of the 300-item IPIP-NEO (Goldberg, 1999) Big Five inventory, operating at the absolute limit of the bandwidth–fidelity tradeoff: exactly one item per facet. Because each item serves as a single load-bearing pillar, this project does not seek to confirm the scale's validity. Instead, it is built entirely around **falsification**. 

We are inviting domain experts to actively stress-test and attempt to break the items. If an item fails here, it severs our ability to measure that facet entirely. 

## Architectural Philosophy
Think of this application as an isolated interrogation room. 

The frontend provides a highly controlled, distractor-free psychological environment for the experts to evaluate each item. It forces a stepwise, logical progression of critique without overwhelming the user. 

To eliminate hosting overhead and ensure high reliability for a low-N user base, the system uses a serverless, decoupled architecture:
* **The Interrogation Room (Frontend):** A static Single Page Application (HTML/CSS/JS) hosted on GitHub Pages. It manages state, conditional logic, and autosaves progress directly to the browser's local storage so experts never lose their work.
* **The Ledger (Backend):** A Google Apps Script endpoint catches the final JSON payload upon submission and writes the audit data to a secured Google Sheet for subsequent analysis.

## The Audit Methodology
Experts evaluate each item under the exact cognitive constraints placed on the original test-takers (Adult WEIRD samples). The audit follows a strict two-stage threshold:

### 1. The Vulnerability Check (Falsification Vector)
Experts are asked to find the structural flaws in the item as written. They categorize failures using a specific vector taxonomy:
* **Proxy:** Measures a cultural/demographic proxy rather than the trait.
* **State:** Driven by temporary mood rather than stable personality.
* **Ambiguity:** Lexically vague, permitting multiple valid interpretations.
* **Fakability:** Highly transparent and easily gamed.
* **Drift:** Discriminant collapse; inadvertently measures the wrong trait.

### 2. Disposition (Lethality)
If a vulnerability is found, the expert must determine if the flaw is an *Acceptable Risk* or a *Fatal Risk* that destroys the item's utility as a sole facet marker.

## Project Structure
* `index.html`: The core application shell and user interface.
* `styles.css`: Custom styling prioritizing readability, focus, and a clean, clinical aesthetic.
* `app.js`: The state-machine logic driving the conditional rendering, local storage memory, and the final payload submission.
* *(Note: The Google Apps Script backend is maintained separately to secure the data pipeline).*

## Ethical and System Constraints
* **Autosave:** All progress is strictly local until the final submission button is pressed. 
* **Anonymity:** The payload strips personally identifiable information to maintain reviewer objectivity and privacy.
* **Independence:** The tool is designed to run completely client-side without external database calls during the evaluation phase, preventing network latency from interrupting the expert's workflow.