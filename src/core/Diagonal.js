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
