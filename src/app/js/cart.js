const Cart = {
    initCart() {
        this.totalPriceCart = 0;
        this.totalProductCount = 0;
        this.cartArray = [];
        return this;
    },

    pushProduct(product) {
        if (this.getProductFromCart(product))
            throw new Error("Product already registered in Cart");

        const basketInformation = {
            total: product.price, // Цена одного продукта
            count: 1, // Начальное количество
            product: product, // Продукт
        };
        this.cartArray.push(basketInformation);
        this.recalculateTotal();
    },

    popProduct(product) {
        const basketElement = this.getProductFromCart(product);
        if (!basketElement) throw new Error("Product already deleted");

        this.cartArray = this.cartArray.filter(
            (element) => element !== basketElement
        );
        this.recalculateTotal();
    },

    increaseCartCount(product) {
        const basketElement = this.getProductFromCart(product);
        if (!basketElement) throw new Error("Product doesn't exist in Cart");

        basketElement.count++;
        basketElement.total = basketElement.product.price * basketElement.count;
        this.recalculateTotal();
    },

    decreaseCartCount(product) {
        const basketElement = this.getProductFromCart(product);
        console.log(basketElement);
        if (!basketElement) throw new Error("Product doesn't exist in Cart");

        if (basketElement.count > 1) {
            basketElement.count--;
            basketElement.total =
                basketElement.product.price * basketElement.count;
            this.recalculateTotal();
        } else {
            this.popProduct(product);
            return false;
        }
        return true;
    },

    clearCart() {
        this.cartArray = [];
        this.totalPriceCart = 0;
        this.totalProductCount = 0; 
    },

    getCartArray() {
        return this.cartArray;
    },

    getPeekProduct() {
        return this.cartArray[this.cartArray.length - 1];
    },

    getProductFromCart(prod) {
        return this.cartArray.find(
            (productElement) => productElement.product === prod
        );
    },

    getCountProduct(prod) {
        return this.getProductFromCart(prod)?.count;
    },

    getTotalCartCount() {
        return this.totalProductCount;
    },

    getTotalCartPrice(){
        return this.totalPriceCart;
    },

    getTotalPriceProduct(prod) {
        return this.getProductFromCart(prod)?.total;
    },

    recalculateTotal() {
        this.totalPriceCart = this.cartArray.reduce(
            (total, item) => total + item.total,
            0
        );

        this.totalProductCount = this.cartArray.reduce(
            (count, item) => count + item.count,
            0
        );
    },
};

export { Cart };
