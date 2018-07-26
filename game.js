$(document).ready(gogoApp);
function gogoApp(){
    addClickHandlers();
    createBoard(heroes);  
}
//----------------------------------------->
//Stat Handling
const stats = {
    matches: 0,
    attempts:0,
    accuracy: 0,
    games_played: 0
}
//----------------------------------------->
// Card Handling
const cardHandling = {
    chosenHeroes: [],
    victoryPoses: [],
    firstImageClick: null,
    secondImageClick: null,
    first_card_clicked: null,
    second_card_clicked: null,
    total_possible_matches: 9,
    match_counter: 0,
    currentCard: null
}

//----------------------------------------->
//Modals
function closeModal(){
    $('#splashModal').replaceWith();
    bgMusicPlay();
}
function hideWin(){
    $("#winModal").addClass('hideWinModal');     
}

//----------------------------------------->
//Board Creation
function createBoard(heroList){
    var extractedHeroes = [];
    var selectedHeroes = [];
    var shuffledHeroes = [];
    for (var prop in heroList) {
        if (heroList.hasOwnProperty(prop)) {
            extractedHeroes.push(prop);
        }
    }
    for ( var i = 0; i < cardHandling.total_possible_matches; i++ ) {
        selectedHeroes.push(extractedHeroes.splice(Math.floor(Math.random()*extractedHeroes.length),1)[0]);
    }
    cardHandling.victoryPoses.push(selectedHeroes);
    selectedHeroes = selectedHeroes.concat(selectedHeroes);
    while ( selectedHeroes.length-1) {
        shuffledHeroes.push(selectedHeroes.splice(Math.floor(Math.random()*selectedHeroes.length),1)[0]);
    }
    shuffledHeroes.push(selectedHeroes[0]);
    cardHandling.chosenHeroes=shuffledHeroes;
    for(i=0; i<cardHandling.chosenHeroes.length; i++){
        var front = $('<div>').addClass('front');
        var back = $('<div>').addClass('back');
        var card = $('<div>').addClass('card').attr({'position': i, 'hero':cardHandling.chosenHeroes[i]}).append(front, back);
        $('#game-area').append(card);
    }
    $('.front').each(function(){
        var heroChoice = Math.floor(Math.random() * cardHandling.chosenHeroes.length);
        $(this).append(`<img src= "assets/images/heroes/${cardHandling.chosenHeroes[heroChoice]}.png" alt= "${cardHandling.chosenHeroes[heroChoice]}"/>`); 
        cardHandling.chosenHeroes.splice(heroChoice, 1);
  });
}
//----------------------------------------->
// Heroes
var heroes = {
    bastion: {
        // power: revealRandomCards,
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
        // power: revealDiagonalCards,
        clickSound: new Audio('assets/sounds/genji-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/genji-ult.ogg'),
        victoryPose: 'assets/images/heroes/genji-victory.png',
        src: 'assets/images/heroes/genji.png'
    },
    hanzo:{
        // power: revealEdgeCards,
        clickSound: new Audio('assets/sounds/hanzo-click.ogg'),
        clickSoundLimiter: false,
        matchSound: new Audio('assets/sounds/hanzo-ult.ogg'),
        victoryPose: 'assets/images/heroes/hanzo-victory.png',
        src: 'assets/images/heroes/hanzo.png' 
    },
    mei: {
        // power: revealAdjacentCards,
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



//----------------------------------------->
//Win Conditions
function victoryPose(){
    var winner = $('<p>').text('YOU WON!');
    var randomPose = cardHandling.victoryPoses[0][Math.floor(Math.random() * cardHandling.victoryPoses.length)];
    $('#winModal').append(`<img src= "${heroes[randomPose].victoryPose}" alt= "You Won"/>)`, winner); 
    $('.abilities').text('You won! Reset and play again?');
}




//----------------------------------------->
//Sound
function heroClickSound(){
    var heroName = firstImageClick.slice(21, -4);
    if(heroes[heroName].clickSoundLimiter == false){
        heroes[heroName].clickSound.play();
        heroes[heroName].clickSoundLimiter = true;
    } else {
        return;
    }
}
function heroMatchSound(){
    var heroName = secondImageClick.slice(21, -4);
    heroes[heroName].matchSound.play();
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