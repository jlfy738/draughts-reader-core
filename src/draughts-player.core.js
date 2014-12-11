// ----------------------------------------------------------------------------------------------------
// Types énumérés
// ----------------------------------------------------------------------------------------------------

var Piece = {
    EMPTY : 0,
    PAWN_WHITE : 1,
    PAWN_BLACK : 2,
    DAME_WHITE : 3,
    DAME_BLACK : 4
};

var Color = {
    NONE : 0,
    WHITE : 1,
    BLACK : 2
};

var Diago = {
    DG : 0,
    TT : 1
};


// ----------------------------------------------------------------------------------------------------
// Square "class"
// ----------------------------------------------------------------------------------------------------
function Square(number, piece) {
    this.number = number;
    this.piece = piece ? piece : Piece.EMPTY;
}

Square.prototype.isPawn = function() {
    return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.PAWN_BLACK);
};
Square.prototype.isDame = function() {
    return (this.piece === Piece.DAME_WHITE || this.piece === Piece.DAME_BLACK);
};
Square.prototype.isWhite = function() {
    return (this.piece === Piece.PAWN_WHITE || this.piece === Piece.DAME_WHITE);
};
Square.prototype.isBlack = function() {
    return (this.piece === Piece.PAWN_BLACK || this.piece === Piece.DAME_BLACK);
};
Square.prototype.isEmpty = function() {
    return (this.piece === Piece.EMPTY);
};

Square.prototype.getColor = function() {
    var c = Color.NONE;

    if (this.isWhite()) {
        c = Color.WHITE;
    } else if (this.isBlack()) {
        c = Color.BLACK;
    }
    return c;
};

Square.prototype.debug = function() {
    console.log("Square n°" + this.number + " (" + this.piece + ")");
};


// ----------------------------------------------------------------------------------------------------
// RafleItem "class"
// ----------------------------------------------------------------------------------------------------
function RafleItem(endingSquareNum, capturedSquareNum) {
    this.capturedSquareNum = capturedSquareNum ? capturedSquareNum : null;
    this.endingSquareNum = endingSquareNum;
}

RafleItem.prototype.getNumber = function() {
    return this.endingSquareNum;
};

RafleItem.prototype.toString = function() {
    //return JSON.stringify(this);
    return "" + this.endingSquareNum;
};



// ----------------------------------------------------------------------------------------------------
// Move "class"
// ----------------------------------------------------------------------------------------------------
function Move(startNum, endNum) {
    this.startingSquareNum = startNum;
    this.endingSquareNum = endNum;
    this.middleSquaresNum = []; // [int]

    this.isCaptured = false;
    this.isCrowned = false;

    this.landingSquaresNum = [];  // [int]
    this.capturedSquares = []; // [Square]

    this.status = true;
    this.message = "";
}

Move.prototype.addLandingSquareNum = function(squareNum) {
    this.landingSquaresNum.push(squareNum);
};
Move.prototype.addCapturedSquareNum = function(squareNum, piece) {
    this.capturedSquares.push(new Square(squareNum, piece));
};

Move.prototype.size = function() {
    return this.capturedSquares.length + this.landingSquaresNum.length;
};

Move.prototype.toString = function() {
    var tmp = "";
    var nb = this.landingSquaresNum.length;
    for (var i = 0; i < nb; i++) {
        if (tmp !== "") {
            tmp += ", ";
        }
        tmp += this.landingSquaresNum[i];
    }

    var tmp2 = "";
    for (var i = 0; i < this.capturedSquares.length; i++) {
        if (tmp2 !== "") {
            tmp2 += ", ";
        }
        tmp2 += this.capturedSquares[i].number;
    }

    var sep = "-";
    if (this.isCaptured) {
        sep = "x";
    }

    var s = "" + this.startingSquareNum;
    if (this.middleSquaresNum.length > 0) {
        s += sep + "(" + this.middleSquaresNum + ")";
    }
    s += sep + this.endingSquareNum;
    s += " : Pose(" + tmp + ")";
    s += " - Pris(" + tmp2 + ")";
    s += " - Statut(" + this.status + ")";
    return s;
};

Move.prototype.getNotation = function() {
    var sep = this.isCaptured ? "x" : "-";

    var s = "";
    s += this.startingSquareNum;

    if (this.middleSquaresNum.length > 0) {
        s += sep;
        s += this.middleSquaresNum;
    }

    s += sep;
    s += this.endingSquareNum;
    return s;
};

