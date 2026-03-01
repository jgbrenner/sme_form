const STORAGE_KEY = "karl30_sme_state_v1";

const items = [
  { id: "I104", domain: "Agreeableness", facet: "Altruism", text: "Am concerned about others.", scoring_direction: "+" },
  { id: "I259", domain: "Agreeableness", facet: "Cooperation", text: "Get back at others.", scoring_direction: "-" },
  { id: "I144", domain: "Agreeableness", facet: "Modesty", text: "Believe that I am better than others.", scoring_direction: "-" },
  { id: "I189", domain: "Agreeableness", facet: "Morality", text: "Put people under pressure.", scoring_direction: "-" },
  { id: "I179", domain: "Agreeableness", facet: "Sympathy", text: "Tend to dislike soft-hearted people.", scoring_direction: "-" },
  { id: "I34", domain: "Agreeableness", facet: "Trust", text: "Believe that others have good intentions.", scoring_direction: "+" },
  { id: "I290", domain: "Conscientiousness", facet: "Achievement", text: "Put little time and effort into my work.", scoring_direction: "-" },
  { id: "I270", domain: "Conscientiousness", facet: "Cautiousness", text: "Act without thinking.", scoring_direction: "-" },
  { id: "I195", domain: "Conscientiousness", facet: "Dutifulness", text: "Break my promises.", scoring_direction: "-" },
  { id: "I160", domain: "Conscientiousness", facet: "Orderliness", text: "Often forget to put things back in their proper place.", scoring_direction: "-" },
  { id: "I85", domain: "Conscientiousness", facet: "Self-Discipline", text: "Start tasks right away.", scoring_direction: "+" },
  { id: "I5", domain: "Conscientiousness", facet: "Self-Efficacy", text: "Complete tasks successfully.", scoring_direction: "+" },
  { id: "I47", domain: "Extraversion", facet: "Activity Level", text: "Am always on the go.", scoring_direction: "+" },
  { id: "I192", domain: "Extraversion", facet: "Assertiveness", text: "Keep in the background.", scoring_direction: "-" },
  { id: "I57", domain: "Extraversion", facet: "Cheerfulness", text: "Have a lot of fun.", scoring_direction: "+" },
  { id: "I22", domain: "Extraversion", facet: "Excitement", text: "Love excitement.", scoring_direction: "+" },
  { id: "I2", domain: "Extraversion", facet: "Friendliness", text: "Make friends easily.", scoring_direction: "+" },
  { id: "I247", domain: "Extraversion", facet: "Gregariousness", text: "Avoid crowds.", scoring_direction: "-" },
  { id: "I66", domain: "Neuroticism", facet: "Anger", text: "Get upset easily.", scoring_direction: "+" },
  { id: "I121", domain: "Neuroticism", facet: "Anxiety", text: "Get caught up in my problems.", scoring_direction: "+" },
  { id: "I221", domain: "Neuroticism", facet: "Depression", text: "Seldom feel blue.", scoring_direction: "-" },
  { id: "I231", domain: "Neuroticism", facet: "Immoderation", text: "Am able to control my cravings.", scoring_direction: "-" },
  { id: "I46", domain: "Neuroticism", facet: "Self-Consciousness", text: "Am afraid that I will do the wrong thing.", scoring_direction: "+" },
  { id: "I296", domain: "Neuroticism", facet: "Vulnerability", text: "Am calm even in tense situations.", scoring_direction: "-" },
  { id: "I288", domain: "Openness", facet: "Adventurousness", text: "Am attached to conventional ways.", scoring_direction: "-" },
  { id: "I8", domain: "Openness", facet: "Artistic Interests", text: "Believe in the importance of art.", scoring_direction: "+" },
  { id: "I133", domain: "Openness", facet: "Emotionality", text: "Try to understand myself.", scoring_direction: "+" },
  { id: "I273", domain: "Openness", facet: "Imagination", text: "Have difficulty imagining things.", scoring_direction: "-" },
  { id: "I173", domain: "Openness", facet: "Intellect", text: "Am not interested in abstract ideas.", scoring_direction: "-" },
  { id: "I28", domain: "Openness", facet: "Liberalism", text: "Tend to vote for liberal political candidates.", scoring_direction: "+" }
];

const vectorOptions = ["Proxy", "State", "Ambiguity", "Fakability", "Drift", "Other"];

