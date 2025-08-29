function handleCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('pascodes_cart')) || [];
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-text">Your cart is empty.</p>';
            clearCartBtn.disabled = true;
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
    <p class="cart-item-title">${item.title}</p>
    <p class="cart-item-price">$${item.price}</p>
    `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    clearCartBtn && clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('pascodes_cart');
        displayCart();
    });

    displayCart();
}
document.addEventListener("DOMContentLoaded", () => {
    handleCart()
});