/*
 * Vrai si
 * <ul>
 * <li>Même case de départ</li>
 * <li>Même case d'arrivée</li>
 * <li>Mêmes cases prises</li>
 * </ul>
 */
Move.prototype.equals = function(move) {
    var isEqual = true;

    isEqual = isEqual && (this.startingSquareNum == move.startingSquareNum);
    isEqual = isEqual && (this.endingSquareNum == move.endingSquareNum);

    if (isEqual) {
        var lc = this.capturedSquares;
        var lc2 = move.capturedSquares;

        isEqual = isEqual && (lc.length == lc2.length);
        if (isEqual) {
            for (var i = 0; i < lc.length; i++) {
                var found = false;
                for (var j = 0; j < lc2.length; j++) {
                    if (lc[i].number == lc2[j].number && lc[i].piece == lc2[j].piece) {
                        found = true;
                    }
                }
                if (!found) {
                    isEqual = false;
                    break;
                }
            }
        }
    }

    return isEqual;
};


// ----------------------------------------------------------------------------------------------------
// DraughtBoard "Class"
// ----------------------------------------------------------------------------------------------------
function DraughtBoard() {

    /** Les 50 cases noires du damier. */
    this.squares = []; // [Square]

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

    /** Initialisation des 50 cases noires. */
    for (var k = 1; k <= 50; k++) {
        var c = new Square(k);
        this.squares.push(c);
    }
}




/** Position initiale : 20 x 20 */
DraughtBoard.prototype.setPosition20x20 = function() {
    for (var num = 1; num <= 20; num++) {
        this.setPiece(num, Piece.PAWN_BLACK);
    }

    for (var num = 31; num <= 50; num++) {
        this.setPiece(num, Piece.PAWN_WHITE);
    }
};

/** Pose des pièces sur le damier */
DraughtBoard.prototype.setPosition = function(piece, numbers) {
    for (var k = 0; k < numbers.length; k++) {
        this.setPiece(numbers[k], piece);
    }
};

/** Ajouter une pièce sur une case. */
DraughtBoard.prototype.setPiece = function(number, piece) {
    var c = this.getCase(number);
    c.piece = piece;
};

/** Retourne une case. */
DraughtBoard.prototype.getCase = function(number) {
    return this.squares[number - 1];
};

/** Connaitre la pièce se trouvant sur une case. */
DraughtBoard.prototype.isPiece = function(number, piece) {
    return (this.getPiece(number) === piece);
};

/** Retourne la pièce. */
DraughtBoard.prototype.getPiece = function(number) {
    return this.getCase(number).piece;
};

/** Retourne la diagonaleGD contenant une case donnée. */
DraughtBoard.prototype.getDiagonalGD = function(number) {
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

    var diago = new Diagonal(Diago.GD);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

/** Retourne la diagonaleTT contenant une case donnée. */
DraughtBoard.prototype.getDiagonalTT = function(number) {
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

    var diago = new Diagonal(Diago.TT);
    for (var i = 0; i < diag.length; i++) {
        var c = this.getCase(diag[i]);
        diago.addCase(c);
    }

    return diago;
};

DraughtBoard.prototype.cloneDraughtBoard = function() {
    var d = new DraughtBoard();

    for (var k = 0; k < this.squares.length; k++) {
        var c = this.squares[k];
        d.setPiece(c.number, c.piece);
    }

    return d;
};

/** Applique le mouvement sur le damier. */
DraughtBoard.prototype.play = function(move) {
    var piecePlayed = this.getPiece(move.startingSquareNum);

    // Retirer la pièce de la case de départ
    this.setPiece(move.startingSquareNum, Piece.EMPTY);

    // Retirer les pièces des cases prises
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, Piece.EMPTY);
    }

    // Poser la pièce sur la case d'arrivée
    if (!move.isCrowned) {
        this.setPiece(move.endingSquareNum, piecePlayed);
    }
    // Ce mouvement promeu en Dame
    else {
        if (piecePlayed == Piece.PAWN_WHITE) {
            this.setPiece(move.endingSquareNum, Piece.DAME_WHITE);
        } else if (piecePlayed == Piece.PAWN_BLACK) {
            this.setPiece(move.endingSquareNum, Piece.DAME_BLACK);
        }
    }
};