const vectorDefinitions = {
  Proxy: "Measures a demographic/cultural proxy instead of the trait.",
  State: "Response is driven by temporary mood or fatigue.",
  Ambiguity: "Text is vague, leading to multiple valid interpretations.",
  Fakability: "Easily gamed for social desirability.",
  Drift: "Discriminant collapse; item measures a completely different trait."
};

const domainGroups = [
  { label: "A — Agreeableness", domain: "Agreeableness" },
  { label: "C — Conscientiousness", domain: "Conscientiousness" },
  { label: "E — Extraversion", domain: "Extraversion" },
  { label: "N — Neuroticism", domain: "Neuroticism" },
  { label: "O — Openness", domain: "Openness" }
];

const panelOptions = {
  Proxy: {
    fields: [
      { id: "proxy_source", label: "Proxy source", options: ["Family/peers", "Institution", "Geography", "Cultural norm", "Other"] },
      { id: "proxy_mechanism", label: "Proxy mechanism", options: ["Direct reference", "Stereotype", "Context cue", "Role expectation", "Other"] },
      { id: "proxy_context", label: "Proxy context", options: ["Work", "Home", "Public", "Digital", "Other"] }
    ]
  },
  State: {
    fields: [
      { id: "state_driver", label: "State driver", options: ["Stress", "Fatigue", "Mood", "Environment", "Other"] },
      { id: "state_timescale", label: "State timescale", options: ["Momentary", "Short-term", "Longer-term", "Unclear"], optional: true }
    ]
  },
  Ambiguity: {
    fields: [
      { id: "ambiguity_type", label: "Ambiguity type", options: ["Lexical", "Context", "Cultural", "Perspective", "Other"] }
    ]
  },
  Fakability: {
    fields: [
      { id: "fake_direction", label: "Fake direction", options: ["Fake-good", "Fake-bad", "Both"] },
      { id: "fake_transparency", label: "Transparency", options: ["Obvious", "Moderate", "Subtle"] }
    ]
  },
  Drift: {
    fields: [
      { id: "drift_type", label: "Drift type", options: ["within-domain", "cross-domain", "non-trait-contextual"] },
      { id: "drift_domain", label: "Cross-domain target", options: ["A", "C", "E", "N", "O"], dependsOn: { field: "drift_type", value: "cross-domain" } },
      { id: "drift_context_class", label: "Context class", options: ["politics/ideology", "institutional constraint", "socioeconomic circumstance", "other"], dependsOn: { field: "drift_type", value: "non-trait-contextual" } }
    ]
  }
};

const witnessPlaceholders = {
  Proxy: "Group/context scenario: Two respondents with equal trait level answer differently because...",
  State: "State scenario: Trait stable, but current state drives the response because...",
  Ambiguity: "Meaning split: Same trait level, different interpretation leads to different answers because...",
  Fakability: "Gaming strategy: A respondent could fake-good/fake-bad by...",
  Drift: "Boundary collapse: This item mainly reflects something else because..."
};

const mechanismFieldGroups = {
  Proxy: ["proxy_source", "proxy_mechanism", "proxy_context"],
  State: ["state_driver", "state_timescale"],
  Ambiguity: ["ambiguity_type"],
  Fakability: ["fake_direction", "fake_transparency"],
  Drift: ["drift_type", "drift_domain", "drift_context_class"]
};

const allMechanismFields = Object.values(mechanismFieldGroups).flat();

let state = null;

