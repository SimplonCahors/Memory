
// toujours déclarer les variables au maximum en haut du bloc
var numeros = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]; //creation tableau avec 2 fois les mêmes numéros
var cartes = document.getElementsByClassName('carte'); // récupérer toutes les div
var premiereCarte = null; // va servir de base pour comparatif 
var deuxiemeCarte = null; // va servir de base pour comparatif 
var clickInterdit = false;
var nbCoups = 0; // va servir au score
var dateDebut = null; // qd on lance le jeu
var timerInterval; // 

// Creation de la première partie (au chargement de la page)
creerPartie();

function creerPartie() {

  // On mélange les cartes
  melangerCartes(numeros);

  // On retourne toutes les cartes et on ajoute l'action du click
  for(i = 0; i < cartes.length; i++) {
    cartes[i].classList.remove('open'); // il n'y a pas au lancement du jeu donc on efface
    cartes[i].innerHTML = '';
    cartes[i].carteIndex = i; //
    
    cartes[i].addEventListener('click', clickCarte);
  }
  // On initialise le timer
  dateDebut = new Date().getTime(); //puis 1er ajnvier 1970
  timerInterval = setInterval(updateTimer, 1000); //execute la fonction updateTimer toutes les secondes

  // On initialise le nombre de coups
  nbCoups = 0;
  mettreAJourScore(nbCoups)
  
  // On attache les actions aux boutons
  document.getElementById('newgame').addEventListener('click', creerPartie); //bouton à l'écoute d'un clic
  document.getElementById('solution').addEventListener('click', voirSolution); //bouton à l'écoute d'un clic
}

// @copier/coller d'une fonction trouvée sur google 
function melangerCartes(tableau) {
  var currentIndex = tableau.length, temporaryValue, randomIndex;
  ////////////////////ON PEUT AUSSI ECRIRE COMME CA///////////////////////
  // var currentIndex = tableau.length; (return 12)
  // var temporaryValue;
  // var randomIndex;
   
  ///////////// REVOIR ÇA CAR PAS COMPRIS/////////////mais avec cellia on interchangeait les numéros
  while (0 !== currentIndex) { // tant que le currentIndex n'est pas égal à 0 alors on boucle dans le tableau.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // permet ici de décrémenter l'index du tableau de 12 à 0
    temporaryValue = tableau[currentIndex]; // créer une varaible temporaire pour ne pas supprimer une valeur qui serait écrasée
    tableau[currentIndex] = tableau[randomIndex]; // donc ici est égal à 6 car index 11
    tableau[randomIndex] = temporaryValue; // on récupère ici la valeur temporaire d'où son intérêt de la garder quelque part.
  }

  return tableau;
}

function clickCarte() {
  var carte = this; //par lisibilité de lecture javascript

  // Si le clic est bloqué, on ne fait rien
  if(clickInterdit) {
    return;
  }

  // On affiche la carte cliquée
  afficherCarte(carte);

  // Si c'est la première, on la stocke
  if(premiereCarte === null) {
    premiereCarte = carte;
  }
  // Sinon, on stocke la deuxième, on bloque le clic et on met à jour le nombre
  // de coups et on compare les cartes retournées
  else {
    deuxiemeCarte = carte;
    clickInterdit = true; //pour arrêter à deux clics pour avoir la fonction de comparaison
    mettreAJourScore(++nbCoups); //rajoute 1 au nombre de coups
    
    if (!comparerCarte(premiereCarte, deuxiemeCarte)) { //vérifie si innerHTML des deux cartes est égal et retourne true ou false (ici les cartes sont donc différentes)
      
      // Les cartes sont différentes, on met en place un timeOut qui masquera
      // les cartes 1 seconde plus tard
      setTimeout(masquerCartes, 1000, premiereCarte, deuxiemeCarte);
    }
    else {
      
      // Les cartes sont les mêmes, on réactive le clic et on laisse ces cartes
      // affichées mais non cliquables
      clickInterdit = false;
      premiereCarte.removeEventListener('click', clickCarte);
      deuxiemeCarte.removeEventListener('click', clickCarte);

      // On regarde si il reste des cartes à retourner ou si le jeu est fini
      var gagne = true;
      for(i = 0; i < cartes.length; i++) {
        if(cartes[i].classList.length === 1) { //teste ici s'il y a plus d'une class à la div
          gagne = false;
        }
      }
      
      // Si c'est fini, c'est gagné
      if(gagne) { // = if gagne === true donc les cartes sont toutes retournées
        clearInterval(timerInterval); // quand on joue avec timeout ou setinterval il faut toujours un clear
        alert('Bravo ! ');
      }
    }

    // On remets les cartes retournées à null
    premiereCarte = null;
    deuxiemeCarte = null;
  }
}

function masquerCartes(carteA, carteB) {
  // On masque les 2 cartes
  masquerCarte(carteA);
  masquerCarte(carteB);

  // On autorise le clic à nouveau
  clickInterdit = false;
}

function afficherCarte(carte) {
  // On affecte la valeur de la carte
  carte.innerHTML = numeros[carte.carteIndex]; //on va chercher l'index que l'on aura attribué avec le for plus haut
  // On rajoute un class open sur la carte pour le style
  carte.classList.add('open'); //rajoute la class "open" aux DIV des cartes// background en vert
}

function masquerCarte(carte) {
  // On retire la valeur de la carte
  carte.innerHTML = '';
  // On retire la class open sur la carte
  carte.classList.remove('open');
}

function voirSolution() {
  // On affiche toutes les cartes
  for(i = 0; i < cartes.length; i++) {
    afficherCarte(cartes[i]);
  }
  // On stoppe le timer
  clearInterval(timerInterval);
}

function comparerCarte(carteA, carteB) {
  // On retourne "true" si les cartes sont les mêmes sinon "false"
  return carteA.innerHTML == carteB.innerHTML;
}

function mettreAJourScore(nbCoups) {
  // On met à jour le nombre de coups sur DIV .score dans le DOM
  document.getElementById('score').innerHTML = nbCoups;
}

function updateTimer() {
  // On récupère la date du jour
  var now = new Date().getTime();
  
  // On prend la différence avec "dateDebut"
  var diff = now - dateDebut;
  
  // On met à jour le nombre de coups sur dans le DOM
  document.getElementById('timer').innerHTML = formatTimer(diff);
}

// @copier/coller d'une fonction trouvé sur le google 
function formatTimer(mill) {
    sec_num = Math.round(mill / 1000);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = "0"+hours; // on peut se passer des {} car on est sur UNE ligne
    if (minutes < 10) minutes = "0"+minutes;
  if (seconds < 10) seconds = "0" + seconds;
  
  // on peut écrire aussi comme ça : 
  // hours = hours < 10 ? "0" + hours : hours;
  // minutes = minutes < 10 ? "0" + minutes : minutes;
  // secondes = secondes < 10 ? "0" + hours : hours;
    return hours+':'+minutes+':'+seconds;
}
