let url = '../data/recipes.json';

async function getRecipes() {
  try {
    let res = await fetch(url);
    let json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function init() {
  const test = await getRecipes();
  console.log(test);
}
init();