const dom = {
  progress: document.getElementById("progress"),
  introScreen: document.getElementById("introScreen"),
  introScreen2: document.getElementById("introScreen2"),
  introNext: document.getElementById("introNext"),
  beginAudit: document.getElementById("beginAudit"),
  itemId: document.getElementById("itemId"),
  itemDomain: document.getElementById("itemDomain"),
  itemFacet: document.getElementById("itemFacet"),
  itemScoring: document.getElementById("itemScoring"),
  itemText: document.getElementById("itemText"),
  itemCard: document.getElementById("itemCard"),
  tripwireGroup: document.getElementById("tripwireGroup"),
  forecastDetection: document.getElementById("forecastDetection"),
  forecastDetectionValue: document.getElementById("forecastDetectionValue"),
  redTeamPanel: document.getElementById("redTeamPanel"),
  rankedVectors: document.getElementById("rankedVectors"),
  rankMessage: document.getElementById("rankMessage"),
  otherFields: document.getElementById("otherFields"),
  otherParent: document.getElementById("otherParent"),
  otherText: document.getElementById("otherText"),
  primaryPanel: document.getElementById("primaryPanel"),
  dispositionGroup: document.getElementById("dispositionGroup"),
  forecastLethality: document.getElementById("forecastLethality"),
  forecastLethalityValue: document.getElementById("forecastLethalityValue"),
  witnessText: document.getElementById("witnessText"),
  witnessCount: document.getElementById("witnessCount"),
  prevButton: document.getElementById("prevButton"),
  nextButton: document.getElementById("nextButton"),
  validationStatus: document.getElementById("validationStatus"),
  endScreen: document.getElementById("endScreen"),
  backToLast: document.getElementById("backToLast"),
  submitFinal: document.getElementById("submitFinal"),
  appFooter: document.getElementById("appFooter"),
  drawer: document.getElementById("drawer"),
  drawerToggle: document.getElementById("drawerToggle"),
  drawerClose: document.getElementById("drawerClose"),
  drawerItemList: document.getElementById("drawerItemList"),
  generalComments: document.getElementById("generalComments"),
  clearProgress: document.getElementById("clearProgress"),
  payloadSection: document.getElementById("payloadSection"),
  payloadPre: document.getElementById("payloadPre")
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

function newResponse() {
  return {
    tripwire_status: null,
    forecast_detection: null,
    rank_1_vector: null,
    rank_2_vector: null,
    rank_3_vector: null,
    other_parent_vector: null,
    other_text: null,
    proxy_source: null,
    proxy_mechanism: null,
    proxy_context: null,
    state_driver: null,
    state_timescale: null,
    ambiguity_type: null,
    fake_direction: null,
    fake_transparency: null,
    drift_type: null,
    drift_domain: null,
    drift_context_class: null,
    disposition: null,
    forecast_lethality: null,
    witness_text: null
  };
}

function buildInitialState() {
  const now = new Date().toISOString();
  return {
    version: 1,
    judge_token: getTokenFromUrl(),
    judge_id: uuidv4(),
    submission_id: uuidv4(),
    current_index: 0,
    started_at: null,
    updated_at: now,
    general_comments: "",
    responses: {}
  };
}

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("t");
}

function ensureResponse(itemId) {
  if (!state.responses[itemId]) {
    state.responses[itemId] = newResponse();
  }
  return state.responses[itemId];
}

function saveState() {
  state.updated_at = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.version === 1) {
        state = parsed;
      }
    } catch (error) {
      state = null;
    }
  }
  if (!state) {
    state = buildInitialState();
    saveState();
  }

  const rawIndex = Number.isInteger(state.current_index) ? state.current_index : 0;
  state.current_index = Math.min(Math.max(rawIndex, 0), items.length - 1);

  const token = getTokenFromUrl();
  if (token && state.judge_token !== token) {
    state.judge_token = token;
    saveState();
  }
}

function getCurrentItem() {
  return items[state.current_index];
}

function scoringLabel(direction) {
  return direction === "-" ? "Scoring: Reverse-keyed" : "Scoring: Regular";
}

function setRadioValue(group, value) {
  const inputs = group.querySelectorAll("input[type='radio']");
  inputs.forEach((input) => {
    input.checked = input.value === value;
  });
}

function renderDrawerList() {
  const rows = [];
  domainGroups.forEach((group) => {
    rows.push(`<li class="drawer-domain">${group.label}</li>`);
    items
      .filter((item) => item.domain === group.domain)
      .forEach((item) => {
        const scoring = item.scoring_direction === "-" ? "(-)" : "(+)";
        rows.push(
          `<li class="drawer-item"><span class="drawer-meta">[${item.id.replace('I', '#')}] ${scoring}</span><span class="drawer-text">${item.facet}: ${item.text}</span></li>`
        );
      });
  });
  dom.drawerItemList.innerHTML = rows.join("");
}

function setView(view) {
  dom.introScreen.classList.toggle("hidden", view !== "intro");
  dom.introScreen2.classList.toggle("hidden", view !== "intro2");
  dom.itemCard.classList.toggle("hidden", view !== "item");
  dom.endScreen.classList.toggle("hidden", view !== "end");
  dom.appFooter.classList.toggle("hidden", view !== "item");
}

