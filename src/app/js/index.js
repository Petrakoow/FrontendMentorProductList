import { Product } from "./product.js";
import { Cart } from "./cart.js";
import { ParserToHTMLProduct, ParserToHTMLCart } from "./parser.js";
import { showConvertPrice } from "./auxiliary.js";

const Controller = {
    init(params) {
        this.paramsController = params;
        fetch(this.paramsController.pathToJson)
            .then((response) => response.json())
            .then((data) => {
                this.initAllStaticUsedElements();
                this.initProducts(data);
                this.createCardPerPage();
                this.initCart();
                this.initTotalValue();
                this.productEventBinding();
            })
            .catch((error) =>
                console.error("Error fetching product data:", error)
            );
    },

    initAllStaticUsedElements() {
        this.basketContainerElement = document.getElementById(
            this.paramsController.ids.cartContainerId
        );
        this.productContainerElement = document.getElementById(
            this.paramsController.ids.productContainerId
        );
        this.cartEmptyElement = document.getElementById(
            this.paramsController.ids.cartEmptyStateId
        );
        this.cartAddedElement = document.getElementById(
            this.paramsController.ids.cartAddedElementId
        );
        this.totalPriceElement = document.getElementById(
            this.paramsController.ids.cartTotalPriceId
        );
        this.totalCountElement = document.getElementById(
            this.paramsController.ids.cartTotalCountId
        );
    },

    initProducts(data) {
        this.products = data.map(({ image, name, category, price }) => {
            return Object.create(Product).initProduct(
                image,
                name,
                category,
                price
            );
        });
    },

    createCardPerPage() {
        this.products.forEach((product) => {
            if (!Product.isPrototypeOf(product))
                throw new Error("its not a product");
            this.productContainerElement.appendChild(
                ParserToHTMLProduct.convert(product)
            );
        });
    },

    initCart() {
        this.cart = Object.create(Cart).initCart();
    },

    initTotalValue() {
        this.handlerChangeTotalValue();
    },

    productEventBinding() {
        this.handlerButtonAddToCart();
        this.handlerDeleteProductFromCart();
        this.handlerButtonIncreaseDecrease();
    },

    handlerButtonAddToCart() {
        const addToCartButtons = document.querySelectorAll(
            this.paramsController.classes.add
        );
        addToCartButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const productCategory = button.getAttribute(
                    this.paramsController.data.category
                );
                const product = Product.getProductByCategory(
                    this.products,
                    productCategory
                );

                const contour = button.closest(
                    this.paramsController.classes.contour
                ).firstElementChild.lastElementChild;

                if (product) {
                    try {
                        this.addProductToCart(product);
                        this.toggleContourHideShow(contour, true);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        });
    },

    addProductToCart(product) {
        product.addProductToCart(this.cart);
        const productFromBasket = product.getPeekProductFromCart(this.cart);
        const basketProductElement =
            ParserToHTMLCart.convert(productFromBasket);

        this.showCartWithProducts();
        this.basketContainerElement.appendChild(basketProductElement);
        this.toggleCartButtons(product, true);
        this.handlerChangeTotalValue();
    },

    showCartWithProducts() {
        if (this.basketContainerElement.childElementCount === 0) {
            this.toggleCartHideShow(true);
        }
    },

    handlerDeleteProductFromCart() {
        this.basketContainerElement.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(
                this.paramsController.classes.delete
            );
            if (deleteButton) {
                const basketElement = deleteButton.closest(
                    this.paramsController.classes.basketElement
                );
                const productCategory = deleteButton.getAttribute(
                    this.paramsController.data.category
                );
                const product = Product.getProductByCategory(
                    this.products,
                    productCategory
                );

                product.deleteProduct(this.cart);
                this.removeProductFromCart(basketElement, product);
            }
        });
    },

    removeProductFromCart(basketElement, product) {
        try {
            basketElement.remove();
            this.handlerChangeTotalValue();
            this.toggleCartButtons(product, false);
            this.clearProductCounter(product);
            this.hideCartWithProducts();
            this.removeCartContour(product);
        } catch (error) {
            console.log(error);
        }
    },

    removeCartContour(product) {
        const contour = document.querySelector(
            `${this.paramsController.classes.add}[data-category="${product.category}"]`
        ).closest(
            this.paramsController.classes.contour
        ).firstElementChild.lastElementChild;;
        this.toggleContourHideShow(contour, false);
    },

    hideCartWithProducts() {
        if (this.basketContainerElement.childElementCount === 0) {
            this.toggleCartHideShow(false);
        }
    },

    handlerButtonIncreaseDecrease() {
        const increaseDecreaseButtons = document.querySelectorAll(
            ".button--increase-decrease-wrapper button"
        );

        increaseDecreaseButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                if (this.isActionButton(button, event)) {
                    const productCategory = button.getAttribute(
                        this.paramsController.data.category
                    );
                    const product = this.getProductByCategory(productCategory);
                    const basketProduct =
                        this.getBasketProduct(productCategory);

                    if (!basketProduct) return;

                    const {
                        counterSpan,
                        singlePriceSpan,
                        totalPriceSpan,
                        counterButtonSpan,
                    } = this.getProductDOMElements(button, basketProduct);

                    this.updateProductQuantity(
                        button,
                        product,
                        counterButtonSpan
                    );

                    this.updateProductPriceDisplay(
                        product,
                        counterSpan,
                        totalPriceSpan,
                        singlePriceSpan
                    );

                    this.handlerChangeTotalValue();
                }
            });
        });
    },

    isActionButton(button, event) {
        console.log(button, event);
        return button.classList.contains("button--action");
    },

    getProductByCategory(productCategory) {
        return Product.getProductByCategory(this.products, productCategory);
    },

    getBasketProduct(productCategory) {
        const deleteButton = document.querySelector(
            `${this.paramsController.classes.delete}[data-category="${productCategory}"]`
        );
        return deleteButton?.closest(
            `${this.paramsController.classes.basketElement}`
        );
    },

    getProductDOMElements(button, basketProduct) {
        return {
            counterSpan: basketProduct.querySelector(
                this.paramsController.classes.portions
            ),
            singlePriceSpan: basketProduct.querySelector(
                this.paramsController.classes.portions
            ).nextElementSibling,
            totalPriceSpan: basketProduct.querySelector(
                this.paramsController.classes.portions
            ).nextElementSibling.nextElementSibling,
            counterButtonSpan: button.parentElement.querySelector(
                this.paramsController.classes.counter
            ),
        };
    },

    updateProductQuantity(button, product, counterButtonSpan) {
        if (button === button.parentElement.firstElementChild) {
            const executeStatus = product.decrease(this.cart);
            if (!executeStatus) this.handleDeleteProductAfterIncrease(product);
        } else {
            product.increase(this.cart);
        }
        const productCount = this.cart.getCountProduct(product) || 1;
        counterButtonSpan.textContent = productCount;
    },

    updateProductPriceDisplay(
        product,
        counterSpan,
        totalPriceSpan,
        singlePriceSpan
    ) {
        const productCount = this.cart.getCountProduct(product) || 1;
        const productTotalValue = this.cart.getTotalPriceProduct(product) || 0;

        counterSpan.textContent = `${productCount}x`;
        totalPriceSpan.textContent = `${showConvertPrice(productTotalValue)}`;
        singlePriceSpan.textContent = `@ ${showConvertPrice(product.price)}`;
    },

    handleDeleteProductAfterIncrease(product) {
        const basketElement = document
            .querySelector(
                `${this.paramsController.classes.delete}[data-category="${product.category}"]`
            )
            .closest(this.paramsController.classes.basketElement);

        if (basketElement) {
            this.removeProductFromCart(basketElement, product);
        }
    },

    clearProductCounter(product) {
        const counterSpan = document.querySelector(
            `${this.paramsController.classes.action}[data-category="${product.category}"]`
        ).nextElementSibling;
        console.log(counterSpan);
        counterSpan.textContent = 1;
    },

    handlerChangeTotalValue() {
        this.totalCountElement.textContent = this.cart.getTotalCartCount();
        this.totalPriceElement.textContent = showConvertPrice(
            this.cart.getTotalCartPrice()
        );
    },

    toggleCartButtons(product, isInCart) {
        const addToCartBtn = document.querySelector(
            `${this.paramsController.classes.add}[data-category="${product.category}"]`
        );
        const increaseDecreaseWrapper = addToCartBtn.nextElementSibling;
        addToCartBtn.classList.toggle("hide", isInCart);
        increaseDecreaseWrapper.classList.toggle("hide", !isInCart);
    },

    toggleCartHideShow(flag) {
        this.cartAddedElement.classList.toggle("hide", !flag);
        this.cartEmptyElement.classList.toggle("hide", flag);
    },

    toggleContourHideShow(product, flag) {
        product.classList.toggle("contour", flag);
    },
};

window.onload = function () {
    const params = {
        pathToJson: "app/data/data.json",
        ids: {
            productContainerId: "productContainerId",
            cartContainerId: "cartStorageId",
            cartEmptyStateId: "cartEmptyStateId",
            cartTotalPriceId: "totalPriceId",
            cartTotalCountId: "cartCounterId",
            cartAddedElementId: "cartAddedStateId",
        },
        classes: {
            add: ".product-preview-card__btn-add-to-cart",
            delete: ".button.button--remove-item.product__button",
            basketElement: ".product-added",
            increaseDecrease: ".button--increase-decrease-wrapper",
            buttonsContainer: ".product-preview-card__buttons-container",
            action: ".button.button--action",
            counter: ".product-preview-card__counter",
            portions: ".product-added__count-portions",
            contour: ".product-preview-card__image-container",
        },
        data: {
            category: "data-category",
        },
    };

    Controller.init(params);
};
