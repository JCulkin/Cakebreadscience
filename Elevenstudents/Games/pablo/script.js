// --- GLOBAL CONFIGURATION (Chart.js) ---
Chart.defaults.font.family = 'Poppins';
Chart.defaults.color = '#fff';


// --- FIREBASE CONFIGURATION (REPLACE THIS WITH YOUR ACTUAL KEYS) ---
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-BUCKET.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "YOUR_APP_ID"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();


// --- GLOBAL STATE ---
let isTestRunning = false;
let startTime = 0;
let lightsTimeout; // Used for the random GO signal and the 3s DNS timeout
const allResultsKey = 'f1ReactionResultsLocal';
const lightElements = document.querySelectorAll('.light');
const sequenceTimers = []; // Timers for the 5 sequential red lights
let chartInstance = null;
let currentUser = null;
let userTeamId = null;


// Leaderboard state variables
let leaderboardType = 'pilots';
let leaderboardCriteria = 'best';


// --- FIREBASE / AUTH LOGIC ---


auth.onAuthStateChanged(user => {
    currentUser = user;
    const loginButton = document.getElementById('login-button');
    const teamManagementDiv = document.getElementById('team-management'); // Changed from team-status
    const userInfoSpan = document.getElementById('user-info');


    if (user) {
        userInfoSpan.textContent = `Logged in as: ${user.displayName}`;
        loginButton.textContent = 'LOGOUT';
        loginButton.onclick = logout;
        teamManagementDiv.style.display = 'flex'; // Show team management panel when logged in
        loadUserProfile(user.uid);
    } else {
        // Revert to the requested catchphrase when logged out
        userInfoSpan.textContent = "Get your Driver's License to save results and join a team!";
        loginButton.textContent = 'LOGIN WITH GOOGLE';
        loginButton.onclick = loginWithGoogle;
        teamManagementDiv.style.display = 'none'; // Hide team panel when logged out
        applyColor('#FF4500');
        userTeamId = null;
        loadTeamStatus(null); // Clear team status
    }
    updateDashboard();
    loadLeaderboard(leaderboardType, leaderboardCriteria);
});


function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error("Login Error:", error);
        alert("Login failed: " + error.message);
    });
}


function logout() {
    auth.signOut();
}


// --- USER PROFILE & COLOR LOGIC ---


async function loadUserProfile(uid) {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
        const data = doc.data();
        if (data.color) {
            document.getElementById('accent-color').value = data.color;
            applyColor(data.color);
        }
        userTeamId = data.teamId || null;
        loadTeamStatus(userTeamId);
    }
}


async function updateProfileColor(color) {
    if (!currentUser) return;
    try {
        await db.collection('users').doc(currentUser.uid).set({
            color: color,
            name: currentUser.displayName,
            email: currentUser.email,
        }, { merge: true });
        applyColor(color);
    } catch (e) {
        console.error("Error updating color:", e);
    }
}


function applyColor(color) {
    document.documentElement.style.setProperty('--orange', color);
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const rBg = Math.floor(r / 1.5);
    const gBg = Math.floor(g / 1.5);
    const bBg = Math.floor(b / 1.5);
    document.documentElement.style.setProperty('--user-accent-dark-bg', `rgb(${rBg}, ${gBg}, ${bBg})`);


    if (chartInstance) {
        chartInstance.data.datasets[0].borderColor = color;
        chartInstance.data.datasets[0].backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
        // Update tooltip title color for better visibility
        if (chartInstance.options.plugins.tooltip) {
            chartInstance.options.plugins.tooltip.titleColor = color;
        }
        chartInstance.update();
    }
}


document.getElementById('accent-color').addEventListener('input', (e) => {
    applyColor(e.target.value);
});


document.getElementById('accent-color').addEventListener('change', (e) => {
    updateProfileColor(e.target.value);
});




// --- TEAM MANAGEMENT LOGIC ---


