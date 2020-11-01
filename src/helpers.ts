export default {
  getAvatarChars(name: string): string {
    const arrTempo = name.split(" ");
    let ret;
    switch (arrTempo.length) {
      case 1:
        ret = arrTempo[0].slice(0, 2);
        break;
      case 2:
        ret = arrTempo[0].slice(0, 1) + "" + arrTempo[1].slice(0, 1);
        break;
      default:
        ret = arrTempo[0].slice(0, 1) + "" + arrTempo[2].slice(0, 1);
    }
    return ret.toUpperCase();
  },
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
  getCompensation(compensation: any, periodicity: string): string {
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
  },
  getUserJobInterestRate(data: any): any {
    const jobs: any = data;
    const response = {
      rate: "",
      periodicity: "",
      currency: "",
      message: "noData"
    };
    if (jobs) {
      const isActive = jobs.find((x: any) => x.field === "active");
      // is the user looking for a job?
      if (isActive && isActive.data) {
        const isVisible = jobs.find(
          (x: any) => x.field === "desirable-compensation-publicly-visible"
        );
        if (isVisible && !isVisible.date) {
          
          const periodicity = jobs.find((x: any) => x.field === "desirable-compensation-periodicity");
          const rate = jobs.find((x: any) => x.field === "desirable-compensation-amount");
          const currency = jobs.find((x: any) => x.field === "desirable-compensation-currency");
          
          if (periodicity){
            response.periodicity = periodicity.data;
          }
          if (currency){
            response.currency = currency.data;
          }
          if (rate){
            response.rate = this.toCurrency (rate.data, response.currency);
          }
        } else {
          response.message = "privateData";
        }
      }
    }
    return response;
  }
};
