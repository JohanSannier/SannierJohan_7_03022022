const userCardTemplate = document.querySelector('[data-user-template]');
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const invalidSearchInput = document.querySelector('#invalid-search');
const url = '../../data/recipes.json';
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
          listItem.innerHTML = `<span class="fw-bold">${element.ingredient}</span>`;
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

// Fonction pour filtrer ce que recherche l'utilisateur et afficher les recettes correspondantes
function filter(e) {
  //   Déclaration d'un compteur global qui correspond à la valeur correcte en fonction de la recherche effectuée et qui sera remise à 0 à chaque appel de la fonction
  let value = searchbar.value;
  let correctScore = 0;
  let visibleRecipe = false;
  clearContent();
  if (value.length >= 3) {
    // Si l'utilisateur a effectué une recherche d'au moins 3 caractères, la variable correctScore passe à 1, sinon elle revient à 0
    correctScore = 1;
  } else {
    correctScore = 0;
  }
  let selectedTags = Array.from(allTags);
  selectedTags.forEach((tag) => {
    // Pour chaque tag actuellement sélectionné, j'incrémente la variable correctScore de 1
    correctScore++;
  });
  allRecipes.forEach((recipe) => {
    // Pour chaque recette, je créé une nouvelle variable currentScore qui représentera les scores atteints par chaque recette
    let currentScore = 0;
    if (value.length >= 3) {
      //   Si la recherche principale est correcte, currentScore passe à 1
      if (
        recipe.name.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value) ||
        recipe.ingredients.some((ingr) =>
          ingr.ingredient.toLowerCase().includes(value)
        )
      ) {
        currentScore = 1;
      }
    }
    selectedTags.forEach((tag) => {
      //   Pour chaque tag, si un ingrédient, appareil ou ustensil de la recette correspond au tag, j'incrémente le currentScore de la recette
      let tagContent = tag.textContent.toLowerCase();
      if (
        recipe.appliance.toLowerCase().includes(tagContent) ||
        recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(tagContent)
        ) ||
        recipe.ingredients.some((ingr) =>
          ingr.ingredient.toLowerCase().includes(tagContent)
        )
      ) {
        currentScore++;
      }
    });
    //   Enfin, si les deux variables sont égales, donc si la ou les recherches correspondent à la celles de l'utilisateur, les recettes resteront affichés. Si elles ne correspondent pas, les recettes seront cachées.
    if (correctScore == currentScore) {
      visibleRecipe = true;
      populateArray(recipe);
    } else {
      visibleRecipe = false;
    }
    recipe.element.classList.toggle('hide', !visibleRecipe);
  });
  injectAllAdvancedFilters(
    [IngredientsArray, AppliancesArray, UstensilsArray],
    [containerIngredients, containerAppliances, containerUstensils]
  );
  if (document.getElementsByClassName('hide').length == allRecipes.length) {
    invalidSearchInput.classList.replace('d-none', 'd-inline');
  } else {
    invalidSearchInput.classList.replace('d-inline', 'd-none');
  }
}

// Fonction pour afficher tous les ingrédients, ustensils et appareils dès le chargement de la page
function populateOnLoad() {
  allRecipes.forEach((recipe) => {
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
function getAllDataFilter() {
  let data = populateOnLoad();
  if (searchbar.value.length == 0 && allTags.length == 0) {
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
  input.setAttribute('placeholder', `Chercher un ${dataName}`);
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

// Fonction permettant de rechercher à l'intérieur de l'input des filtres avancés
function checkInputFilters(e) {
  let itemsContainer;
  switch (e.target.id) {
    case 'input-primary':
      itemsContainer = document.getElementById('container-ingredients')
        .children[0];
      break;
    case 'input-success':
      itemsContainer = document.getElementById('container-appliances')
        .children[0];
      break;
    case 'input-danger':
      itemsContainer = document.getElementById('container-ustensils')
        .children[0];
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
function injectAllAdvancedFilters(array, parent) {
  let i = 0;
  parent.forEach((childContainer) => {
    childContainer.children[0].innerHTML = '';
    const type = childContainer.className.substr(20);
    const correctType = type.split(' ')[0];
    array[i].forEach((element) => {
      let liste = document.createElement('li');
      liste.classList.add('main-list', 'w-33');
      liste.setAttribute('data-color', correctType);
      liste.innerText = element;
      childContainer.children[0].appendChild(liste);
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
  let typeBtn =
    target.previousElementSibling.children[0].getAttribute('data-fr');
  if (target.classList.contains('active-filter') && target == activeFilter) {
    target.classList.remove('active-filter');
    btnParent.classList.remove('border-fix');
    newChevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
    target.previousElementSibling.children[0].innerHTML = '';
    target.previousElementSibling.children[0].innerText = typeBtn;
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
    activeFilter.previousElementSibling.children[0].innerHTML = '';
    activeFilter.previousElementSibling.children[0].innerText =
      activeFilter.previousElementSibling.children[0].getAttribute('data-fr');
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
function advancedFiltering(e) {
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
    case 'chevron-ingredients':
      getInputFilters(document.querySelector('#ingredients'), 'primary');
      changeDisplay(containerIngredients);
      getAllDataFilter();
      break;
    case 'chevron-appliance':
      getInputFilters(document.querySelector('#appliance'), 'success');
      changeDisplay(containerAppliances);
      getAllDataFilter();
      break;
    case 'chevron-ustensil':
      getInputFilters(document.querySelector('#ustensil'), 'danger');
      changeDisplay(containerUstensils);
      getAllDataFilter();
      break;
    default:
      break;
  }
  switch (e.target.classList.value) {
    case 'bi bi-x-circle':
      tagsContainer.removeChild(e.target.parentNode);
      filter(e);
      break;

    default:
      break;
  }
  if (e.target.classList.contains('main-list')) {
    advancedFiltering(e);
    filter(e);
  } else {
    advancedFiltering(e);
  }
});

window.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'searchbar':
      filter(e);
      break;

    default:
      break;
  }
  checkInputFilters(e);
});