/** Annule le mouvement sur le damier. */
DraughtBoard.prototype.playInv = function(move) {
    var piecePlayed = this.getPiece(move.endingSquareNum);

    // Retirer la pièce de la case d'arrivée
    this.setPiece(move.endingSquareNum, Piece.EMPTY);

    // Remettre les pièces qui avaient été prises.
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, c.piece);
    }

    // Remettre la pièce sur la case de départ
    if (!move.isCrowned) {
        this.setPiece(move.startingSquareNum, piecePlayed);
    }

    // La dame redevient pion
    else {
        if (piecePlayed == Piece.DAME_WHITE) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_WHITE);
        } else if (piecePlayed == Piece.DAME_BLACK) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_BLACK);
        }
    }
};

DraughtBoard.prototype.debugDraughtBoard = function() {
    var row = "";

    console.log("================================");
    for (var k = 0; k < 10; k++) {
        row += "|";
        for (var l = 1; l <= 5; l++) {

            var num = 5 * k + l;
            var p = this.getCase(num).piece;

            if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                row += "   ";
            }

            switch (p) {
            case Piece.PAWN_WHITE:
                row += " o ";
                break;
            case Piece.PAWN_BLACK:
                row += " x ";
                break;
            case Piece.DAME_WHITE:
                row += " O ";
                break;
            case Piece.DAME_BLACK:
                row += " X ";
                break;
            default:
                row += " . ";
            }

            if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                row += "   ";
            }
        }
        row += "|";

        console.log(row);
        row = "";
    }
    console.log("================================");
};




// ----------------------------------------------------------------------------------------------------
// NTree "class"
// ----------------------------------------------------------------------------------------------------
function NTree(item) {
    this.item = item ? item : null; // E
    this.left = null;  // NTree<E>
    this.right = null; // NTree<E>
}

NTree.prototype.getItem = function() {
    return this.item;
};

NTree.prototype.setItem = function(item) {
    this.item = item;
};

NTree.prototype.hasLeft = function() {
    return (this.left != null);
};

NTree.prototype.hasRight = function() {
    return (this.right != null);
};

NTree.prototype.isLeaf = function() {
    return !(this.hasRight());
};

// Ajoute une liste de fils dans un noeud binaire
// (fils à droite, frère à gauche)
NTree.prototype.setChildren = function(list) {
    var nb = list.length;
    if (nb > 0) {
        var val = list[0];

        // 1er element en fils droit
        var currentTree = new NTree(val);
        this.right = currentTree;

        // les autres : en frère à gauche
        if (nb > 1) {
            for (var k = 1; k < nb; k++) {
                var ntLeft = new NTree();
                ntLeft.setItem(list[k]);
                currentTree.left = ntLeft;
                currentTree = ntLeft;
            }
        }
    }
};

// Retourne tous les fils
NTree.prototype.getChildren = function() {
    var list = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var ntRight = this.right;
        list.push(ntRight.getItem());

        // Et des fils gauche successifs
        var currentTree = ntRight;
        while (currentTree.hasLeft()) {
            list.push(currentTree.left.getItem());
            currentTree = currentTree.left;
        }
    }
    return list;
};

// Retourne tous les noeuds fils
NTree.prototype.getChildrenNodes = function() {
    var list = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var ntRight = this.right;
        list.push(ntRight);

        // Et des fils gauches successifs
        var currentTree = ntRight;
        while (currentTree.hasLeft()) {
            list.push(currentTree.left);
            currentTree = currentTree.left;
        }
    }
    return list;
};

NTree.prototype.traverse = function() {
    var lists = []; // [[E]]
    this._traverse(this, [], lists);
    return lists;
};

/**
* lle : resultat (liste des chemins = liste de "liste d'éléments" [[E]])
*/
NTree.prototype._traverse = function(node, path, lle) {
    path.push(node);
    if (node.isLeaf()) {
        var res = [];
        for (var k = 0; k < path.length; k++) {
            var e = path[k].getItem();
            res.push(e);
        }
        lle.push(res);
    } else {
        var fils = node.getChildrenNodes();

        for (var i = 0; i < fils.length; i++) {
            var newPath = path.slice(0);
            this._traverse(fils[i], newPath, lle);
        }
    }
};



// ----------------------------------------------------------------------------------------------------
// Diagonal "class"
// ----------------------------------------------------------------------------------------------------
function Diagonal(typeDiago) {
    this.squares = []; // [case]
    this.type = typeDiago ? typeDiago : null; // Diago
}

