// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const recipeForm = document.getElementById('recipeForm');
const ingredientForm = document.getElementById('ingredientForm');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientsList = document.getElementById('ingredientsList');
const recipesContainer = document.getElementById('recipes');
const recipeCategory = document.getElementById('recipeCategory');
const filterVeg = document.getElementById('filterVeg');
const filterRegional = document.getElementById('filterRegional');
const showAll = document.getElementById('showAll');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
const addRecipeModal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
const addIngredientModal = new bootstrap.Modal(document.getElementById('addIngredientModal'));

// Global Variables
let allIngredients = [];
let allRecipes = [];
let currentFilter = 'all';

// Initialize the application
async function init() {
    await loadCategories();
    await loadIngredients();
    await loadRecipes();
    setupEventListeners();
}

// Load all categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        recipeCategory.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.category_name;
            recipeCategory.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('Failed to load categories', 'danger');
    }
}

// Load all ingredients
async function loadIngredients() {
    try {
        const response = await fetch(`${API_URL}/ingredients`);
        allIngredients = await response.json();
    } catch (error) {
        console.error('Error loading ingredients:', error);
        showAlert('Failed to load ingredients', 'danger');
    }
}

// Load all recipes
async function loadRecipes() {
    try {
        const response = await fetch(`${API_URL}/recipes`);
        allRecipes = await response.json();
        displayRecipes(allRecipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        showAlert('Failed to load recipes', 'danger');
    }
}

// Display recipes in the UI
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';

    // Remove duplicate recipes based on recipe_id and name
    const uniqueRecipes = recipes.reduce((acc, current) => {
        const isDuplicate = acc.some(item => 
            item.recipe_id === current.recipe_id || 
            item.recipe_name.toLowerCase() === current.recipe_name.toLowerCase()
        );
        if (!isDuplicate) {
            return [...acc, current];
        }
        return acc;
    }, []);

    if (uniqueRecipes.length === 0) {
        recipesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-emoji-frown fs-1 text-muted"></i>
                <h3 class="mt-3">No recipes found</h3>
                <p class="text-muted">Add your first recipe to get started!</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRecipeModal">
                    <i class="bi bi-plus-circle me-2"></i>Add Recipe
                </button>
            </div>
        `;
        return;
    }

    // Sort recipes by recipe_id to maintain consistent order
    uniqueRecipes.sort((a, b) => a.recipe_id - b.recipe_id);

    uniqueRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'col-md-4 mb-4';
        
        const recipeImageUrl = getRecipeImageUrl(recipe.recipe_name);
        
        recipeCard.innerHTML = `
            <div class="card recipe-card">
                <div class="recipe-image" style="background-image: url('${recipeImageUrl}')">
                    <span class="category-badge">${recipe.category_name}</span>
                    <div class="recipe-badges">
                        ${recipe.is_vegetarian ? '<span class="badge bg-success me-1">Vegetarian</span>' : ''}
                        ${recipe.is_regional ? '<span class="badge bg-info">Regional</span>' : ''}
                        </div>
                        </div>
                <div class="recipe-content">
                    <h5 class="card-title">${recipe.recipe_name}</h5>
                    <p class="card-text">${recipe.description || 'No description available'}</p>
                    <div class="mt-auto">
                        <button class="btn btn-outline-primary btn-sm" onclick="showRecipeDetails(${recipe.recipe_id})">
                            <i class="bi bi-eye me-1"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        recipesContainer.appendChild(recipeCard);
    });
}

