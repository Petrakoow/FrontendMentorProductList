import { showConvertPrice } from "./auxiliary.js";

const OrderUIManager = {
    init(orderElement, orderResultPrice) {
        this.orderElement = orderElement;
        this.orderResultPrice = orderResultPrice;
        return this;
    },

    setTotalPrice(value){
        this.orderResultPrice.textContent = showConvertPrice(value); 
    },

    toggleOrderInfo(flag) {        
        this.orderElement.classList.toggle('hide', !flag);
    }
};

export { OrderUIManager };
