var
    symbols = require('../utils/symbols'),
    Color = symbols.Color
;

function Move(startNum, endNum) {
    this.startingSquareNum = startNum;
    this.endingSquareNum = endNum;
    this.middleSquaresNum = []; // [int]

    this.color = Color.NONE;
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
Move.prototype.addCapturedSquare = function(square) {
    this.capturedSquares.push(square);
};

Move.prototype.size = function() {
    return this.capturedSquares.length + this.landingSquaresNum.length;
};

Move.prototype.getLandingSquaresNum = function() {
    return this.landingSquaresNum;
};

Move.prototype.getCapturedSquaresNum = function() {
    var list = [];
    for (var k = 0; k < this.capturedSquares.length; k++){
        list.push(this.capturedSquares[k].number);
    }
    return list;
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

module.exports = Move;
