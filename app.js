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

let state = null;

const dom = {
  progress: document.getElementById("progress"),
  itemId: document.getElementById("itemId"),
  itemDomain: document.getElementById("itemDomain"),
  itemFacet: document.getElementById("itemFacet"),
  itemScoring: document.getElementById("itemScoring"),
  itemText: document.getElementById("itemText"),
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
    started_at: now,
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
  dom.drawerItemList.innerHTML = items
    .map((item, index) => `<li>${index + 1}. ${item.id} — ${item.facet}</li>`)
    .join("");
}

function render() {
  const item = getCurrentItem();
  const response = ensureResponse(item.id);

  dom.progress.textContent = `${state.current_index + 1} / ${items.length}`;
  dom.itemId.textContent = item.id;
  dom.itemDomain.textContent = item.domain;
  dom.itemFacet.textContent = item.facet;
  dom.itemScoring.textContent = scoringLabel(item.scoring_direction);
  dom.itemText.textContent = item.text;

  setRadioValue(dom.tripwireGroup, response.tripwire_status);

  dom.forecastDetection.value = response.forecast_detection ?? 0;
  dom.forecastDetectionValue.textContent = response.forecast_detection ?? "—";

  if (response.tripwire_status === "Flag") {
    dom.redTeamPanel.classList.remove("hidden");
  } else {
    dom.redTeamPanel.classList.add("hidden");
  }

  renderVectorButtons(response);
  renderOtherFields(response);
  renderPrimaryPanel(response);

  setRadioValue(dom.dispositionGroup, response.disposition);
  dom.forecastLethality.value = response.forecast_lethality ?? 0;
  dom.forecastLethalityValue.textContent = response.forecast_lethality ?? "—";

  dom.witnessText.value = response.witness_text ?? "";
  dom.witnessCount.textContent = `${dom.witnessText.value.length} / 300`;
  updateWitnessPlaceholder(response);

  dom.generalComments.value = state.general_comments || "";

  dom.prevButton.disabled = state.current_index === 0;
  dom.nextButton.textContent = state.current_index === items.length - 1 ? "Review & Submit" : "Next";
  dom.nextButton.disabled = !canAdvance(response);
}

function renderVectorButtons(response) {
  dom.rankedVectors.innerHTML = "";
  vectorOptions.forEach((vector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "vector-button";
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

function canAdvance(response) {
  if (!response.tripwire_status) return false;
  if (response.forecast_detection === null) return false;

  if (response.tripwire_status === "Pass") return true;

  if (!response.rank_1_vector) return false;

  const otherRanked = [response.rank_1_vector, response.rank_2_vector, response.rank_3_vector].includes("Other");
  if (otherRanked) {
    if (!response.other_parent_vector) return false;
    if (!response.other_text || response.other_text.trim().length === 0) return false;
  }

  if (!primaryPanelComplete(response)) return false;

  if (!response.disposition) return false;
  if (response.forecast_lethality === null) return false;

  if (response.disposition === "Fatal") {
    if (!response.witness_text || response.witness_text.trim().length === 0) return false;
  }

  return true;
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

function updateResponseField(field, value) {
  const item = getCurrentItem();
  const response = ensureResponse(item.id);
  response[field] = value;
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
      handleSubmit();
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
  dom.tripwireGroup.addEventListener("change", (event) => {
    if (event.target.name === "tripwire") {
      updateResponseField("tripwire_status", event.target.value);
    }
  });

  dom.forecastDetection.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    updateResponseField("forecast_detection", value);
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
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });
}

function init() {
  loadState();
  renderDrawerList();
  attachEvents();
  render();
}

init();
