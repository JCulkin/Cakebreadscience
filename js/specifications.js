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
            
            // Update last access timestamp in users collection
            const userRef = db.collection("users").doc(currentUser.uid);
            await userRef.set({
                lastAccess: new Date().toISOString()
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
        document.body.appendChild(modal);
        modal.classList.add("is-visible");
        document.body.classList.add("modal-open");
        applyStateToUI();
    };

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
            const specId = `${subject}-${topicId}-${index + 1}`;
            item.dataset.specId = specId;
            item.dataset.specReady = "true";
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

            const scopeButton = event.target.closest("[data-scope]");
            if (scopeButton) {
                progressScope = scopeButton.dataset.scope;
                updateProgressModalButtons();
                renderProgressChart();
                return;
            }

            const modalModeButton = event.target.closest("[data-progress-mode]");
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
