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
    chosenHeroes: [],
    firstImageClick: null,
    secondImageClick: null,
    first_card_clicked: null,
    second_card_clicked: null,
    total_possible_matches: 9,
    match_counter: 0,
    currentCard: null
}
//Board Creation
function chooseHeroes(heroList){
    var extractedHeroes = [];
    var selectedHeroes = [];
    var randomHeroes = [];
    var shuffledHeroes = [];
    for (var prop in heroList) {
        if (heroList.hasOwnProperty(prop)) {
            extractedHeroes.push(prop);
        }
    }
    
    for ( var i = 0; i < cardHandling.total_possible_matches; i++ ) {
        selectedHeroes.push(extractedHeroes.splice(Math.floor(Math.random()*extractedHeroes.length),1)[0]);
    }
    console.log('selected heroes', selectedHeroes);
    selectedHeroes = selectedHeroes.concat(selectedHeroes);
    for ( var i = 0; i < cardHandling.total_possible_matches*2-1; i++ ) {
        shuffledHeroes.push(selectedHeroes.splice(Math.floor(Math.random()*selectedHeroes.length),1)[0]);
    }
    shuffledHeroes.push(selectedHeroes[0]);
    cardHandling.chosenHeroes=shuffledHeroes;
    console.log('chosen heroes', cardHandling.chosenHeroes);
    
    
}
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