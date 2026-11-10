(() => {
    const body = document.body;
    const subject = body.dataset.subject || "science";
    const localKey = `spec-progress-v1-${subject}`;

    let state = {
        mode: "checkbox",
        items: {},
        total: 0,
        filter: "all"
    };

    const knownSubjects = ["biology", "chemistry", "physics"];

    let auth = null;
    let db = null;
    let currentUser = null;
    let firebaseReady = false;
    let remoteLoading = false;
    let saveTimer = null;
    let remoteSubjects = {};

    const loginButton = document.querySelector("[data-auth-login]");
    const logoutButton = document.querySelector("[data-auth-logout]");
    const authStatus = document.querySelector("[data-auth-status]");
    const progressButton = document.querySelector("[data-progress-summary]");
    const landingModeButtons = Array.from(document.querySelectorAll("[data-landing-mode]"));

    const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));

    const modal = document.createElement("div");
    modal.className = "spec-modal";
    modal.innerHTML = `
        <div class="spec-modal-backdrop" data-modal-close></div>
        <div class="spec-modal-card" role="dialog" aria-modal="true">
            <button type="button" class="spec-modal-close" data-modal-close>Close</button>
            <div class="spec-modal-body"></div>
        </div>
    `;

    const progressModal = document.createElement("div");
    progressModal.className = "progress-modal";
    progressModal.innerHTML = `
        <div class="spec-modal-backdrop" data-progress-close></div>
        <div class="progress-modal-card" role="dialog" aria-modal="true">
            <button type="button" class="spec-modal-close" data-progress-close>Close</button>
            <h2>Specification Progress</h2>
            <div class="progress-panel">
                <div class="progress-toggle" data-progress-scope>
                    <button type="button" data-scope="subject">This subject</button>
                    <button type="button" data-scope="all">All subjects</button>
                </div>
                <div class="progress-toggle" data-progress-mode>
                    <button type="button" data-progress-mode="checkbox">Checkboxes</button>
                    <button type="button" data-progress-mode="rag" class="has-tooltip" data-tooltip="RAG = Red / Amber / Green">RAG</button>
                </div>
            </div>
            <div class="progress-chart">
                <canvas width="220" height="220" aria-label="Progress pie chart"></canvas>
                <div class="progress-legend" data-progress-legend></div>
            </div>
        </div>
    `;

    let progressScope = "subject";
    let progressMode = state.mode;
    let landingMode = "checkbox";

    const updateStickyOffset = () => {
        const hero = document.querySelector(".spec-hero");
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const style = window.getComputedStyle(hero);
        const marginBottom = parseFloat(style.marginBottom) || 0;
        const offset = Math.ceil(rect.height + marginBottom + 8);
        document.documentElement.style.setProperty("--sticky-offset", `${offset}px`);
    };

    const wireTocLinks = () => {
        document.querySelectorAll(".subject-toc a").forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href");
                if (!href || !href.startsWith("#")) return;
                const target = document.querySelector(href);
                if (!target) return;
                event.preventDefault();
                const offset = parseFloat(getComputedStyle(document.documentElement)
                    .getPropertyValue("--sticky-offset")) || 0;
                const top = window.scrollY + target.getBoundingClientRect().top - offset;
                window.scrollTo({ top, behavior: "smooth" });
            });
        });
    };

    const readLocalState = () => {
        try {
            const raw = localStorage.getItem(localKey);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    };

    const readLocalStateFor = (subjectId) => {
        try {
            const raw = localStorage.getItem(`spec-progress-v1-${subjectId}`);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    };

    const writeLocalState = (nextState) => {
        localStorage.setItem(localKey, JSON.stringify(nextState));
    };

    const mergeState = (incoming) => {
        if (!incoming) return;
        state = {
            mode: incoming.mode || state.mode,
            items: {
                ...state.items,
                ...(incoming.items || {})
            },
            total: incoming.total || state.total,
            filter: incoming.filter || state.filter
        };
    };

    const isFirebaseConfigured = () => {
        const config = window.firebaseConfig;
        return !!(config && config.apiKey && config.apiKey !== "YOUR_API_KEY" && window.firebase);
    };

    const initFirebase = () => {
        if (!isFirebaseConfigured()) {
            updateAuthUI();
            return;
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
        }

        auth = firebase.auth();
        db = firebase.firestore();
        firebaseReady = true;

        auth.onAuthStateChanged(async (user) => {
            currentUser = user || null;
            updateAuthUI();
            if (currentUser) {
                await loadRemoteState();
                applyStateToUI();
            }
            loadQuesting();
        });
    };

    const updateAuthUI = () => {
        if (!authStatus) return;

        if (!isFirebaseConfigured()) {
            authStatus.textContent = "Login not configured";
            if (loginButton) loginButton.classList.add("hidden");
            if (logoutButton) logoutButton.classList.add("hidden");
            return;
        }

        if (currentUser) {
            const email = currentUser.email || "Student";
            authStatus.textContent = `Signed in as ${email}`;
            if (loginButton) loginButton.classList.add("hidden");
            if (logoutButton) {
                logoutButton.textContent = "Sign out";
                logoutButton.classList.remove("hidden");
            }
        } else {
            authStatus.textContent = "Not signed in";
            if (loginButton) loginButton.classList.remove("hidden");
            if (logoutButton) {
                logoutButton.textContent = "Sign out";
                logoutButton.classList.add("hidden");
            }
        }
    };

    const getCountsFromStateWithMode = (subjectState, mode) => {
        const items = subjectState?.items || {};
        const total = subjectState?.total || Object.keys(items).length;
        const counts = { green: 0, amber: 0, red: 0, total };
        Object.values(items).forEach((entry) => {
            if (mode === "checkbox") {
                if (entry.checkbox) counts.green += 1;
                return;
            }
            if (entry.rag === "green") {
                counts.green += 1;
            } else if (entry.rag === "amber") {
                counts.amber += 1;
            } else if (entry.rag === "red") {
                counts.red += 1;
            }
        });
        if (mode === "checkbox") {
            counts.red = Math.max(total - counts.green, 0);
            return counts;
        }
        counts.red = Math.max(total - counts.green - counts.amber - counts.red, 0) + counts.red;
        return counts;
    };

    const getCountsFromState = (subjectState) => {
        return getCountsFromStateWithMode(subjectState, progressMode);
    };

    const getSubjectState = (subjectId) => {
        return readLocalStateFor(subjectId) || remoteSubjects?.[subjectId] || null;
    };

    const getProgressCounts = () => {
        if (progressScope === "all") {
            return knownSubjects.reduce((acc, subjectId) => {
                const subjectState = getSubjectState(subjectId);
                if (!subjectState) return acc;
                const counts = getCountsFromState(subjectState);
                acc.green += counts.green;
                acc.amber += counts.amber;
                acc.red += counts.red;
                acc.total += counts.total;
                return acc;
            }, { green: 0, amber: 0, red: 0, total: 0 });
        }

        const items = Array.from(document.querySelectorAll(".spec-item"));
        if (!items.length) {
            const subjectState = getSubjectState(subject) || state;
            return getCountsFromState(subjectState);
        }

        const counts = { green: 0, amber: 0, red: 0, total: 0 };
        items.forEach((item) => {
            const specId = item.dataset.specId;
            if (!specId) return;
            counts.total += 1;
            const entry = state.items[specId] || {};
            if (progressMode === "checkbox") {
                if (entry.checkbox) {
                    counts.green += 1;
                } else {
                    counts.red += 1;
                }
                return;
            }
            if (entry.rag === "green") {
                counts.green += 1;
            } else if (entry.rag === "amber") {
                counts.amber += 1;
            } else if (entry.rag === "red") {
                counts.red += 1;
            } else {
                counts.red += 1;
            }
        });
        return counts;
    };

    const renderProgressChart = () => {
        const canvas = progressModal.querySelector("canvas");
        const legend = progressModal.querySelector("[data-progress-legend]");
        if (!canvas || !legend) return;
        const ctx = canvas.getContext("2d");
        const { green, amber, red, total } = getProgressCounts();
        const isCheckbox = progressMode === "checkbox";
        const values = isCheckbox ? [green, red] : [green, amber, red];
        const colors = isCheckbox ? ["#0f172a", "#e2e8f0"] : ["#16a34a", "#f59e0b", "#ef4444"];
        const labels = isCheckbox ? ["Done", "Not done"] : ["Green", "Amber", "Red"];
        const sum = total || 1;
        let start = -Math.PI / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        values.forEach((value, index) => {
            const angle = (value / sum) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(110, 110);
            ctx.arc(110, 110, 90, start, start + angle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            start += angle;
        });

        if (progressScope === "all") {
            const subjectLines = knownSubjects.map((subjectId) => {
                const subjectState = getSubjectState(subjectId);
                if (!subjectState) return `
                    <span>
                        <i class="progress-swatch" style="background:#cbd5f5"></i>
                        ${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}: no data
                    </span>
                `;
                const subjectCounts = getCountsFromState(subjectState);
                if (isCheckbox) {
                    return `
                        <span>
                            <i class="progress-swatch" style="background:#0f172a"></i>
                            ${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}: Done ${subjectCounts.green} / ${subjectCounts.total}
                        </span>
                    `;
                }
                return `
                    <span>
                        <i class="progress-swatch" style="background:#16a34a"></i>
                        ${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}: Green ${subjectCounts.green} · Amber ${subjectCounts.amber} · Red ${subjectCounts.red}
                    </span>
                `;
            }).join("");
            legend.innerHTML = subjectLines;
            return;
        }

        legend.innerHTML = labels.map((label, index) => {
            const value = values[index];
            return `
                <span>
                    <i class="progress-swatch" style="background:${colors[index]}"></i>
                    ${label}: ${value}
                </span>
            `;
        }).join("");
    };

    const updateProgressModalButtons = () => {
        progressModal.querySelectorAll("[data-scope]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.scope === progressScope);
        });
        progressModal.querySelectorAll("[data-progress-mode]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.progressMode === progressMode);
        });
    };

    const openProgressModal = () => {
        progressMode = state.mode || "checkbox";
        progressScope = "subject";
        updateProgressModalButtons();
        renderProgressChart();
        document.body.appendChild(progressModal);
        progressModal.classList.add("is-visible");
        document.body.classList.add("modal-open");
    };

    const closeProgressModal = () => {
        progressModal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
    };

    const loadRemoteState = async () => {
        if (!firebaseReady || !currentUser || !db) return;
        remoteLoading = true;
        try {
            const docRef = db.collection("specProgress").doc(currentUser.uid);
            const snapshot = await docRef.get();
            if (snapshot.exists) {
                const data = snapshot.data();
                if (data.subjects) {
                    remoteSubjects = data.subjects;
                    mergeState(data.subjects[subject]);
                } else {
                    remoteSubjects = { [subject]: data };
                    mergeState(data);
                }
            }
        } catch (error) {
            console.error("Failed to load remote progress", error);
        } finally {
            remoteLoading = false;
        }
    };

    const saveRemoteState = async () => {
        if (!firebaseReady || !currentUser || !db || remoteLoading) return;
        try {
            const docRef = db.collection("specProgress").doc(currentUser.uid);
            const updatedAt = new Date().toISOString();
            remoteSubjects = {
                ...(remoteSubjects || {}),
                [subject]: {
                    mode: state.mode,
                    items: state.items,
                    total: state.total,
                    updatedAt
                }
            };
            await docRef.set({
                mode: state.mode,
                items: state.items,
                total: state.total,
                subjects: remoteSubjects,
                updatedAt
            }, { merge: true });
            
            // Update last access + spec progress summary in users collection
            const userRef = db.collection("users").doc(currentUser.uid);
            await userRef.set({
                lastAccess: new Date().toISOString(),
                specSubjects: remoteSubjects
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save remote progress", error);
        }
    };

    const scheduleSave = () => {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            writeLocalState(state);
            saveRemoteState();
        }, 300);
    };

    const setMode = (mode) => {
        state.mode = mode;
        body.dataset.progressMode = mode;
        modeButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.mode === mode);
        });
        scheduleSave();
    };

    const applyStateToUI = () => {
        setMode(state.mode || "checkbox");
        document.querySelectorAll(".spec-item").forEach((item) => {
            const specId = item.dataset.specId;
            if (!specId) return;
            const entry = state.items[specId] || {};
            const checkbox = item.querySelector(".progress-checkbox input");
            if (checkbox) checkbox.checked = !!entry.checkbox;
            const ragButtons = item.querySelectorAll(".progress-rag button");
            ragButtons.forEach((btn) => {
                btn.classList.toggle("is-active", btn.dataset.rag === entry.rag);
            });
            item.classList.remove("rag-red", "rag-amber", "rag-green");
            if (entry.rag) {
                item.classList.add(`rag-${entry.rag}`);
            }
        });
        updateLandingProgress();
        applyQuesting();
    };

    const setLandingMode = (mode) => {
        landingMode = mode;
        landingModeButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.landingMode === mode);
        });
        updateLandingProgress();
    };

    const updateLandingProgress = () => {
        const cards = Array.from(document.querySelectorAll("[data-progress-card]"));
        if (!cards.length) return;
        cards.forEach((card) => {
            const subjectId = card.dataset.subjectId;
            if (!subjectId) return;
            const subjectState = getSubjectState(subjectId);
            const mode = landingMode;
            const modeLabel = mode === "checkbox" ? "Checkbox" : "RAG";
            const counts = subjectState ? getCountsFromStateWithMode(subjectState, mode) : { green: 0, amber: 0, red: 0, total: 0 };
            const total = counts.total || 0;
            const modeEl = card.querySelector("[data-progress-mode]");
            const metaEl = card.querySelector("[data-progress-meta]");
            const greenEl = card.querySelector("[data-progress-green]");
            const amberEl = card.querySelector("[data-progress-amber]");
            const redEl = card.querySelector("[data-progress-red]");

            if (modeEl) modeEl.textContent = `Mode: ${modeLabel}`;

            if (!subjectState || total === 0) {
                card.classList.add("is-empty");
                if (metaEl) metaEl.textContent = "No progress yet";
                if (greenEl) greenEl.style.width = "0%";
                if (amberEl) amberEl.style.width = "0%";
                if (redEl) redEl.style.width = "0%";
                return;
            }

            card.classList.remove("is-empty");
            let greenPct = (counts.green / total) * 100;
            let amberPct = (counts.amber / total) * 100;
            let redPct = (counts.red / total) * 100;
            if (mode === "checkbox") {
                amberPct = 0;
                redPct = Math.max(100 - greenPct, 0);
            }

            if (greenEl) greenEl.style.width = `${greenPct}%`;
            if (amberEl) amberEl.style.width = `${amberPct}%`;
            if (redEl) redEl.style.width = `${redPct}%`;

            if (metaEl) {
                if (mode === "checkbox") {
                    const percent = Math.round(greenPct);
                    metaEl.textContent = `${counts.green} / ${total} (${percent}%)`;
                } else {
                    const percent = Math.round(greenPct);
                    metaEl.textContent = `${percent}% green · ${counts.green}/${total}`;
                }
            }
        });
    };

    const openModalForItem = (item) => {
        const modalBody = modal.querySelector(".spec-modal-body");
        if (!modalBody) return;
        modalBody.innerHTML = "";
        const cloned = item.cloneNode(true);
        cloned.classList.remove("is-expanded");
        modalBody.appendChild(cloned);
        if (item.dataset.code) modalBody.insertAdjacentHTML("beforeend", revisePanel(item.dataset.code));
        document.body.appendChild(modal);
        modal.classList.add("is-visible");
        document.body.classList.add("modal-open");
        applyStateToUI();
    };

    /* ---------- One spec (10 Nov 2026): every point links to what covers it, and shows what Cakebread Questing says ----------
       The spec code (e.g. B2.27) comes from the number the point's text starts with; SPEC_INDEX is /js/spec-index.js
       (built by tools/spec/build_index.js). Questing writes users/{uid}.specQuizSummary.points = { 'B2.27': 's'|'r'|'l' }. */
    const LETTER = { biology: "B", chemistry: "C", physics: "P" }[subject];
    const IDX = typeof SPEC_INDEX !== "undefined" ? SPEC_INDEX : null;
    let questing = {};
    const QUEST_LABEL = { s: ["Secured in Questing", "q-sec"], r: ["Gone rusty in Questing", "q-rust"], l: ["Learning in Questing", "q-learn"] };
    const KIND = { lesson: ["📘", "Lessons"], sheet: ["📝", "Worksheets"], long: ["✍️", "6-mark questions"], eq: ["🧮", "Equations"] };
    const codeOf = (item) => {
        const text = (item.querySelector(".spec-item-content") || item).textContent.trim();
        const m = text.match(/^(\d+)\.(\d+)/);
        if (m && LETTER) return `${LETTER}${+m[1]}.${+m[2]}`;
        /* practicals are listed without a number: pick the practical of this subject sharing the most words */
        if (!LETTER || !IDX || !IDX.prac || !/^practical/i.test(text)) return null;
        const words = new Set(text.toLowerCase().match(/[a-z]{4,}/g) || []);
        let best = null, score = 0;
        Object.entries(IDX.prac).forEach(([k, w]) => {
            if (k[0] !== LETTER) return;
            const ws = w.split(" "), hit = ws.filter((x) => words.has(x)).length / Math.sqrt(ws.length * words.size);
            if (hit > score) { score = hit; best = k; }
        });
        return score > 0.3 ? best : null;
    };
    const missionUrl = (code) => `/interactive/spec-quiz/adventurer-mission.html?point=${encodeURIComponent(code)}`;
    const cardsUrl = (code) => `/Flashcards/?spec=${encodeURIComponent(code)}`;
    function addSpecLinks(item) {
        const code = codeOf(item);
        if (!code || !IDX || !IDX.pts[code]) return;
        const p = IDX.pts[code];
        item.dataset.code = code;
        const strip = document.createElement("div");
        strip.className = "spec-links";
        strip.innerHTML = `<span class="q-badge" hidden></span>`
            + `<a href="${missionUrl(code)}" title="A Cakebread Questing mission on ${code} — counts towards securing it">⚔️ Quiz me</a>`
            + (p.c ? `<a href="${cardsUrl(code)}" title="Study the flashcards for ${code}">🃏 ${p.c} card${p.c === 1 ? "" : "s"}</a>` : "")
            + (p.r.length ? `<button type="button" data-more title="Lessons, worksheets and more for ${code}">📚 ${p.r.length} more</button>` : "");
        strip.addEventListener("click", (e) => { if (e.target.closest("a")) e.stopPropagation(); });
        item.querySelector(".spec-item-content").appendChild(strip);
    }
    function revisePanel(code) {
        const p = IDX && IDX.pts[code];
        if (!p) return "";
        const groups = {};
        p.r.forEach((i) => { const [kind, title, url] = IDX.res[i]; (groups[kind] = groups[kind] || []).push(`<li><a href="${url}">${title}</a></li>`); });
        const st = questing[code];
        return `<div class="revise"><h3>Revise ${code}</h3>
            ${st ? `<p class="q-line ${QUEST_LABEL[st][1]}">${QUEST_LABEL[st][0]}</p>` : currentUser ? `<p class="q-line">Not started in Cakebread Questing yet.</p>` : ""}
            <div class="revise-main"><a class="go" href="${missionUrl(code)}">⚔️ Quiz me <small>(${p.n} questions · counts in Questing)</small></a>
            ${p.c ? `<a class="go alt" href="${cardsUrl(code)}">🃏 Flashcards <small>(${p.c})</small></a>` : ""}</div>
            ${Object.keys(KIND).filter((k) => groups[k]).map((k) => `<h4>${KIND[k][0]} ${KIND[k][1]}</h4><ul>${groups[k].join("")}</ul>`).join("")}</div>`;
    }
    function applyQuesting() {
        document.querySelectorAll(".spec-item[data-code]").forEach((item) => {
            const badge = item.querySelector(".q-badge"), st = questing[item.dataset.code];
            const entry = state.items[item.dataset.specId] || {};
            const saysGreen = entry.rag === "green" || entry.checkbox;
            if (!badge) return;
            if (st) { badge.hidden = false; badge.className = `q-badge ${QUEST_LABEL[st][1]}`; badge.textContent = { s: "✓ Secured", r: "Rusty", l: "Learning" }[st]; badge.title = QUEST_LABEL[st][0]; }
            else if (saysGreen && currentUser) { badge.hidden = false; badge.className = "q-badge q-none"; badge.textContent = "Quiz: not tried"; badge.title = "You've marked this as known — prove it with a Quiz me mission"; }
            else badge.hidden = true;
        });
    }
    async function loadQuesting() {
        if (!db || !currentUser) { questing = {}; applyQuesting(); return; }
        try {
            const snap = await db.collection("users").doc(currentUser.uid).get();
            questing = (snap.exists && snap.data().specQuizSummary && snap.data().specQuizSummary.points) || {};
        } catch (e) { questing = {}; }
        applyQuesting();
    }

    const closeModal = () => {
        modal.classList.remove("is-visible");
        document.body.classList.remove("modal-open");
    };

    const buildSpecItems = () => {
        const specItems = Array.from(document.querySelectorAll(".spec-item"));
        state.total = specItems.length;
        specItems.forEach((item, index) => {
            if (item.dataset.specReady) return;

            const contentWrapper = document.createElement("div");
            contentWrapper.className = "spec-item-content";
            while (item.firstChild) {
                contentWrapper.appendChild(item.firstChild);
            }
            item.appendChild(contentWrapper);

            const controls = document.createElement("div");
            controls.className = "spec-progress";
            controls.innerHTML = `
                <label class="progress-checkbox">
                    <input type="checkbox" aria-label="Mark as complete">
                </label>
                <div class="progress-rag" role="group" aria-label="RAG status">
                    <button type="button" data-rag="red" aria-label="Red">R</button>
                    <button type="button" data-rag="amber" aria-label="Amber">A</button>
                    <button type="button" data-rag="green" aria-label="Green">G</button>
                </div>
            `;
            item.appendChild(controls);

            const topicId = item.closest(".topic-card")?.querySelector(".topic-title")?.id || "topic";
            const specId = `${subject}-${topicId}-${index + 1}`;   // saved ticks use this id — never change it
            item.dataset.specId = specId;
            item.dataset.specReady = "true";
            addSpecLinks(item);
        });
        scheduleSave();
    };

    const applyColumnBreaks = () => {
        document.querySelectorAll(".topic-card").forEach((card) => {
            const items = Array.from(card.querySelectorAll(".spec-item"));
            items.forEach((item) => item.classList.remove("column-break"));
            if (items.length < 3) return;
            const breakIndex = Math.ceil(items.length / 2);
            const breakItem = items[breakIndex];
            if (breakItem) breakItem.classList.add("column-break");
        });
    };

    const wireSpecInteractions = () => {
        document.addEventListener("click", (event) => {
            const ragButton = event.target.closest(".progress-rag button");
            if (ragButton) {
                const item = ragButton.closest(".spec-item");
                if (!item) return;
                const specId = item.dataset.specId;
                if (!specId) return;
                const value = ragButton.dataset.rag;
                state.items[specId] = {
                    ...(state.items[specId] || {}),
                    rag: value
                };
                applyStateToUI();
                scheduleSave();
                return;
            }

            const checkbox = event.target.closest(".progress-checkbox input");
            if (checkbox) {
                const item = checkbox.closest(".spec-item");
                if (!item) return;
                const specId = item.dataset.specId;
                if (!specId) return;
                state.items[specId] = {
                    ...(state.items[specId] || {}),
                    checkbox: checkbox.checked
                };
                applyStateToUI();
                scheduleSave();
                return;
            }

            if (event.target.closest("[data-modal-close]")) {
                closeModal();
                return;
            }

            if (event.target.closest("[data-progress-close]")) {
                closeProgressModal();
                return;
            }

            const scopeButton = event.target.closest("button[data-scope]");
            if (scopeButton) {
                progressScope = scopeButton.dataset.scope;
                updateProgressModalButtons();
                renderProgressChart();
                return;
            }

            const modalModeButton = event.target.closest("button[data-progress-mode]");
            if (modalModeButton) {
                progressMode = modalModeButton.dataset.progressMode;
                updateProgressModalButtons();
                renderProgressChart();
                return;
            }

            if (event.target.closest(".spec-modal")) {
                return;
            }

            if (event.target.closest(".progress-modal")) {
                return;
            }

            const progressButton = event.target.closest("[data-progress-summary]");
            if (progressButton) {
                openProgressModal();
                return;
            }

            const specItem = event.target.closest(".spec-item");
            if (!specItem) return;
            if (event.target.closest("[data-more]") && !event.target.closest(".spec-modal")) { openModalForItem(specItem); return; }
            if (event.target.closest("a") || event.target.closest("button") || event.target.closest("input")) return;

            openModalForItem(specItem);
        });
    };

    const wireProgressButton = () => {
        if (!progressButton) return;
        progressButton.addEventListener("click", (event) => {
            event.preventDefault();
            openProgressModal();
        });
    };

    const wireModeButtons = () => {
        modeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                setMode(button.dataset.mode);
            });
        });
    };

    const wireLandingModeButtons = () => {
        if (!landingModeButtons.length) return;
        landingModeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                setLandingMode(button.dataset.landingMode);
            });
        });
    };

    const wireAuth = () => {
        if (!isFirebaseConfigured()) return;
        if (loginButton) {
            loginButton.addEventListener("click", async () => {
                if (!auth) return;
                const provider = new firebase.auth.GoogleAuthProvider();
                try {
                    await auth.signInWithPopup(provider);
                } catch (error) {
                    console.error("Login failed", error);
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener("click", async () => {
                if (!auth) return;
                try {
                    await auth.signOut();
                } catch (error) {
                    console.error("Logout failed", error);
                }
            });
        }
    };

    const init = () => {
        mergeState(readLocalState());
        buildSpecItems();
        applyColumnBreaks();
        applyStateToUI();
        setLandingMode(landingMode);
        updateStickyOffset();
        window.addEventListener("resize", updateStickyOffset);
        setTimeout(updateStickyOffset, 0);
        wireTocLinks();
        wireSpecInteractions();
        wireProgressButton();
        wireModeButtons();
        wireLandingModeButtons();
        initFirebase();
        wireAuth();
        updateAuthUI();
    };

    init();
})();
