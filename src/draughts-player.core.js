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
    console.log("Case n°" + this.number + " (" + this.piece + ")");
};


// ----------------------------------------------------------------------------------------------------
// Classe RafleItem
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
    this.cases = []; // [Square]

    /** Liste des diagonales parallèles à la Grande Diagonale. */
    this.diagonalesGD = [
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
    this.diagonalesTT = [ 
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
        this.cases.push(c);
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
    return this.cases[number - 1];
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
DraughtBoard.prototype.getDiagonaleGD = function(number) {
    var diag = [];
    boucle: 
    for (var i = 0; i < this.diagonalesGD.length; i++) {
        var diagonale = this.diagonalesGD[i];
        for (var j = 0; j < diagonale.length; j++) {
            if (diagonale[j] === number) {
                diag = diagonale;
                break boucle;
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
DraughtBoard.prototype.getDiagonaleTT = function(number) {
    var diag = [];
    boucle: 
    for (var i = 0; i < this.diagonalesTT.length; i++) {
        var diagonale = this.diagonalesTT[i];
        for (var j = 0; j < diagonale.length; j++) {
            if (diagonale[j] === number) {
                diag = diagonale;
                break boucle;
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

    for (var k = 0; k < this.cases.length; k++) {
        var c = this.cases[k];
        d.setPiece(c.number, c.piece);
    }

    return d;
};

/** Applique le mouvement sur le damier. */
DraughtBoard.prototype.jouer = function(move) {
    var pieceJouee = this.getPiece(move.startingSquareNum);

    // Retirer la pièce de la case de départ
    this.setPiece(move.startingSquareNum, Piece.EMPTY);

    // Retirer les pièces des cases prises
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, Piece.EMPTY);
    }

    // Poser la pièce sur la case d'arrivée
    if (!move.isCrowned) {
        this.setPiece(move.endingSquareNum, pieceJouee);
    }
    // Ce mouvement promeu en Dame
    else {
        if (pieceJouee == Piece.PAWN_WHITE) {
            this.setPiece(move.endingSquareNum, Piece.DAME_WHITE);
        } else if (pieceJouee == Piece.PAWN_BLACK) {
            this.setPiece(move.endingSquareNum, Piece.DAME_BLACK);
        }
    }
};

/** Annule le mouvement sur le damier. */
DraughtBoard.prototype.jouerInv = function(move) {
    var pieceJouee = this.getPiece(move.endingSquareNum);

    // Retirer la pièce de la case d'arrivée
    this.setPiece(move.endingSquareNum, Piece.EMPTY);

    // Remettre les pièces qui avaient été prises.
    for (var i = 0; i < move.capturedSquares.length; i++) {
        var c = move.capturedSquares[i];
        this.setPiece(c.number, c.piece);
    }

    // Remettre la pièce sur la case de départ
    if (!move.isCrowned) {
        this.setPiece(move.startingSquareNum, pieceJouee);
    }

    // La dame redevient pion
    else {
        if (pieceJouee == Piece.DAME_WHITE) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_WHITE);
        } else if (pieceJouee == Piece.DAME_BLACK) {
            this.setPiece(move.startingSquareNum, Piece.PAWN_BLACK);
        }
    }
};

DraughtBoard.prototype.debugDraughtBoard = function() {
    var ligne = "";

    console.log("================================");
    for (var k = 0; k < 10; k++) {
        ligne += "|";
        for (var l = 1; l <= 5; l++) {

            var num = 5 * k + l;
            var p = this.getCase(num).piece;

            if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                ligne += "   ";
            }

            switch (p) {
            case Piece.PAWN_WHITE:
                ligne += " o ";
                break;
            case Piece.PAWN_BLACK:
                ligne += " x ";
                break;
            case Piece.DAME_WHITE:
                ligne += " O ";
                break;
            case Piece.DAME_BLACK:
                ligne += " X ";
                break;
            default:
                ligne += " . ";
            }

            if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                ligne += "   ";
            }
        }
        ligne += "|";

        console.log(ligne);
        ligne = "";
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
NTree.prototype.setChildren = function(liste) {
    var nb = liste.length;
    if (nb > 0) {
        var val = liste[0];

        // 1er element en fils droit
        var btCourant = new NTree(val);
        this.right = btCourant;

        // les autres : en frère à gauche
        if (nb > 1) {
            for (var k = 1; k < nb; k++) {
                var btg = new NTree();
                btg.setItem(liste[k]);
                btCourant.left = btg;
                btCourant = btg;
            }
        }
    }
};

// Retourne tous les fils
NTree.prototype.getChildren = function() {
    var liste = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var btd = this.right;
        liste.push(btd.getItem());

        // Et des fils gauche successifs
        var btCourant = btd;
        while (btCourant.hasLeft()) {
            liste.push(btCourant.left.getItem());
            btCourant = btCourant.left;
        }
    }
    return liste;
};

// Retourne tous les noeuds fils
NTree.prototype.getChildrenNodes = function() {
    var liste = [];

    if (this.hasRight()) {
        // Ajout du fils droits
        var btd = this.right;
        liste.push(btd);

        // Et des fils gauches successifs
        var btCourant = btd;
        while (btCourant.hasLeft()) {
            liste.push(btCourant.left);
            btCourant = btCourant.left;
        }
    }
    return liste;
};

NTree.prototype.traverse = function() {
    var listes = []; // [[E]]
    this._traverse(this, [], listes);
    return listes;
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
    this.cases = []; // [case]
    this.type = typeDiago ? typeDiago : null; // Diago
}

Diagonal.prototype.addCase = function(c) {
    this.cases.push(c);
};

Diagonal.prototype.size = function() {
    return this.cases.length;
};

Diagonal.prototype.getCaseByNumero = function(number) {
    var c = null;
    for (var k = 0; k < this.size(); k++) {
        var cTmp = this.cases[k];
        if (cTmp.number == number) {
            c = cTmp;
            break;
        }
    }
    return c;
};

Diagonal.prototype.getCaseByIndex = function(idx) {
    return this.cases[idx];
};

/** index de la case dans la liste. */
Diagonal.prototype.indexOf = function(number) {
    var idx = -1;
    for (var k = 0; k < this.size(); k++) {
        var c = this.cases[k];
        if (c.number == number) {
            idx = k;
            break;
        }
    }
    return idx;
};

Diagonal.prototype._isEmpty = function(idxCase) {
    var piece = this.cases[idxCase];
    return piece.isEmpty();
};

Diagonal.prototype._getColorByIndex = function(idxCase) {
    var piece = this.cases[idxCase];
    return piece.getColor();
};

Diagonal.prototype._isCouleurOppose = function(c1, c2) {
    return ((c1 == Color.WHITE && c2 == Color.BLACK) || (c1 == Color.BLACK && c2 == Color.WHITE));
};

Diagonal.prototype.getDeplacementsSimples = function(numCase) {
    var liste = [];

    var c = this.getCaseByNumero(numCase);
    var lg = this.size();
    var idxCase = this.indexOf(numCase);

    // Déplacement Pion Blanc dans le sens gauche-droite ?
    if (c.piece == Piece.PAWN_WHITE) {
        // La case à droite doit être libre.
        if (idxCase + 1 < lg) {
            if (this._isEmpty(idxCase + 1)) {
                liste.push(this.getCaseByIndex(idxCase + 1).number);
            }
        }

    }
    // Déplacement Pion Noir dans le sens droite-gauche ?
    else if (c.piece == Piece.PAWN_BLACK) {
        // La case à gauche doit être libre.
        if (idxCase - 1 >= 0) {
            if (this._isEmpty(idxCase - 1)) {
                liste.push(this.getCaseByIndex(idxCase - 1).number);
            }
        }
    }

    // Déplacement Dame Blanche ou Noire dans les 2 sens
    else if (c.isDame()) {

        // Déplacement dans le sens gauche-droite ?
        // -----------------------------------------
        // Au moins 1 case à droite.
        if (idxCase + 1 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxCase + 1; k < lg; k++) {
                if (this._isEmpty(k)) {
                    liste.push(this.getCaseByIndex(k).number);
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
        if (idxCase - 1 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxCase - 1; k >= 0; k--) {
                if (this._isEmpty(k)) {
                    liste.push(this.getCaseByIndex(k).number);
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }
        }
    }

    return liste;
};


/**
 * @param numCasesDejaPrises
 *            Pour ne pas la reprendre (coup Turc).
 */
Diagonal.prototype.getRaflesItem = function(numCase, numCasesDejaPrises) {
    var c = this.getCaseByNumero(numCase);
    var couleur = c.getColor();

    raflesItem = [];

    var lg = this.size();
    var idxCase = this.indexOf(numCase);

    if (c.isPawn()) {

        // Prise dans le sens gauche-droite ?
        // S'il y a au moins 2 cases devant.
        if (idxCase + 2 < lg) {
            if (this._isEmpty(idxCase + 2)) {
                var cCase1 = this._getColorByIndex(idxCase + 1);
                if (this._isCouleurOppose(couleur, cCase1)) {
                    // prise OK
                    var casePrise = this.getCaseByIndex(idxCase + 1);
                    var caseArrivee = this.getCaseByIndex(idxCase + 2);
                    if (!(numCasesDejaPrises.indexOf(casePrise.number) > -1)) {
                        var ri = new RafleItem(caseArrivee.number, casePrise.number);
                        raflesItem.push(ri);
                    }
                }
            }
        }

        // Prise dans le sens droite-gauche ?
        // S'il y a au moins 2 cases derrière.
        if (idxCase - 2 >= 0) {
            if (this._isEmpty(idxCase - 2)) {
                var cCase1 = this._getColorByIndex(idxCase - 1);
                if (this._isCouleurOppose(couleur, cCase1)) {
                    // prise OK
                    var casePrise = this.getCaseByIndex(idxCase - 1);
                    var caseArrivee = this.getCaseByIndex(idxCase - 2);
                    // System.out.println("debug[" + this.type + "] : " +
                    // (idxCase - 1) + "=" + casePrise);
                    if (!(numCasesDejaPrises.indexOf(casePrise.number) > -1)) {
                        var ri = new RafleItem(caseArrivee.number, casePrise.number);
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
        var nbVideAvant = 0;
        var idxPieceAPrendre = -1;
        var nbVideApres = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases devant.
        if (idxCase + 2 < lg) {
            // On avance case par case, en comptant les cases vides.
            for (var k = idxCase + 1; k < lg; k++) {
                if (this._isEmpty(k)) {
                    nbVideAvant++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'après n'est pas hors du damier
            if (idxCase + nbVideAvant + 2 < lg) {
                idxPieceAPrendre = idxCase + nbVideAvant + 1;
                // Case casePrise = getCaseByIndex(idxPieceAPrendre);

                // S'assurer que la case prise est de couleur opposée.
                var cCasePrise = this._getColorByIndex(idxPieceAPrendre);
                if (this._isCouleurOppose(couleur, cCasePrise)) {
                    // Verifier qu'il existe au moins une case
                    // d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceAPrendre + 1; k < lg; k++) {
                        if (this._isEmpty(k)) {
                            nbVideApres++;
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
        if (idxPieceAPrendre >= 0 && nbVideApres > 0) {
            var casePrise = this.getCaseByIndex(idxPieceAPrendre);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!(numCasesDejaPrises.indexOf(casePrise.number) > -1)) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbVideApres; k++) {
                    var caseArrivee = this.getCaseByIndex(idxPieceAPrendre + k);
                    var ri = new RafleItem(caseArrivee.number, casePrise.number);
                    raflesItem.push(ri);
                }
            }

        }

        // -----------------------------------
        // Prise dans le sens droite-gauche ?
        // -----------------------------------

        // il faut : [0..n] vide + 1 Couleur opposee + [1..n] vide
        nbVideAvant = 0;
        idxPieceAPrendre = -1;
        nbVideApres = 0;
        // ---

        // Avant tout, Il faut au moins 2 cases derrière.
        if (idxCase - 2 >= 0) {
            // On recule case par case, en comptant les cases vides.
            for (var k = idxCase - 1; k >= 0; k--) {
                if (this._isEmpty(k)) {
                    nbVideAvant++;
                } else {
                    // On a rencontré une pièce ou le bord du damier
                    // => fin d'analyse.
                    break;
                }
            }

            // On s'assure que la case d'avant n'est pas hors du damier
            if (idxCase - nbVideAvant - 2 >= 0) {
                idxPieceAPrendre = idxCase - nbVideAvant - 1;
                // Case casePrise = getCaseByIndex(idxPieceAPrendre);

                // S'assurer que la case prise est de couleur opposée.
                var cCasePrise = this._getColorByIndex(idxPieceAPrendre);
                if (this._isCouleurOppose(couleur, cCasePrise)) {
                    // Verifier qu'il existe au moins une case
                    // d'atterrisage.

                    // On avance case par case, en comptant les cases vides.
                    for (var k = idxPieceAPrendre - 1; k >= 0; k--) {
                        if (this._isEmpty(k)) {
                            nbVideApres++;
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
        if (idxPieceAPrendre >= 0 && nbVideApres > 0) {
            var casePrise = this.getCaseByIndex(idxPieceAPrendre);

            // On ne passe pas 2 fois sur la même pièce. (coup turc).
            if (!(numCasesDejaPrises.indexOf(casePrise.number) > -1)) {

                // n cases d'arrivée possibles
                for (var k = 1; k <= nbVideApres; k++) {
                    var caseArrivee = this.getCaseByIndex(idxPieceAPrendre - k);
                    var ri = new RafleItem(caseArrivee.number, casePrise.number);
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
        s += this.cases[k].number;
        var p = this.cases[k].piece;

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
// Class PathFinder
// ----------------------------------------------------------------------------------------------------
function PathFinder() {
}

PathFinder.prototype.getMouvementsSimples = function(board, startingSquareNum) {
    var moves = []; // [Move]

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonaleGD(startingSquareNum);
    var diagoTT = board.getDiagonaleTT(startingSquareNum);

    // Déplacements simples (observés sur chacune des 2 diagonales)
    var liste = diagoGD.getDeplacementsSimples(startingSquareNum);
    liste = liste.concat(diagoTT.getDeplacementsSimples(startingSquareNum));

    for (var k = 0; k < liste.length; k++) {
        var endingSquareNum = liste[k];
        var move = new Move(startingSquareNum, endingSquareNum);
        moves.push(move);
    }

    return moves;
};

PathFinder.prototype.getMouvementsRafles = function(board, startingSquareNum) {
    var tree = this.getArbreRafles(board, startingSquareNum); // NTree<RafleItem>
    return this._treeToMoves(board, tree);
};

PathFinder.prototype._treeToMoves = function(board, tree) {
    var listes = tree.traverse(); // [[RafleItem]]

    var moves = []; // [Move]

    for (var k = 0; k < listes.length; k++) {
        var liste = listes[k];

        // le 1er element n'est pas une prise mais le point de départ.
        // Toujours présents même s'il n'existe aucune prise.
        if (liste.length > 1) {
            var riDeb = liste[0];
            var riFin = liste[liste.length - 1];

            var nDepart = riDeb.endingSquareNum;
            var nArrivee = riFin.endingSquareNum;
            var move = new Move(nDepart, nArrivee);

            for (var j = 0; j < liste.length; j++) {
                var ri = liste[j];
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

PathFinder.prototype.getArbreRafles = function(board, startingSquareNum) {
    var ri = new RafleItem(startingSquareNum);

    var ntreeRoot = new NTree();
    ntreeRoot.setItem(ri);

    this.construireRafles(board.cloneDraughtBoard(), ntreeRoot, []);

    return ntreeRoot;
};

PathFinder.prototype.construireRafles = function(board, node, numCasesDejaPrises) {
    // board.debugDraughtBoard();

    var ri = node.getItem();
    var numCaseNouveauDepart = ri.getNumber();
    // console.log("");
    // console.log("construireRafles(" + numCaseNouveauDepart + ", [" + numCasesDejaPrises + "])");

    // Récupération des 2 diagonales
    var diagoGD = board.getDiagonaleGD(numCaseNouveauDepart);
    var diagoTT = board.getDiagonaleTT(numCaseNouveauDepart);

    // debug
    // console.log(diagoGD);
    // console.log(diagoTT);
    // ---

    // Liste des prises unitaires (observées sur chacune des 2 diagonales)
    var liste = diagoGD.getRaflesItem(numCaseNouveauDepart, numCasesDejaPrises);
    liste = liste.concat(diagoTT.getRaflesItem(numCaseNouveauDepart, numCasesDejaPrises));

    // debug
    // var sri = "";
    // for (var k = 0; k < liste.length; k++) {
    //     var riTmp = liste[k];
    //     sri += riTmp.toString() + "-";
    // }
    // console.log("Arrivées possibles : " + sri);
    // ---

    // Ajout de ces rafles simples dans l'arbre.
    node.setChildren(liste);

    // Recommencer recursivement sur les rafles filles.
    var noeudsFils = node.getChildrenNodes();
    for (var k = 0; k < noeudsFils.length; k++) {
        var nf = noeudsFils[k];
        var r = nf.getItem();

        // On met à jour la liste des cases déjà prises.
        var lcdp = numCasesDejaPrises.slice(0);
        lcdp.push(r.capturedSquareNum);
        // ---

        // On deplace le pion avant de poursuivre
        // (sans retirer la pièce prise).
        var diag = board.cloneDraughtBoard();
        var numDeb = ri.getNumber();
        var numFin = r.endingSquareNum;
        var caseDeb = diag.getCase(numDeb);
        var piece = caseDeb.piece;
        diag.getCase(numDeb).piece = Piece.EMPTY;
        diag.getCase(numFin).piece = piece;

        // ---
        this.construireRafles(diag, nf, lcdp);
    }
};

PathFinder.prototype.displayTreePaths = function(tree) {
    var listes = tree.traverse(); // [[RafleItem]]

    console.log("Nombre de mouvements : " + listes.length);
    for (var k = 0; k < listes.length; k++) {
        var liste = listes[k];
        var s = "";
        for (var j = 0; j < liste.length; j++) {
            var ri = liste[j];
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
Arbiter.getMove = function(board, depart, arrivee, middleSquaresNum) {

    // Toutes les combinaisons de rafles
    var listeMouvementsRafle = Arbiter.pf.getMouvementsRafles(board, depart);
    var existeRafle = listeMouvementsRafle.length > 0;

    var listeMouvements = [];

    // Ne conserver que la/les rafles majoritaires
    if (existeRafle) {
        // console.log("CAS : RAFLE");
        listeMouvements = this._filtreMajoritaire(listeMouvementsRafle);
    }
    // Aucune prise possible => on regarde les déplacements simples
    else {
        // console.log("CAS : DEPLACEMENT SIMPLE");
        listeMouvements = Arbiter.pf.getMouvementsSimples(board, depart);
    }

    // Ne conserver que le/les mouvements qui arrivent sur la case indiquée.
    var listeOK = this._filtreArrivee(listeMouvements, arrivee);

    // Ne conserver que le/les mouvements qui passent par les cases
    // indiquées.
    if (middleSquaresNum != null && middleSquaresNum.length > 0) {
        listeOK = this._filtreInter(listeOK, middleSquaresNum);
    }

    // Si plusieurs mouvements sont valides, on prendra le premier.
    var move = null;
    if (listeOK.length > 0) {
        move = listeOK[0];

        // Enregistrer les mouvements intermédiaires précisées
        if (middleSquaresNum != null) {
            move.middleSquaresNum = middleSquaresNum;
        }

        if (listeOK.length > 1) {
            console.log("Il existe des variantes pour le coup " + depart + "/" + arrivee);
        }
    }

    // Le mouvement demandé est irrégulier.
    if (move == null) {
        move = new Move(depart, arrivee);
        move.status = false;
        move.message = "Mouvement irrégulier..."; // A préciser
    }

    // Préciser s'il s'agit d'une rafle (pour la notation)
    move.isCaptured = existeRafle;

    // Préciser si la piece a été promu en dame.
    var piece = board.getPiece(depart);
    var isCrowned = (piece == Piece.PAWN_WHITE && arrivee >= 1 && arrivee <= 5);
    isCrowned = isCrowned || (piece == Piece.PAWN_BLACK && arrivee >= 45 && arrivee <= 50);
    move.isCrowned = isCrowned;

    return move;
};

/**
 * Ne conserver que le/les mouvements les plus longs. <br />
 * Note : une prise est toujours plus longue qu'un déplacement simple.
 */
Arbiter._filtreMajoritaire = function(moves) {
    var liste = [];

    var lMax = this._moveMax(moves);
    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.size() == lMax) {
            liste.push(m);
        }
    }

    // Eviter les faux positifs de variantes
    liste = this._filtreDoublons(liste);

    return liste;
};

/**
 * Retire les mouvements identiques (mêmes cases prises et même arrivée) <br/>
 * => Eviter les faux positifs de variantes...<br />
 * Exemple d'une dame avec plusieurs pts de repos possibles entre 2 prises.
 */
Arbiter._filtreDoublons = function(moves) {
    var liste = []; // [Move]

    if (moves.length > 1) {
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];
            var isDoublon = false;
            for (var j = 0; j < liste.length; j++) {
                var cf = liste[j];
                if (m == cf) {
                    isDoublon = true;
                }
            }
            if (!isDoublon) {
                liste.push(m);
            }
        }
    } else {
        liste = moves;
    }

    return liste;
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
Arbiter._filtreArrivee = function(moves, endNum) {
    var liste = []; // [Move]

    for (var k = 0; k < moves.length; k++) {
        var m = moves[k];
        if (m.endingSquareNum == endNum) {
            liste.push(m);
        }
    }
    return liste;
};

/**
 * Ne conserve que les mouvements qui passent par les cases intermédiaires
 * indiquées.
 * 
 * @param inters
 *            : REQUIS, non null
 */
Arbiter._filtreInter = function(moves, middleSquaresNum) {
    var liste = []; // [Move]

    if (moves != null) {
        // Pour chaque mouvement
        for (var k = 0; k < moves.length; k++) {
            var m = moves[k];

            var landingSquaresNum = m.landingSquaresNum;
            var tousTrouve = true;
            var nbPose = landingSquaresNum.length;

            var lastIdxPose = -1;

            // Pour chaque inter spécifié
            for (var j = 0; j < middleSquaresNum.length; j++) {
                var inter = middleSquaresNum[j];

                // On regarde s'il fait partie des cases sur laquelle la pièce s'est posée
                var trouve = false;
                for (var idxPose = 0; idxPose < nbPose; idxPose++) {
                    // La case posée existe
                    if (inter == landingSquaresNum[idxPose]) {
                        // ET on ne l'a pas déjà prise en compte
                        if (idxPose > lastIdxPose) {
                            trouve = true;
                            lastIdxPose = idxPose;
                        }
                    }
                }

                if (!trouve) {
                    tousTrouve = false;
                    break; // mouvement suivant
                }
            }

            if (tousTrouve) {
                liste.push(m);
            }

        }
    }
    return liste;
};




// ----------------------------------------------------------------------------------------------------
// Class Partie
// ----------------------------------------------------------------------------------------------------

function Partie() {
    this.board = new DraughtBoard();
    this.moves = []; // [Move]
    this.index = -1;
}


/** Définition de la position */
Partie.prototype.setPosition = function(piece, numbers) {
    this.board.setPosition(piece, numbers);
};

Partie.prototype.setPosition20x20 = function() {
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
Partie.prototype.addMove = function(startNum, endNum, middleSquaresNum) {
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
Partie.prototype.addMoveTxt = function(move) {
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
            var liste = move.split(sep);
            var nb = liste.length;
            if (nb > 1) {
                var error = false;
                var iDeb = parseInt(liste[0], 10);
                var iFin = parseInt(liste[nb - 1], 10);
                var iInters = [];

                if (iDeb === null || iFin === null) {
                    error = true;
                } else {
                    if (nb > 2) {
                        for (var i = 1; i <= nb - 2; i++) {
                            var inter = parseInt(liste[i], 10);
                            if (inter != null) {
                                iInters.push(inter);
                            } else {
                                error = true;
                            }
                        }
                    }
                }
                if (!error) {
                    this.addMove(iDeb, iFin, iInters);
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

Partie.prototype._getStatutNextIndex = function() {
    var status = true;
    if (this.index < this._getLastIndex()) {
        var m = this.moves[this.index + 1];
        status = m.status;
    }
    return status;
};

Partie.prototype._getStatutPrevIndex = function() {
    var status = true;
    if (this.index > 0) {
        var m = this.moves[this.index - 1];
        status = m.status;
    }
    return status;
};

Partie.prototype.hasNext = function() {
    return this._getStatutNextIndex() && this.index < this._getLastIndex();
};

Partie.prototype.hasPrev = function() {
    return this._getStatutPrevIndex() && this.index > -1;
};

Partie.prototype.next = function() {
    if (this.hasNext()) {
        this.index++;
        var m = this.moves[this.index];
        if (m.status) {
            this.board.jouer(m);
        } else {
            this.index--;
        }
    }
};

Partie.prototype.prev = function() {
    if (this.hasPrev()) {
        var m = this.moves[this.index];
        if (m.status) {
            this.board.jouerInv(m);
            this.index--;
        }
    }
}

Partie.prototype.start = function() {
    this._setIndex(-1);
};

Partie.prototype.end = function() {
    this._setIndex(this._getLastIndex());
};

/** Position initiale = 0 ; Premier coup = 1. */
Partie.prototype.setCurseur = function(position) {
    this._setIndex(position - 1);
};

/** Position initiale = -1 ; premier coup = 0 */
Partie.prototype._setIndex = function(idx) {
    idx = this._contraindreIndex(idx);

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

Partie.prototype._getLastIndex = function() {
    return this.moves.length - 1;
};

Partie.prototype._contraindreIndex = function(idx) {
    if (idx < 0) {
        idx = -1;
    } else if (idx > this._getLastIndex()) {
        idx = this._getLastIndex();
    }

    return idx;
};

Partie.prototype._hasError = function() {
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

Partie.prototype.debug = function() {
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

Partie.prototype.debugFull = function() {
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
console.log("Partie");
console.log("--------------------------------------");

function testPartie() {
    var partie = new Partie();
    // ---
    partie.setPosition(Piece.PAWN_WHITE, [33, 38, 39, 43, 44]);
    partie.setPosition(Piece.PAWN_BLACK, [12, 13, 14, 22, 24]);
    partie.setPosition(Piece.DAME_WHITE, []);
    partie.setPosition(Piece.DAME_BLACK, []);
    // ---
    partie.addMove(33, 29);
    partie.addMove(24, 42, [33]);
    partie.addMove(43, 38);
    partie.addMoveTxt("42x33");
    partie.addMoveTxt("39x10");
    // ---

    partie.debugFull();
}


testPartie();
