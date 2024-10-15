import { showConvertPrice } from "./auxiliary.js";

const ProductUIManager = {
    init(product, productElement, cartElement) {
        this.product = product;
        this.productElement = productElement;
        this.cartElement = cartElement;

        this.contourElement = productElement.querySelector(
            ".product-preview-card__img"
        );
        this.addButton = productElement.querySelector(
            ".product-preview-card__btn-add-to-cart"
        );
        this.increaseDecreaseWrapper = productElement.querySelector(
            ".button--increase-decrease-wrapper"
        );

        this.counterElement = this.increaseDecreaseWrapper.children[1];

        return this;
    },

    setCartElement(cartElement) {
        this.cartElement = cartElement;
    },

    getCartElement() {
        return this.cartElement;
    },

    setProductCounter(value) {
        this.counterElement.textContent = value;
    },

    clearProductCounter() {
        this.counterElement.textContent = 1;
    },

    deleteCartElement() {
        this.cartElement.remove();
    },

    toggleAddButton(isInCart) {
        this.addButton.classList.toggle("hide", isInCart);
        this.increaseDecreaseWrapper.classList.toggle("hide", !isInCart);
    },

    toggleContour(flag) {
        this.contourElement.classList.toggle("contour", flag);
    },

    updateCartView(productCount, totalPrice, singlePrice) {
        const counterSpan = this.cartElement.querySelector(
            ".product-added__count-portions"
        );
        const totalPriceSpan = this.cartElement.querySelector(
            ".product-added__total-price"
        );
        const singlePriceSpan = this.cartElement.querySelector(
            ".product-added__single-price"
        );

        counterSpan.textContent = `${productCount}x`;
        totalPriceSpan.textContent = showConvertPrice(totalPrice);
        singlePriceSpan.textContent = `@ ${showConvertPrice(singlePrice)}`;
    },
};

export { ProductUIManager };
