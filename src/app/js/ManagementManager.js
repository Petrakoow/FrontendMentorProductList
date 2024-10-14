import { showConvertPrice } from "./auxiliary.js";

const ManagementUIManager = {
    init(
        basketContainerElement,
        cartAddedElement,
        cartEmptyElement,
        totalCountElement,
        totalPriceElement
    ) {
        this.basketContainerElement = basketContainerElement;
        this.cartAddedElement = cartAddedElement;
        this.cartEmptyElement = cartEmptyElement;
        this.totalCountElement = totalCountElement;
        this.totalPriceElement = totalPriceElement;
        return this;
    },
    toggleCart(flag) {
        if (this.basketContainerElement.childElementCount === 0) {
            this.cartAddedElement.classList.toggle("hide", flag);
            this.cartEmptyElement.classList.toggle("hide", !flag);
        }
    },
    updateCartTotals(cart) {
        this.totalCountElement.textContent = cart.getTotalCartCount();
        this.totalPriceElement.textContent = showConvertPrice(
            cart.getTotalCartPrice()
        );
    },
};

export { ManagementUIManager };
