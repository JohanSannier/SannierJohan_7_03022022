const colBtnIngredient = document.querySelector('#col-btn-ingredients');
const containerIngredients = document.querySelector('#container-ingredients');
const colBtnAppliance = document.querySelector('#col-btn-appliance');
const colBtnUstensil = document.querySelector('#col-btn-ustensil');
const tagsContainer = document.querySelector('#tags-container');
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const mainContainer = document.querySelector('#main-container');
const invalidSearchInput = document.querySelector('#invalid-search');
let IngredientsArray = [];
let AppliancesArray = [];
let UstensilsArray = [];

async function getRecipes() {
  let url = '../data/recipes.json';
  try {
    let res = await fetch(url);
    let json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function displayRecipes() {
  const recipes = await getRecipes();
  recipes.forEach(async (recipe) => {
    const cardData = recipeFactory(recipe);
    const createCard = cardData.getRecipeCard();
    mainSection.appendChild(createCard);
  });
}

// Création d'un input à l'intérieur du span
function getInputFilters(type, color) {
  let chevron = document.querySelector(`#chevron-${type.id}`);
  chevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  let input = document.createElement('input');
  input.classList.add('btn', `btn-${color}`);
  const dataName = type.getAttribute('data-name');
  input.setAttribute('placeholder', `Rechercher un ${dataName}`);
  input.classList.add('text-white');
  input.setAttribute('id', `input-${color}`);
  type.innerText = '';
  // let parentCol = type.parentNode.parentNode;
  type.appendChild(input);
}

// async function createContainerFilter(parent, type, color, array) {
//   let container = document.createElement('div');
//   container.setAttribute('id', `container-${type}`);
//   container.style.width = '40rem';
//   container.classList.add(`bg-${color}`, 'advanced-filters');
//   let list = document.createElement('ul');
//   list.classList.add('main-ul', 'd-flex', 'flex-wrap');
//   list.classList.add('list-unstyled');

//   array.forEach((element) => {
//     let liste = document.createElement('li');
//     liste.classList.add('main-list', 'w-33');
//     liste.innerText = element;
//     list.appendChild(liste);
//   });
//   parent.appendChild(container);
//   container.appendChild(list);
// }

// Création et injection des items de filtres avancés
async function injectAdvancedFilters(array, parent) {
  parent.firstChild.innerHTML = '';
  let type = parent.className.substr(20);
  for (let index = 0; index < array.length; index++) {
    const element = await array[index];
    let liste = document.createElement('li');
    liste.classList.add('main-list', 'w-33');
    liste.setAttribute('data-color', type);
    liste.innerText = element;
    parent.firstChild.appendChild(liste);
  }
}

// Gestion des évènements de création des filtres au clic sur les boutons de filtres avancés
window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      break;
    case 'chevron-ingredients':
      changeDisplay(containerIngredients);
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      // createContainerFilter(colBtnAppliance, e.target.id, 'success');
      break;
    case 'chevron-appliance':
      if (e.target.parentNode.nextElementSibling) {
        getTargetGenealogy(e);
      } else {
        getInputFilters(e.target.previousElementSibling, 'success');
        createContainerFilter(
          colBtnAppliance,
          e.target.previousElementSibling.id,
          'success',
          AppliancesArray
        );
      }
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      // createContainerFilter(colBtnUstensil, e.target.id, 'danger');
      break;
    case 'chevron-ustensil':
      if (e.target.parentNode.nextElementSibling) {
        getTargetGenealogy(e);
      } else {
        getInputFilters(e.target.previousElementSibling, 'danger');
        createContainerFilter(
          colBtnUstensil,
          e.target.previousElementSibling.id,
          'danger',
          UstensilsArray
        );
      }
      break;
    default:
      break;
  }
  switch (e.target.classList.value) {
    case 'bi bi-x-circle':
      tagsContainer.removeChild(e.target.parentNode);
      break;

    default:
      break;
  }
  advancedFiltering(e);
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'searchbar':
      mainFilter();
      // A faire : Mettre la fonction inject 3 fois avec tableau différent à chaque fois - créer la div dans le HTML et déclarer la constante qui relie l'id de la nouvelle div
      injectAdvancedFilters(IngredientsArray, containerIngredients);
      break;
    case 'input-primary':
      beginFiltering('ingredients', e);
      break;
    case 'input-success':
      beginFiltering('appliance', e);
      break;
    case 'input-danger':
      beginFiltering('ustensil', e);
      break;

    default:
      break;
  }
});

