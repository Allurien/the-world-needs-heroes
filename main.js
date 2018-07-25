$(document).ready(gogoApp);
function gogoApp(){
    addClickHandlers();
    createBoard();  
}
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
        createBoard();
    });
}
function closeModal(){
    $('#splashModal').replaceWith();
    bgMusicPlay();
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
// Game Board Generation
function createBoard(){
    for(i=0; i<total_possible_matches*2; i++){
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
    $(this).append(`<img src= "/assets/images/heroes/${rosterCopy[heroChoice]}.png" alt= "${rosterCopy[heroChoice]}"/>`); 
    rosterCopy.splice(heroChoice, 1);
  });
}
function victoryPose(){
    var heroVictoryPoses = ['bastion', 'brigitte', 'genji', 'hanzo', 'mei', 'mercy', 'sombra', 'tracer', 'zenyatta'];
    var randomPose = heroVictoryPoses[Math.floor(Math.random() * heroVictoryPoses.length)];
    switch(randomPose){
        case 'bastion':
            $('#winModal').append(`<img src= "${heroes.bastion.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'brigitte':
            $('#winModal').append(`<img src= "${heroes.brigitte.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'genji':
            $('#winModal').append(`<img src= "${heroes.genji.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'hanzo':
            $('#winModal').append(`<img src= "${heroes.hanzo.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'mei':
            $('#winModal').append(`<img src= "${heroes.mei.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'mercy':
            $('#winModal').append(`<img src= "${heroes.mercy.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'sombra':
            $('#winModal').append(`<img src= "${heroes.sombra.victoryPose}" alt= "You Won"/>)`); 
            break;  
        case 'tracer':
            $('#winModal').append(`<img src= "${heroes.tracer.victoryPose}" alt= "You Won"/>)`); 
            break;
        case 'zenyatta':
            $('#winModal').append(`<img src= "${heroes.zenyatta.victoryPose}" alt= "You Won"/>)`); 
            break;
    }  
    var winner = $('<p>').text('YOU WON!');
    $('#winModal').append(winner);
    $('.abilities').text('You won! Reset and play again?');
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
// Heroes
var heroRoster = ['bastion', 'brigitte', 'genji', 'hanzo', 'mei', 'mercy', 'sombra', 'tracer', 'zenyatta'];
var heroes = {
    bastion: {
        power: revealRandomCards,
        clickSound: new Audio('assets/sounds/bastion-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/bastion-ult.ogg'),
        victoryPose: 'assets/images/heroes/bastion-victory.png',
        src: 'assets/images/heroes/bastion.png'
    },
    brigitte: {
        power: 'none',
        clickSound: new Audio('assets/sounds/brigitte-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/brigitte-ult.ogg'),
        victoryPose: 'assets/images/heroes/brigitte-victory.png',
        src: 'assets/images/heroes/brigitte.png'
    },
    genji: {
        power: revealDiagonalCards,
        clickSound: new Audio('assets/sounds/genji-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/genji-ult.ogg'),
        victoryPose: 'assets/images/heroes/genji-victory.png',
        src: 'assets/images/heroes/genji.png'
    },
    hanzo:{
        power: revealEdgeCards,
        clickSound: new Audio('assets/sounds/hanzo-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/hanzo-ult.ogg'),
        victoryPose: 'assets/images/heroes/hanzo-victory.png',
        src: 'assets/images/heroes/hanzo.png' 
    },
    mei: {
        power: revealAdjacentCards,
        heroCounter: 0,
        clickSound: new Audio('assets/sounds/mei-click.mp3'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/mei-ult.ogg'),
        victoryPose: 'assets/images/heroes/mei-victory.png',
        src: 'assets/images/heroes/mei.png'
    },
    mercy: {
        power: 'none',
        clickSound: new Audio('assets/sounds/mercy-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/mercy-ult.ogg'),
        victoryPose: 'assets/images/heroes/mercy-victory.png',
        src: 'assets/images/heroes/mercy.png'
    },
    sombra: {
        power: 'none',
        clickSound: new Audio('assets/sounds/sombra-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/sombra-ult.ogg'),
        victoryPose: 'assets/images/heroes/sombra-victory.png',
        src: 'assets/images/heroes/sombra.png'
    },
    tracer: {
        power: 'none',
        clickSound: new Audio('assets/sounds/tracer-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/tracer-ult.ogg'),
        victoryPose: 'assets/images/heroes/tracer-victory.png',
        src: 'assets/images/heroes/tracer.png'
    },
    zenyatta: {
        power: 'none',
        clickSound: new Audio('assets/sounds/zenyatta-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/zenyatta-ult.ogg'),
        victoryPose: 'assets/images/heroes/zenyatta-victory.png',
        src: 'assets/images/heroes/zenyatta.png'
    },
}
// Sounds
function heroClickSound(){
    var heroName = firstImageClick.slice(14, -4);
    switch(heroName){  
        case 'bastion': 
            if(heroes.bastion.clickSoundLimiter == false){
                heroes.bastion.clickSound.play();
                heroes.bastion.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'brigitte': 
            if(heroes.brigitte.clickSoundLimiter == false){
                heroes.brigitte.clickSound.play();
                heroes.brigitte.clickSoundLimiter = true;
            } else {
                break;
            }            
            break;
        case 'genji': 
            if(heroes.genji.clickSoundLimiter == false){
                heroes.genji.clickSound.play();
                heroes.genji.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'hanzo': 
            if(heroes.hanzo.clickSoundLimiter == false){
                heroes.hanzo.clickSound.play();
                heroes.hanzo.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'mei': 
            if(heroes.mei.clickSoundLimiter == false){
                heroes.mei.clickSound.play();
                heroes.mei.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'mercy': 
            if(heroes.mercy.clickSoundLimiter == false){
                heroes.mercy.clickSound.play();
                heroes.mercy.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'sombra': 
            if(heroes.sombra.clickSoundLimiter == false){
                heroes.sombra.clickSound.play();
                heroes.sombra.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'tracer': 
            if(heroes.tracer.clickSoundLimiter == false){
                heroes.tracer.clickSound.play();
                heroes.tracer.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
        case 'zenyatta': 
            if(heroes.zenyatta.clickSoundLimiter == false){
                heroes.zenyatta.clickSound.play();
                heroes.zenyatta.clickSoundLimiter = true;
            } else {
                break;
            }
            break;
    }
}
function heroMatchSound(){
    var heroName = secondImageClick.slice(14, -4);
    switch(heroName){
        case 'bastion': 
            heroes.bastion.matchSound.play();
            break;
        case 'brigitte': 
            heroes.brigitte.matchSound.play();
            break;
        case 'genji': 
            heroes.genji.matchSound.play();
            break;
        case 'hanzo': 
            heroes.hanzo.matchSound.play();
            break;
        case 'mei': 
            heroes.mei.matchSound.play();
            break;
        case 'mercy': 
            heroes.mercy.matchSound.play();
            break;
        case 'sombra': 
            heroes.sombra.matchSound.play();
            break;
        case 'tracer': 
            heroes.tracer.matchSound.play();
            break;
        case 'zenyatta': 
            heroes.zenyatta.matchSound.play();
            break;
    }
}
var bgMusic = new Audio('assets/sounds/owlst17.mp3');    
function bgMusicPlay(){
    bgMusic.play();
    bgMusic.loop=true;
}
function bgMusicPause(){
  bgMusic.pause();
}
$(window).focus(bgMusicPlay);
$(window).blur(bgMusicPause);    

//Win Modal
function hideWin(){
    $("#winModal").addClass('hideWinModal');     
}
