document.getElementById('edit-distance-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const string1 = document.getElementById('string1').value;
    const string2 = document.getElementById('string2').value;
    
    fetch('/edit-distance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ string1, string2 })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = `Minimum Edit Distance: ${data.distance}`;
        displayGrid(data.dp, data.backtrack, string1, string2);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayGrid(dp, backtrack, string1, string2) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    // Add the first row with string2 characters
    const firstRow = document.createElement('div');
    firstRow.className = 'grid-row';
    firstRow.appendChild(createCell(''));
    for (let j = 0; j < string2.length; j++) {
        firstRow.appendChild(createCell(string2[j]));
    }
    gridContainer.appendChild(firstRow);

    // Add the rest of the grid
    for (let i = 0; i <= string1.length; i++) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        if (i > 0) {
            row.appendChild(createCell(string1[i - 1]));
        } else {
            row.appendChild(createCell(''));
        }
        for (let j = 0; j <= string2.length; j++) {
            const cell = createCell(dp[i][j] + '\n' + backtrack[i][j]);
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        gridContainer.appendChild(row);
    }

    // Highlight the MED path
    highlightPath(dp, backtrack, string1.length, string2.length);
}

function createCell(content) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.innerText = content;
    return cell;
}

function highlightPath(dp, backtrack, len1, len2) {
    let i = len1;
    let j = len2;

    while (i > 0 || j > 0) {
        const cell = document.getElementById(`cell-${i}-${j}`);
        cell.classList.add('highlight');

        if (backtrack[i][j] === '↖') {
            i--;
            j--;
        } else if (backtrack[i][j] === '↑') {
            i--;
        } else if (backtrack[i][j] === '←') {
            j--;
        }
    }
    // Highlight the starting cell
    document.getElementById(`cell-0-0`).classList.add('highlight');
}
