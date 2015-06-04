# draughts-reader-core

The draughts-reader-core library is a pure javascript engine to define and read draughts game. No user interface is provided. It is an "in-memory" game representation.

## Quick start
- Install : `$ npm install`
- Launch tests : `$ npm test`
- Build : `$ npm run build` (NB : using browserify)


## Simple example
There are 3 main objects : `Game`, `DraughtBoard` and `Piece`.

**Define initial position and movements**
```javascript
var game = new Game();
var board = game.board;

// Initial position
board
  .setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44])
  .setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24])
  .setPosition(Piece.DAME_WHITE, [])
  .setPosition(Piece.DAME_BLACK, []);

// Different ways to define the list of movements
game
  .addMove(33, 29)
  .addMove(24, 42, [33])
  .addMove(43, 38)
  .addMoveTxt("42x33")
  .addMoveTxt("39x10");
```

**Read position, apply moves and get detailed information**
```javascript
// Set initial position
game.start();

// Reading some squares
var p1 = board.getPiece(1);
var p33 = board.getPiece(33);
console.log(p1  == Piece.EMPTY);      // true
console.log(p33 == Piece.PAWN_WHITE); // true

// Iterate all squares
for (var k = 1; k <= board.conf['SQ_MAX_NUM']; k++) {
    var p = board.getPiece(k);
    switch (p) {
    case Piece.PAWN_WHITE:
        console.log("Square " + k + " : PAWN_WHITE");
        break;
    case Piece.PAWN_BLACK:
        console.log("Square " + k + " : PAWN_BLACK");
        break;
    case Piece.DAME_WHITE:
        console.log("Square " + k + " : DAME_WHITE");
        break;
    case Piece.DAME_BLACK:
        console.log("Square " + k + " : DAME_BLACK");
        break;
    default:
        // Empty square
    }
}

/* Results :
Square 12 : PAWN_BLACK
Square 13 : PAWN_BLACK
Square 14 : PAWN_BLACK
Square 22 : PAWN_BLACK
Square 24 : PAWN_BLACK
Square 33 : PAWN_WHITE
Square 38 : PAWN_WHITE
Square 39 : PAWN_WHITE
Square 43 : PAWN_WHITE
Square 44 : PAWN_WHITE
*/

// What's append on next move ?
var m = game.getNextMove();
console.log(m);

/*  Results :
{   startingSquareNum: 33,
    endingSquareNum: 29,
    middleSquaresNum: [],
    color: 1,
    isCaptured: false,
    isCrowned: false,
    landingSquaresNum: [],
    capturedSquares: [],
    status: true,
    message: '' }
*/


// We apply it.
game.next();

// What's append on next move ?
m = game.getNextMove();
console.log(m);

/*  Results :
{   startingSquareNum: 24,
    endingSquareNum: 42,
    middleSquaresNum: [ 33 ],
    color: 2,
    isCaptured: true,
    isCrowned: false,
    landingSquaresNum: [ 33, 42 ],
    capturedSquares: [ { number: 29, piece: 1 }, { number: 38, piece: 1 } ],
    status: true,
    message: '' }
*/

// Reading game
game.start();
while (game.hasNext()){
    var m = game.getNextMove();
    console.log(m.getNotation());

    game.next();
}

/*  Results :
33-29
24x33x42
43-38
42x33
39x10
*/
```

## API

### Piece

Draught board consists of squares on which the piece are located including :
- `Piece.EMPTY` : Empty square
- `Piece.PAWN_WHITE`
- `Piece.PAWN_BLACK`
- `Piece.DAME_WHITE`
- `Piece.DAME_BLACK`

### Color

The color of the piece on the square :
- `Color.NONE` : Empty square
- `Color.WHITE`
- `Color.BLACK`

### DraughtBoard

`DraughtBoard(boardSize)`
Constructor : Create an empty draughts board. Default board size is 10 for International 10x10 Draughts. It is also possible to set 8 for Bresilian game or 12 for Canadian game, using the international rules.

`.setInitialPosition()`
Add pieces on draught board to set the initial position. Default is 20  pawns on each side, depending of boardsize (cf. constructor).

`.setPosition(piece, numbers)`
Put Piece on squares.

`.setPiece(piece, number)`
Put Piece on specified square.

`.getPiece(number)`
return the piece located on the square number.

`.isPiece(piece, number)`
is this piece located on the specified square ?

`.getColor(number)`
return the piece color located on the specified square.

`.applyMove(move)`
Apply move on draughts board. So, the board position will change.

`.applyMoveRev(move)`
Cancel the move (Read move in reverse). So, the board position will change.

### Game

`Game(boardSize)`
Constructor. A Game includes a board and a list of movements. We can apply the movements on the board. Thus the position of the pieces on the board change. (boardSize : See DraughtBoard)

`.addMove(startNum, endNum, middleSquaresNum)`
Define a Move and add it to list of movements. startNum : first square number ; endNum : Last square number ; middleSquaresNum : list of square number (not required) use it if path is ambiguous.

`.addMoveTxt(move)`
Other way to define a Move. Examples : "40-34" ; "24x42" ; "24x33x42"

`.getNotation()`
Get a structure to easily display text notation.
The structure can be defined like this :
```
notation ::= [line]
line ::= {'number':int, 'white':moveNotation, 'black':moveNotation}
moveNotation ::= {'move':textNotation, 'current':boolean}
textNotation ::= \d[x|-]\d
```
```
[{'number':1,
  'white':{'move':'35-30', 'current':false},
  'black':{'move':'25x34', 'current':false}
 }, ...]
```

`.hasMove()`
True if there exists at least one move.

`.start()`
Set the DraugthBoard in the initial position. No movement has been played.

`.end()`
Set the DraugthBoard in the final position. All movements has been played.

`.next()`
Apply the next move and set the board in the new position.

`.prev()`
Apply (backward) the previous move and set the board in the new position.

`.setCursor(position)`
Set the board in the specified position, applying moves from start number to position number.

`.hasNext()`
Is there a move after the current move ?

`.hasPrev()`
Is there a move before the current move ?

`.getCurrentMove()`
Return the current Move object.

`.getNextMove()`
Return the next Move Object to apply (relative to the current Move).

`.getPrevMove()`
Return the previous Move Object  (relative to the current Move).


`.debug()`
`.debugFull()`
