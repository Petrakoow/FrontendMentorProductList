import { Product } from "./product.js";
import { Cart } from "./cart.js";

import { ProductUIManager } from "./ProductManager.js";
import { ManagementUIManager } from "./ManagementManager.js";

import { ParserToHTMLProduct, ParserToHTMLCart } from "./parser.js";

const Controller = {
    init(params) {
        this.paramsController = params;
        this.productUIManagers = new Map();
        this.managementUIManager = Object.create(ManagementUIManager);

        fetch(this.paramsController.pathToJson)
            .then((response) => response.json())
            .then((data) => {
                this.initStaticContainers();
                this.initManagementManager();
                this.initProducts(data);
                this.createCardPerPage();
                this.initCart();
                this.initTotalValue();
                this.bindProductEvents();
            })
            .catch((error) =>
                console.error("Error fetching product data:", error)
            );
    },

    initStaticContainers() {
        const ids = this.paramsController.ids;
        this.productContainerElement = document.getElementById(
            ids.productContainerId
        );
        this.basketContainerElement = document.getElementById(
            ids.cartContainerId
        );
    },

    initManagementManager() {
        const cartEmptyElement = document.getElementById("cartEmptyStateId");
        const cartAddedElement = document.getElementById("cartAddedStateId");
        const totalCountElement = document.getElementById("cartCounterId");
        const totalPriceElement = document.getElementById("totalPriceId");
        this.managementUIManager.init(
            this.basketContainerElement,
            cartEmptyElement,
            cartAddedElement,
            totalCountElement,
            totalPriceElement
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
            const productElement = ParserToHTMLProduct.convert(product);
            this.productContainerElement.appendChild(productElement);

            const productUIManager = Object.create(ProductUIManager).init(
                product,
                productElement,
                null
            );
            this.productUIManagers.set(product.category, productUIManager);
        });
    },

    initCart() {
        this.cart = Object.create(Cart).initCart();
    },

    initTotalValue() {
        this.managementUIManager.updateCartTotals(this.cart);
    },

    bindProductEvents() {
        this.handleAddToCart();
        this.handleDeleteProductFromCart();
        this.handlerButtonIncreaseDecrease();
    },

    handleAddToCart() {
        const addToCartButtons = document.querySelectorAll(
            ".product-preview-card__btn-add-to-cart"
        );
        addToCartButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const category = button.getAttribute("data-category");
                const product = Product.getProductByCategory(
                    this.products,
                    category
                );

                if (product) {
                    const productUIManager =
                        this.productUIManagers.get(category);
                    this.addProductToCart(product, productUIManager);
                }
            });
        });
    },

    addProductToCart(product, productUIManager) {
        product.addProductToCart(this.cart);
        const productFromCart = product.getPeekProductFromCart(this.cart);

        const cartElement = ParserToHTMLCart.convert(productFromCart);
        productUIManager.setCartElement(cartElement);
        this.managementUIManager.toggleCart(true);
        this.basketContainerElement.appendChild(cartElement);

        productUIManager.toggleAddButton(true);
        productUIManager.toggleContour(true);
        this.managementUIManager.updateCartTotals(this.cart);
    },

    handleDeleteProductFromCart() {
        this.basketContainerElement.addEventListener("click", (event) => {
            const button = event.target.closest(
                ".button.button--remove-item.product__button"
            );
            if (button) {
                const category = button.getAttribute("data-category");
                const product = Product.getProductByCategory(
                    this.products,
                    category
                );

                if (product) {
                    const productUIManager =
                        this.productUIManagers.get(category);
                    product.deleteProduct(this.cart);
                    this.removeProductFromCart(product, productUIManager);
                }
            }
        });
    },

    removeProductFromCart(product, productUIManager) {
        try {
            productUIManager.deleteCartElement();
            this.managementUIManager.updateCartTotals(this.cart);
            productUIManager.toggleAddButton(false);
            productUIManager.clearProductCounter();
            this.managementUIManager.toggleCart(false);
            productUIManager.toggleContour(false);
        } catch (error) {
            console.log(error);
        }
    },

    handlerButtonIncreaseDecrease() {
        const increaseDecreaseButtons = document.querySelectorAll(
            ".button--increase-decrease-wrapper button"
        );

        increaseDecreaseButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                if (button.classList.contains("button--action")) {
                    const category = button.getAttribute("data-category");
                    const product = Product.getProductByCategory(
                        this.products,
                        category
                    );
                    const productUIManager =
                        this.productUIManagers.get(category);

                    if (!productUIManager.getCartElement()) return;

                    this.updateProductQuantity(
                        button,
                        product,
                        productUIManager
                    );

                    this.updateProductPriceDisplay(product, productUIManager);

                    this.managementUIManager.updateCartTotals(this.cart);
                }
            });
        });
    },

    updateProductQuantity(button, product, productUIManager) {
        if (button === button.parentElement.firstElementChild) {
            const executeStatus = product.decrease(this.cart);
            if (!executeStatus) {
                this.removeProductFromCart(product, productUIManager);
            }
        } else {
            product.increase(this.cart);
        }
        const productCount = this.cart.getCountProduct(product) || 1;
        productUIManager.setProductCounter(productCount);
    },

    updateProductPriceDisplay(product, productUIManager) {
        const productCount = this.cart.getCountProduct(product) || 1;
        const productTotalValue = this.cart.getTotalPriceProduct(product) || 0;

        productUIManager.updateCartView(
            productCount,
            productTotalValue,
            product.price
        );
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