Diagonal.prototype.addCase = function(c) {
    this.squares.push(c);
};

Diagonal.prototype.size = function() {
    return this.squares.length;
};

Diagonal.prototype.getSquareByNumber = function(number) {
    var c = null;
    for (var k = 0; k < this.size(); k++) {
        var cTmp = this.squares[k];
        if (cTmp.number == number) {
            c = cTmp;
            break;
        }
    }
    return c;
};

Diagonal.prototype.getSquareByIndex = function(idx) {
    return this.squares[idx];
};

/** index de la case dans la liste. */
Diagonal.prototype.indexOf = function(number) {
    var idx = -1;
    for (var k = 0; k < this.size(); k++) {
        var c = this.squares[k];
        if (c.number == number) {
            idx = k;
            break;
        }
    }
    return idx;
};

Diagonal.prototype._isEmpty = function(idxSquare) {
    var piece = this.squares[idxSquare];
    return piece.isEmpty();
};

Diagonal.prototype._getColorByIndex = function(idxSquare) {
    var piece = this.squares[idxSquare];
    return piece.getColor();
};

Diagonal.prototype._isOppositeColor = function(c1, c2) {
    return ((c1 == Color.WHITE && c2 == Color.BLACK) || (c1 == Color.BLACK && c2 == Color.WHITE));
};

