function showConvertPrice(number) {
    return number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}

export { showConvertPrice };
