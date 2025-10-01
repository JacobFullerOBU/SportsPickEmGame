// Sample matchup data (fallback if API fails)
const sampleMatchups = [
    {
        id: 1,
        sport: "NFL",
        date: "Sunday, October 6, 2025",
        time: "1:00 PM EST",
        rawDate: new Date("2025-10-06T17:00:00Z"),
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
        rawDate: new Date("2025-10-06T20:25:00Z"),
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
        rawDate: new Date("2025-10-07T23:30:00Z"),
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
        rawDate: new Date("2025-10-05T19:30:00Z"),
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

// Store matchups and user picks
let matchups = [];
let allMatchups = []; // Store all games before filtering
let userPicks = {};
let sportFilters = {
    nfl: true,
    collegeFootball: true
};

// Fetch NFL games for the upcoming week
async function fetchNFLGames() {
    try {
        // Using ESPN's public API
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
        const data = await response.json();
        
        const nflGames = data.events.map((event, index) => {
            const competition = event.competitions[0];
            const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
            const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
            const gameDate = new Date(event.date);
            
            return {
                id: `nfl-${index}`,
                sport: "NFL",
                date: gameDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
                rawDate: gameDate,
                homeTeam: {
                    name: homeTeam.team.displayName,
                    record: `${homeTeam.records?.[0]?.summary || '0-0'}`
                },
                awayTeam: {
                    name: awayTeam.team.displayName,
                    record: `${awayTeam.records?.[0]?.summary || '0-0'}`
                }
            };
        });
        
        return nflGames;
    } catch (error) {
        console.error('Error fetching NFL games:', error);
        return [];
    }
}

// Fetch top 25 college football games
async function fetchCollegeFootballGames() {
    try {
        // Using ESPN's public API for college football
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard');
        const data = await response.json();
        
        // Filter for games involving top 25 teams (based on rankings if available)
        const cfbGames = data.events
            .filter((event, index) => index < 25) // Limit to top matchups
            .map((event, index) => {
                const competition = event.competitions[0];
                const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
                const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
                const gameDate = new Date(event.date);
                
                return {
                    id: `cfb-${index}`,
                    sport: "College Football",
                    date: gameDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    time: gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
                    rawDate: gameDate,
                    homeTeam: {
                        name: homeTeam.team.displayName,
                        record: `${homeTeam.records?.[0]?.summary || '0-0'}`
                    },
                    awayTeam: {
                        name: awayTeam.team.displayName,
                        record: `${awayTeam.records?.[0]?.summary || '0-0'}`
                    }
                };
            });
        
        return cfbGames;
    } catch (error) {
        console.error('Error fetching College Football games:', error);
        return [];
    }
}

// Fetch all games
async function fetchAllGames() {
    const loadingContainer = document.getElementById('loading-container');
    const matchupsContainer = document.getElementById('matchups-container');
    
    // Show loading indicator
    loadingContainer.style.display = 'block';
    matchupsContainer.style.display = 'none';
    
    try {
        // Fetch both NFL and College Football games
        const [nflGames, cfbGames] = await Promise.all([
            fetchNFLGames(),
            fetchCollegeFootballGames()
        ]);
        
        // Combine all games
        allMatchups = [...nflGames, ...cfbGames];
        
        // If no games fetched, use sample data
        if (allMatchups.length === 0) {
            console.log('No games fetched from APIs, using sample data');
            allMatchups = sampleMatchups;
        }
        
        // Apply filters
        applyFilters();
    } catch (error) {
        console.error('Error fetching games:', error);
        allMatchups = sampleMatchups;
        applyFilters();
    } finally {
        // Hide loading indicator
        loadingContainer.style.display = 'none';
        matchupsContainer.style.display = 'block';
    }
}

// Filter games based on sport and date
function filterGames(games) {
    const now = new Date();
    
    return games.filter(game => {
        // Filter out games that have passed
        if (game.rawDate && game.rawDate < now) {
            return false;
        }
        
        // Filter by sport
        if (game.sport === "NFL" && !sportFilters.nfl) {
            return false;
        }
        if (game.sport === "College Football" && !sportFilters.collegeFootball) {
            return false;
        }
        
        return true;
    });
}

// Apply filters to matchups
function applyFilters() {
    matchups = filterGames(allMatchups);
    renderMatchups();
    updatePicksSummary();
}

// Initialize the application
async function init() {
    // Fetch games from APIs
    await fetchAllGames();
    
    // Set up filter listeners
    document.getElementById('filter-nfl').addEventListener('change', (e) => {
        sportFilters.nfl = e.target.checked;
        applyFilters();
    });
    
    document.getElementById('filter-college').addEventListener('change', (e) => {
        sportFilters.collegeFootball = e.target.checked;
        applyFilters();
    });
    
    // Set up submit button listener
    document.getElementById('submit-picks').addEventListener('click', submitPicks);
    
    // Set up download button listener
    document.getElementById('download-picks').addEventListener('click', downloadPicksSummary);
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
    const downloadBtn = document.getElementById('download-picks');
    
    const pickCount = Object.keys(userPicks).length;
    
    if (pickCount === 0) {
        picksList.innerHTML = '<p class="no-picks">No picks made yet. Start selecting winners!</p>';
        submitBtn.disabled = true;
        downloadBtn.disabled = true;
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
        downloadBtn.disabled = false;
    }
}

// Download picks summary as image
async function downloadPicksSummary() {
    const picksSummary = document.querySelector('.picks-summary');
    
    // Check if html2canvas is available (from CDN)
    if (typeof html2canvas !== 'undefined') {
        try {
            const canvas = await html2canvas(picksSummary, {
                backgroundColor: '#f8f9fa',
                scale: 2,
                logging: false
            });
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 10);
                link.download = `picks-summary-${timestamp}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            });
            
            alert('Your picks summary has been downloaded!');
            return;
        } catch (error) {
            console.error('Error generating picks summary with html2canvas:', error);
        }
    }
    
    // Fallback: Create an HTML page and open it for screenshot/print
    try {
        const picksHTML = createPicksSummaryHTML();
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow.document.write(picksHTML);
        newWindow.document.close();
        
        // Give the user time to save/screenshot
        setTimeout(() => {
            newWindow.print();
        }, 500);
        
        alert('A new window has opened with your picks summary. You can print or save it from there!');
    } catch (error) {
        console.error('Error creating picks summary:', error);
        alert('Failed to create picks summary. Please try again.');
    }
}

// Create HTML for picks summary
function createPicksSummaryHTML() {
    const timestamp = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let picksHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Sports Picks - ${timestamp}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                h1 {
                    color: #667eea;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .date {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                .pick-item {
                    background: #f8f9fa;
                    padding: 20px;
                    margin-bottom: 15px;
                    border-radius: 10px;
                    border-left: 5px solid #667eea;
                }
                .pick-sport {
                    font-weight: bold;
                    color: #667eea;
                    font-size: 1.1em;
                }
                .pick-matchup {
                    color: #666;
                    margin: 5px 0;
                }
                .pick-choice {
                    color: #333;
                    font-size: 1.3em;
                    font-weight: bold;
                    margin-top: 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    color: #999;
                    font-size: 0.9em;
                }
                @media print {
                    body {
                        background: white;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏈 My Sports Picks 🏀</h1>
                <div class="date">${timestamp}</div>
    `;
    
    Object.values(userPicks).forEach(pick => {
        picksHTML += `
            <div class="pick-item">
                <div class="pick-sport">${pick.sport}</div>
                <div class="pick-matchup">${pick.matchup}</div>
                <div class="pick-matchup">${pick.date}</div>
                <div class="pick-choice">✓ ${pick.teamName}</div>
            </div>
        `;
    });
    
    picksHTML += `
                <div class="footer">
                    Total Picks: ${Object.keys(userPicks).length} | Generated from Sports Pick 'Em Game
                </div>
            </div>
        </body>
        </html>
    `;
    
    return picksHTML;
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
