// Create a formatter for PKR
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
export default formatCurrency;