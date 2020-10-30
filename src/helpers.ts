export default {
  toCurrency(value: any, currency: string): string {
    const currencies = [
      { name: "COP$", locale: "es-CO", currency: "COP" },
      { name: "USD$", locale: "en-US", currency: "USD" },
      { name: "EUR€", locale: "en-EN", currency: "EUR" },
      { name: "BRLR$", locale: "pt-BR", currency: "BRL" }
    ];
    let myLocale = currencies[0];
    currencies.forEach(k => {
      if (k.name === currency) {
        myLocale = k;
        return true;
      }
    });
    
    if (typeof value !== "number") {
      return value;
    }
    const formatter = new Intl.NumberFormat(myLocale.locale, {
      style: "currency",
      currency: myLocale.currency,
      minimumFractionDigits: 0
    });
    return formatter.format(value);
  },
  getCompensation( compensation: any, periodicity: string ): string {
    let ret = "";
    if (compensation) {
    if (compensation.code === "range" && compensation.periodicity) {
      ret = `${periodicity} (${compensation.currency.replace("$", "")}) 
      ${this.toCurrency(compensation.minAmount, compensation.currency)} - 
      ${this.toCurrency(compensation.maxAmount, compensation.currency)}`;
    }
    if (compensation.code === "fixed" && compensation.periodicity) {
      ret = `${periodicity} (${compensation.currency.replace("$", "")}) 
      ${this.toCurrency(compensation.minAmount, compensation.currency)}`;
    }
  }
  return ret;
}
};
