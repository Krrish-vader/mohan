// Cart data structure
let cart = {
    vegetables: [],
    fruits: []
};


const products = {
    vegetables: [
        { id: 'v1', name: 'Tomato 1 kg', price: 30, image: 'images/Products/vegetables/Tomato 1 kg.jpg' },
        { id: 'v2', name: 'Fresh Broccoli vegetable 500 g', price: 50, image: 'images/Products/vegetables/Fresh Broccoli vegetable 500 g.jpg'}, 
        { id: 'v3', name: 'Onion 1 kg', price: 50, image: 'images/Products/vegetables/Onion 1 kg.jpg' },
        { id: 'v4', name: 'Carrot 1 kg', price: 50, image: 'images/Products/vegetables/Carrot 1 kg.jpg' },
        { id: 'v5', name: 'Green sweet pepper 1 kg', price: 80, image: 'images/Products/vegetables/Green sweet pepper 1 kg.jpg' },
        { id: 'v6', name: 'Fresh ginger root or rhizome 500 g', price: 60, image: 'images/Products/vegetables/Fresh ginger root or rhizome 500 g.jpg' },
        { id: 'v7', name: 'Green kidney bean 1 kg', price: 90, image: 'images/Products/vegetables/Green kidney bean 1 kg.jpg' },
        { id: 'v8', name: 'Fresh Garlic 1 kg', price: 80, image: 'images/Products/vegetables/Fresh Garlic 1 kg.jpg' },
        { id: 'v9', name: 'whole green cabbage  1 kg', price: 50, image: 'images/Products/vegetables/whole green cabbage  1 kg.jpg' },
        { id: 'v10', name: 'Fresh Cilantro popular vegetable', price: 50, image: 'images/Products/vegetables/Fresh Cilantro popular vegetable.jpg' },


    ],
        fruits: [
            { id: 'f1', name: 'Apple 1 kg', price: 120, image: 'images/Products/Fruits/Apple 1 kg.jpg' },
            { id: 'f2', name: 'Fresh Orange 1 kg', price: 80, image: 'images/Products/Fruits/Fresh Orange 1 kg.jpg' },
            { id: 'f3', name: 'Fresh Pomegranate 1 kg', price: 200, image: 'images/Products/Fruits/Fresh Pomegranate 1 kg.jpg' },
            { id: 'f4', name: 'Muskmelon 1 kg.', price: 100, image: 'images/Products/Fruits/Muskmelon 1 kg..jpg' },
            { id: 'f5', name: 'Custard Apple fruit', price: 70, image: 'images/Products/Fruits/Custard Apple fruit.jpg' },
            { id: 'f6', name: 'Green Apple fruit', price: 100, image: 'images/Products/Fruits/Green Apple fruit.jpg' },
            { id: 'f7', name: 'watermelon 1 kg', price: 50, image: 'images/Products/Fruits/watermelon 1 kg.jpg' },
            { id: 'f8', name: 'Kiwi fruit 500 g', price: 100, image: 'images/Products/Fruits/Kiwi fruit 500 g.jpg' },
            { id: 'f9', name: 'Mango  fruit 1 kg', price: 100, image: 'images/Products/Fruits/Mango  fruit 1 kg.jpg' },
            { id: 'f10', name: 'Banana 1 kg', price: 100, image: 'images/Products/Fruits/Banana 1 kg.jpg' },

             

        ]
    };
    

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('freshMartCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('freshMartCart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    updateSection('vegetables');
    updateSection('fruits');
    updateSummary();
}

// Update specific section (vegetables or fruits)
function updateSection(section) {
    const container = document.getElementById(`${section}Cart`);
    if (!container) return; // Guard clause if container doesn't exist

    container.innerHTML = '';

    cart[section].forEach(item => {
        const product = products[section].find(p => p.id === item.id);
        if (product) {
            const itemElement = createCartItemElement(product, item.quantity, section);
            container.appendChild(itemElement);
        }
    });
}

// Create cart item element
function createCartItemElement(product, quantity, section) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    div.innerHTML = `
        <div class="item-details">
            <h4 class="item-name">${product.name}</h4>
            <div class="item-price">₹${product.price}</div>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn minus" onclick="updateQuantity('${product.id}', ${quantity - 1}, '${section}')">-</button>
            <input type="number" class="quantity-input" value="${quantity}" min="1" max="10" 
                onchange="updateQuantity('${product.id}', this.value, '${section}')">
            <button class="quantity-btn plus" onclick="updateQuantity('${product.id}', ${quantity + 1}, '${section}')">+</button>
        </div>
        <div class="item-total">₹${(product.price * quantity).toFixed(2)}</div>
        <div class="remove-item" onclick="removeItem('${product.id}', '${section}')">
            <i class="fa fa-trash"></i>
        </div>
    `;
    return div;
}

// Update quantity of an item
function updateQuantity(productId, newQuantity, section) {
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
        removeItem(productId, section);
        return;
    }
    if (newQuantity > 10) newQuantity = 10;

    const itemIndex = cart[section].findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[section][itemIndex].quantity = newQuantity;
    } else {
        cart[section].push({ id: productId, quantity: newQuantity });
    }

    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeItem(productId, section) {
    cart[section] = cart[section].filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update order summary
function updateSummary() {
    const summaryElement = document.getElementById('orderSummary');
    if (!summaryElement) return;

    let subtotal = 0;
    const delivery = 40;

    // Calculate subtotal
    ['vegetables', 'fruits'].forEach(section => {
        cart[section].forEach(item => {
            const product = products[section].find(p => p.id === item.id);
            if (product) {
                subtotal += product.price * item.quantity;
            }
        });
    });

    // Update display
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `₹${delivery.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${(subtotal + delivery).toFixed(2)}`;
}

// Handle checkout
function handleCheckout() {
    if (cart.vegetables.length === 0 && cart.fruits.length === 0) {
        alert('Your cart is empty! Please add some items before checking out.');
        return;
    }
    
    // Here you would typically redirect to a checkout page
    alert('Proceeding to checkout...');
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', initCart);

// Add event listener to checkout button if it exists
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}); 