function render() {
  const item = getCurrentItem();
  const response = ensureResponse(item.id);

  dom.progress.textContent = `${state.current_index + 1} / ${items.length}`;
  dom.itemId.textContent = item.id.replace('I', '#');
  dom.itemDomain.textContent = item.domain;
  dom.itemFacet.textContent = item.facet;
  dom.itemScoring.textContent = scoringLabel(item.scoring_direction);
  dom.itemText.textContent = item.text;

  setRadioValue(dom.tripwireGroup, response.tripwire_status);

  dom.forecastDetection.value = response.forecast_detection === null ? 50 : response.forecast_detection;
  dom.forecastDetectionValue.textContent = response.forecast_detection === null ? "—" : response.forecast_detection;

  if (response.tripwire_status === "Flag") {
    dom.redTeamPanel.classList.remove("hidden");
  } else {
    dom.redTeamPanel.classList.add("hidden");
  }

  renderVectorButtons(response);
  renderOtherFields(response);
  renderPrimaryPanel(response);

  setRadioValue(dom.dispositionGroup, response.disposition);
  dom.forecastLethality.value = response.forecast_lethality === null ? 50 : response.forecast_lethality;
  dom.forecastLethalityValue.textContent = response.forecast_lethality === null ? "—" : response.forecast_lethality;

  dom.witnessText.value = response.witness_text ?? "";
  dom.witnessCount.textContent = `${dom.witnessText.value.length} / 300`;
  updateWitnessPlaceholder(response);

  dom.generalComments.value = state.general_comments || "";

  dom.prevButton.disabled = state.current_index === 0;
  dom.nextButton.textContent = state.current_index === items.length - 1 ? "Review & Submit" : "Next";
  const missing = getMissingRequirement(response);
  dom.nextButton.disabled = missing !== "";
  dom.validationStatus.textContent = missing ? `Missing: ${missing}` : "";
}

function renderVectorButtons(response) {
  dom.rankedVectors.innerHTML = "";
  vectorOptions.forEach((vector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "vector-button";
    button.title = vectorDefinitions[vector] || "";
    const rank = getVectorRank(response, vector);
    if (rank) {
      button.classList.add("active");
      button.textContent = `${vector} (${rank})`;
    } else {
      button.textContent = vector;
    }
    button.addEventListener("click", () => handleRankClick(vector));
    dom.rankedVectors.appendChild(button);
  });
}

function getVectorRank(response, vector) {
  if (response.rank_1_vector === vector) return 1;
  if (response.rank_2_vector === vector) return 2;
  if (response.rank_3_vector === vector) return 3;
  return null;
}

function handleRankClick(vector) {
  const response = ensureResponse(getCurrentItem().id);
  dom.rankMessage.textContent = "";
  const previousRank1 = response.rank_1_vector;
  const existingRank = getVectorRank(response, vector);
  if (existingRank) {
    response[`rank_${existingRank}_vector`] = null;
  } else {
    const availableRank = [1, 2, 3].find((rank) => response[`rank_${rank}_vector`] === null);
    if (!availableRank) {
      dom.rankMessage.textContent = "Max 3 reached";
      return;
    }
    response[`rank_${availableRank}_vector`] = vector;
  }
  if (previousRank1 !== response.rank_1_vector) {
    sanitizeResponse(response, { rank1Changed: true });
  } else {
    sanitizeResponse(response, {});
  }
  saveState();
  render();
}

function renderOtherFields(response) {
  const otherRanked = [response.rank_1_vector, response.rank_2_vector, response.rank_3_vector].includes("Other");
  if (otherRanked) {
    dom.otherFields.classList.remove("hidden");
    dom.otherParent.value = response.other_parent_vector ?? "";
    dom.otherText.value = response.other_text ?? "";
  } else {
    dom.otherFields.classList.add("hidden");
  }
}

function renderPrimaryPanel(response) {
  dom.primaryPanel.innerHTML = "";
  if (!response.rank_1_vector) return;
  const vector = response.rank_1_vector;
  const config = panelOptions[vector];
  if (!config) return;

  config.fields.forEach((field) => {
    if (field.dependsOn) {
      const currentValue = response[field.dependsOn.field];
      if (currentValue !== field.dependsOn.value) {
        return;
      }
    }
    const label = document.createElement("label");
    label.textContent = field.label + (field.optional ? " (optional)" : "");
    const select = document.createElement("select");
    select.id = field.id;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select one";
    select.appendChild(placeholder);
    field.options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
    select.value = response[field.id] ?? "";
    select.addEventListener("change", (event) => {
      response[field.id] = event.target.value || null;
      if (field.id === "drift_type") {
        sanitizeResponse(response, { driftTypeChanged: true });
      } else {
        sanitizeResponse(response, {});
      }
      saveState();
      render();
    });
    label.appendChild(select);
    dom.primaryPanel.appendChild(label);
  });
}

