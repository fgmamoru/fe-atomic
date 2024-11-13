const formatter = new Intl.NumberFormat(undefined, {
  // style: 'currency',
  // currency: 'USD',
  minimumFractionDigits: 2,

})

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 2
})

export const formatCryptoAmountAbbr = (amount: number | string) => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  if (amount < 1000) {
    return amount.toFixed(2);
  } else if (amount < 1000000) {
    return (amount / 1000).toFixed(2) + "K";
  } else if (amount < 1000000000) {
    return (amount / 1000000).toFixed(2) + "M";
  } else {
    return (amount / 1000000000).toFixed(2) + "B";
  }
}

export const abbreviateNumber = (value: number, precision: number = 0) => {
  let newValue = value;
  let suffix = "";
  if (value >= 1000) {
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }
    suffix = suffixes[suffixNum];
  }
  return newValue.toFixed(precision) + suffix;
}

export const formatCryptoAmount = (amount: number) => {
  return formatter.format(amount);
}

export const formatPercent = (amount: number) => {
  return percentFormatter.format(amount);
}

export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  if (!navigator.userAgent) return false;
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}