var
    symbols = require('./symbols'),
    DraughtBoard =  require('./DraughtBoard'),
    Diagonal =  require('./Diagonal'),
    RafleItem = require('./RafleItem'),
    Move = require('./Move'),
    NTree = require('./NTree'),
    Piece = symbols.Piece
;


function PathFinder() {
    /** Liste des diagonales parallèles à la Grande Diagonale. */
    this.diagonalsGD = [
        [ 6, 1 ], 
        [ 16, 11, 7, 2 ], 
        [ 26, 21, 17, 12, 8, 3 ], 
        [ 36, 31, 27, 22, 18, 13, 9, 4 ], 
        [ 46, 41, 37, 32, 28, 23, 19, 14, 10, 5 ],
        [ 47, 42, 38, 33, 29, 24, 20, 15 ], 
        [ 48, 43, 39, 34, 30, 25 ], 
        [ 49, 44, 40, 35 ], 
        [ 50, 45 ] 
    ];

    /** Liste des diagonale parallèle au Tric Trac. */
    this.diagonalsTT = [ 
        [ 5 ], 
        [ 15, 10, 4 ], 
        [ 25, 20, 14, 9, 3 ], 
        [ 35, 30, 24, 19, 13, 8, 2 ], 
        [ 45, 40, 34, 29, 23, 18, 12, 7, 1 ], 
        [ 50, 44, 39, 33, 28, 22, 17, 11, 6 ],
        [ 49, 43, 38, 32, 27, 21, 16 ], 
        [ 48, 42, 37, 31, 26 ], 
        [ 47, 41, 36 ], 
        [ 46 ] 
    ];
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

        // le 1er element n'est pas une prise mais le point de départ.
        // Toujours présents même s'il n'existe aucune prise.
        if (list.length > 1) {
            var riStart = list[0];
            var riEnd = list[list.length - 1];

            var nStart = riStart.endingSquareNum;
            var nEnd = riEnd.endingSquareNum;
            var move = new Move(nStart, nEnd);

            for (var j = 0; j < list.length; j++) {
                var ri = list[j];
                move.addLandingSquareNum(ri.endingSquareNum);
                if (ri.capturedSquareNum != null) {
                    move.addCapturedSquareNum(ri.capturedSquareNum, board.getPiece(ri.capturedSquareNum));
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
    for (var i = 0; i < this.diagonalsGD.length; i++) {
        var diagonal = this.diagonalsGD[i];
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
        diago.addCase(c);
    }

    return diago;
};

/** Retourne la diagonaleTT contenant une case donnée. */
PathFinder.prototype._getDiagonalTT = function(board, number) {
    var diag = [];
    loop: 
    for (var i = 0; i < this.diagonalsTT.length; i++) {
        var diagonal = this.diagonalsTT[i];
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
        diago.addCase(c);
    }

    return diago;
};

PathFinder.prototype._cloneDraughtBoard = function(board) {
    var d = new DraughtBoard();

    for (var k = 0; k < board.getSquares().length; k++) {
        var c = board.getSquare(k + 1);
        d.setPiece(c.number, c.piece);
    }

    return d;
};

module.exports = PathFinder;