Diagonal.prototype.getSimpleMovements = function(squareNum) {
    var list = [];

    var c = this.getSquareByNumber(squareNum);
    var lg = this.size();
    var idxSquare = this.indexOf(squareNum);

    // Déplacement Pion Blanc dans le sens gauche-droite ?
    if (c.piece == Piece.PAWN_WHITE) {
        // La case à droite doit être libre.
        if (idxSquare + 1 < lg) {
            if (this._isEmpty(idxSquare + 1)) {
                list.push(this.getSquareByIndex(idxSquare + 1).number);
            }
        }

    }
    // Déplacement Pion Noir dans le sens droite-gauche ?
    else if (c.piece == Piece.PAWN_BLACK) {
        // La case à gauche doit être libre.
        if (idxSquare - 1 >= 0) {
            if (this._isEmpty(idxSquare - 1)) {
                list.push(this.getSquareByIndex(idxSquare - 1).number);
            }
        }
    }

    // Déplacement Dame Blanche ou Noire dans les 2 sens
    else if (c.isDame()) {

        // Déplacement dans le sens gauche-droite ?
        // -----------------------------------------
        // Au moins 1 case à droite.
        if (idxSquare + 1 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxSquare + 1; k < lg; k++) {
                if (this._isEmpty(k)) {
                    list.push(this.getSquareByIndex(k).number);
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

        }

        // Déplacement dans le sens droite-gauche ?
        // -----------------------------------------
        // Au moins 1 case à gauche.
        if (idxSquare - 1 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxSquare - 1; k >= 0; k--) {
                if (this._isEmpty(k)) {
                    list.push(this.getSquareByIndex(k).number);
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }
        }
    }

    return list;
};


/**
 * @param numCasesDejaPrises
 *            Pour ne pas la reprendre (coup Turc).
 */
Diagonal.prototype.getRaflesItem = function(squareNum, numSquaresPrevCaptured) {
    var c = this.getSquareByNumber(squareNum);
    var color = c.getColor();

    raflesItem = [];

    var lg = this.size();
    var idxSquare = this.indexOf(squareNum);

    if (c.isPawn()) {

        // Prise dans le sens gauche-droite ?
        // S'il y a au moins 2 cases devant.
        if (idxSquare + 2 < lg) {
            if (this._isEmpty(idxSquare + 2)) {
                var cSquare1 = this._getColorByIndex(idxSquare + 1);
                if (this._isOppositeColor(color, cSquare1)) {
                    // prise OK
                    var capturedSq = this.getSquareByIndex(idxSquare + 1);
                    var endingSq = this.getSquareByIndex(idxSquare + 2);
                    if (!(numSquaresPrevCaptured.indexOf(capturedSq.number) > -1)) {
                        var ri = new RafleItem(endingSq.number, capturedSq.number);
                        raflesItem.push(ri);
                    }
                }
            }
        }

        // Prise dans le sens droite-gauche ?
        // S'il y a au moins 2 cases derrière.
        if (idxSquare - 2 >= 0) {
            if (this._isEmpty(idxSquare - 2)) {
                var cSquare1 = this._getColorByIndex(idxSquare - 1);
                if (this._isOppositeColor(color, cSquare1)) {
                    // prise OK
                    var capturedSq = this.getSquareByIndex(idxSquare - 1);
                    var endingSq = this.getSquareByIndex(idxSquare - 2);
                    // console.log("debug[" + this.type + "] : " + (idxSquare - 1) + "=" + capturedSq);
                    if (!(numSquaresPrevCaptured.indexOf(capturedSq.number) > -1)) {
                        var ri = new RafleItem(endingSq.number, capturedSq.number);
                        raflesItem.push(ri);
                    }
                }
            }
        }
    } else if (c.isDame()) {

        // -----------------------------------
        // Prise dans le sens gauche-droite ?
        // -----------------------------------

        // il faut : [0..n] vide + 1 Couleur opposee + [1..n] vide
        var nbEmptyBefore = 0;
        var idxPieceToCapture = -1;
        var nbEmptyAfter = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases devant.
        if (idxSquare + 2 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxSquare + 1; k < lg; k++) {
                if (this._isEmpty(k)) {
                    nbEmptyBefore++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'après n'est pas hors du damier
            if (idxSquare + nbEmptyBefore + 2 < lg) {
                idxPieceToCapture = idxSquare + nbEmptyBefore + 1;

                // S'assurer que la case prise est de couleur opposée.
                var cCapturedSq = this._getColorByIndex(idxPieceToCapture);
                if (this._isOppositeColor(color, cCapturedSq)) {
                    // Verifier qu'il existe au moins une case d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceToCapture + 1; k < lg; k++) {
                        if (this._isEmpty(k)) {
                            nbEmptyAfter++;
                        } else {
                            // On a rencontré une pièce ou le bord
                            // => fin d'analyse.
                            break;
                        }
                    }
                }
            }
        }

        // Y a t-il une prise possible ?
        if (idxPieceToCapture >= 0 && nbEmptyAfter > 0) {
            var capturedSq = this.getSquareByIndex(idxPieceToCapture);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!(numSquaresPrevCaptured.indexOf(capturedSq.number) > -1)) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbEmptyAfter; k++) {
                    var endingSq = this.getSquareByIndex(idxPieceToCapture + k);
                    var ri = new RafleItem(endingSq.number, capturedSq.number);
                    raflesItem.push(ri);
                }
            }
        }

        // -----------------------------------
        // Prise dans le sens droite-gauche ?
        // -----------------------------------

        // il faut : [0..n] vide + 1 Couleur opposee + [1..n] vide
        nbEmptyBefore = 0;
        idxPieceToCapture = -1;
        nbEmptyAfter = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases derrière.
        if (idxSquare - 2 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxSquare - 1; k >= 0; k--) {
                if (this._isEmpty(k)) {
                    nbEmptyBefore++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'avant n'est pas hors du damier
            if (idxSquare - nbEmptyBefore - 2 >= 0) {
                idxPieceToCapture = idxSquare - nbEmptyBefore - 1;

                // S'assurer que la case prise est de couleur opposée.
                var cCapturedSq = this._getColorByIndex(idxPieceToCapture);
                if (this._isOppositeColor(color, cCapturedSq)) {
                    // Verifier qu'il existe au moins une case d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceToCapture - 1; k >= 0; k--) {
                        if (this._isEmpty(k)) {
                            nbEmptyAfter++;
                        } else {
                            // On a rencontré une pièce ou le bord
                            // => fin d'analyse.
                            break;
                        }
                    }
                }
            }
        }

        // Y a t-il une prise possible ?
        if (idxPieceToCapture >= 0 && nbEmptyAfter > 0) {
            var capturedSq = this.getSquareByIndex(idxPieceToCapture);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!(numSquaresPrevCaptured.indexOf(capturedSq.number) > -1)) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbEmptyAfter; k++) {
                    var endingSq = this.getSquareByIndex(idxPieceToCapture - k);
                    var ri = new RafleItem(endingSq.number, capturedSq.number);
                    raflesItem.push(ri);
                }
            }
        }
    }

    return raflesItem;
};

