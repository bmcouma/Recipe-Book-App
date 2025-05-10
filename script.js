const API_KEY = "5288905a97d8411fa45c12debcdf0511"; // Replace with your actual API key
const recipeListEl = document.getElementById("recipe-list");
const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");
const categorySelectEl = document.getElementById("category-select");
const darkModeToggleEl = document.getElementById("dark-mode-toggle");

// Function to display recipes on the page
function displayRecipes(recipes) {
    recipeListEl.innerHTML = ""; // Clear the list before adding new recipes

    if (recipes.length === 0) {
        recipeListEl.innerHTML = "<p>No recipes found. Try a different search or category.</p>";
        return;
    }

    recipes.forEach((recipe) => {
        // Create recipe item container
        const recipeItemEl = document.createElement("li");
        recipeItemEl.classList.add("recipe-item");

        // Recipe image
        const recipeImageEl = document.createElement("img");
        recipeImageEl.src = recipe.image || "https://via.placeholder.com/150";
        recipeImageEl.alt = "Recipe image";
        recipeImageEl.classList.add("recipe-image");

        // Recipe title
        const recipeTitleEl = document.createElement("h3");
        recipeTitleEl.innerText = recipe.title;
        recipeTitleEl.classList.add("recipe-title");

        // Recipe ingredients
        const recipeIngredientsEl = document.createElement("p");
        recipeIngredientsEl.innerHTML = `
            <strong>Ingredients:</strong> ${recipe.extendedIngredients
                .map((ingredient) => ingredient.original)
                .join(", ")}`;
        recipeIngredientsEl.classList.add("recipe-description");

        // Recipe link
        const recipeLinkEl = document.createElement("a");
        recipeLinkEl.href = recipe.sourceUrl;
        recipeLinkEl.innerText = "View Recipe";
        recipeLinkEl.target = "_blank"; // Open in a new tab
        recipeLinkEl.classList.add("recipe-link");

        // Append elements to the recipe item
        recipeItemEl.appendChild(recipeImageEl);
        recipeItemEl.appendChild(recipeTitleEl);
        recipeItemEl.appendChild(recipeIngredientsEl);
        recipeItemEl.appendChild(recipeLinkEl);

        // Append recipe item to the list
        recipeListEl.appendChild(recipeItemEl);
    });
}

// Function to fetch recipes from the API
async function getRecipes(category = "all") {
    try {
        const url = category === "all"
            ? `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`
            : `https://api.spoonacular.com/recipes/complexSearch?number=10&type=${category}&apiKey=${API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch recipes. Please try again later.");
        }

        const data = await response.json();
        return data.recipes || data.results || [];
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again later.");
        return [];
    }
}

// Function to handle search
async function handleSearch() {
    const searchTerm = searchInputEl.value.trim().toLowerCase();
    const category = categorySelectEl.value;

    const recipes = await getRecipes(category);
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm)
    );

    displayRecipes(filteredRecipes);
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Initialize the app
async function init() {
    const recipes = await getRecipes();
    displayRecipes(recipes);
}

// Event Listeners
searchButtonEl.addEventListener("click", handleSearch);
categorySelectEl.addEventListener("change", handleSearch);
darkModeToggleEl.addEventListener("click", toggleDarkMode);

init();
