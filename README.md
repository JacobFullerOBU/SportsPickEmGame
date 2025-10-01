# Sports Pick 'Em Game

A web-based sports pick'em game where users can view upcoming sports matchups and pick which team they think will win.

## Live Demo

🔗 [Play the game here](https://jacobfullerobU.github.io/SportsPickEmGame/)

The game is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Features

- **Live Game Data**: Automatically fetches upcoming NFL and top 25 College Football games from ESPN API
- **Interactive Matchup Display**: View multiple sports matchups with team names, records, and game information
- **Easy Pick Selection**: Click on any team to select them as your winner
- **Visual Feedback**: Selected teams are highlighted with a gradient background
- **Pick Summary**: See all your picks summarized in one place
- **Download Picks**: Save or print your picks summary for sharing or record-keeping
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Sports**: Supports NFL, College Football, and more

## How to Use

1. Open `index.html` in a web browser or visit the [live demo](https://jacobfullerobU.github.io/SportsPickEmGame/)
2. The app will automatically load the latest NFL and top 25 College Football games
3. Browse through the available matchups
4. Click on the team you think will win for each matchup
5. Review your picks in the "Your Picks" section
6. Click "Submit All Picks" when you're ready to submit
7. Click "Download Picks Summary" to save or print your picks for your records

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - JavaScript functionality and matchup data

## Customization

The app automatically fetches live game data from ESPN's public API. If you want to customize the data sources or add manual matchups, edit the `sampleMatchups` array in `script.js`:

```javascript
const sampleMatchups = [
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
    // Add more matchups...
];
```

### API Integration

The app uses ESPN's public APIs to fetch:
- **NFL Games**: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
- **College Football Games**: `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`

If the APIs are unavailable, the app automatically falls back to sample data.

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on every push to the `main` branch
2. Uploads the static files (HTML, CSS, JS) to GitHub Pages
3. Makes the site available at https://jacobfullerobU.github.io/SportsPickEmGame/

To set up GitHub Pages for your own repository:
1. Go to repository Settings > Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push changes to the main branch to trigger deployment

## License

This project is open source and available for anyone to use and modify.
