class LudoGame {
  constructor() {
    this.teams = ["red", "blue", "yellow", "green"];
    this.teamNames = {
      red: "Merah",
      blue: "Biru",
      yellow: "Kuning",
      green: "Hijau",
    };
    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };
    this.positions = { red: -1, blue: -1, yellow: -1, green: -1 }; // -1 means in basecamp
    this.currentTeam = 0;
    this.questionCount = 0;
    this.maxQuestions = 20;
    this.gameStarted = false;
    this.gameEnded = false;
    this.currentQuestion = null;
    this.timer = null;
    this.timeLeft = 0;
    this.isAnswering = false;
    this.isStealPhase = false;
    this.isAnimating = false; // Flag to prevent multiple animations
    this.isJuryPhase = false; // New: Phase for jury to allow answer
    this.isSpecialZoneQuestion = false; // New: Track if current question is from special zone

    // Board layout - 68 squares total
    this.boardLayout = this.createBoardLayout();
    this.paths = this.createPaths();
    this.questions = this.createQuestions();

    this.initializeBoard();
    this.initializeEventListeners();
    this.updateDisplay();
  }

  createBoardLayout() {
    // Standard Ludo board with 15x15 grid
    const layout = [];

    // Create the standard Ludo board layout
    // The board is a 15x15 grid where:
    // - Corners are home areas (6x6 each)
    // - Center cross forms the main path
    // - Colored paths lead to center

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const square = {
          id: row * 15 + col,
          row,
          col,
          type: "empty",
          team: null,
        };

        // Define main path (outer track)
        // Top row of main path
        if (row === 6 && col >= 1 && col <= 5) {
          square.type = "path";
          if (col === 2) {
            square.type = "start";
            square.team = "blue";
          }
        }
        if (row === 8 && col >= 9 && col <= 13) {
          square.type = "path";
          if (col === 12) {
            square.type = "start";
            square.team = "green";
          }
        }
        if (col === 6 && row >= 9 && row <= 13) {
          square.type = "path";
          if (row === 12) {
            square.type = "start";
            square.team = "red";
          }
        }
        if (col === 8 && row >= 1 && row <= 5) {
          square.type = "path";
          if (row === 2) {
            square.type = "start";
            square.team = "yellow";
          }
        }

        // Bottom row of main path
        if (row === 8 && col >= 1 && col <= 5) {
          square.type = "path";
          if (col === 2) {
            square.type = "special";
          }
        }
        if (row === 6 && col >= 9 && col <= 13) {
          square.type = "path";
          if (col === 12) {
            square.type = "special";
          }
        }

        // Left column of main path
        if (col === 6 && row >= 1 && row <= 5) {
          square.type = "path";
          if (row === 2) {
            square.type = "special";
          }
        }

        // Right column of main path
        if (col === 8 && row >= 9 && row <= 13) {
          square.type = "path";
          if (row === 12) {
            square.type = "special";
          }
        }

        // Colored paths to center
        if (row === 7) {
          if (col >= 1 && col <= 6) {
            square.type = "colored";
            square.team = "blue";
            if (col === 6) square.type = "checkpoint";
          } else if (col >= 8 && col <= 13) {
            square.type = "colored";
            square.team = "green";
            if (col === 8) square.type = "checkpoint";
          }
        }

        if (col === 7) {
          if (row >= 1 && row <= 6) {
            square.type = "colored";
            square.team = "yellow";
            if (row === 6) square.type = "checkpoint";
          } else if (row >= 8 && row <= 13) {
            square.type = "colored";
            square.team = "red";
            if (row === 8) square.type = "checkpoint";
          }
        }

        // Center square
        if (row === 7 && col === 7) {
          square.type = "center";
        }

        // Only add non-empty squares to layout
        if (square.type !== "empty") {
          layout.push(square);
        }
      }
    }

    return layout;
  }

  createPaths() {
    return {
      red: [
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 12, col: 7 },
        { row: 11, col: 7 },
        { row: 10, col: 7 },
        { row: 9, col: 7 },
        { row: 8, col: 7 },
      ],
      blue: [
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 7, col: 2 },
        { row: 7, col: 3 },
        { row: 7, col: 4 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
      ],
      yellow: [
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 2, col: 7 },
        { row: 3, col: 7 },
        { row: 4, col: 7 },
        { row: 5, col: 7 },
        { row: 6, col: 7 },
      ],
      green: [
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 7, col: 12 },
        { row: 7, col: 11 },
        { row: 7, col: 10 },
        { row: 7, col: 9 },
        { row: 7, col: 8 },
      ],
    };
  }

  createQuestions() {
    const questions = [
      // Easy questions (10 seconds)
      {
        difficulty: "easy",
        text: "Berapa hasil dari 5 + 3?",
        answer: "8",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Apa ibu kota Indonesia?",
        answer: "jakarta",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Berapa jumlah hari dalam seminggu?",
        answer: "7",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Warna apa yang dihasilkan dari campuran merah dan putih?",
        answer: "merah muda",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Planet terdekat dengan matahari adalah?",
        answer: "merkurius",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Berapa hasil dari 10 - 4?",
        answer: "6",
        time: 10,
      },
      {
        difficulty: "easy",
        text: "Hewan apa yang dikenal sebagai raja hutan?",
        answer: "singa",
        time: 10,
      },

      // Medium questions (12 seconds)
      {
        difficulty: "medium",
        text: "Siapa penemu lampu pijar?",
        answer: "thomas edison",
        time: 12,
      },
      {
        difficulty: "medium",
        text: "Berapa hasil dari 15 × 4?",
        answer: "60",
        time: 12,
      },
      {
        difficulty: "medium",
        text: "Apa nama sungai terpanjang di dunia?",
        answer: "nil",
        time: 12,
      },
      {
        difficulty: "medium",
        text: "Dalam sistem tata surya, berapa jumlah planet?",
        answer: "8",
        time: 12,
      },
      {
        difficulty: "medium",
        text: "Apa rumus kimia air?",
        answer: "h2o",
        time: 12,
      },
      {
        difficulty: "medium",
        text: "Siapa presiden pertama Indonesia?",
        answer: "soekarno",
        time: 12,
      },

      // Hard questions (15 seconds)
      {
        difficulty: "hard",
        text: "Apa nama teori evolusi yang dikemukakan oleh Charles Darwin?",
        answer: "seleksi alam",
        time: 15,
      },
      {
        difficulty: "hard",
        text: "Berapa hasil dari √144?",
        answer: "12",
        time: 15,
      },
      {
        difficulty: "hard",
        text: 'Siapa yang menulis novel "Laskar Pelangi"?',
        answer: "andrea hirata",
        time: 15,
      },
      {
        difficulty: "hard",
        text: "Apa nama proses fotosintesis pada tumbuhan?",
        answer: "fotosintesis",
        time: 15,
      },
      {
        difficulty: "hard",
        text: "Berapa jumlah tulang dalam tubuh manusia dewasa?",
        answer: "206",
        time: 15,
      },
      {
        difficulty: "hard",
        text: "Apa nama satelit alami bumi?",
        answer: "bulan",
        time: 15,
      },

      // Special zone question
      {
        difficulty: "special",
        text: 'Sebutkan 3 negara ASEAN yang dimulai dengan huruf "M"!',
        answer: "malaysia myanmar myanmar",
        time: 15,
      },
    ];

    return this.shuffleArray(questions);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  initializeBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = ""; // Clear existing board

    // Create home areas first
    const homeAreas = [
      { team: "blue", gridRow: "2 / span 5", gridColumn: "2 / span 5" },
      { team: "yellow", gridRow: "2 / span 5", gridColumn: "10 / span 5" },
      { team: "red", gridRow: "10 / span 5", gridColumn: "2 / span 5" },
      { team: "green", gridRow: "10 / span 5", gridColumn: "10 / span 5" },
    ];

    homeAreas.forEach((home) => {
      const homeAreaEl = document.createElement("div");
      homeAreaEl.classList.add("home-area", home.team);
      homeAreaEl.style.gridRow = home.gridRow;
      homeAreaEl.style.gridColumn = home.gridColumn;
      board.appendChild(homeAreaEl);

      // Create pieces and append to home area
      const piece = document.createElement("div");
      piece.classList.add("piece", home.team);
      piece.id = `piece-${home.team}`;
      piece.textContent = home.team.charAt(0).toUpperCase();
      homeAreaEl.appendChild(piece);

      // Add logo image
      const logo = document.createElement("img");
      logo.classList.add("home-logo");
      logo.src = `./${home.team}.png`; // Assuming logo images are named after team colors
      homeAreaEl.appendChild(logo);
    });

    // Create board squares
    this.boardLayout.forEach((square) => {
      const squareEl = document.createElement("div");
      squareEl.classList.add("square", square.type);
      if (square) {
        squareEl.className = `square ${square.type}${
          square.team ? " " + square.team : ""
        }`;
        squareEl.id = `square-${square.id}`;
        squareEl.style.gridRow = square.row + 1;
        squareEl.style.gridColumn = square.col + 1;

        // Add content based on square type
        if (square.type === "start") {
          squareEl.textContent = "★";
        } else if (square.type === "special") {
          squareEl.textContent = "◆";
        } else if (square.type === "checkpoint") {
          squareEl.textContent = "♦";
        } else if (square.type === "center") {
          squareEl.textContent = "♔";
        }
      } else {
        // Empty square
        squareEl.className = "square empty";
        squareEl.style.gridRow = square.row + 1;
        squareEl.style.gridColumn = square.col + 1;
        squareEl.style.background = "transparent";
        squareEl.style.border = "none";
      }

      board.appendChild(squareEl);
    });
  }

  // Enhanced piece movement with smooth animations
  async movePiece(team, steps) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const piece = document.getElementById(`piece-${team}`);
    const currentPosition = this.positions[team];
    const teamPath = this.paths[team];

    // Calculate new position
    let newPosition = currentPosition + steps;

    // Handle starting from basecamp
    if (currentPosition === -1) {
      newPosition = Math.min(steps - 1, teamPath.length - 1);
    } else {
      newPosition = Math.min(currentPosition + steps, teamPath.length - 1);
    }

    // Animate piece movement step by step
    await this.animateStepByStep(
      piece,
      team,
      currentPosition,
      newPosition,
      teamPath
    );

    // Update position
    this.positions[team] = newPosition;

    // Check for collisions and special squares
    this.handleSpecialSquares(team, newPosition);

    this.isAnimating = false;
  }

  // NEW: Move piece backward (for special zone wrong answer)
  async movePieceBackward(team, steps) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const piece = document.getElementById(`piece-${team}`);
    const currentPosition = this.positions[team];
    const teamPath = this.paths[team];

    // Calculate new position (backward)
    let newPosition = Math.max(currentPosition - steps, 0);

    // If would go to negative, send to basecamp
    if (newPosition < 0) {
      await this.sendToBasecamp(team);
      this.isAnimating = false;
      return;
    }

    // Animate piece movement step by step backward
    await this.animateStepByStepBackward(
      piece,
      team,
      currentPosition,
      newPosition,
      teamPath
    );

    // Update position
    this.positions[team] = newPosition;

    this.isAnimating = false;
  }

  async animateStepByStepBackward(piece, team, startPos, endPos, path) {
    const stepDelay = 200; // Delay between each step in milliseconds

    // Animate each step along the path backward
    for (let i = startPos - 1; i >= endPos; i--) {
      if (i >= 0 && i < path.length) {
        const targetSquare = path[i];
        await this.animateSingleStep(
          piece,
          targetSquare.row + 1,
          targetSquare.col + 1
        );

        // Highlight the path briefly
        this.highlightSquare(targetSquare.row, targetSquare.col);

        await this.delay(stepDelay);
      }
    }

    // Final animation
    piece.classList.add("bouncing");
    setTimeout(() => {
      piece.classList.remove("bouncing");
    }, 600);
  }

  async animateStepByStep(piece, team, startPos, endPos, path) {
    const stepDelay = 200; // Delay between each step in milliseconds

    // If starting from basecamp, move to start position first
    if (startPos === -1) {
      const startSquare = this.boardLayout.find(
        (s) => s.type === "start" && s.team === team
      );
      if (startSquare) {
        // Remove piece from home area dan add ke board
        const homeArea = document.querySelector(`.home-area.${team}`);
        const board = document.getElementById("gameBoard");

        if (homeArea && homeArea.contains(piece)) {
          homeArea.removeChild(piece);
          board.appendChild(piece);
        }

        await this.animateSingleStep(
          piece,
          startSquare.row + 1,
          startSquare.col + 1
        );
        await this.delay(stepDelay);
      }
      startPos = 0;
    }

    // Animate each step along the path
    for (let i = startPos + 1; i <= endPos; i++) {
      if (i < path.length) {
        const targetSquare = path[i];
        await this.animateSingleStep(
          piece,
          targetSquare.row + 1,
          targetSquare.col + 1
        );

        // Highlight the path briefly
        this.highlightSquare(targetSquare.row, targetSquare.col);

        await this.delay(stepDelay);
      }
    }

    // Final celebration animation
    piece.classList.add("celebrating");
    setTimeout(() => {
      piece.classList.remove("celebrating");
    }, 1000);
  }

  async animateSingleStep(piece, gridRow, gridCol) {
    return new Promise((resolve) => {
      // Add moving animation class
      piece.classList.add("moving");

      // Update position
      piece.style.gridRow = gridRow;
      piece.style.gridColumn = gridCol;

      // Remove animation class after animation completes
      setTimeout(() => {
        piece.classList.remove("moving");
        resolve();
      }, 800); // Match the animation duration in CSS
    });
  }

  highlightSquare(row, col) {
    const squareEl = document.querySelector(
      `[style*="grid-row: ${row + 1}"][style*="grid-column: ${col + 1}"]`
    );
    if (squareEl && squareEl.classList.contains("square")) {
      squareEl.classList.add("highlight-path");
      setTimeout(() => {
        squareEl.classList.remove("highlight-path");
      }, 500);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  handleSpecialSquares(team, position) {
    const teamPath = this.paths[team];
    if (position >= 0 && position < teamPath.length) {
      const currentSquare = teamPath[position];
      const square = this.boardLayout.find(
        (s) => s.row === currentSquare.row && s.col === currentSquare.col
      );

      if (square) {
        const piece = document.getElementById(`piece-${team}`);

        if (square.type === "special") {
          // Add glowing effect for special squares
          piece.classList.add("glowing");
          setTimeout(() => {
            piece.classList.remove("glowing");
          }, 2000);
        } else if (square.type === "checkpoint") {
          // Add celebration effect for checkpoint
          piece.classList.add("celebrating");
          setTimeout(() => {
            piece.classList.remove("celebrating");
          }, 1500);

          // NEW: Add bonus points for reaching checkpoint
          this.scores[team] += 150;
          this.updateDisplay();

          // Check for win condition
          if (position === teamPath.length - 1) {
            this.endGame(team);
          }
        }
      }
    }

    // Check for collisions with other pieces
    this.checkCollisions(team, position);
  }

  checkCollisions(team, position) {
    const teamPath = this.paths[team];
    if (position < 0 || position >= teamPath.length) return;

    const currentSquare = teamPath[position];

    // Check if any other team is on the same square
    for (const otherTeam of this.teams) {
      if (otherTeam === team) continue;

      const otherPosition = this.positions[otherTeam];
      if (otherPosition >= 0) {
        const otherPath = this.paths[otherTeam];
        if (otherPosition < otherPath.length) {
          const otherSquare = otherPath[otherPosition];

          // If on the same square and not in safe zones
          if (
            currentSquare.row === otherSquare.row &&
            currentSquare.col === otherSquare.col
          ) {
            const square = this.boardLayout.find(
              (s) => s.row === currentSquare.row && s.col === currentSquare.col
            );

            // Only send back to basecamp if not in safe zones (home, start, colored path, special zone)
            if (square && square.type === "path") {
              this.sendToBasecamp(otherTeam);
            }
          }
        }
      }
    }
  }

  async sendToBasecamp(team) {
    const piece = document.getElementById(`piece-${team}`);
    const homeArea = document.querySelector(`.home-area.${team}`);

    if (homeArea && piece) {
      // Add bouncing animation to show the piece was sent back
      piece.classList.add("bouncing");

      // Move back to home after a short delay
      setTimeout(() => {
        // Remove piece from current position
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }

        // Add piece back to home area
        homeArea.appendChild(piece);

        // Reset position
        this.positions[team] = -1;
        piece.classList.remove("bouncing");
      }, 300);
    }
  }

  initializeEventListeners() {
    // Start game button
    document.getElementById("startGame").addEventListener("click", () => {
      this.startGame();
    });

    // Reset game button
    document.getElementById("resetGame").addEventListener("click", () => {
      this.resetGame();
    });

    // Show rules button
    document.getElementById("showRules").addEventListener("click", () => {
      document.getElementById("rulesModal").style.display = "block";
    });

    // Close rules modal
    document.querySelector(".close").addEventListener("click", () => {
      document.getElementById("rulesModal").style.display = "none";
    });

    // Submit answer button
    document.getElementById("submitAnswer").addEventListener("click", () => {
      this.submitAnswer();
    });

    // Answer input enter key
    document.getElementById("answerInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.submitAnswer();
      }
    });

    // NEW: Difficulty selection buttons
    document.querySelectorAll(".difficulty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const difficulty = e.target.dataset.difficulty;
        this.selectDifficulty(difficulty);
      });
    });

    // NEW: Jury allow answer button
    document.getElementById("juryAllowAnswer").addEventListener("click", () => {
      this.allowAnswer();
    });

    // Steal buttons
    document.querySelectorAll(".steal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const team = e.target.dataset.team;
        this.handleSteal(team);
      });
    });

    // Play again button
    document.getElementById("playAgain").addEventListener("click", () => {
      document.getElementById("gameOverModal").style.display = "none";
      this.resetGame();
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      const rulesModal = document.getElementById("rulesModal");
      const gameOverModal = document.getElementById("gameOverModal");
      if (e.target === rulesModal) {
        rulesModal.style.display = "none";
      }
      if (e.target === gameOverModal) {
        gameOverModal.style.display = "none";
      }
    });
  }

  startGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.questionCount = 0;
    this.currentTeam = 0;
    this.isStealPhase = false;

    document.getElementById("startGame").style.display = "none";
    this.showDifficultySelection();
  }

  resetGame() {
    // Reset all game state
    this.gameStarted = false;
    this.gameEnded = false;
    this.questionCount = 0;
    this.currentTeam = 0;
    this.isStealPhase = false;
    this.isAnimating = false;
    this.isJuryPhase = false;
    this.isSpecialZoneQuestion = false;
    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };
    this.positions = { red: -1, blue: -1, yellow: -1, green: -1 };

    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Reset UI
    document.getElementById("startGame").style.display = "inline-block";
    document.getElementById("answerSection").style.display = "none";
    document.getElementById("stealSection").style.display = "none";
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("jurySection").style.display = "none";
    document.getElementById("answerInput").value = "";
    document.getElementById("questionText").textContent =
      'Klik "Mulai Permainan" untuk memulai';

    // Reset pieces to home positions
    this.teams.forEach((team) => {
      const piece = document.getElementById(`piece-${team}`);
      const homeArea = document.querySelector(`.home-area.${team}`);

      if (homeArea && piece) {
        // Remove piece from current position
        if (piece.parentNode && piece.parentNode !== homeArea) {
          piece.parentNode.removeChild(piece);
        }

        // Add piece back to home area if not already there
        if (!homeArea.contains(piece)) {
          homeArea.appendChild(piece);
        }

        // Remove all animation classes
        piece.classList.remove("moving", "bouncing", "celebrating", "glowing");
      }
    });
    this.updateDisplay();
  }

  // NEW: Show difficulty selection for current team
  showDifficultySelection() {
    if (this.questionCount >= this.maxQuestions || this.gameEnded) {
      this.endGame();
      return;
    }

    // Check if current team is on special zone
    const currentTeamName = this.teams[this.currentTeam];
    const position = this.positions[currentTeamName];
    const teamPath = this.paths[currentTeamName];
    
    if (position >= 0 && position < teamPath.length) {
      const currentSquare = teamPath[position];
      const square = this.boardLayout.find(
        (s) => s.row === currentSquare.row && s.col === currentSquare.col
      );
      
      if (square && square.type === "special") {
        // Automatically give special zone question
        this.isSpecialZoneQuestion = true;
        this.selectDifficulty("special");
        return;
      }
    }

    this.isSpecialZoneQuestion = false;
    
    // Show difficulty selection UI
    document.getElementById("difficultySelection").style.display = "block";
    document.getElementById("answerSection").style.display = "none";
    document.getElementById("stealSection").style.display = "none";
    document.getElementById("jurySection").style.display = "none";
    
    document.getElementById("questionText").textContent = 
      `Tim ${this.teamNames[currentTeamName]}, pilih tingkat kesulitan soal:`;
  }

  // NEW: Select difficulty and get question
  selectDifficulty(difficulty) {
    this.questionCount++;

    // Get question based on difficulty
    const availableQuestions = this.questions.filter((q) => !q.used && q.difficulty === difficulty);
    if (availableQuestions.length === 0) {
      // If no questions of selected difficulty, get any available question
      const anyAvailable = this.questions.filter((q) => !q.used);
      if (anyAvailable.length === 0) {
        this.endGame();
        return;
      }
      this.currentQuestion = anyAvailable[0];
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      this.currentQuestion = availableQuestions[randomIndex];
    }
    
    this.currentQuestion.used = true;

    // Hide difficulty selection
    document.getElementById("difficultySelection").style.display = "none";
    
    // Update UI and show question
    this.updateDisplay();
    this.showQuestion();
    this.startQuestionReadingTimer();
  }

  // NEW: Start timer for question reading
  startQuestionReadingTimer() {
    // Give 3 seconds for question reading
    this.timeLeft = 3;
    document.getElementById("questionText").textContent = 
      `${this.currentQuestion.text} (Soal sedang dibacakan...)`;
    
    this.updateTimer();
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.showJurySection();
      }
    }, 1000);
  }

  // NEW: Show jury section to allow answer
  showJurySection() {
    this.isJuryPhase = true;
    document.getElementById("jurySection").style.display = "block";
    document.getElementById("questionText").textContent = this.currentQuestion.text;
    document.getElementById("timer").textContent = "⏸";
  }

  // NEW: Jury allows team to answer
  allowAnswer() {
    this.isJuryPhase = false;
    document.getElementById("jurySection").style.display = "none";
    document.getElementById("answerSection").style.display = "flex";
    document.getElementById("answerInput").focus();
    
    // Start answer timer (5 seconds)
    this.timeLeft = 5;
    this.updateTimer();
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeUp();
      }
    }, 1000);
  }

  nextQuestion() {
    if (this.questionCount >= this.maxQuestions || this.gameEnded) {
      this.endGame();
      return;
    }

    this.isStealPhase = false;
    this.isJuryPhase = false;
    this.isSpecialZoneQuestion = false;

    // Update UI
    this.updateDisplay();
    this.showDifficultySelection();
  }

  showQuestion() {
    const questionText = document.getElementById("questionText");
    const difficultyBadge = document.getElementById("difficultyBadge");
    const answerSection = document.getElementById("answerSection");
    const stealSection = document.getElementById("stealSection");

    questionText.textContent = this.currentQuestion.text;
    difficultyBadge.textContent = this.getDifficultyText(
      this.currentQuestion.difficulty
    );
    difficultyBadge.className = `difficulty-badge ${this.currentQuestion.difficulty}`;

    answerSection.style.display = "none"; // Will be shown after jury allows
    stealSection.style.display = "none";

    document.getElementById("answerInput").value = "";
  }

  getDifficultyText(difficulty) {
    const texts = {
      easy: "Mudah",
      medium: "Sedang",
      hard: "Sulit",
      special: "Special",
    };
    return texts[difficulty] || "Mudah";
  }

  startTimer() {
    this.timeLeft = this.currentQuestion.time;
    this.updateTimer();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeUp();
      }
    }, 1000);
  }

  updateTimer() {
    const timerEl = document.getElementById("timer");
    timerEl.textContent = this.timeLeft;

    if (this.timeLeft <= 3) {
      timerEl.classList.add("warning");
    } else {
      timerEl.classList.remove("warning");
    }
  }

  handleTimeUp() {
    if (!this.isStealPhase) {
      this.showStealPhase();
    } else {
      this.nextTurn();
    }
  }

  submitAnswer() {
    if (!this.currentQuestion || this.isAnimating) return;

    const answer = document
      .getElementById("answerInput")
      .value.trim()
      .toLowerCase();
    const correctAnswer = this.currentQuestion.answer.toLowerCase();

    clearInterval(this.timer);

    if (answer === correctAnswer) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  async handleCorrectAnswer() {
    const currentTeamName = this.teams[this.currentTeam];
    let points, steps;
    
    if (this.isStealPhase) {
      // Different points and steps for steal phase
      points = this.getStealPoints(this.currentQuestion.difficulty);
      steps = this.getStealSteps(this.currentQuestion.difficulty);
    } else {
      points = this.getPoints(this.currentQuestion.difficulty);
      steps = this.getSteps(this.currentQuestion.difficulty);
    }

    // Update score
    this.scores[currentTeamName] += points;

    // Move piece with animation
    await this.movePiece(currentTeamName, steps);

    // Check win condition
    const position = this.positions[currentTeamName];
    const teamPath = this.paths[currentTeamName];
    if (position >= teamPath.length - 1) {
      this.endGame(currentTeamName);
      return;
    }

    this.nextTurn();
  }

  async handleWrongAnswer() {
    const currentTeamName = this.teams[this.currentTeam];
    
    // NEW: Handle special zone wrong answer
    if (this.isSpecialZoneQuestion && !this.isStealPhase) {
      // Move piece backward 2 steps
      await this.movePieceBackward(currentTeamName, 2);
      this.nextTurn();
      return;
    }
    
    if (!this.isStealPhase) {
      this.showStealPhase();
    } else {
      this.nextTurn();
    }
  }

  getPoints(difficulty) {
    const points = {
      easy: 100,
      medium: 150,
      hard: 200,
      special: 250,
    };
    return points[difficulty] || 100;
  }

  getSteps(difficulty) {
    const steps = {
      easy: 5,
      medium: 6,
      hard: 7,
      special: 5,
    };
    return steps[difficulty] || 5;
  }

  // NEW: Get points for steal phase
  getStealPoints(difficulty) {
    const points = {
      easy: 100,
      medium: 150,
      hard: 200,
      special: 250,
    };
    return points[difficulty] || 100;
  }

  // NEW: Get steps for steal phase
  getStealSteps(difficulty) {
    const steps = {
      easy: 3,
      medium: 4,
      hard: 5,
      special: 5,
    };
    return steps[difficulty] || 3;
  }

  showStealPhase() {
    this.isStealPhase = true;
    document.getElementById("answerSection").style.display = "none";
    document.getElementById("stealSection").style.display = "block";

    // Hide current team's steal button
    const currentTeamName = this.teams[this.currentTeam];
    document.querySelectorAll(".steal-btn").forEach((btn) => {
      if (btn.dataset.team === currentTeamName) {
        btn.style.display = "none";
      } else {
        btn.style.display = "inline-block";
      }
    });

    // NEW: Start timer for steal phase (5 seconds instead of 10)
    this.timeLeft = 5;
    this.updateTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.nextTurn();
      }
    }, 1000);
  }

  handleSteal(team) {
    if (!this.isStealPhase) return;

    clearInterval(this.timer);

    // Show answer input for stealing team
    this.isStealPhase = true; // Keep steal phase active
    const teamIndex = this.teams.indexOf(team);
    this.currentTeam = teamIndex;

    document.getElementById("stealSection").style.display = "none";
    document.getElementById("answerSection").style.display = "flex";
    document.getElementById("answerInput").focus();

    // Give 5 seconds to answer
    this.timeLeft = 5;
    this.updateTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.nextTurn();
      }
    }, 1000);
  }

  nextTurn() {
    this.currentTeam = (this.currentTeam + 1) % this.teams.length;

    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  }

  endGame(winner = null) {
    this.gameEnded = true;
    clearInterval(this.timer);

    const modal = document.getElementById("gameOverModal");
    const winnerMessage = document.getElementById("winnerMessage");
    const finalScores = document.getElementById("finalScores");

    if (winner) {
      winnerMessage.innerHTML = `<h3>🎉 Tim ${this.teamNames[winner]} Menang! 🎉</h3>`;
    } else {
      // Find winner by highest score
      let highestScore = 0;
      let winningTeam = null;

      for (const team of this.teams) {
        if (this.scores[team] > highestScore) {
          highestScore = this.scores[team];
          winningTeam = team;
        }
      }

      if (winningTeam) {
        winnerMessage.innerHTML = `<h3>🎉 Tim ${this.teamNames[winningTeam]} Menang dengan Skor Tertinggi! 🎉</h3>`;
      } else {
        winnerMessage.innerHTML = `<h3>Permainan Berakhir!</h3>`;
      }
    }

    // Show final scores
    let scoresHTML = "<h4>Skor Akhir:</h4><ul>";
    for (const team of this.teams) {
      scoresHTML += `<li>${this.teamNames[team]}: ${this.scores[team]} poin</li>`;
    }
    scoresHTML += "</ul>";
    finalScores.innerHTML = scoresHTML;

    modal.style.display = "block";
  }

  updateDisplay() {
    // Update current team indicator
    const currentTeamName = this.teams[this.currentTeam];
    const teamIndicator = document.getElementById("currentTeam");
    teamIndicator.textContent = this.teamNames[currentTeamName];
    teamIndicator.className = `team-indicator ${currentTeamName}`;

    // Update scores
    for (const team of this.teams) {
      document.getElementById(`${team}Score`).textContent = this.scores[team];
    }

    // Update question counter
    document.getElementById("questionCounter").textContent = this.questionCount;
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  new LudoGame();
});

