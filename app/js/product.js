const Product = {
    initProduct(image, name, category, price) {
        this.image = image;
        this.name = name;
        this.category = category;
        this.price = price;
        return this;
    },
    addProductToCart(cart) {
        return cart.pushProduct(this);
    },
    getPeekProductFromCart(cart) {
        return cart.getPeekProduct();
    },
    deleteProduct(cart){
        cart.popProduct(this);
    },
    increase(cart) {
        cart.increaseCartCount(this);
    },
    decrease(cart) {
        return cart.decreaseCartCount(this);
    },
    getProductByCategory(products, productCategory) {
        return products.find(
            ({ category }) => productCategory === category
        );
    },
};

export { Product };