Diagonal.prototype.toString = function() {
    var s = "Diagonal [" + this.type + "] = ";

    for (var k = 0; k < this.size(); k++) {
        s += this.squares[k].number;
        var p = this.squares[k].piece;

        s += "[";
        switch (p) {
            case Piece.PAWN_WHITE:
                s += "b";
                break;
            case Piece.PAWN_BLACK:
                s += "n";
                break;
            case Piece.DAME_WHITE:
                s += "B";
                break;
            case Piece.DAME_BLACK:
                s += "N";
                break;
            default:
                s += "*";
        }
        s += "] ";
    }

    return s;
};




// ----------------------------------------------------------------------------------------------------
// PathFinder "class"
// ----------------------------------------------------------------------------------------------------
function PathFinder() {
}

PathFinder.prototype.getSimpleMovements = function(board, startingSquareNum) {
    var moves = []; // [Move]

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonalGD(startingSquareNum);
    var diagoTT = board.getDiagonalTT(startingSquareNum);

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

    this.buildRafles(board.cloneDraughtBoard(), ntreeRoot, []);

    return ntreeRoot;
};

PathFinder.prototype.buildRafles = function(board, node, numSquaresPrevCaptured) {
    // board.debugDraughtBoard();

    var ri = node.getItem();
    var numSquareNewStart = ri.getNumber();
    // console.log("");
    // console.log("buildRafles(" + numSquareNewStart + ", [" + numSquaresPrevCaptured + "])");

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonalGD(numSquareNewStart);
    var diagoTT = board.getDiagonalTT(numSquareNewStart);

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
        var diag = board.cloneDraughtBoard();
        var numStart = ri.getNumber();
        var numEnd = r.endingSquareNum;
        var startSq = diag.getCase(numStart);
        var piece = startSq.piece;
        diag.getCase(numStart).piece = Piece.EMPTY;
        diag.getCase(numEnd).piece = piece;

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



// ----------------------------------------------------------------------------------------------------
// Arbiter "class"
// ----------------------------------------------------------------------------------------------------
function Arbiter() {
}

Arbiter.pf = new PathFinder();

/** Crée le mouvement demandé. */
Arbiter.getMove = function(board, startingSqNum, endingSqNum, middleSquaresNum) {

    // Toutes les combinaisons de rafles
    var listRafleMovements = Arbiter.pf.getRafleMovements(board, startingSqNum);
    var existsRafle = listRafleMovements.length > 0;

    var listMovements = [];

    // Ne conserver que la/les rafles majoritaires
    if (existsRafle) {
        // console.log("CAS : RAFLE");
        listMovements = this._filterMajority(listRafleMovements);
    }
    // Aucune prise possible => on regarde les déplacements simples
    else {
        // console.log("CAS : DEPLACEMENT SIMPLE");
        listMovements = Arbiter.pf.getSimpleMovements(board, startingSqNum);
    }

    // Ne conserver que le/les mouvements qui arrivent sur la case indiquée.
    var listOK = this._filterEnding(listMovements, endingSqNum);

    // Ne conserver que le/les mouvements qui passent par les cases
    // indiquées.
    if (middleSquaresNum != null && middleSquaresNum.length > 0) {
        listOK = this._filterInter(listOK, middleSquaresNum);
    }

    // Si plusieurs mouvements sont valides, on prendra le premier.
    var move = null;
    if (listOK.length > 0) {
        move = listOK[0];

        // Enregistrer les mouvements intermédiaires précisées
        if (middleSquaresNum != null) {
            move.middleSquaresNum = middleSquaresNum;
        }

        if (listOK.length > 1) {
            console.log("Il existe des variantes pour le coup " + startingSqNum + "/" + endingSqNum);
        }
    }

    // Le mouvement demandé est irrégulier.
    if (move == null) {
        move = new Move(startingSqNum, endingSqNum);
        move.status = false;
        move.message = "Mouvement irrégulier..."; // A préciser
    }

    // Préciser s'il s'agit d'une rafle (pour la notation)
    move.isCaptured = existsRafle;

    // Préciser si la piece a été promu en dame.
    var piece = board.getPiece(startingSqNum);
    var isCrowned = (piece == Piece.PAWN_WHITE && endingSqNum >= 1 && endingSqNum <= 5);
    isCrowned = isCrowned || (piece == Piece.PAWN_BLACK && endingSqNum >= 45 && endingSqNum <= 50);
    move.isCrowned = isCrowned;

    return move;
};

/**
 * Ne conserver que le/les mouvements les plus longs. <br />
 * Note : une prise est toujours plus longue qu'un déplacement simple.
 */
Arbiter._filterMajority = function(moves) {
    var list = [];

    var lMax = this._moveMax(moves);
    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.size() == lMax) {
            list.push(m);
        }
    }

    // Eviter les faux positifs de variantes
    list = this._filterDuplicates(list);

    return list;
};

