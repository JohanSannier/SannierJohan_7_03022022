const colBtnIngredient = document.querySelector('#col-btn-ingredients');
const colBtnAppliance = document.querySelector('#col-btn-appliance');
const colBtnUstensil = document.querySelector('#col-btn-ustensil');
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const mainContainer = document.querySelector('#main-container');
const IngredientsArray = [];
const AppliancesArray = [];
const UstensilsArray = [];

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

// async function createContainerFilter(parent, type, color) {
//   let container = document.createElement('div');
//   container.setAttribute('id', `container-${type}`);
//   container.style.width = '100%';
//   container.style.height = '40vh';
//   container.style.overflow = 'scroll';
//   container.classList.add(`bg-${color}`);
//   let list = document.createElement('ul');
//   list.classList.add('main-ul', 'd-flex', 'flex-wrap');
//   list.classList.add('list-unstyled');
//   const recipes = await getRecipes();

//   recipes.forEach(async (recipe) => {
//     recipe.ingredients.forEach((element) => {
//       IngredientsArray.push(element.ingredient);
//     });
//     AppliancesArray.push(recipe.appliance);
//     recipe.ustensils.forEach((element) => {
//       UstensilsArray.push(element);
//     });
//   });

//   const array = createFilteredArray(type);
//   array.forEach((element) => {
//     let liste = document.createElement('li');
//     liste.classList.add('main-list', 'w-33');
//     liste.innerText = element;
//     list.appendChild(liste);
//   });
//   parent.appendChild(container);
//   container.appendChild(list);
// }

// Création de la fonction qui récupère les ingrédients, appareils et ustensils et les classe dans un nouveau tableau sans doublon
// function createFilteredArray(type) {
//   switch (type) {
//     case 'ingredients':
//       const filteredIngredientsArray = IngredientsArray.filter(
//         (element, pos) => IngredientsArray.indexOf(element) == pos
//       );
//       return filteredIngredientsArray;
//     case 'appliance':
//       const filteredAppliancesArray = AppliancesArray.filter(
//         (element, pos) => AppliancesArray.indexOf(element) == pos
//       );
//       return filteredAppliancesArray;
//     case 'ustensil':
//       const filteredUstensilsArray = UstensilsArray.filter(
//         (element, pos) => UstensilsArray.indexOf(element) == pos
//       );
//       return filteredUstensilsArray;

//     default:
//       break;
//   }
// }

// Gestion des évènements de création des filtres au clic sur les boutons de filtres
window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      // createContainerFilter(colBtnIngredient, e.target.id, 'primary');
      break;
    case 'chevron-ingredients':
      if (e.target.parentNode.nextElementSibling) {
        getTargetGenealogy(e);
      } else {
        getInputFilters(e.target.previousElementSibling, 'primary');
        createContainerFilter(
          colBtnIngredient,
          e.target.previousElementSibling.id,
          'primary'
        );
      }
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
          'success'
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
          'danger'
        );
      }
      break;
    default:
      break;
  }
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'searchbar':
      mainFilter();
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
            // Si il n'y a pas de doublons et que le score est toujours à 0, j'injecte la carte de la recette
            injectCard(recipe);
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

function injectCard(recipe) {
  const cardData = recipeFactory(recipe);
  const createCard = cardData.getRecipeCard();
  mainSection.appendChild(createCard);
}

function invalidSearch() {
  if (document.querySelector('#invalid-search')) {
    mainContainer.removeChild(row);
  } else if (mainContainer.children[0].children.length == 0) {
    let row = document.createElement('div');
    row.classList.add('row', 'justify-content-center', 'text-danger');
    row.setAttribute('id', 'invalid-search');
    row.innerText =
      'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc';
    mainContainer.appendChild(row);
  }
}

// async function beginFiltering(type, e) {
//   if (e.target.value.length >= 3) {
//     const recipes = await getRecipes();

//     recipes.forEach(async (recipe) => {
//       recipe.ingredients.forEach((element) => {
//         IngredientsArray.push(element.ingredient);
//       });
//       AppliancesArray.push(recipe.appliance);
//       recipe.ustensils.forEach((element) => {
//         UstensilsArray.push(element);
//       });
//     });
//     const filteredResult = createFilteredArray(type);
//     console.log(filtreTexte(filteredResult, e.target.value));
//   }
// }

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

// Fonction pour effacer le contenu des recettes sur la page
function clearContent() {
  mainSection.innerText = '';
}

// Initialisation de la page
// displayRecipes();
