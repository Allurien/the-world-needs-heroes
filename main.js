
// function gogoApp(){
//     // addClickHandlers();
//     // createBoard();  
// }
// Global variables
    // Card Handling
var firstImageClick = null;
var secondImageClick = null;
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var currentCard = null;
    // Stats
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $("#splashModal").click(closeModal);
    $("#winModal").click(hideWin);
    $('.reset').click(function(){
        games_played++;
        reset_stats();
        display_stats();
        match_counter = 0;
        $(".card").replaceWith();
        // createBoard();
    });
}

// Card Click Functionality
function card_clicked() {
    var clickedCard = $(this);
    if(clickedCard.hasClass('matched') || clickedCard.hasClass('reveal') || clickedCard.hasClass('revealMei')) {
        return;
    }
    clickedCard.addClass('reveal'); 
    $(this.back).addClass('fadeCard animated');    
    if(first_card_clicked === null) {
        first_card_clicked = this;
        firstImageClick = clickedCard.find('.front img').attr('src');
        heroClickSound();
        $(first_card_clicked).addClass('viewing');
        return;
    } else {
        second_card_clicked = this;
        secondImageClick = clickedCard.find('.front img').attr('src');
        $(second_card_clicked).addClass('viewing');
        attempts++;
        $('.attemptValue').text(attempts);
        if (firstImageClick === secondImageClick) {
            currentCard = clickedCard.attr('position');
            powerDetection();
            heroMatchSound();
            match_counter++;
            matches ++;
            attempts++;
            if(heroes.mei.heroCounter !==0 && heroes.mei.heroCounter < 5 && match_counter < 5){
                heroes.mei.heroCounter++;
                revealAdjacentCards();
                
            }   
            $('.attemptValue').text(attempts);
            $('.accuracyValue').text(accuracy + '%');
            $(first_card_clicked).addClass('matched');
            $(second_card_clicked).addClass('matched');
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                victoryPose();
                $('#winModal').removeClass('hideWinModal');
            } else {
                return;
            }
        } else {
            $('.card').addClass('viewing');
            pauseFlip();   
            if(heroes.mei.heroCounter !==0 && heroes.mei.heroCounter < 5){
                heroes.mei.heroCounter++;
                revealAdjacentCards();
                
            }   
            return;
        }
    }
        
        
}
function hideCard(){
    $(first_card_clicked).removeClass('reveal');
    $(second_card_clicked).removeClass('reveal');
    first_card_clicked = null;
    second_card_clicked = null;
    $('.card').removeClass('viewing');
}
function pauseFlip(){
    window.setTimeout(function(){
        hideCard();
    }, 1500);
}
// Stats Functionality
function display_stats(){
    var accuracy = Math.round((matches)/(attempts)*100);
    $('.games-played .playedValue').text(games_played);
    $('.attempts .attemptValue').text(attempts);
    $('.accuracy .accuracyValue').text(accuracy + '%');
}
function reset_stats(){
    var matches = 0;
    var attempts = 0;
    var accuracy = 0;
    display_stats();
}


