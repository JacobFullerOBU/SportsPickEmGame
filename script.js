// Sample matchup data
const matchups = [
    {
        id: 1,
        sport: "NFL",
        date: "Sunday, October 6, 2025",
        time: "1:00 PM EST",
        homeTeam: {
            name: "Dallas Cowboys",
            record: "3-1"
        },
        awayTeam: {
            name: "New York Giants",
            record: "2-2"
        }
    },
    {
        id: 2,
        sport: "NFL",
        date: "Sunday, October 6, 2025",
        time: "4:25 PM EST",
        homeTeam: {
            name: "Kansas City Chiefs",
            record: "4-0"
        },
        awayTeam: {
            name: "Las Vegas Raiders",
            record: "1-3"
        }
    },
    {
        id: 3,
        sport: "NBA",
        date: "Monday, October 7, 2025",
        time: "7:30 PM EST",
        homeTeam: {
            name: "Los Angeles Lakers",
            record: "2-0"
        },
        awayTeam: {
            name: "Golden State Warriors",
            record: "1-1"
        }
    },
    {
        id: 4,
        sport: "College Football",
        date: "Saturday, October 5, 2025",
        time: "3:30 PM EST",
        homeTeam: {
            name: "Alabama Crimson Tide",
            record: "4-1"
        },
        awayTeam: {
            name: "Georgia Bulldogs",
            record: "5-0"
        }
    }
];

// Store user picks
let userPicks = {};

// Initialize the application
function init() {
    renderMatchups();
    updatePicksSummary();
    
    // Set up submit button listener
    document.getElementById('submit-picks').addEventListener('click', submitPicks);
}

// Render all matchups
function renderMatchups() {
    const container = document.getElementById('matchups-container');
    container.innerHTML = '';
    
    matchups.forEach(matchup => {
        const matchupCard = createMatchupCard(matchup);
        container.appendChild(matchupCard);
    });
}

// Create a matchup card
function createMatchupCard(matchup) {
    const card = document.createElement('div');
    card.className = 'matchup-card';
    card.innerHTML = `
        <div class="matchup-header">
            <h3>${matchup.sport}</h3>
            <div class="matchup-info">${matchup.date} • ${matchup.time}</div>
        </div>
        <div class="teams-container">
            <div class="team" data-matchup-id="${matchup.id}" data-team="away">
                <div class="team-name">${matchup.awayTeam.name}</div>
                <div class="team-record">${matchup.awayTeam.record}</div>
            </div>
            <div class="vs-divider">VS</div>
            <div class="team" data-matchup-id="${matchup.id}" data-team="home">
                <div class="team-name">${matchup.homeTeam.name}</div>
                <div class="team-record">${matchup.homeTeam.record}</div>
            </div>
        </div>
    `;
    
    // Add click listeners to teams
    const teamElements = card.querySelectorAll('.team');
    teamElements.forEach(teamEl => {
        teamEl.addEventListener('click', () => handleTeamClick(teamEl, matchup));
    });
    
    // Restore previous selection if exists
    if (userPicks[matchup.id]) {
        const selectedTeam = card.querySelector(`[data-matchup-id="${matchup.id}"][data-team="${userPicks[matchup.id].team}"]`);
        if (selectedTeam) {
            selectedTeam.classList.add('selected');
        }
    }
    
    return card;
}

// Handle team click
function handleTeamClick(teamElement, matchup) {
    const matchupId = matchup.id;
    const team = teamElement.dataset.team;
    
    // Remove previous selection for this matchup
    const allTeamsInMatchup = document.querySelectorAll(`[data-matchup-id="${matchupId}"]`);
    allTeamsInMatchup.forEach(t => t.classList.remove('selected'));
    
    // Add selection to clicked team
    teamElement.classList.add('selected');
    
    // Store the pick
    const teamName = team === 'home' ? matchup.homeTeam.name : matchup.awayTeam.name;
    userPicks[matchupId] = {
        team: team,
        teamName: teamName,
        matchup: `${matchup.awayTeam.name} @ ${matchup.homeTeam.name}`,
        sport: matchup.sport,
        date: matchup.date
    };
    
    // Update the picks summary
    updatePicksSummary();
}

// Update picks summary
function updatePicksSummary() {
    const picksList = document.getElementById('picks-list');
    const submitBtn = document.getElementById('submit-picks');
    
    const pickCount = Object.keys(userPicks).length;
    
    if (pickCount === 0) {
        picksList.innerHTML = '<p class="no-picks">No picks made yet. Start selecting winners!</p>';
        submitBtn.disabled = true;
    } else {
        picksList.innerHTML = '';
        
        Object.values(userPicks).forEach(pick => {
            const pickItem = document.createElement('div');
            pickItem.className = 'pick-item';
            pickItem.innerHTML = `
                <div>
                    <div class="pick-matchup">${pick.sport}: ${pick.matchup}</div>
                    <div class="pick-matchup">${pick.date}</div>
                </div>
                <div class="pick-choice">${pick.teamName}</div>
            `;
            picksList.appendChild(pickItem);
        });
        
        submitBtn.disabled = false;
    }
}

// Submit picks
function submitPicks() {
    const pickCount = Object.keys(userPicks).length;
    const totalMatchups = matchups.length;
    
    if (pickCount === 0) {
        alert('Please make at least one pick before submitting!');
        return;
    }
    
    // Create success message
    const picksContainer = document.querySelector('.picks-summary');
    
    // Remove any existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h3>Picks Submitted Successfully! 🎉</h3>
        <p>You submitted ${pickCount} out of ${totalMatchups} picks.</p>
        <p>Good luck!</p>
    `;
    picksContainer.appendChild(successMessage);
    
    // Log picks to console for demonstration
    console.log('Submitted Picks:', userPicks);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Optionally disable further changes after submission
    // Uncomment the lines below if you want to lock picks after submission
    /*
    document.querySelectorAll('.team').forEach(team => {
        team.style.cursor = 'not-allowed';
        team.onclick = null;
    });
    document.getElementById('submit-picks').disabled = true;
    */
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