// Function to get recipe-specific image URL
function getRecipeImageUrl(recipeName) {
    const normalizedName = recipeName.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    // Optimized food image mappings
    const foodImages = {
        // Specific dishes
        'vegetable pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
        'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        'pasta': 'https://images.unsplash.com/photo-1473093226795-af9939fe685c',
        'burger': 'https://images.unsplash.com/photo-1565402170291-8491f14678db',
        'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
        'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
        'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
        'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        'tacos': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',
        'steak': 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
        'chicken': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435',
        'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        'rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        'noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
        
        // Desserts
        'dessert': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
        'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        'ice cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f',
        
        // Breakfast items
        'pancakes': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
        'waffles': 'https://images.unsplash.com/photo-1558584724-0e4d32ca55a4',
        'omelette': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
        
        // Beverages
        'smoothie': 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82',
        'juice': 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82',
        'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'
    };

    // Check for specific dish matches first
    for (const [food, imageUrl] of Object.entries(foodImages)) {
        if (normalizedName.includes(food)) {
            return `${imageUrl}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
        }
    }

    // Category-based fallback images
    const categoryImages = {
        'breakfast': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
        'lunch': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'dinner': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        'dessert': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
        'snacks': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        'indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
        'italian': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
        'chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
        'mexican': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d'
    };

    // Return category image or default food image
    return categoryImages[normalizedName] || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
}

// Show recipe details
function showRecipeDetails(recipeId) {
    fetch(`${API_URL}/recipes/${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipe details');
            }
            return response.json();
        })
        .then(recipe => {
            const modalBody = document.getElementById('recipeDetails');
            const recipeImageUrl = getRecipeImageUrl(recipe.recipe_name);
            
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="recipe-image mb-3" style="background-image: url('${recipeImageUrl}'); height: 300px;"></div>
                    </div>
                    <div class="col-md-6">
                        <h4 class="mb-3">${recipe.recipe_name}</h4>
                        <div class="mb-3">
                            <span class="badge bg-primary me-2">${recipe.category_name}</span>
                            ${recipe.is_vegetarian ? '<span class="badge bg-success me-2">Vegetarian</span>' : ''}
                            ${recipe.is_regional ? '<span class="badge bg-info">Regional</span>' : ''}
                        </div>
                        <p class="mb-4">${recipe.description || 'No description available'}</p>
                        
                        <h5 class="mb-3">Ingredients</h5>
                        <div class="ingredients-list">
                            ${recipe.ingredients && recipe.ingredients.length > 0 
                                ? `
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Ingredient</th>
                                                <th>Amount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${recipe.ingredients.map(ing => `
                                                <tr id="ingredient-${ing.recipe_ingredient_id}">
                                                    <td>${ing.ingredient_name}</td>
                                                    <td><span class="badge bg-primary">${ing.amount}</span></td>
                                                    <td>
                                                        <button class="btn btn-sm btn-danger" onclick="removeIngredient(${recipe.recipe_id}, ${ing.recipe_ingredient_id})">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                `
                                : '<p class="text-muted">No ingredients listed</p>'
                            }
                        </div>
                    </div>
                </div>
            `;
            
            // Show the modal
            const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
            recipeModal.show();
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            showAlert('Error loading recipe details. Please try again.', 'danger');
        });
}

function removeIngredient(recipeId, recipeIngredientId) {
    if (!confirm('Are you sure you want to remove this ingredient?')) {
        return;
    }

    fetch(`${API_URL}/recipes/${recipeId}/ingredients/${recipeIngredientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove ingredient');
        }
        return response.json();
    })
    .then(() => {
        // Remove the ingredient row from the table
        const ingredientRow = document.getElementById(`ingredient-${recipeIngredientId}`);
        if (ingredientRow) {
            ingredientRow.remove();
        }
        
        // Show success message
        showAlert('Ingredient removed successfully', 'success');
        
        // If no ingredients left, show the "No ingredients" message
        const tbody = document.querySelector('.ingredients-list tbody');
        if (tbody && tbody.children.length === 0) {
            document.querySelector('.ingredients-list').innerHTML = '<p class="text-muted">No ingredients listed</p>';
        }
    })
    .catch(error => {
        console.error('Error removing ingredient:', error);
        showAlert('Failed to remove ingredient. Please try again.', 'danger');
    });
}

// Add ingredient button click
addIngredientBtn.addEventListener('click', () => {
    if (allIngredients.length === 0) {
        showAlert('Please add some ingredients first in the Manage Ingredients section', 'warning');
        return;
    }

    const ingredientSelect = document.createElement('div');
    ingredientSelect.className = 'ingredient-item';
    
    const select = document.createElement('select');
    select.className = 'form-select mb-2';
    select.required = true;
    
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'form-control mb-2';
    amountInput.placeholder = 'Amount';
    amountInput.required = true;
    amountInput.step = '0.01';
    amountInput.min = '0.01';
    
    const unitSelect = document.createElement('select');
    unitSelect.className = 'form-select mb-2';
    unitSelect.innerHTML = `
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
        <option value="tsp">tsp</option>
        <option value="tbsp">tbsp</option>
        <option value="cup">cup</option>
        <option value="piece">piece</option>
    `;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline-danger btn-sm';
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
    
    // Populate select with ingredients
    select.innerHTML = '<option value="">Select Ingredient</option>';
    allIngredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.ingredient_id;
        option.textContent = ingredient.ingredient_name;
        select.appendChild(option);
    });
    
    ingredientSelect.appendChild(select);
    ingredientSelect.appendChild(amountInput);
    ingredientSelect.appendChild(unitSelect);
    ingredientSelect.appendChild(removeBtn);
    ingredientsList.appendChild(ingredientSelect);
    
    removeBtn.addEventListener('click', () => {
        ingredientSelect.remove();
    });
});

// Recipe form submission
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    const recipeName = document.getElementById('recipeName').value.trim();
    const recipeDescription = document.getElementById('recipeDescription').value.trim();
    const categoryId = document.getElementById('recipeCategory').value;

    if (!recipeName || !categoryId) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    // Get recipe data
    const recipeData = {
        recipe_name: recipeName,
        description: recipeDescription,
        category_id: categoryId,
        ingredients: []
    };

    // Get ingredients data
    const ingredientInputs = ingredientsList.querySelectorAll('.ingredient-item');
    if (ingredientInputs.length === 0) {
        showAlert('Please add at least one ingredient', 'warning');
        return;
    }

    for (const input of ingredientInputs) {
        const select = input.querySelector('select');
        const amountInput = input.querySelector('input[type="number"]');
        const unitSelect = input.querySelector('select:last-child');
        
        if (!select.value || !amountInput.value) {
            showAlert('Please fill in all ingredient details', 'warning');
            return;
        }

        recipeData.ingredients.push({
            ingredient_id: select.value,
            amount: `${amountInput.value} ${unitSelect.value}`
        });
    }

    try {
        const response = await fetch(`${API_URL}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || 'Failed to add recipe');
        }

        // Show success message
        showAlert('Recipe added successfully!', 'success');
        
        // Reset form and close modal
        recipeForm.reset();
        ingredientsList.innerHTML = '';
        addRecipeModal.hide();
        
        // Reload recipes
        await loadRecipes();
    } catch (error) {
        console.error('Error adding recipe:', error);
        showAlert(error.message || 'Failed to add recipe', 'danger');
    }
});