/**
 * Retire les mouvements identiques (mêmes cases prises et même arrivée) <br/>
 * => Eviter les faux positifs de variantes...<br />
 * Exemple d'une dame avec plusieurs pts de repos possibles entre 2 prises.
 */
Arbiter._filterDuplicates = function(moves) {
    var list = []; // [Move]

    if (moves.length > 1) {
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];
            var isDuplicate = false;
            for (var j = 0; j < list.length; j++) {
                var cf = list[j];
                if (m == cf) {
                    isDuplicate = true;
                }
            }
            if (!isDuplicate) {
                list.push(m);
            }
        }
    } else {
        list = moves;
    }

    return list;
};

/** Longueur du plus long mouvement. */
Arbiter._moveMax = function(moves) {
    var lMax = -1;

    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.size() > lMax) {
            lMax = m.size();
        }
    }
    return lMax;
};

/** Ne conserve que les mouvements qui arrivent sur la case indiquée. */
Arbiter._filterEnding = function(moves, endNum) {
    var list = []; // [Move]

    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.endingSquareNum == endNum) {
            list.push(m);
        }
    }
    return list;
};

/**
 * Ne conserve que les mouvements qui passent par les cases intermédiaires
 * indiquées.
 * 
 * @param inters
 *            : REQUIS, non null
 */
Arbiter._filterInter = function(moves, middleSquaresNum) {
    var list = []; // [Move]

    if (moves != null) {
        // Pour chaque mouvement
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];

            var landingSquaresNum = m.landingSquaresNum;
            var allFound = true;
            var nbLanding = landingSquaresNum.length;

            var lastIdxPose = -1;

            // Pour chaque inter spécifié
            for (var j = 0; j < middleSquaresNum.length; j++) {
                var inter = middleSquaresNum[j];

                // On regarde s'il fait partie des cases sur laquelle la pièce s'est posée
                var found = false;
                for (var idxPose = 0; idxPose < nbLanding; idxPose++) {
                    // La case posée existe
                    if (inter == landingSquaresNum[idxPose]) {
                        // ET on ne l'a pas déjà prise en compte
                        if (idxPose > lastIdxPose) {
                            found = true;
                            lastIdxPose = idxPose;
                        }
                    }
                }

                if (!found) {
                    allFound = false;
                    break; // mouvement suivant
                }
            }

            if (allFound) {
                list.push(m);
            }

        }
    }
    return list;
};




// ----------------------------------------------------------------------------------------------------
// Game "class"
// ----------------------------------------------------------------------------------------------------

function Game() {
    this.board = new DraughtBoard();
    this.moves = []; // [Move]
    this.index = -1;
}


/** Définition de la position */
Game.prototype.setPosition = function(piece, numbers) {
    this.board.setPosition(piece, numbers);
};

Game.prototype.setPosition20x20 = function() {
    this.board.setPosition20x20();
};

/**
 * Définition des mouvements
 * 
 * @param startNum
 *            Numéro de la case de départ (REQUIS)
 * @param endNum
 *            Numéro de la case d'arrivée (REQUIS)
 * @param middleSquaresNum
 *            Liste des cases intermédiaires (Facultatif)
 */
Game.prototype.addMove = function(startNum, endNum, middleSquaresNum) {
    middleSquaresNum = middleSquaresNum ? middleSquaresNum : null;

    if (!this._hasError()) {

        // Positionner le damier
        this.end();

        var m = Arbiter.getMove(this.board, startNum, endNum, middleSquaresNum);
        // console.log("addMove(" + startNum + ">" + endNum + ") => mouvement=" + m);

        this.moves.push(m);
    } else {
        console.log("addMove: ERREUR");
    }
};



/**
 * Exemples : <br />
 * Prise : 24x22 ou 24x33x22 ou 24x13x...x22 <br />
 * Déplacement : 24-29
 * */