async function loadTeamStatus(teamId) {
    const teamInfo = document.getElementById('team-info');
    const leaveBtn = document.getElementById('leave-team-btn');
    const createBtn = document.getElementById('create-team-btn');
    const joinBtn = document.getElementById('join-team-btn');
    const teamNameInput = document.getElementById('team-name-input');
   
    if (teamId) {
        try {
            const teamDoc = await db.collection('teams').doc(teamId).get();
            if (teamDoc.exists) {
                teamInfo.innerHTML = `You are a member of: <b>${teamDoc.data().name}</b> (ID: ${teamId})`;
                leaveBtn.style.display = 'inline-block';
                teamNameInput.style.display = 'none';
                createBtn.style.display = 'none';
                joinBtn.style.display = 'none';
            } else {
                teamInfo.textContent = `Invalid Team ID stored. Please create or join a new team.`;
                leaveBtn.style.display = 'none';
                teamNameInput.style.display = 'block';
                createBtn.style.display = 'inline-block';
                joinBtn.style.display = 'inline-block';
            }
        } catch(e) {
            console.error("Error loading team:", e);
            teamInfo.textContent = `Error loading team status.`;
        }
    } else {
        teamInfo.textContent = 'You are currently not in a team.';
        leaveBtn.style.display = 'none';
        teamNameInput.style.display = 'block';
        createBtn.style.display = 'inline-block';
        joinBtn.style.display = 'inline-block';
    }
}


async function createOrJoinTeam(action) {
    if (!currentUser) return alert("You must be logged in to manage teams.");
   
    const input = document.getElementById('team-name-input').value.trim();
    if (!input) return alert("Please enter a Team Name or ID.");


    const teamId = input.toLowerCase().replace(/\s/g, '');
    const teamRef = db.collection('teams').doc(teamId);
   
    try {
        const teamDoc = await teamRef.get();
       
        if (action === 'create') {
            if (teamDoc.exists) {
                return alert(`Team ID '${teamId}' already exists. Please choose another name or join it.`);
            }
           
            await teamRef.set({
                name: input,
                creator: currentUser.displayName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });


            alert(`Team '${input}' created successfully!`);


        } else if (action === 'join') {
            if (!teamDoc.exists) {
                return alert(`Team ID '${teamId}' does not exist.`);
            }
            alert(`Joined team '${teamDoc.data().name}' successfully!`);
        }
       
        // Update user's team ID in Firestore
        await db.collection('users').doc(currentUser.uid).update({ teamId: teamId });
        userTeamId = teamId;
       
        // Clear input field
        document.getElementById('team-name-input').value = '';
       
        // Re-render UI
        loadTeamStatus(teamId);
        loadLeaderboard(leaderboardType, leaderboardCriteria);


    } catch (e) {
        console.error("Error managing team:", e);
        alert(`Error ${action}ing team. Please try again.`);
    }
}


async function leaveTeam() {
    if (!currentUser || !userTeamId) return;
   
    if (!confirm(`Are you sure you want to leave your team?`)) return;


    try {
        await db.collection('users').doc(currentUser.uid).update({ teamId: firebase.firestore.FieldValue.delete() });
        userTeamId = null;
        alert("You have left the team.");
        loadTeamStatus(null);
        loadLeaderboard('pilots', 'best'); // Load individual leaderboard by default
    } catch (e) {
        console.error("Error leaving team:", e);
        alert("Error leaving team.");
    }
}


// --- CORE GAME LOGIC (Restored from your working version) ---


document.body.onkeydown = function(event) {
    if (event.keyCode === 32) { // Spacebar key code
        event.preventDefault();
       
        // *** CRUCIAL FIX: Allow spacebar to start the test if it's not running ***
        if (!isTestRunning) {
            startTest();
        } else {
            // If the test IS running, let handleTap process the Jump Start or Reaction
            handleTap();
        }
    }
};


