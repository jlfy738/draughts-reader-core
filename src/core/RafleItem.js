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

module.exports = RafleItem;
