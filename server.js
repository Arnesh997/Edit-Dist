const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function editDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const dp = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    const backtrack = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(''));

    for (let i = 0; i <= len1; i++) {
        for (let j = 0; j <= len2; j++) {
            if (i === 0) {
                dp[i][j] = j;
                backtrack[i][j] = '←';
            } else if (j === 0) {
                dp[i][j] = i;
                backtrack[i][j] = '↑';
            } else if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                backtrack[i][j] = '↖';
            } else {
                const insertion = dp[i][j - 1] + 1;
                const deletion = dp[i - 1][j] + 1;
                const substitution = dp[i - 1][j - 1] + 1;

                dp[i][j] = Math.min(insertion, deletion, substitution);

                if (dp[i][j] === insertion) {
                    backtrack[i][j] = '←';
                } else if (dp[i][j] === deletion) {
                    backtrack[i][j] = '↑';
                } else {
                    backtrack[i][j] = '↖';
                }
            }
        }
    }
    return { distance: dp[len1][len2], dp, backtrack };
}

app.post('/edit-distance', (req, res) => {
    const { string1, string2 } = req.body;
    const result = editDistance(string1, string2);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