function handleTap() {
    // This runs on spacebar press AFTER the test has been initiated


    if (!isTestRunning) return; // Should not happen with the onkeydown fix, but kept for safety


    clearTimeout(lightsTimeout);
    sequenceTimers.forEach(clearTimeout);
   
    const endTime = performance.now();
    let reactionTime = null;


    if (startTime === 0) {
        // Spacebar pressed before lights turn off
        document.getElementById('message').textContent = "JUMP START!";
        document.getElementById('result').textContent = "DNS";
        document.body.classList.add('fail');
        lightElements.forEach(light => light.classList.add('on')); // Keep lights on for visual feedback
       
        reactionTime = null; // DNS/Jump Start


    } else {
        // Spacebar pressed after lights turn off
        reactionTime = endTime - startTime;
       
        if (reactionTime > 3000) {
            // This case should be caught by noReaction timeout, but kept for logic
            noReaction();
            return;
        }


        document.getElementById('message').textContent = "REACTION TIME";
        document.getElementById('result').textContent = (reactionTime / 1000).toFixed(3) + ' s';
        document.body.classList.add('success');
        lightElements.forEach(light => light.classList.remove('on'));
    }


    saveResult(reactionTime);
    isTestRunning = false;
    startTime = 0;
    document.getElementById('start-button').disabled = false;
}


function startLightSequence() {
    let delay = 0;
    sequenceTimers.forEach(clearTimeout);
    sequenceTimers.length = 0;
    lightElements.forEach((light, index) => {
        delay += 1000;
        const timer = setTimeout(() => {
            light.classList.add('on');
            light.classList.remove('fail', 'success');
            if (index === lightElements.length - 1) {
                startRandomGoTimer();
            }
        }, delay);
        sequenceTimers.push(timer);
    });
}


function startRandomGoTimer() {
    // Random delay between 200ms and 3000ms
    const randomDelay = Math.floor(Math.random() * (3000 - 200 + 1) + 200);
    document.getElementById('message').textContent = "WAIT FOR LIGHTS OUT";
    lightsTimeout = setTimeout(turnLightsOffAndStartTimer, randomDelay);
}


function turnLightsOffAndStartTimer() {
    clearTimeout(lightsTimeout);
    lightElements.forEach(light => light.classList.remove('on'));
    startTime = performance.now(); // Record the GO time
    document.getElementById('message').textContent = "GO!";
   
    // Set 3-second timeout for a "Late DNS"
    lightsTimeout = setTimeout(noReaction, 3000);
}


function noReaction() {
    if (isTestRunning && startTime !== 0) {
        document.getElementById('message').textContent = "DNS (Did Not Start)";
        document.getElementById('result').textContent = "DNS";
        document.body.classList.add('fail');
        lightElements.forEach(light => light.classList.remove('on')); // Lights are already off
        saveResult(null);
        isTestRunning = false;
        startTime = 0;
        document.getElementById('start-button').disabled = false;
    }
}


function startTest(event) {
    if (event) event.stopPropagation();
    if (isTestRunning) return;
   
    // --- RESET ALL STATE ---
    isTestRunning = true;
    document.getElementById('start-button').disabled = true;
    document.getElementById('message').textContent = "Light sequence starting...";
    document.getElementById('result').textContent = "0.000";
    startTime = 0;
    document.body.classList.remove('success', 'fail'); // Clear visual feedback
    lightElements.forEach(light => {
        light.classList.remove('on', 'fail', 'success');
    });


    startLightSequence();
}


// --- DATA HELPERS & PERSISTENCE ---


