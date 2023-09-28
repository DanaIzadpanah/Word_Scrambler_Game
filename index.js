// File name: index.jsx
// Author: Dana Izadpanah
// userid: Izadpadn
// Email: dana.n.izadpanah@vanderbilt.edu
// Description: Provides a backend server for the scrambled word game. Uses express to serve API endpoints for game functionalities. Uses cors for handling cross-origin requests. Reads a list of words from 'english-words.csv'. Serves endpoints to get a scrambled word, submit a guess, and reset the game. Keeps track of the score and the number of incorrect guesses.

const express = require('express'); // a popular framework for building web applications in Node.js.
const cors = require('cors'); // Cross-Origin Resource Sharing
const app = express();
const PORT = 3000; // May need to change PORT to something else if 3000 is already in use
const fs = require('fs');

let incorrectCount = 0;
let words = [];
let currentWord = ''; 

fs.readFile('english-words.csv', 'utf8', (err, data) => {
    if (err) throw err;
    words = data.split('\n');  // Assuming one word per line
});

app.use(cors());

let score = 0;

app.get('/hello', (req, res) => {
    res.send('hello world!');
});

app.get('/score', (req, res) => {
    res.send(`${score}`);
    console.log(currentWord);
});

app.patch('/score', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
})

const scrambleWord = (word) => {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray.join('');
  };

app.get('/getWord', (req, res) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].trim();  // Store the original word
    console.log(`Original word: ${currentWord}`);  // Debugging
    
    const scrambled = scrambleWord(currentWord);  // Scramble the word
    console.log(`Scrambled word: ${scrambled}`);  // Debugging
    
    res.json({ 
        scrambled: scrambled,
        correct: currentWord
    });  // Send the scrambled word to frontend
});


app.patch('/guessWord', (req, res) => {
    const sanitizedCurrentWord = currentWord.trim().toLowerCase();
    const sanitizedGuessWord = req.query.word.trim().toLowerCase();
    
    if (sanitizedGuessWord === sanitizedCurrentWord) {
        score += 1;
        res.status(200).json({ success: true, newScore: score, incorrectCount });
    } else {
        incorrectCount += 1;
        res.status(200).json({ success: false, newScore: score, incorrectCount });
    }
});


app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});

app.patch('/reset', (req, res) => {
    score = 0;
    incorrectCount = 0;
    console.log("Backend after reset -> Score:", score, " IncorrectCount:", incorrectCount);
    res.status(200).send("Game reset successfully");
});