function updateWitnessPlaceholder(response) {
  const vector = response.rank_1_vector;
  dom.witnessText.placeholder = vector ? witnessPlaceholders[vector] || "" : "";
}

function getMissingRequirement(response) {
  if (!response.tripwire_status) return "Tripwire";
  if (response.forecast_detection === null) return "Detection Forecast";

  if (response.tripwire_status === "Pass") return "";

  if (!response.rank_1_vector) return "Rank 1 Vector";

  const otherRanked = [response.rank_1_vector, response.rank_2_vector, response.rank_3_vector].includes("Other");
  if (otherRanked) {
    if (!response.other_parent_vector) return "Other Parent Vector";
    if (!response.other_text || response.other_text.trim().length === 0) return "Other Text";
  }

  if (!primaryPanelComplete(response)) return "Primary Mechanism";

  if (!response.disposition) return "Disposition";
  if (response.forecast_lethality === null) return "Lethality Forecast";

  if (response.disposition === "Fatal") {
    if (!response.witness_text || response.witness_text.trim().length === 0) return "Witness Statement";
  }

  return "";
}

function canAdvance(response) {
  return getMissingRequirement(response) === "";
}

function primaryPanelComplete(response) {
  const vector = response.rank_1_vector;
  const config = panelOptions[vector];
  if (!config) return true;

  for (const field of config.fields) {
    if (field.optional) continue;
    if (field.dependsOn) {
      const currentValue = response[field.dependsOn.field];
      if (currentValue !== field.dependsOn.value) {
        continue;
      }
    }
    if (!response[field.id]) {
      return false;
    }
  }
  return true;
}

function updateResponseField(field, value, options = {}) {
  const item = getCurrentItem();
  const response = ensureResponse(item.id);
  response[field] = value;
  if (options.sanitize) {
    sanitizeResponse(response, options);
  }
  saveState();
  render();
}

function handleNavigation(direction) {
  const response = ensureResponse(getCurrentItem().id);
  if (direction === "next") {
    if (!canAdvance(response)) {
      render();
      return;
    }
    if (state.current_index === items.length - 1) {
      dom.payloadSection.classList.add("hidden");
      setView("end");
      return;
    }
    state.current_index += 1;
  } else {
    if (state.current_index > 0) {
      state.current_index -= 1;
    }
  }
  saveState();
  render();
}

function handleSubmit() {
  const submittedAt = new Date().toISOString();
  const payload = items.map((item) => {
    const response = ensureResponse(item.id);
    return {
      judge_id: state.judge_id,
      judge_token: state.judge_token,
      submission_id: state.submission_id,
      submitted_at: submittedAt,
      item_id: item.id,
      domain: item.domain,
      facet: item.facet,
      item_text: item.text,
      scoring_direction: item.scoring_direction,
      tripwire_status: response.tripwire_status,
      forecast_detection: response.forecast_detection,
      rank_1_vector: response.rank_1_vector,
      rank_2_vector: response.rank_2_vector,
      rank_3_vector: response.rank_3_vector,
      other_parent_vector: response.other_parent_vector,
      other_text: response.other_text,
      proxy_source: response.proxy_source,
      proxy_mechanism: response.proxy_mechanism,
      proxy_context: response.proxy_context,
      state_driver: response.state_driver,
      state_timescale: response.state_timescale,
      ambiguity_type: response.ambiguity_type,
      fake_direction: response.fake_direction,
      fake_transparency: response.fake_transparency,
      drift_type: response.drift_type,
      drift_domain: response.drift_domain,
      drift_context_class: response.drift_context_class,
      disposition: response.disposition,
      forecast_lethality: response.forecast_lethality,
      witness_text: response.witness_text
    };
  });

  console.log(payload);
  dom.payloadPre.textContent = JSON.stringify(payload, null, 2);
  dom.payloadSection.classList.remove("hidden");
}