// Ingredient form submission
ingredientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ingredientData = {
        ingredient_name: document.getElementById('ingredientName').value.trim(),
        ingredient_type: document.getElementById('ingredientType').value
    };

    try {
        const response = await fetch(`${API_URL}/ingredients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Failed to add ingredient');
        }

        // Show success message
        showAlert('Ingredient added successfully!', 'success');
        
        // Reset form and close modal
        ingredientForm.reset();
        addIngredientModal.hide();
        
        // Reload ingredients
        await loadIngredients();
    } catch (error) {
        console.error('Error adding ingredient:', error);
        showAlert(error.message || 'Failed to add ingredient', 'danger');
    }
});

// Filter buttons
filterVeg.addEventListener('click', () => {
    currentFilter = 'veg';
    const filteredRecipes = allRecipes.filter(recipe => recipe.is_veg);
    displayRecipes(filteredRecipes);
});

filterRegional.addEventListener('click', () => {
    currentFilter = 'regional';
    const filteredRecipes = allRecipes.filter(recipe => recipe.regional);
    displayRecipes(filteredRecipes);
});

showAll.addEventListener('click', () => {
    currentFilter = 'all';
    displayRecipes(allRecipes);
});

// View recipe details
recipesContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('view-recipe') || e.target.closest('.view-recipe')) {
        const recipeId = e.target.dataset.id || e.target.closest('.view-recipe').dataset.id;
        await showRecipeDetails(recipeId);
    }
});

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Add this new function to manage ingredients
function manageIngredients() {
    fetch(`${API_URL}/ingredients`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }
            return response.json();
        })
        .then(ingredients => {
            const modalBody = document.getElementById('ingredientsList');
            modalBody.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Ingredient Name</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ingredients.map(ing => `
                                <tr id="ingredient-row-${ing.ingredient_id}">
                                    <td>${ing.ingredient_name}</td>
                                    <td>${ing.ingredient_type}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="deleteIngredient(${ing.ingredient_id}, '${ing.ingredient_name}')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
            showAlert('Failed to load ingredients. Please try again.', 'danger');
        });
}

function deleteIngredient(ingredientId, ingredientName) {
    if (!confirm(`Are you sure you want to delete the ingredient "${ingredientName}"?`)) {
        return;
    }

    fetch(`${API_URL}/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete ingredient');
        }
        return response.json();
    })
    .then(() => {
        // Remove the ingredient row from the table
        const ingredientRow = document.getElementById(`ingredient-row-${ingredientId}`);
        if (ingredientRow) {
            ingredientRow.remove();
        }
        
        // Show success message
        showAlert(`Ingredient "${ingredientName}" deleted successfully`, 'success');
        
        // Reload the ingredients list
        manageIngredients();
    })
    .catch(error => {
        console.error('Error deleting ingredient:', error);
        showAlert('Failed to delete ingredient. Please try again.', 'danger');
    });
}

// Initialize the application
init();

// Add this to your initialization code
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...
    
    // Add button to manage ingredients
    const manageIngredientsBtn = document.createElement('button');
    manageIngredientsBtn.className = 'btn btn-outline-primary me-2';
    manageIngredientsBtn.innerHTML = '<i class="bi bi-box-seam me-1"></i>Manage Ingredients';
    manageIngredientsBtn.onclick = () => {
        manageIngredients();
        const ingredientsModal = new bootstrap.Modal(document.getElementById('ingredientsModal'));
        ingredientsModal.show();
    };
    
    // Add the button to the navbar
    const navbarNav = document.querySelector('.navbar-nav');
    const listItem = document.createElement('li');
    listItem.className = 'nav-item';
    listItem.appendChild(manageIngredientsBtn);
    navbarNav.appendChild(listItem);
});