// Hero Power Invocation
function powerDetection(){
    function removeAbility() {
        $('.abilities').text('Choose a card');
    }
    if(secondImageClick == heroes.mei.src) {
        $('.abilities').text('You\'ve triggered Mei\'s Ice Wall!');
        setTimeout(removeAbility, 4000);
        revealAdjacentCards();
    } else if(secondImageClick == heroes.genji.src) {
        $('.abilities').text('You\'ve triggered Genji\'s Dragon Blade!');
        setTimeout(removeAbility, 4000);
        revealDiagonalCards();
    } else if(secondImageClick == heroes.hanzo.src) {
        $('.abilities').text('You\'ve triggered Hanzo\'s Sonic Arrow!');
        setTimeout(removeAbility, 4000);
        revealEdgeCards();
    } else if(secondImageClick == heroes.bastion.src) {
        $('.abilities').text('You\'ve triggered Bastion\'s Tank Configuration! Run.');
        setTimeout(removeAbility, 4000);
        revealRandomCards();
    } else {
        return;
    }
}
function revealAdjacentCards() {
    var position = parseInt(currentCard);
    var range = position >= 0 && position < 18;
    var topPosition = parseInt(currentCard)-6;
    var bottomPosition = parseInt(currentCard)+6;
    var leftPosition = parseInt(currentCard)-1;
    var rightPosition = parseInt(currentCard)+1;
    var topElementSelector = `div[position="${topPosition}"]`;
    var bottomElementSelector = `div[position="${bottomPosition}"]`;
    var leftElementSelector = `div[position="${leftPosition}"]`;
    var rightElementSelector = `div[position="${rightPosition}"]`;
    if(heroes.mei.heroCounter == 0){
        topBottomCheck();
        leftCheck();
        rightCheck();
        heroes.mei.heroCounter++;
    } else if(heroes.mei.heroCounter < 5) {
        iceWall();
    }
    function topBottomCheck(){      
        if(topPosition >= 0 && topPosition < 18){
            $(topElementSelector).addClass('revealMei');
        }
        if(bottomPosition >= 0 && bottomPosition < 18)
            $(bottomElementSelector).addClass('revealMei');   
        }
    function leftCheck(){
        if(leftPosition !== 5 && leftPosition !== 11) {
            $(leftElementSelector).addClass('revealMei');
        }  
    }
    function rightCheck(){
        if(rightPosition !== 6 && rightPosition !== 12) {
            $(rightElementSelector).addClass('revealMei');
        }
    }
    function iceWall(){
        if(heroes.mei.heroCounter == 4){
        setTimeout(removeIceElement, 2000);
        } else {
            return;
        }
        function removeIceElement() {
            $(topElementSelector).addClass('deIce');
            $(topElementSelector).removeClass('revealMei deIce');
            $(bottomElementSelector).addClass('deIce');
            $(bottomElementSelector).removeClass('revealMei deIce');
            $(leftElementSelector).addClass('deIce');
            $(leftElementSelector).removeClass('revealMei deIce');
            $(rightElementSelector).addClass('deIce');
            $(rightElementSelector).removeClass('revealMei deIce');
        }
    }
}
function revealDiagonalCards() {
    var position = parseInt(currentCard);
    var range = position >= 0 && position < 18;
    var topLeft = parseInt(currentCard)-7;
    var topRight = parseInt(currentCard)-5;
    var bottomLeft = parseInt(currentCard)+5;
    var bottomRight = parseInt(currentCard)+7;
    var topLeftSelector = `div[position="${topLeft}"]`;
    var topRightSelector = `div[position="${topRight}"]`;
    var bottomLeftSelector = `div[position="${bottomLeft}"]`;
    var bottomRightSelector = `div[position="${bottomRight}"]`;
    leftCheck();
    rightCheck();
    function leftCheck(){
        if(range == true && position !== 6 && position !== 12 && position !== 18) {
            $(topLeftSelector).addClass('revealGenji');
            $(bottomLeftSelector).addClass('revealGenji');
        }  
    }
    function rightCheck(){
        if(range == true && position !== 5 && position !== 11 && position !== 17) {
            $(topRightSelector).addClass('revealGenji');
            $( bottomRightSelector).addClass('revealGenji');
        }
    }
}
function revealEdgeCards() {
    addElement();
    function addElement() {
        $('div[position="0"]').addClass('reveal');
        $('div[position="6"]').addClass('reveal');
        $('div[position="12"]').addClass('reveal');
        $('div[position="5"]').addClass('reveal');
        $('div[position="11"]').addClass('reveal');
        $('div[position="17"]').addClass('reveal');
    }
    function removeElement() {
        $('div[position="0"]').removeClass('reveal');
        $('div[position="6"]').removeClass('reveal');
        $('div[position="12"]').removeClass('reveal');
        $('div[position="5"]').removeClass('reveal');
        $('div[position="11"]').removeClass('reveal');
        $('div[position="17"]').removeClass('reveal');
    }
    setTimeout(removeElement, 2000);
}
function revealRandomCards(){
    var position = parseInt(currentCard);
    var range = position >= 0 && position < 18;
    var card1 = `div[position="${Math.floor((Math.random() * 17))}"]`;
    var card2 = `div[position="${Math.floor((Math.random() * 17))}"]`;
    var card3 = `div[position="${Math.floor((Math.random() * 17))}"]`;
    $(card1).addClass('revealBastion');
    $(card2).addClass('revealBastion');
    $(card3).addClass('revealBastion');
}


