var
    symbols = require('../utils/symbols'),
    DraughtBoard =  require('../core/DraughtBoard'),
    Square = require('../core/Square'),
    Diagonal =  require('./Diagonal'),
    RafleItem = require('./RafleItem'),
    Move = require('../core/Move'),
    NTree = require('./NTree'),
    Piece = symbols.Piece
;


function PathFinder() {
}

PathFinder.prototype.getSimpleMovements = function(board, startingSquareNum) {
    var moves = []; // [Move]

    // Récupération des 2 diagonales
    var diagoGD = this._getDiagonalGD(board, startingSquareNum);
    var diagoTT = this._getDiagonalTT(board, startingSquareNum);

    // Déplacements simples (observés sur chacune des 2 diagonales)
    var list = diagoGD.getSimpleMovements(startingSquareNum);
    list = list.concat(diagoTT.getSimpleMovements(startingSquareNum));

    for (var k = 0; k < list.length; k++) {
        var endingSquareNum = list[k];
        var move = new Move(startingSquareNum, endingSquareNum);
        moves.push(move);
    }

    return moves;
};

PathFinder.prototype.getRafleMovements = function(board, startingSquareNum) {
    var tree = this.getTreeRafles(board, startingSquareNum); // NTree<RafleItem>
    return this._treeToMovements(board, tree);
};

PathFinder.prototype._treeToMovements = function(board, tree) {
    var lists = tree.traverse(); // [[RafleItem]]

    var moves = []; // [Move]

    for (var k = 0; k < lists.length; k++) {
        var list = lists[k];

        // First item is not a capture but the starting point.
        // (It still exists even if there is no capture)
        if (list.length > 1) {
            var riStart = list[0];
            var riEnd = list[list.length - 1];

            var nStart = riStart.endingSquareNum;
            var nEnd = riEnd.endingSquareNum;
            var move = new Move(nStart, nEnd);

            for (var j = 0; j < list.length; j++) {
                var ri = list[j];

                // Starting square is not considered as a landing square
                // unlike the final square (it can be the same).
                if (ri.endingSquareNum != nStart || j != 0){
                    move.addLandingSquareNum(ri.endingSquareNum);
                }
                if (ri.capturedSquareNum != null) {
                    var capturedSq = new Square(ri.capturedSquareNum, board.getPiece(ri.capturedSquareNum));
                    move.addCapturedSquare(capturedSq);
                }
            }
            moves.push(move);
        }
    }
    return moves;
};

PathFinder.prototype.getTreeRafles = function(board, startingSquareNum) {
    var ri = new RafleItem(startingSquareNum);

    var ntreeRoot = new NTree();
    ntreeRoot.setItem(ri);

    this.buildRafles(this._cloneDraughtBoard(board), ntreeRoot, []);

    return ntreeRoot;
};

PathFinder.prototype.buildRafles = function(board, node, numSquaresPrevCaptured) {
    // board.debugDraughtBoard();

    var ri = node.getItem();
    var numSquareNewStart = ri.getNumber();
    // console.log("");
    // console.log("buildRafles(" + numSquareNewStart + ", [" + numSquaresPrevCaptured + "])");

    // Récupération des 2 diagonales
    var diagoGD = this._getDiagonalGD(board, numSquareNewStart);
    var diagoTT = this._getDiagonalTT(board, numSquareNewStart);

    // debug
    // console.log(diagoGD);
    // console.log(diagoTT);
    // ---

    // Liste des prises unitaires (observées sur chacune des 2 diagonales)
    var list = diagoGD.getRaflesItem(numSquareNewStart, numSquaresPrevCaptured);
    list = list.concat(diagoTT.getRaflesItem(numSquareNewStart, numSquaresPrevCaptured));

    // debug
    // var sri = "";
    // for (var k = 0; k < list.length; k++) {
    //     var riTmp = list[k];
    //     sri += riTmp.toString() + "-";
    // }
    // console.log("Arrivées possibles : " + sri);
    // ---

    // Ajout de ces rafles simples dans l'arbre.
    node.setChildren(list);

    // Recommencer recursivement sur les rafles filles.
    var childrenNodes = node.getChildrenNodes();
    for (var k = 0; k < childrenNodes.length; k++) {
        var nf = childrenNodes[k];
        var r = nf.getItem();

        // On met à jour la liste des cases déjà prises.
        var lcdp = numSquaresPrevCaptured.slice(0);
        lcdp.push(r.capturedSquareNum);
        // ---

        // On deplace le pion avant de poursuivre
        // (sans retirer la pièce prise).
        var diag = this._cloneDraughtBoard(board);
        var numStart = ri.getNumber();
        var numEnd = r.endingSquareNum;
        var startSq = diag.getSquare(numStart);
        var piece = startSq.piece;
        diag.getSquare(numStart).piece = Piece.EMPTY;
        diag.getSquare(numEnd).piece = piece;

        // ---
        this.buildRafles(diag, nf, lcdp);
    }
    return this;
};

PathFinder.prototype.displayTreePaths = function(tree) {
    var lists = tree.traverse(); // [[RafleItem]]

    console.log("Nombre de mouvements : " + lists.length);
    for (var k = 0; k < lists.length; k++) {
        var list = lists[k];
        var s = "";
        for (var j = 0; j < list.length; j++) {
            var ri = list[j];
            s += " > " + ri.endingSquareNum + "[" + ri.capturedSquareNum + "]";
        }
        console.log(s);
    }
};

/** Retourne la diagonaleGD contenant une case donnée. */
PathFinder.prototype._getDiagonalGD = function(board, number) {
    var diag = [];
    loop:
    for (var i = 0; i < board.conf['DIAGONALS_GD'].length; i++) {
        var diagonal = board.conf['DIAGONALS_GD'][i];
        for (var j = 0; j < diagonal.length; j++) {
            if (diagonal[j] === number) {
                diag = diagonal;
                break loop;
            }
        }
    }

    var diago = new Diagonal(true);
    for (var i = 0; i < diag.length; i++) {
        var c = board.getSquare(diag[i]);
        diago.addSquare(c);
    }

    return diago;
};

/** Retourne la diagonaleTT contenant une case donnée. */
PathFinder.prototype._getDiagonalTT = function(board, number) {
    var diag = [];
    loop:
    for (var i = 0; i < board.conf['DIAGONALS_TT'].length; i++) {
        var diagonal = board.conf['DIAGONALS_TT'][i];
        for (var j = 0; j < diagonal.length; j++) {
            if (diagonal[j] === number) {
                diag = diagonal;
                break loop;
            }
        }
    }

    var diago = new Diagonal(false);
    for (var i = 0; i < diag.length; i++) {
        var c = board.getSquare(diag[i]);
        diago.addSquare(c);
    }

    return diago;
};

PathFinder.prototype._cloneDraughtBoard = function(board) {
    var d = new DraughtBoard();

    for (var k = 0; k < board.getSquares().length; k++) {
        var c = board.getSquare(k + 1);
        d.setPiece(c.piece, c.number);
    }

    return d;
};

module.exports = PathFinder;
