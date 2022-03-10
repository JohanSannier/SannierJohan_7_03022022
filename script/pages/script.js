const userCardTemplate = document.querySelector('[data-user-template]');
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const invalidSearchInput = document.querySelector('#invalid-search');
const url = '../data/recipes.json';
const colBtnIngredient = document.querySelector('#col-btn-ingredients');
const containerIngredients = document.querySelector('#container-ingredients');
const colBtnAppliance = document.querySelector('#col-btn-appliance');
const containerAppliances = document.querySelector('#container-appliances');
const colBtnUstensil = document.querySelector('#col-btn-ustensil');
const containerUstensils = document.querySelector('#container-ustensils');
const tagsContainer = document.querySelector('#tags-container');
const filterButtons = document.getElementsByClassName('advanced-filters');
const totalContainerFilter = [
  containerIngredients,
  containerAppliances,
  containerUstensils,
];
let IngredientsArray = [];
let AppliancesArray = [];
let UstensilsArray = [];
let onLoadIngredientsArray = [];
let onLoadAppliancesArray = [];
let onLoadUstensilsArray = [];
let allRecipes = [];
let activeCards = [];
let allTags = document.getElementsByClassName('tag');

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    allRecipes = data.map((recipe) => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      const title = card.querySelector('[data-card-title]');
      const duration = card.querySelector('[data-card-duration]');
      const description = card.querySelector('[data-card-description]');
      const ul = card.querySelector('[data-card-ul]');
      title.textContent = recipe.name;
      duration.textContent = `${recipe.time} min`;
      description.textContent = recipe.description;

      recipe.ingredients.forEach((element) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item');
        if (element.unit) {
          if (
            element.unit == 'cl' ||
            element.unit == 'g' ||
            element.unit == 'ml' ||
            element.unit == 'kg'
          ) {
            listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity}${element.unit}`;
          } else {
            listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity} ${element.unit}`;
          }
        } else if (element.quantity) {
          listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity}`;
        } else {
          listItem.innerHTML = `<span class="fw-boldm">${element.ingredient}</span>`;
        }
        ul.appendChild(listItem);
      });

      mainSection.append(card);
      return {
        name: recipe.name,
        ingredients: recipe.ingredients,
        description: recipe.description,
        appliance: recipe.appliance,
        ustensils: recipe.ustensils,
        element: card,
      };
    });
  });

function getActiveCards() {
  allRecipes.forEach((element) => {
    if (!element.element.classList.contains('hide')) {
      activeCards.push(element);
    }
  });
}

// Fonction pour afficher tous les ingrédients, ustensils et appareils dès le chargement de la page
async function populateOnLoad() {
  let recipes = allRecipes;
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (onLoadIngredientsArray.indexOf(ingredient.ingredient) == -1) {
        onLoadIngredientsArray.push(ingredient.ingredient);
      }
    });
    recipe.ustensils.forEach((ustensil) => {
      if (onLoadUstensilsArray.indexOf(ustensil) == -1) {
        onLoadUstensilsArray.push(ustensil);
      }
    });
    if (onLoadAppliancesArray.indexOf(recipe.appliance) == -1) {
      onLoadAppliancesArray.push(recipe.appliance);
    }
  });
}

// Fonction sauvegarder les filtres avancés dans leur tableaux respectifs
async function getAllDataFilter() {
  let data = await populateOnLoad();
  if (searchbar.value.length == 0) {
    injectAllAdvancedFilters(
      [onLoadIngredientsArray, onLoadAppliancesArray, onLoadUstensilsArray],
      [containerIngredients, containerAppliances, containerUstensils]
    );
  }
}

// Création d'un input à l'intérieur du span
function getInputFilters(type, color) {
  let input = document.createElement('input');
  input.classList.add('btn', `btn-${color}`);
  const dataName = type.getAttribute('data-name');
  input.setAttribute('placeholder', `Rechercher un ${dataName}`);
  input.setAttribute('type', 'search');
  input.classList.add('text-white', 'p-0', 'input-advanced-filters');
  input.setAttribute('id', `input-${color}`);
  type.innerText = '';
  type.appendChild(input);
  let spanParent = input.parentElement;
  let btnParent = spanParent.parentElement;
  btnParent.classList.remove('px-4');
  input.focus();
}

function checkInputFilters(e) {
  let itemsContainer;
  switch (e.target.id) {
    case 'input-primary':
      itemsContainer = document.getElementById(
        'container-ingredients'
      ).firstChild;
      break;
    case 'input-success':
      itemsContainer = document.getElementById(
        'container-appliances'
      ).firstChild;
      break;
    case 'input-danger':
      itemsContainer = document.getElementById(
        'container-ustensils'
      ).firstChild;
      break;

    default:
      break;
  }
  if (itemsContainer && itemsContainer.children.length != 0) {
    let value = e.target.value.toLowerCase();
    let items = itemsContainer.childNodes;
    items.forEach((item) => {
      const isVisible = item.innerText.toLowerCase().includes(value);
      item.classList.toggle('hide', !isVisible);
    });
  }
}

// Création et injection des items de filtres avancés
async function injectAllAdvancedFilters(array, parent) {
  let i = 0;
  parent.forEach((childContainer) => {
    childContainer.firstChild.innerHTML = '';
    const type = childContainer.className.substr(20);
    const correctType = type.split(' ')[0];

    array[i].forEach((element) => {
      let liste = document.createElement('li');
      liste.classList.add('main-list', 'w-33');
      liste.setAttribute('data-color', correctType);
      liste.innerText = element;
      childContainer.firstChild.appendChild(liste);
    });
    i++;
  });
}

// Fonction pour remplir les tableaux d'ingrédients, ustensils et appareils
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

// Fonction pour faire apparaître les filtres avancés
function changeDisplay(target) {
  let activeFilter = document.querySelector('.active-filter');
  let newChevron = target.previousElementSibling.children[1];
  let btnParent = target.previousElementSibling;

  if (target.classList.contains('active-filter') && target == activeFilter) {
    target.classList.remove('active-filter');
    btnParent.classList.remove('border-fix');
    newChevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
  } else if (
    totalContainerFilter.some((element) =>
      element.classList.contains('active-filter')
    )
  ) {
    let oldChevron = activeFilter.previousElementSibling.children[1];
    oldChevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
    activeFilter.previousElementSibling.classList.remove(
      'border-fix',
      'active-width'
    );
    activeFilter.parentNode.classList.remove('active-width');
    activeFilter.classList.remove('active-filter');
    target.classList.add('active-filter');
    btnParent.classList.add('border-fix');
    newChevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  } else {
    target.classList.add('active-filter');
    btnParent.classList.add('border-fix');
    newChevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
  }
}

// Fonction pour sélectionner les tags sur les filtres
async function advancedFiltering(e) {
  // Je récupère l'attribut data-color pour obtenir le style correct du tag si c'est un ingrédient, appareil ou un ustensil
  if (e.target.classList.contains('main-list')) {
    // Si il n'y a aucun tag sélectionné je créé un tag
    if (tagsContainer.children.length == 0) {
      createTag(e);
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
        createTag(e);
      }
    }
  }
}

// Fonction qui créé le tag du filtre
function createTag(e) {
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
  tag.setAttribute('data-color', color);
  tag.innerText = e.target.innerText;
  let deleteTag = document.createElement('i');
  deleteTag.classList.add('bi', 'bi-x-circle');
  tagWrapper.appendChild(tag);
  tagWrapper.appendChild(deleteTag);
  tagsContainer.appendChild(tagWrapper);
}

// Fonction pour effacer le contenu des tableaux d'ingrédients, ustensils et appareils sur la page
function clearContent() {
  IngredientsArray = [];
  UstensilsArray = [];
  AppliancesArray = [];
}

// Gestion des évènements de création des filtres au clic sur les boutons de filtres avancés
window.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'ingredients':
      getInputFilters(e.target, 'primary');
      break;
    case 'chevron-ingredients':
      changeDisplay(containerIngredients);
      getAllDataFilter();
      break;
    case 'appliance':
      getInputFilters(e.target, 'success');
      break;
    case 'chevron-appliance':
      changeDisplay(containerAppliances);
      getAllDataFilter();
      break;
    case 'ustensil':
      getInputFilters(e.target, 'danger');
      break;
    case 'chevron-ustensil':
      changeDisplay(containerUstensils);
      getAllDataFilter();
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

  if (e.target.classList.contains('main-list')) {
    // Je dois utiliser un set timeout afin que mon tableau prenne en compte le nouveau tag au clic
    setTimeout(() => {
      // Je créé un nouveau tableau contenant les tags sélectionnés
      let selectedTags = Array.from(allTags);
      console.log(selectedTags);
      // Si l'utilisateur n'a rien écrit dans la recherche principale
      if (searchbar.value.length == 0) {
        // Pour chacun des tags, je vais vérifier si le tag correspond à un type puis filtrer les résultats correspondants
        selectedTags.forEach((tag) => {
          let tagColor = tag.getAttribute('data-color');
          let result = [];
          getActiveCards();
          console.log(activeCards);
          switch (tagColor) {
            case 'primary':
              result = activeCards.filter((recipe) =>
                recipe.ingredients.some((ingr) =>
                  ingr.ingredient
                    .toLowerCase()
                    .includes(tag.innerText.toLowerCase())
                )
              );
              break;
            case 'success':
              result = activeCards.filter(
                (recipe) =>
                  recipe.appliance.toLowerCase() == tag.innerText.toLowerCase()
              );
              break;
            case 'danger':
              result = activeCards.filter((recipe) =>
                recipe.ustensils.some((ustensil) =>
                  ustensil.toLowerCase().includes(tag.innerText.toLowerCase())
                )
              );
              break;

            default:
              break;
          }
          console.log(result);
          console.log(activeCards);
          // result.forEach((correctResult) => {
          //   console.log(correctResult);
          // });
        });
      }
    }, 50);
  }

  advancedFiltering(e);
  // J'appelle la fonction de filtre tag uniquement si il y a au moins un tag sélectionné
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'searchbar':
      const value = e.target.value.toLowerCase();
      clearContent();
      if (value.length > 2) {
        //   Si pas de tag AllRecipes foreach, si tag faire sur activeCards foreach
        allRecipes.forEach((recipe) => {
          const isVisible =
            recipe.name.toLowerCase().includes(value) ||
            recipe.description.toLowerCase().includes(value) ||
            recipe.ingredients.some((ingr) =>
              ingr.ingredient.toLowerCase().includes(value)
            );
          recipe.element.classList.toggle('hide', !isVisible);
          invalidSearchInput.classList.replace('d-inline', 'd-none');
          if (!recipe.element.classList.contains('hide')) {
            populateArray(recipe);
          }
        });
      } else if (value.length == 0) {
        allRecipes.forEach((recipe) => {
          recipe.element.classList.remove('hide');
        });
        invalidSearchInput.classList.replace('d-inline', 'd-none');
        getAllDataFilter();
      }
      const allCards = mainSection.querySelectorAll('[data-id]');
      const cardsArray = Array.from(allCards);
      if (cardsArray.every((element) => element.classList.contains('hide'))) {
        invalidSearchInput.classList.replace('d-none', 'd-inline');
      }
      activeCards = [];
      getActiveCards();
      injectAllAdvancedFilters(
        [IngredientsArray, AppliancesArray, UstensilsArray],
        [containerIngredients, containerAppliances, containerUstensils]
      );
      break;

    default:
      break;
  }
  checkInputFilters(e);
});