Game.prototype.addMoveTxt = function(move) {
    if (move != null) {

        move = move.toLowerCase();
        move = move.replace(" ", "");

        var sep = "";
        if (move.indexOf("-") > -1) {
            sep = "-";
        } else if (move.indexOf("x") > -1) {
            sep = "x";
        }

        if (sep != "") {
            var list = move.split(sep);
            var nb = list.length;
            if (nb > 1) {
                var error = false;
                var iStart = parseInt(list[0], 10);
                var iEnd = parseInt(list[nb - 1], 10);
                var iInters = [];

                if (iStart === null || iEnd === null) {
                    error = true;
                } else {
                    if (nb > 2) {
                        for (var i = 1; i <= nb - 2; i++) {
                            var inter = parseInt(list[i], 10);
                            if (inter != null) {
                                iInters.push(inter);
                            } else {
                                error = true;
                            }
                        }
                    }
                }
                if (!error) {
                    this.addMove(iStart, iEnd, iInters);
                } else {
                    console.log("addMove: ERREUR (4)");
                }

            } else {
                console.log("addMove: ERREUR (3)");
            }
        } else {
            console.log("addMove: ERREUR (2)");
        }

    } else {
        console.log("addMove: ERREUR (1)");
    }
};

Game.prototype._getStatusNextIndex = function() {
    var status = true;
    if (this.index < this._getLastIndex()) {
        var m = this.moves[this.index + 1];
        status = m.status;
    }
    return status;
};

Game.prototype._getStatusPrevIndex = function() {
    var status = true;
    if (this.index > 0) {
        var m = this.moves[this.index - 1];
        status = m.status;
    }
    return status;
};

Game.prototype.hasNext = function() {
    return this._getStatusNextIndex() && this.index < this._getLastIndex();
};

Game.prototype.hasPrev = function() {
    return this._getStatusPrevIndex() && this.index > -1;
};

Game.prototype.next = function() {
    if (this.hasNext()) {
        this.index++;
        var m = this.moves[this.index];
        if (m.status) {
            this.board.play(m);
        } else {
            this.index--;
        }
    }
};

Game.prototype.prev = function() {
    if (this.hasPrev()) {
        var m = this.moves[this.index];
        if (m.status) {
            this.board.playInv(m);
            this.index--;
        }
    }
}

Game.prototype.start = function() {
    this._setIndex(-1);
};

Game.prototype.end = function() {
    this._setIndex(this._getLastIndex());
};

/** Position initiale = 0 ; Premier coup = 1. */
Game.prototype.setCursor = function(position) {
    this._setIndex(position - 1);
};

/** Position initiale = -1 ; premier coup = 0 */
Game.prototype._setIndex = function(idx) {
    idx = this._constrainIndex(idx);

    if (this.index < idx) {
        while (this.index < idx) {
            this.next();
        }
    } else if (this.index > idx) {
        while (this.index > idx) {
            this.prev();
        }
    }
};

Game.prototype._getLastIndex = function() {
    return this.moves.length - 1;
};

Game.prototype._constrainIndex = function(idx) {
    if (idx < 0) {
        idx = -1;
    } else if (idx > this._getLastIndex()) {
        idx = this._getLastIndex();
    }

    return idx;
};

Game.prototype._hasError = function() {
    var err = false;
    for (var k = 1; k <= this.moves.length - 2; k++) {
        var m = this.moves[k];
        if (!m.status) {
            err = true;
            break;
        }
    }
    return err;
};

Game.prototype.debug = function() {
    console.log("Etat courant de la partie :");

    var s = "";
    for (var k = 0; k < this.moves.length; k++) {
        var m = this.moves[k];
        if (k == this.index) {
            s += "[" + m.getNotation() + "] ; ";
        } else {
            s += m.getNotation() + " ; ";
        }
    }
    console.log(s);
    this.board.debugDraughtBoard();
    console.log("");
};

Game.prototype.debugFull = function() {
    this.start();
    this.debug();

    while (this.hasNext()) {
        this.next();
        this.debug();
    }
};



// ----------------------------------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------------------------------

console.log("--------------------------------------");
console.log("Game");
console.log("--------------------------------------");

function testGame() {
    var game = new Game();
    // ---
    game.setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44]);
    game.setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24]);
    game.setPosition(Piece.DAME_WHITE, []);
    game.setPosition(Piece.DAME_BLACK, []);
    // ---
    game.addMove(33, 29);
    game.addMove(24, 42, [33]);
    game.addMove(43, 38);
    game.addMoveTxt("42x33");
    game.addMoveTxt("39x10");
    // ---

    game.debugFull();
}


testGame();