function getFormattedDate(dateObj) {
    const now = dateObj || new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${h}:${m}.${s} ${day}/${month}/${year}`;
}


function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return `${monday.getDate()}/${monday.getMonth()+1}`;
}


function loadResults() {
    const json = localStorage.getItem(allResultsKey);
    return json ? JSON.parse(json) : [];
}


function calculateAverages(results) {
    // Filter for valid (non-DNS) results
    const validResults = results.filter(r => r.rt !== null).map(r => parseFloat(r.rt));
   
    if (validResults.length === 0) {
        return { best: null, avgAll: null, avg10: null };
    }


    const sumAll = validResults.reduce((a, b) => a + b, 0);
    const avgAll = sumAll / validResults.length;
   
    // Slice only the last 10 valid results for a true rolling average
    const allValidResults = results.filter(r => r.rt !== null);
    const validInLast10 = allValidResults.slice(-10).map(r => parseFloat(r.rt));
   
    const sumLastTen = validInLast10.reduce((a, b) => a + b, 0);
    const avg10 = validInLast10.length >= 1 ? sumLastTen / validInLast10.length : null; // Changed from 10 to 1
   
    const best = Math.min(...validResults);
   
    return { best, avgAll, avg10 };
}


async function saveResult(reactionTime) {
    // reactionTime is ms for success, or null for DNS/Jump Start
    const rtInSeconds = (reactionTime === null) ? null : parseFloat(reactionTime / 1000).toFixed(3);
    const newResult = {
        rt: rtInSeconds,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: getFormattedDate(new Date())
    };


    if (currentUser) {
        try {
            const userRef = db.collection('users').doc(currentUser.uid);
           
            // 1. Save individual attempt
            await userRef.collection('attempts').add(newResult);


            // 2. Recalculate summary: We re-fetch all attempts to ensure correct averages
            const attemptsSnapshot = await userRef.collection('attempts').orderBy('timestamp', 'asc').get();
           
            let allAttempts = attemptsSnapshot.docs.map(doc => ({
                rt: doc.data().rt,
                timestamp: doc.data().timestamp?.toMillis()
            }));
           
            const averages = calculateAverages(allAttempts.sort((a, b) => a.timestamp - b.timestamp));
           
            // 3. Update user leaderboard summary
            await userRef.set({
                uid: currentUser.uid,
                name: currentUser.displayName,
                bestTime: averages.best || 999, // Use 999 to represent DNS/no time for sorting
                avg10Time: averages.avg10 || 999,
                avgTotalTime: averages.avgAll || 999,
                lastAttempt: new Date(),
                attemptsCount: allAttempts.length, // Count ALL attempts (valid or null)
                teamId: userTeamId || firebase.firestore.FieldValue.delete()
            }, { merge: true });


           
        } catch (e) {
            console.error("Error saving to Firebase:", e);
        }
    } else {
        const results = loadResults();
        results.push({...newResult, timestamp: Date.now()});
        localStorage.setItem(allResultsKey, JSON.stringify(results));
    }
   
    updateDashboard();
    loadLeaderboard(leaderboardType, leaderboardCriteria);
}


function formatTime(seconds) {
    if (seconds === null || seconds === undefined || isNaN(seconds) || parseFloat(seconds) >= 999) return 'DNS';
    return parseFloat(seconds).toFixed(3) + ' s';
}


// --- FILTER & CHART LOGIC ---


function clearFilters() {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('min-rt').value = '';
    document.getElementById('max-rt').value = '';
    document.getElementById('chart-view-mode').value = 'all';
    renderCurrentChart();
}


function processChartData(results) {
    const mode = document.getElementById('chart-view-mode').value;
    const startDateVal = document.getElementById('start-date').value;
    const endDateVal = document.getElementById('end-date').value;
    const minRtVal = document.getElementById('min-rt').value;
    const maxRtVal = document.getElementById('max-rt').value;


    let filtered = results.filter(r => {
        // Filter out null results (DNS/Jump Start) from aggregation modes
        if (mode !== 'all' && r.rt === null) return false;
       
        // --- Apply all filters ---
        if (r.rt !== null) {
            const val = parseFloat(r.rt);
            const date = new Date(r.timestamp);
           
            if (minRtVal && val < parseFloat(minRtVal)) return false;
            if (maxRtVal && val > parseFloat(maxRtVal)) return false;


            if (startDateVal) {
                const start = new Date(startDateVal);
                start.setHours(0,0,0,0);
                if (date < start) return false;
            }
            if (endDateVal) {
                const end = new Date(endDateVal);
                end.setHours(23,59,59,999);
                if (date > end) return false;
            }
        }
        return true;
    });


    if (mode === 'all') {
        return {
            labels: filtered.map((_, i) => i + 1),
            // Data maps null results to null so Chart.js skips the data point
            data: filtered.map(r => r.rt === null ? null : parseFloat(r.rt)),
            tooltips: filtered.map(r => ({ date: r.date, attempts: 1, isNull: r.rt === null })),
            label: "Reaction Time"
        };
    }


    const groups = {};
   
    filtered.forEach(r => {
        if (r.rt === null) return;
       
        const dateObj = new Date(r.timestamp);
        let key;


        if (mode === 'day') {
            key = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        } else if (mode === 'hour') {
            const h = String(dateObj.getHours()).padStart(2, '0');
            key = `${dateObj.getDate()}/${dateObj.getMonth() + 1} ${h}:00`;
        } else if (mode === 'week') {
            key = `Week starting ${getWeekStart(dateObj)}`;
        }


        if (!groups[key]) groups[key] = { values: [], count: 0, label: key };
        groups[key].values.push(parseFloat(r.rt));
        groups[key].count++;
    });


    const labels = Object.keys(groups);
    const data = labels.map(key => {
        const values = groups[key].values;
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
    });


    return {
        labels: labels,
        data: data,
        tooltips: labels.map(key => ({ date: key, attempts: groups[key].count, isNull: false })),
        label: `Avg per ${mode === 'day' ? 'Day' : (mode === 'hour' ? 'Hour' : 'Week')}`
    };
}


function renderCurrentChart() {
    const results = loadResults().sort((a, b) => a.timestamp - b.timestamp);
    const chartData = processChartData(results);
    drawChart(chartData);
}


function drawChart(chartData) {
    const ctx = document.getElementById('reactionChart').getContext('2d');


    if (chartInstance) {
        chartInstance.destroy();
    }
   
    const currentAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--orange').trim();


    const r = parseInt(currentAccentColor.slice(1, 3), 16);
    const g = parseInt(currentAccentColor.slice(3, 5), 16);
    const b = parseInt(currentAccentColor.slice(5, 7), 16);


    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: chartData.label,
                data: chartData.data,
                borderColor: currentAccentColor,
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                borderWidth: 2,
                pointRadius: chartData.tooltips.map(t => t.isNull ? 0 : 4), // Set radius to 0 for null data points
                pointHoverRadius: 6,
                tension: 0.2,
                fill: false,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#fff', font: { family: 'Poppins' } },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: {
                        color: '#fff',
                        font: { family: 'Poppins' },
                        callback: function(value) { return value.toFixed(3); }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { family: 'Poppins' } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: currentAccentColor,
                    bodyColor: '#fff',
                    titleFont: { family: 'Poppins' },
                    bodyFont: { family: 'Poppins', size: 13 },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            const tooltipInfo = chartData.tooltips[context.dataIndex];


                            if (tooltipInfo.isNull) {
                                return 'Attempt: DNS/Jump Start';
                            }
                           
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += formatTime(context.parsed.y);
                            }
                            return label;
                        },
                        afterLabel: function(context) {
                            const tooltipInfo = chartData.tooltips[context.dataIndex];
                            // Show attempt count for aggregated modes
                            if (tooltipInfo.attempts > 1) {
                                return `Attempts: ${tooltipInfo.attempts}`;
                            } else {
                                return tooltipInfo.date;
                            }
                        }
                    }
                }
            }
        }
    });
}


function updateDashboard() {
    const results = loadResults();
    const { best, avgAll, avg10 } = calculateAverages(results);
   
    document.getElementById('best-time').textContent = formatTime(best);
    document.getElementById('avg-10-time').textContent = formatTime(avg10);
    document.getElementById('avg-time').textContent = formatTime(avgAll);


    renderCurrentChart();
}




// --- LEADERBOARD LOGIC ---


function setLeaderboardType(type) {
    leaderboardType = type;
   
    const pilotCriteriaSelector = document.getElementById('pilot-criteria-selector');
    const teamCriteriaSelector = document.getElementById('team-criteria-selector');


    pilotCriteriaSelector.style.display = (type === 'pilots' ? 'block' : 'none');
    teamCriteriaSelector.style.display = (type === 'teams' ? 'block' : 'none');


    // 1. Update Type buttons active state
    document.querySelectorAll('.leaderboard-type').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-type="${type}"]`).classList.add('active');


    // 2. Determine the current/default criteria for the new type
    let newCriteria;
    let activeCriteriaBtn = document.querySelector(`#${type}-criteria-selector .leaderboard-criteria.active`);
   
    if (activeCriteriaBtn) {
        newCriteria = activeCriteriaBtn.dataset.criteria;
    } else {
        // Default to the first button if none are active
        newCriteria = type === 'pilots' ? 'best' : 'avgbest';
    }


    // 3. Set the criteria and ensure the button is active
    setLeaderboardCriteria(type, newCriteria);
}


