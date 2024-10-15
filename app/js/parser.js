import { showConvertPrice } from "./auxiliary.js";

const ParserToHTML = {
    createElement(tag, classes = [], text = "") {
        const el = document.createElement(tag);
        if (Array.isArray(classes) && classes.length > 0)
            el.classList.add(...classes);
        if (text) el.textContent = text;
        return el;
    },
    getMediaParams() {
        return [
            "(min-width: 1024px)",
            "(min-width: 768px) and (max-width: 1023.98px)",
            "(max-width: 767.98px)",
        ];
    },
};

const productParser = Object.create(ParserToHTML);

productParser.convert = function (product) {
    const article = this.createElement("article", ["product-preview-card"]);

    const previewDiv = this.createElement("div", [
        "product-preview-card__image-padding",
    ]);
    const wrapperDiv = this.createElement("div", [
        "product-preview-card__image-container",
    ]);

    const picture = this.createElement("picture", [
        "product-preview-card__picture",
    ]);
    const mediaParams = this.getMediaParams();

    const sources = Object.entries(product.image)
        .slice(1)
        .map(([_, value]) => {
            const source = this.createElement("source");
            source.srcset = value;
            source.type = "image/jpeg";
            source.media = mediaParams.pop();
            return source;
        });

    const img = this.createElement("img", ["product-preview-card__img"]);
    img.src = product.image.thumbnail;
    img.alt = `${product.name} Product Image`;

    picture.append(...sources, img);

    const buttonContainer = this.createElement("div", [
        "product-preview-card__buttons-container",
    ]);

    const buttonAddToCart = this.createElement("button", [
        "button",
        "button--add-cart",
        "product-preview-card__btn-add-to-cart",
    ]);
    const spanIcon = this.createElement("span", ["button__icon"]);
    const svgImg = this.createElement("img");
    svgImg.src = "assets/images/icon-add-to-cart.svg";
    svgImg.alt = "Icon Product";
    spanIcon.appendChild(svgImg);
    const spanTextButton = this.createElement("span");
    spanTextButton.textContent = "Add to Cart";
    buttonAddToCart.dataset.category = product.category;
    buttonAddToCart.append(spanIcon, spanTextButton);

    const spanBtnWrapper = this.createElement("span", [
        "button--increase-decrease-wrapper",
        "hide",
    ]);

    const buttonDecrease = this.createElement("button", [
        "button",
        "button--action",
    ]);
    buttonDecrease.dataset.category = product.category;
    buttonDecrease.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 2">
            <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
        </svg>`;

    const productCounter = this.createElement("span", [
        "product-preview-card__counter",
    ]);
    productCounter.textContent = "1";

    const buttonIncrease = this.createElement("button", [
        "button",
        "button--action",
    ]);
    buttonIncrease.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
            <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
        </svg>`;
    buttonIncrease.dataset.category = product.category;

    spanBtnWrapper.append(buttonDecrease, productCounter, buttonIncrease);

    buttonContainer.append(buttonAddToCart, spanBtnWrapper);

    wrapperDiv.append(picture, buttonContainer);

    previewDiv.append(wrapperDiv);

    const paragraphType = this.createElement(
        "p",
        ["product-preview-card__type-dessert"],
        product.category
    );
    const title = this.createElement(
        "h2",
        ["product-preview-card__title"],
        product.name
    );
    const paragraphPrice = this.createElement(
        "p",
        ["product-preview-card__price"],
        showConvertPrice(product.price)
    );

    article.append(previewDiv, paragraphType, title, paragraphPrice);

    return article;
};

const cartParser = Object.create(ParserToHTML);

cartParser.convert = function (product) {
    const storage = this.createElement("div", [
        "product-added",
        "storage__product",
    ]);

    const container = this.createElement("div", ["product-added__container"]);

    const title = this.createElement(
        "p",
        ["product-added__title"],
        product.name
    );
    const content = this.createElement("div");

    [
        { class: "product-added__count-portions", value: `${1}x` },
        {
            class: "product-added__single-price",
            value: `@ ${showConvertPrice(product.price)}`,
        },
        {
            class: "product-added__total-price",
            value: showConvertPrice(product.price),
        },
    ].forEach((item) => {
        console.log(item.class, item.value);
        content.appendChild(
            this.createElement("span", [item.class], item.value)
        );
    });

    container.append(title, content);

    const buttonWrapper = this.createElement("div", [
        "product__button-wrapper",
    ]);

    const button = this.createElement("button", [
        "button",
        "button--remove-item",
        "product__button",
    ]);

    button.dataset.category = product.category;

    const img = this.createElement("img");
    img.src = "assets/images/icon-remove-item.svg";
    img.alt = `"Remove Product: ${product.name}`;
    button.appendChild(img);
    buttonWrapper.appendChild(button);

    storage.append(container, buttonWrapper);

    return storage;
};

const orderParser = Object.create(ParserToHTML);

orderParser.convert = function (cartProduct) {
    const article = this.createElement("article", ["order__product"]);
    const orderDetails = this.createElement("div", ["order__details"]);

    const img = this.createElement("img", ["order__img"]);
    img.src = cartProduct.product.image.thumbnail;
    img.alt = `Thumbnail of ${cartProduct.product.name}`;

    const orderData = this.createElement("div", ["order__data"]);

    const name = this.createElement(
        "h3",
        ["order__name"],
        cartProduct.product.name
    );

    const count = this.createElement(
        "span",
        ["order__count"],
        `${cartProduct.count}x`
    );

    const price = this.createElement(
        "span",
        ["order__price"],
        `@ ${showConvertPrice(cartProduct.product.price)}`
    );

    orderData.appendChild(name);
    orderData.appendChild(count);
    orderData.appendChild(price);

    orderDetails.appendChild(img);
    orderDetails.appendChild(orderData);

    const totalPrice = this.createElement(
        "span",
        ["order__total"],
        showConvertPrice(cartProduct.total)
    );

    article.appendChild(orderDetails);
    article.appendChild(totalPrice);

    return article;
};

export {
    productParser as ParserToHTMLProduct,
    cartParser as ParserToHTMLCart,
    orderParser as ParserToHTMLOrder,
};