function attachEvents() {
  document.querySelectorAll(".slider-anchors span").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      const value = Number(anchor.dataset.value);
      const section = anchor.closest(".section");
      if (!section || Number.isNaN(value)) return;
      const slider = section.querySelector("input[type='range']");
      if (!slider) return;
      slider.value = value;
      if (slider.id === "forecastDetection") {
        updateResponseField("forecast_detection", value);
      } else if (slider.id === "forecastLethality") {
        updateResponseField("forecast_lethality", value);
      }
    });
  });

  dom.tripwireGroup.addEventListener("change", (event) => {
    if (event.target.name === "tripwire") {
      updateResponseField("tripwire_status", event.target.value, { sanitize: true, tripwireChanged: true });
    }
  });

  dom.forecastDetection.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    updateResponseField("forecast_detection", value);
  });

  dom.forecastDetection.addEventListener("pointerdown", () => {
    const response = ensureResponse(getCurrentItem().id);
    if (response.forecast_detection === null) {
      updateResponseField("forecast_detection", Number(dom.forecastDetection.value));
    }
  });

  dom.otherParent.addEventListener("change", (event) => {
    updateResponseField("other_parent_vector", event.target.value || null);
  });

  dom.otherText.addEventListener("input", (event) => {
    updateResponseField("other_text", event.target.value);
  });

  dom.dispositionGroup.addEventListener("change", (event) => {
    if (event.target.name === "disposition") {
      updateResponseField("disposition", event.target.value);
    }
  });

  dom.forecastLethality.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    updateResponseField("forecast_lethality", value);
  });

  dom.forecastLethality.addEventListener("pointerdown", () => {
    const response = ensureResponse(getCurrentItem().id);
    if (response.forecast_lethality === null) {
      updateResponseField("forecast_lethality", Number(dom.forecastLethality.value));
    }
  });

  dom.witnessText.addEventListener("input", (event) => {
    updateResponseField("witness_text", event.target.value);
  });

  dom.generalComments.addEventListener("input", (event) => {
    state.general_comments = event.target.value;
    saveState();
  });

  dom.prevButton.addEventListener("click", () => handleNavigation("prev"));
  dom.nextButton.addEventListener("click", () => handleNavigation("next"));

  dom.drawerToggle.addEventListener("click", () => dom.drawer.classList.remove("hidden"));
  dom.drawerClose.addEventListener("click", () => dom.drawer.classList.add("hidden"));

  dom.clearProgress.addEventListener("click", () => {
    const confirmed = window.confirm("Are you sure? This cannot be undone.");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  dom.introNext.addEventListener("click", () => {
    setView("intro2");
  });

  dom.beginAudit.addEventListener("click", () => {
    if (!state.started_at) {
      state.started_at = new Date().toISOString();
      saveState();
    }
    dom.appFooter.classList.remove("hidden");
    setView("item");
    render();
  });

  dom.backToLast.addEventListener("click", () => {
    setView("item");
    render();
  });

  dom.submitFinal.addEventListener("click", () => {
    handleSubmit();
  });
}

function init() {
  loadState();
  renderDrawerList();
  attachEvents();
  if (state.started_at) {
    setView("item");
  } else {
    setView("intro");
  }
  render();
}

init();

function sanitizeResponse(response, options = {}) {
  if (response.tripwire_status === "Pass") {
    const keep = new Set(["tripwire_status", "forecast_detection"]);
    Object.keys(response).forEach((key) => {
      if (!keep.has(key)) {
        response[key] = null;
      }
    });
    return;
  }

  if (options.rank1Changed) {
    response.witness_text = null;
    response.disposition = null;
    response.forecast_lethality = null;
    allMechanismFields.forEach((field) => {
      response[field] = null;
    });
  }

  const activeVector = response.rank_1_vector;
  if (activeVector && mechanismFieldGroups[activeVector]) {
    const activeFields = new Set(mechanismFieldGroups[activeVector]);
    allMechanismFields.forEach((field) => {
      if (!activeFields.has(field)) {
        response[field] = null;
      }
    });
  } else {
    allMechanismFields.forEach((field) => {
      response[field] = null;
    });
  }

  const otherRanked = [response.rank_1_vector, response.rank_2_vector, response.rank_3_vector].includes("Other");
  if (!otherRanked) {
    response.other_parent_vector = null;
    response.other_text = null;
  }

  if (response.drift_type !== "cross-domain") {
    response.drift_domain = null;
  }
  if (response.drift_type !== "non-trait-contextual") {
    response.drift_context_class = null;
  }
}