function setLeaderboardCriteria(type, criteria) {
    leaderboardType = type;
    leaderboardCriteria = criteria;
   
    // 1. Deactivate ALL criteria buttons
    document.querySelectorAll('.leaderboard-criteria').forEach(btn => btn.classList.remove('active'));
   
    // 2. Activate only the selected criteria button
    const selectedBtn = document.querySelector(`#${type}-criteria-selector [data-criteria="${criteria}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }


    loadLeaderboard(leaderboardType, leaderboardCriteria);
}


// Main load function
async function loadLeaderboard(type, criteria) {
    const leaderboardTableDiv = document.getElementById('leaderboard-table');
    leaderboardTableDiv.innerHTML = `Calculating ${type === 'pilots' ? 'pilot' : 'team'} leaderboard...`;
   
    if (type === 'teams') {
        await displayTeamLeaderboard(leaderboardTableDiv, criteria);
    } else if (type === 'pilots') {
        await displayPilotLeaderboard(leaderboardTableDiv, criteria);
    }
}


async function displayPilotLeaderboard(leaderboardTableDiv, criteria) {
    let orderByField;
    let orderLabel;
   
    switch (criteria) {
        case 'best':
            orderByField = 'bestTime'; orderLabel = 'Best Time'; break;
        case 'avg10':
            orderByField = 'avg10Time'; orderLabel = 'Avg Last 10'; break;
        case 'avgAll':
            orderByField = 'avgTotalTime'; orderLabel = 'Avg Total'; break;
        default:
            orderByField = 'bestTime'; orderLabel = 'Best Time';
    }
   
    const snapshot = await db.collection('users').orderBy(orderByField, 'asc').limit(20).get();


    let html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Pilot</th>
                    <th class="sorted-col">${orderLabel} (s)</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
    `;
   
    let rank = 1;
    snapshot.forEach(doc => {
        const data = doc.data();
        if (criteria === 'avg10' && (data.attemptsCount < 10 || data.avg10Time >= 999)) return;
        if (!data.bestTime || data.bestTime >= 999) return;


        const displayColor = data.color || '#FF4500';
        const teamIdDisplay = data.teamId ? (data.teamId.length > 15 ? data.teamId.substring(0, 12) + '...' : data.teamId) : '--';




        html += `
            <tr>
                <td>${rank++}</td>
                <td style="color:${displayColor};">${data.name || 'Anonymous'}</td>
                <td style="font-weight:600;">${formatTime(data[orderByField] || null)}</td>
                <td>${teamIdDisplay}</td>
            </tr>
        `;
    });


    html += '</tbody></table>';
    leaderboardTableDiv.innerHTML = html;
}


// EXPANDED TEAM LOGIC
async function displayTeamLeaderboard(leaderboardTableDiv, criteria) {
    leaderboardTableDiv.innerHTML = 'Calculating Team Averages...';
   
    const usersSnapshot = await db.collection('users').where('teamId', '!=', null).get();
    const teamsData = {};


    // 1. Accumulate individual averages for each team
    usersSnapshot.forEach(doc => {
        const data = doc.data();
        const teamId = data.teamId;
       
        if (!teamId || !data.bestTime || data.bestTime >= 999) return;


        if (!teamsData[teamId]) {
            teamsData[teamId] = {
                teamId: teamId,
                name: teamId,
                totalBestTime: 0,
                totalAvg10Time: 0,
                totalAvgAllTime: 0,
                memberCount: 0,
                validAvg10Count: 0,
            };
        }
       
        teamsData[teamId].totalBestTime += data.bestTime;
        teamsData[teamId].memberCount += 1;
       
        if (data.avg10Time < 999) {
            teamsData[teamId].totalAvg10Time += data.avg10Time;
            teamsData[teamId].validAvg10Count += 1;
        }
       
        teamsData[teamId].totalAvgAllTime += data.avgTotalTime;
    });


    // 2. Calculate final team averages
    const finalTeams = Object.values(teamsData)
        .filter(team => team.memberCount > 0)
        .map(team => ({
            ...team,
            avgBestTime: team.totalBestTime / team.memberCount,
            avg10Time: team.validAvg10Count > 0 ? team.totalAvg10Time / team.validAvg10Count : 999,
            avgTotalTime: team.totalAvgAllTime / team.memberCount,
        }));


    // 3. Sort based on selected criteria
    let orderBy;
    let orderLabel;
   
    switch (criteria) {
        case 'avgbest':
            orderBy = 'avgBestTime'; orderLabel = 'Avg Best Time'; break;
        case 'avg10':
            orderBy = 'avg10Time'; orderLabel = 'Avg Last 10'; break;
        case 'avgAll':
            orderBy = 'avgTotalTime'; orderLabel = 'Avg Total'; break;
        default:
            orderBy = 'avgBestTime'; orderLabel = 'Avg Best Time';
    }
   
    const sortedTeams = finalTeams
        .filter(team => team[orderBy] < 999)
        .sort((a, b) => a[orderBy] - b[orderBy]);


    // 4. Load real team names
    if (sortedTeams.length > 0) {
        const teamNamesSnapshot = await db.collection('teams').where(firebase.firestore.FieldPath.documentId(), 'in', sortedTeams.map(t => t.teamId)).get();
        const teamNames = {};
        teamNamesSnapshot.forEach(doc => {
            teamNames[doc.id] = doc.data().name;
        });
       
        sortedTeams.forEach(team => {
            team.name = teamNames[team.teamId] || team.teamId;
        });
    }


    // 5. Generate HTML
    let html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Team Name</th>
                    <th class="sorted-col">${orderLabel} (s)</th>
                    <th>Members</th>
                </tr>
            </thead>
            <tbody>
    `;


    let rank = 1;
    sortedTeams.slice(0, 20).forEach(team => {
        html += `
            <tr>
                <td>${rank++}</td>
                <td style="font-weight:600;">${team.name}</td>
                <td style="font-weight:600; color:var(--orange);">${formatTime(team[orderBy])}</td>
                <td>${team.memberCount}</td>
            </tr>
        `;
    });


    html += '</tbody></table>';
    leaderboardTableDiv.innerHTML = html;
}




// --- STARTUP LOGIC ---
window.onload = function() {
    // Attach the main start button click handler
    document.getElementById('start-button').addEventListener('click', startTest);
   
    // Initialize the leaderboard
    setLeaderboardType(leaderboardType);
   
    // Assign criteria listeners
    document.getElementById('pilot-criteria-selector').addEventListener('click', (e) => {
        if (e.target.classList.contains('leaderboard-criteria')) {
            setLeaderboardCriteria('pilots', e.target.dataset.criteria);
        }
    });


    document.getElementById('team-criteria-selector').addEventListener('click', (e) => {
        if (e.target.classList.contains('leaderboard-criteria')) {
            setLeaderboardCriteria('teams', e.target.dataset.criteria);
        }
    });
};



