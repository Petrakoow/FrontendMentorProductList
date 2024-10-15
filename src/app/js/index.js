import { Product } from "./product.js";
import { Cart } from "./cart.js";

import { ProductUIManager } from "./productManager.js";
import { ManagementUIManager } from "./managementManager.js";
import { OrderUIManager } from "./orderManager.js";

import {
    ParserToHTMLProduct,
    ParserToHTMLCart,
    ParserToHTMLOrder,
} from "./parser.js";

const Controller = {
    init(params) {
        this.paramsController = params;
        this.productUIManagers = new Map();
        this.managementUIManager = Object.create(ManagementUIManager);
        this.orderUIManager = Object.create(OrderUIManager);

        fetch(this.paramsController.pathToJson)
            .then((response) => response.json())
            .then((data) => {
                this.initStaticContainers();
                this.initManagementManager();
                this.initOrderManager();
                this.initProducts(data);
                this.createCardPerPage();
                this.initCart();
                this.initTotalValue();
                this.bindProductEvents();
            })
            .catch((error) =>
                console.error("Error fetching product data:", error)
            );

        return this;
    },

    initStaticContainers() {
        this.productContainerElement =
            document.getElementById("productContainerId");
        this.basketContainerElement = document.getElementById("cartStorageId");
        this.orderContainerElement =
            document.getElementById("orderContainerId");
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

    initOrderManager() {
        const orderElement = document.getElementById("orderBlockId");
        const orderResultPrice = document.getElementById("orderResultPriceId");
        this.orderUIManager.init(orderElement, orderResultPrice);
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
        this.handleIncreaseDecrease();
        this.handleAcceptOrder();
        this.handleStartNewOrder();
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
        const cartElement = ParserToHTMLCart.convert(product);
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
                    this.removeProductFromCart(productUIManager);
                }
            }
        });
    },

    removeProductFromCart(productUIManager) {
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

    handleIncreaseDecrease() {
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
                this.removeProductFromCart(productUIManager);
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

    handleAcceptOrder() {
        const orderAcceptButton = document.getElementById("confirmOrderId");
        orderAcceptButton.addEventListener("click", (event) => {
            this.orderContainerElement.innerHTML = "";
            this.cart.getCartArray().forEach((cartProduct) => {
                const orderProductElement =
                    ParserToHTMLOrder.convert(cartProduct);
                this.orderContainerElement.appendChild(orderProductElement);
            });

            this.orderUIManager.setTotalPrice(this.cart.getTotalCartPrice());
            this.orderUIManager.toggleOrderInfo(true);
        });
    },

    handleStartNewOrder() {
        const orderStartNewOrder = document.getElementById("startNewOrderId");
        orderStartNewOrder.addEventListener("click", (event) => {
            this.orderUIManager.toggleOrderInfo(false);
            this.cart.getCartArray().forEach((cartProduct) => {
                const product = cartProduct.product;
                product.deleteProduct(this.cart);
                const productUIManager = this.productUIManagers.get(product.category);
                this.removeProductFromCart(productUIManager);
            });
            this.cart.clearCart();
            this.orderUIManager.setTotalPrice(this.cart.getTotalCartPrice());
            this.orderContainerElement.innerHTML = "";
        });
    },
};

window.onload = function () {
    const params = {
        pathToJson: "app/data/data.json",
    };

    Controller.init(params);
};
