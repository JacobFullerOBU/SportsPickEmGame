# Sports Pick 'Em Game

A web-based sports pick'em game where users can view upcoming sports matchups and pick which team they think will win.

## Features

- **Interactive Matchup Display**: View multiple sports matchups with team names, records, and game information
- **Easy Pick Selection**: Click on any team to select them as your winner
- **Visual Feedback**: Selected teams are highlighted with a gradient background
- **Pick Summary**: See all your picks summarized in one place
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Sports**: Supports NFL, NBA, College Football, and more

## How to Use

1. Open `index.html` in a web browser
2. Browse through the available matchups
3. Click on the team you think will win for each matchup
4. Review your picks in the "Your Picks" section
5. Click "Submit All Picks" when you're ready to submit

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - JavaScript functionality and matchup data

## Customization

To add or modify matchups, edit the `matchups` array in `script.js`:

```javascript
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
    // Add more matchups...
];
```

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available for anyone to use and modify.
