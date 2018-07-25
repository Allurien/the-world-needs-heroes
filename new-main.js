$(document).ready(gogoApp);
function gogoApp(){
    addClickHandlers();
    createBoard();  
}
//Stat Handling
const stats = {
    matches: 0,
    attempts:0,
    accuracy: 0,
    games_played: 0
}
// Card Handling
const cardHandling = {
    firstImageClick: null,
    secondImageClick: null,
    first_card_clicked: null,
    second_card_clicked: null,
    total_possible_matches: 9,
    match_counter: 0,
    currentCard: null
}
function addClickHandlers(){
    $('#game-area').on('click', '.card', card_clicked);
    $("#splashModal").click(closeModal);
    $("#winModal").click(hideWin);
    $('.reset').click(function(){
        stats.games_played++;
        reset_stats();
        display_stats();
        cardHandling.match_counter = 0;
        $(".card").replaceWith();
        createBoard();
    });
}
function closeModal(){
    $('#splashModal').replaceWith();
    bgMusicPlay();
}
function card_clicked() {
    var clickedCard = $(this);
    if(clickedCard.hasClass('matched') || clickedCard.hasClass('reveal') || clickedCard.hasClass('revealMei')) {
        return;
    }
    clickedCard.addClass('reveal'); 
    $(this.back).addClass('fadeCard animated');    
    if(cardHandling.first_card_clicked === null) {
        cardHandling.first_card_clicked = this;
        cardHandling.firstImageClick = clickedCard.find('.front img').attr('src');
        heroClickSound();
        $(cardHandling.first_card_clicked).addClass('viewing');
        return;
    } else {
        cardHandling.second_card_clicked = this;
        cardHandling.secondImageClick = clickedCard.find('.front img').attr('src');
        $(cardHandling.second_card_clicked).addClass('viewing');
        stats.attempts++;
        $('.attemptValue').text(stats.attempts);
        if (cardHandling.firstImageClick === cardHandling.secondImageClick) {
            cardHandling.currentCard = clickedCard.attr('position');
            powerDetection();
            heroMatchSound();
            stats.match_counter++;
            stats.matches ++;
            stats.attempts++;
            if(heroes.mei.heroCounter !==0 && heroes.mei.heroCounter < 5 && match_counter < 5){
                heroes.mei.heroCounter++;
                revealAdjacentCards();
                
            }   
            $('.attemptValue').text(stats.attempts);
            $('.accuracyValue').text(stats.accuracy + '%');
            $(cardHandling.first_card_clicked).addClass('matched');
            $(cardHandling.second_card_clicked).addClass('matched');
            cardHandling.first_card_clicked = null;
            cardHandling.second_card_clicked = null;
            if (cardHandling.match_counter === cardHandling.total_possible_matches) {
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
    $(cardHandling.first_card_clicked).removeClass('reveal');
    $(cardHandling.second_card_clicked).removeClass('reveal');
    cardHandling.first_card_clicked = null;
    cardHandling.second_card_clicked = null;
    $('.card').removeClass('viewing');
}
function pauseFlip(){
    window.setTimeout(function(){
        hideCard();
    }, 1500);
}
// Stats Functionality
function display_stats(){
    stats.accuracy = Math.round((stats.matches)/(stats.attempts)*100);
    $('.games-played .playedValue').text(stats.games_played);
    $('.attempts .attemptValue').text(stats.attempts);
    $('.accuracy .accuracyValue').text(stats.accuracy + '%');
}
function reset_stats(){
    stats.matches = 0;
    stats.attempts = 0;
    stats.accuracy = 0;
    display_stats();
}
// Game Board Generation
function createBoard(){
    for(i=0; i<cardHandling.total_possible_matches*2; i++){
        var card = $('<div>').addClass('card').attr('position',i);
        var front = $('<div>').addClass('front');
        var back = $('<div>').addClass('back');
        $('#game-area').append(card);
    }
    $('.card').append(front, back);
    addHeroes();
}
function addHeroes(){
    var rosterCopy = heroRoster.concat(heroRoster);
    $('.front').each(function(){
    var heroChoice = Math.floor(Math.random() * rosterCopy.length);
    $(this).append(`<img src= "assets/images/heroes/${rosterCopy[heroChoice]}.png" alt= "${rosterCopy[heroChoice]}"/>`); 
    rosterCopy.splice(heroChoice, 1);
  });
}