(function($) {

    function generateUUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    function getUniqueId(element){
        var id = $(element).attr('id');
        if (typeof id === typeof undefined || id === false) {
            id = generateUUID();
            $(element).attr("id", id);
        }
        return id;
    };

    $.player = function(element, options) {

        // Default options
        var defaults = {
            format:'pdn',
            type:'canvas',
            pdnFirstLoadNum:1,
            cvSquareSize:40,
            cvSquareDarkColor:'#B4814E',
            cvSquareLightColor:'#FFFFFF',
            cvSquareLandingColor:'#84532F',
            cvSquareStartColor:'#84532F',
            cvSquareEndColor:'#84532F',
            displayNumbers:false,
            numberTextFont:"10px Arial",
            numberTextColor:"#FFFFFF",
            delayAfterHighlight:200,
            delayToJump:200,
            delayToRemoveCapturedPiece:100,
            delayAutoPlay:1000
        };

        // avoid $(this) confusion
        // plugin instance
        var plugin = this;

        plugin.options = {}

        // Jquery item reference
        var $element = $(element);
        // HTML item reference
        var element = element;
        // ID item reference
        var id = getUniqueId(element);
        // Timer (canvas animation)
        var timer = null;
        // Timer (Autoplay)
        var timerAutoPlay = null;

        var game = null;
        var board = null;

        var pdnManager = null;
        var pdnCurrentNumGame = null;


        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            
            if (plugin.options['format'] == "damweb"){
                var position = $element.data('position');
                var notation = $element.data('notation');
                game = DamWeb.getGame(position, notation);
                game.start(); 
                board = game.board;
            } else if (plugin.options['format'] == "pdn"){
                var pdnText = $element.html();
                pdnManager = new PDN(pdnText);

                var nbGames = pdnManager.getGameCount();
                if (nbGames > 0){
                    var firstNum = plugin.options['pdnFirstLoadNum'];
                    if (firstNum){
                        if (firstNum > nbGames){
                            firstNum = 1;
                        }
                        pdnCurrentNumGame = firstNum;
                        initPDNGame();
                    }
                }
            } 
            
            // if no game is loaded, we initialize an emty one.
            if (game === null){
                game = new Game();
                board = game.board;
            }
      
            initLayout();

            $("#" + id).on("change", "select[name="+id+"-menu]",function(){
                pdnCurrentNumGame = $(this).val();
                initPDNGame();
                initLayout();
            });

            $("#" + id).on("click", ".notation span",function(){
                var pos = $(this).data('pos');
                applyPosition(pos);
            });

            $("#" + id).on("click", ".control-bar .start",function(){
                applyStart();
            });

            $("#" + id).on("click", ".control-bar .end",function(){
                applyEnd();
            });

            $("#" + id).on("click", ".control-bar .prev",function(){
                applyPrev();
            });

            $("#" + id).on("click", ".control-bar .next",function(){
                applyNext();
            });

            $("#" + id).on("click", ".control-bar .autoplay",function(){
                autoPlay();
            });
        };

        var initPDNGame = function(){
            razAnim();
            razAutoPlay();
            
            if (pdnCurrentNumGame){
                game = pdnManager.getGame(pdnCurrentNumGame);
                game.start();
            } else {
                game = new Game();
            }
            board = game.board;
        };

        var initLayout = function(){
            var layout = '';
            layout += '<table>';
            layout += '<tr>';
            layout += '<td>';

            if (plugin.options['type'] == "canvas"){
                layout += '<div class="outer-box">'
                layout += '    <div class="inner-box">'
                layout += '        <canvas class="cv-board"></canvas>';
                layout += '    </div>';
                layout += '</div>';
            } else if (plugin.options['type'] == "ascii"){
                layout += '<div class="ascii-view"></div>';
            }

            var menu = '';
            if (pdnManager !== null){
                var nbGames = pdnManager.getGameCount();
                if (nbGames > 1) {
                    var titles = pdnManager.getTitles("tagWhite - tagBlack [tagRound] - tagResult");
                    menu = '<select name="' + id + '-menu">';
                    
                    if (!plugin.options['pdnFirstLoadNum']){
                        menu += '<option value="">&mdash;</option>';
                    }

                    for (var k = 0; k < titles.length; k++){
                        var t = titles[k];
                        var isSelect = (pdnCurrentNumGame == t['num']);
                        var attrSelected = '';
                        if (isSelect){
                            attrSelected = ' selected="selected"';
                        }
                        menu += '<option value="' + t["num"] + '"' + attrSelected + '>' + t["num"] + ' &ndash; ' + t["title"] + '</option>';
                    }
                    menu += '</select>';
                }
            }

            layout += '</td>';
            layout += '<td>';
            if (menu){
                layout += '<div class="pdn-games">' + menu + '</div>';
            }
            if (game.hasMove()){
                layout += '<div class="notation"></div>';
            }
            layout += '</td>';
            layout += '</tr>';
            layout += '<tr>';
            layout += '<td>';
            if (game.hasMove()){
                layout += '<div class="control-bar">';
                layout += '    <button class="start">&laquo;</button>';
                layout += '    <button class="prev">&lsaquo;</button>';
                layout += '    <button class="next">&rsaquo;</button>';
                layout += '    <button class="end">&raquo;</button>';
                layout += '    <button class="autoplay">&diams;</button>';
                layout += '</div>';
            }
            layout += '</td>';
            layout += '<td></td>';
            layout += '</tr>';
            layout += '</table>';

            $(element).html(layout);

            refreshNotation();

            if (plugin.options['type'] == "ascii"){
                refreshASCII();
            } else if (plugin.options['type'] == "canvas"){
                var $c = $("#" + id + " .cv-board")[0];
                var ctx = $c.getContext("2d");
                var sqWidth = plugin.options['cvSquareSize'];
                $c.width = 10*sqWidth;
                $c.height = 10*sqWidth;

                drawCanvasContent(ctx);
            }
        };

        var razAnim = function(){
            if (timer !== null){
                clearInterval(timer);
                timer = null;
            }
        };

        var razAutoPlay = function(){
            if (timerAutoPlay !== null){
                clearInterval(timerAutoPlay);
                timerAutoPlay = null;
            }
        };

        var refreshAll = function(){
            refreshNotation();

            if (plugin.options['type'] == "ascii"){
                refreshASCII();
            } else if (plugin.options['type'] == "canvas"){
                refreshCanvas();
            }
        };

        var refreshNotation = function(){
            var $notationArea = $("#" + id + " .notation");
            $notationArea.html(getHTMLNotation());
        };

        var refreshASCII = function(){
            var $c = $("#" + id + " .ascii-view");
            $c.html(getASCIIBoard());
        };

        var refreshCanvas = function(){
            var $c = $("#" + id + " .cv-board")[0];
            var ctx = $c.getContext("2d");
            drawCanvasContent(ctx);
        };

        var applyPosition = function(pos){
            razAnim();
            razAutoPlay();
            game.setCursor(pos);
            refreshAll();
        };

        var applyStart = function(){
            razAnim();
            razAutoPlay();
            game.start();
            refreshAll();
        };
        
        var applyEnd = function(){
            razAnim();
            razAutoPlay();
            game.end();
            refreshAll();
        };

        var applyNext = function(){
            razAnim();
            razAutoPlay();
            refreshAll();
            applyNextAuto();
        };

        var applyNextAuto = function(){
            if (plugin.options['type'] == "ascii"){
                game.next();
                refreshAll();
            } else if (plugin.options['type'] == "canvas"){
                razAnim();
                drawCanvasNextMove();
                game.next();
                refreshNotation();
            }
        };

        var applyPrev = function(){
            razAnim();
            razAutoPlay();
            game.prev();
            refreshAll();
        };

        var autoPlay = function(){
            var callback = function() { 
                // waiting the end of the current animation if it exists.
                if (timer !== null){
                    return;
                }

                if (game.hasNext()){
                    if (plugin.options['type'] == "canvas"){
                        refreshCanvas();
                    }
                    applyNextAuto();
                } else {
                    razAutoPlay();
                }
            };

            // Stop/Start
            if (timerAutoPlay !== null){
                razAutoPlay();
            } else {
                callback(); // Do not wait first time
                timerAutoPlay = setInterval(callback, plugin.options['delayAutoPlay']);
            }
        };


        var getHTMLNotation = function(){
            var notationStruct = game.getNotation();

            var ht = '';
            for (var k = 0; k < notationStruct.length; k++){
                var line = notationStruct[k];
                

                var bn = '';
                if (line.number < 10) {
                    bn += '&nbsp;';
                }
                bn += line.number;
                                

                var currentWhite = false;
                var posWhite = '';
                var bw = '';
                if (line.white !== undefined){
                    currentWhite = line.white.current;
                    posWhite = line.white.position;
                    var nsWhite = getNotationStyle(line.white.move);
                    if (nsWhite.before) {
                        bw += '&nbsp;';
                    }
                    bw += nsWhite.notation;
                    if (nsWhite.after) {
                        bw += '&nbsp;';
                    }
                } else {
                    bw = '&nbsp;...&nbsp;';
                }
                    
                var currentBlack = false;
                var posBlack = '';
                var bm = '';
                if (line.black !== undefined){
                    currentBlack = line.black.current;
                    posBlack = line.black.position;
                    var nsBlack = getNotationStyle(line.black.move);
                    if (nsBlack.before) {
                        bm += '&nbsp;';
                    }
                    bm += nsBlack.notation;
                    if (nsBlack.after) {
                        bm += '&nbsp;';
                    }
                }


                var s = '';
                s += bn + '. ';


                s += '<span';
                if (!isNaN(posWhite)){
                    s += ' data-pos="' + posWhite + '"';
                }
                if (currentWhite){
                    s += ' class="active"';
                }
                s += '>';
                s += bw + '</span>';
                s += " &nbsp;";


                s += '<span';
                if (!isNaN(posBlack)){
                    s += ' data-pos="' + posBlack + '"';
                }
                if (currentBlack){
                    s += ' class="active"';
                }
                s += '>';
                s += bm + '</span>';


                ht += s + "<br />";
            }

            return ht;
        };

        var getNotationStyle = function(notation){
            var idxSep = notation.indexOf("-");
            if (idxSep == -1) {
                idxSep = notation.indexOf("x");
            } 
            var s = notation.substring(idxSep + 1);

            var before = (idxSep == 1);
            var after = (s.length == 1);

            notation = notation.replace("-", "&minus;");
            notation = notation.replace("x", "&times;");

            var map = { 'notation':notation, 'before':before, 'after':after };
            return map;
        };

        var getASCIIBoard = function() {
            var s = "";
            
            var cr = "<br />";
            var sp = "&nbsp;";
            var row = "";

            s += "================================" + cr;
            for (var k = 0; k < 10; k++) {
                row += "|";
                for (var l = 1; l <= 5; l++) {

                    var num = 5 * k + l;
                    var p = board.getSquare(num).piece;

                    if (k == 0 || k == 2 || k == 4 || k == 6 || k == 8) {
                        row += sp + sp + sp;
                    }

                    switch (p) {
                    case Piece.PAWN_WHITE:
                        row += sp + "o" + sp;
                        break;
                    case Piece.PAWN_BLACK:
                        row += sp + "x" + sp;
                        break;
                    case Piece.DAME_WHITE:
                        row += sp + "O" + sp;
                        break;
                    case Piece.DAME_BLACK:
                        row += sp + "X" + sp;
                        break;
                    default:
                        row += sp + "." + sp;
                    }

                    if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9) {
                        row += sp + sp + sp;
                    }
                }
                row += "|";

                s += row + cr;
                row = "";
            }
            s += "================================";

            return s;
        };

        var drawPiece = function(ctx, piece, x, y, r){
            var sqWidth = plugin.options['cvSquareSize'];
            var shift = ((~~(sqWidth / 10)) + 1) / 2;

            switch (piece) {
            case Piece.PAWN_WHITE:
                ctx.beginPath();
                ctx.arc(x, y, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.PAWN_BLACK:
                ctx.beginPath();
                ctx.arc(x, y, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "#888";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.DAME_WHITE:
                ctx.beginPath();
                ctx.arc(x, y + shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(x, y - shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                break;
            case Piece.DAME_BLACK:
                ctx.beginPath();
                ctx.arc(x, y + shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "#888";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(x, y - shift, r ,0, Math.PI * 2, true);
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.stroke();
                break;
            default:
            }
        };

        var drawSquare = function(ctx, num, piece, sqColor){
            var nRow = ~~((num - 1) / 5) + 1; // [1..10]
            var nCol = ((num - 1) % 5) + 1; // [1..5]

            var sqWidth = plugin.options['cvSquareSize'];

            if (nRow == 1 || nRow == 3 || nRow == 5 || nRow == 7 || nRow == 9) {
                var x = 2 * sqWidth * (nCol - 1) + sqWidth;
                var y = sqWidth * (nRow - 1);

                drawSquareInc(ctx, num, piece, x, y, sqColor);
            }

            if (nRow == 2 || nRow == 4 || nRow == 6 || nRow == 8 || nRow == 10) {
                var x = 2 * sqWidth * (nCol - 1);
                var y = sqWidth * (nRow - 1);

                drawSquareInc(ctx, num, piece, x, y, sqColor);
            }
        };

        var drawSquareInc = function(ctx, num, piece, x, y, sqColor){
            var sqWidth = plugin.options['cvSquareSize'];
               
            if (!sqColor){
                sqColor = plugin.options['cvSquareDarkColor'];
            }
            ctx.fillStyle = sqColor;
            ctx.fillRect(x, y, sqWidth, sqWidth);

            if (plugin.options['displayNumbers']){
                ctx.font = plugin.options['numberTextFont'];
                ctx.fillStyle = plugin.options['numberTextColor'];
                ctx.fillText("" + num, x + 2, y + sqWidth - 2);
            }

            var x = x + (sqWidth / 2);
            var y = y + (sqWidth / 2);
            var r = sqWidth / 2 - (sqWidth / 10 * 2);

            drawPiece(ctx, piece, x, y, r);
        };

        var drawCanvasContent = function(ctx){
            var sqWidth = plugin.options['cvSquareSize'];
            ctx.fillStyle = plugin.options['cvSquareLightColor'];
            ctx.fillRect(0, 0, 10*sqWidth, 10*sqWidth);

            for (var num = 1; num <= 50; num++){
                var p = board.getSquare(num).piece;
                drawSquare(ctx, num, p);
            }
        };

        var drawCanvasNextMove = function(){
            var move = game.getNextMove();
            if (move === null) {
                return;
            }

            var $c = $("#" + id + " .cv-board")[0];
            var ctx = $c.getContext("2d");

            var piecePlayed = board.getPiece(move.startingSquareNum);
            drawCanvasNextMoveStep2(ctx, move, piecePlayed);            
        };

        var drawCanvasNextMoveStep2 = function(ctx, move, piecePlayed){
            // color start square.
            drawSquare(ctx, move.startingSquareNum, piecePlayed, plugin.options['cvSquareStartColor']);

            // color end square.
            drawSquare(ctx, move.endingSquareNum, Piece.EMPTY, plugin.options['cvSquareStartColor']);

            // color intermediate squares.
            if (move.isCaptured){
                var landingSquaresNum = move.getLandingSquaresNum();
                for (var i = 0; i < landingSquaresNum.length; i++) {
                    var num = landingSquaresNum[i];
                    if (num != move.startingSquareNum) {
                        drawSquare(ctx, num, Piece.EMPTY, plugin.options['cvSquareLandingColor']);
                    }
                }
            }

            // Wait a little...
            (function() {
                var callback = function() { 
                    razAnim();
                    drawCanvasNextMoveStep3(ctx, move, piecePlayed);
                };
                timer = setInterval(callback, plugin.options['delayAfterHighlight']);
            })();
        };

        var drawCanvasNextMoveStep3 = function(ctx, move, piecePlayed){
            // Remove piece from starting square
            drawSquare(ctx, move.startingSquareNum, Piece.EMPTY, plugin.options['cvSquareStartColor']);
            
            
            if (!move.isCaptured){
                drawCanvasNextMoveStep4(ctx, move, piecePlayed);
            } 
            // Move piece on intermediate squares
            else {

                var landingSquaresNum = move.getLandingSquaresNum();
                if (landingSquaresNum.length > 0){
                    
                    (function() {
                        var i = 0;
                        var callback = function() {
                            if (i < landingSquaresNum.length){
                                var num = landingSquaresNum[i];
                                var numPrev = null;
                                if (i > 0){
                                    numPrev = landingSquaresNum[i - 1];
                                }
                                if (numPrev !== null){
                                    drawSquare(ctx, numPrev, Piece.EMPTY, plugin.options['cvSquareLandingColor']);
                                }
                                drawSquare(ctx, num, piecePlayed, plugin.options['cvSquareLandingColor']);
                                
                                i++;
                            } else {
                                razAnim();
                                drawCanvasNextMoveStep4(ctx, move, piecePlayed);
                            }
                        };

                        callback(); // do not wait first time
                        timer = setInterval(callback, plugin.options['delayToJump']);
                    })();

                } else {
                    drawCanvasNextMoveStep4(ctx, move, piecePlayed);
                }
            }
        };

        var drawCanvasNextMoveStep4 = function(ctx, move, piecePlayed){
            // Set piece on ending square
            if (!move.isCrowned) {
                drawSquare(ctx, move.endingSquareNum, piecePlayed, plugin.options['cvSquareEndColor']);
            }
            // Piece is crowned
            else {
                if (piecePlayed == Piece.PAWN_WHITE) {
                    drawSquare(ctx, move.endingSquareNum, Piece.DAME_WHITE, plugin.options['cvSquareEndColor']);
                } else if (piecePlayed == Piece.PAWN_BLACK) {
                    drawSquare(ctx, move.endingSquareNum, Piece.DAME_BLACK, plugin.options['cvSquareEndColor']);
                }
            }

            // Remove pieces for captured squares
            if (move.isCaptured){
                var capturedNums = move.getCapturedSquaresNum();
                if (capturedNums.length > 0){
                    
                    (function() {
                        var i = 0;
                        var callback = function() { 
                            if (i < capturedNums.length){
                                var num = capturedNums[i];
                                drawSquare(ctx, num, Piece.EMPTY);
                                
                                i++;
                            } else {
                                razAnim();
                            }
                        };
                        timer = setInterval(callback, plugin.options['delayToRemoveCapturedPiece']);
                    })();
                }
            }
        };

        plugin.init();
    };


    



    $.fn.player = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('player')) {
                var plugin = new $.player(this, options);
                $(this).data('player', plugin);
            }
        });
    };

})(jQuery);