// Fonction pour la recherche principale
async function mainFilter() {
  let inputLength = searchbar.value.length;
  let input = searchbar.value;
  let recipes = await getRecipes();
  if (inputLength >= 3) {
    // On efface les recettes avant de lancer la boucle pour que les informations soient actualisées
    clearContent();
    recipes.forEach(async (recipe) => {
      // Compteur pour itérer sur chaque ingrédient d'une recette
      let i = 0;
      capitalizedFirstLetterInput = capitalizeFirstLetter(input);
      if (
        // Si l'input est retrouvé parmi le titre, la description ou les ingrédients d'une recette
        recipe.name.indexOf(input) != -1 ||
        recipe.name.indexOf(capitalizedFirstLetterInput) != -1 ||
        recipe.description.includes(capitalizedFirstLetterInput) ||
        recipe.description.includes(input) ||
        recipe.ingredients[i].ingredient.includes(
          capitalizedFirstLetterInput
        ) ||
        recipe.ingredients[i].ingredient.includes(input)
      ) {
        // Si la carte n'est pas déjà injectée dans le DOM, je l'injecte dans le DOM
        if (mainSection.children.length == 0) {
          injectCard(recipe);
        } else {
          // Si il y a déjà des cartes de recettes dans le DOM
          // Utilisation d'un compteur pour vérifier si la recette a déjà été injectée dans le DOM
          let score = 0;
          for (let index = 0; index < mainSection.children.length; index++) {
            // Boucle sur chacune des cartes de recettes déjà ajoutées et incrémentation du score pour détecter les doublons
            const child = mainSection.children[index];
            if (child.getAttribute('data-id') == recipe.id) {
              score++;
            }
          }
          if (score == 0) {
            // Si il n'y a pas de doublons et que le score est toujours à 0, j'injecte la carte de la recette et j'ajoute les données aux filtres avancés
            injectCard(recipe);
            populateArray(recipe);
            score = 0;
          }
        }
      } else {
        invalidSearch();
      }
      i++;
    });
  } else {
    clearContent();
  }
}

// Fonction pour injecter une carte de recette dans le DOM
function injectCard(recipe) {
  const cardData = recipeFactory(recipe);
  const createCard = cardData.getRecipeCard();
  mainSection.appendChild(createCard);
}

// Fonction qui affiche un message d'erreur à l'utilisateur en cas de critères de recherche invalides
function invalidSearch() {
  if (mainSection.children.length == 0) {
    invalidSearchInput.classList.replace('d-none', 'd-inline');
  } else if (
    invalidSearchInput.classList.contains('d-inline') &&
    mainSection.children.length != 0
  ) {
    invalidSearchInput.classList.replace('d-inline', 'd-none');
  }
}

function populateArray(recipe) {
  recipe.ingredients.forEach((ingredient) => {
    if (IngredientsArray.indexOf(ingredient.ingredient) == -1) {
      IngredientsArray.push(ingredient.ingredient);
    }
  });
  recipe.ustensils.forEach((ustensil) => {
    if (UstensilsArray.indexOf(ustensil) == -1) {
      UstensilsArray.push(ustensil);
    }
  });
  if (AppliancesArray.indexOf(recipe.appliance) == -1) {
    AppliancesArray.push(recipe.appliance);
  }
}

// Fonction pour créer les tags sur les filtres
async function advancedFiltering(e) {
  // Je récupère l'attribut data-color pour obtenir le style correct du tag si c'est un ingrédient, appareil ou un ustensil
  switch (e.target.getAttribute('data-color')) {
    case 'primary':
      color = 'primary';
      break;
    case 'success':
      color = 'success';
      break;
    case 'danger':
      color = 'danger';
      break;

    default:
      break;
  }
  if (e.target.classList.contains('main-list')) {
    // Si il n'y a aucun tag sélectionné je créé un tag
    if (tagsContainer.children.length == 0) {
      createTag(e, color);
    } else {
      // Sinon, pour chaque tag sélectionné, je vérifie si le le tag sur lequel j'ai cliqué est déjà affiché
      let scoreTag = 0;
      for (let index = 0; index < tagsContainer.children.length; index++) {
        const element = tagsContainer.children[index];
        if (e.target.innerText == element.firstChild.innerText) {
          scoreTag++;
        }
      }
      // Si le score est à 0 et donc que le tag n'a pas été sélectionné avant, je créé le tag
      if (scoreTag == 0) {
        createTag(e, color);
      }
    }
  }
}

// Fonction qui créé le tag du filtre
function createTag(e, color) {
  let tagWrapper = document.createElement('div');
  tagWrapper.classList.add(
    'tag-wrapper',
    'd-inline-flex',
    'me-4',
    `bg-${color}`,
    'p-2',
    'rounded',
    'text-white',
    'mb-3'
  );
  let tag = document.createElement('span');
  tag.classList.add('me-3', 'tag');
  tag.innerText = e.target.innerText;
  let deleteTag = document.createElement('i');
  deleteTag.classList.add('bi', 'bi-x-circle');
  tagWrapper.appendChild(tag);
  tagWrapper.appendChild(deleteTag);
  tagsContainer.appendChild(tagWrapper);
}

// Fonction qui filtre l'input de l'utilisateur et renvoie les données correspondantes
function filtreTexte(arr, requete) {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(requete.toLowerCase()) !== -1
  );
}

// Fonction pour mettre en majuscule la première lettre d'une chaine de caractère
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fonction pour permettre d'ajouter ou de supprimer l'input des filtres au clic sur le chevron du bouton
function getTargetGenealogy(e) {
  let displayedContainer = document.querySelector(
    `#container-${e.target.previousElementSibling.id}`
  );
  e.target.parentNode.parentNode.removeChild(displayedContainer);
  e.target.previousElementSibling.removeChild(
    e.target.previousElementSibling.firstChild
  );
  e.target.previousElementSibling.innerText = capitalizeFirstLetter(
    e.target.previousElementSibling.id
  );
}

// Fonction pour faire apparaître les filtres avancés
function changeDisplay(target) {
  if (target.classList.contains('opacity-0')) {
    target.classList.remove('opacity-0');
  } else {
    target.classList.add('opacity-0');
  }
}

// Fonction pour effacer le contenu des recettes sur la page
function clearContent() {
  mainSection.innerText = '';
  IngredientsArray = [];
  UstensilsArray = [];
  AppliancesArray = [];
}

// Initialisation de la page
displayRecipes();
