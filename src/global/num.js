export function num(sum, type = null) {
  sum = parseFloat(Number(sum));

  if (isNaN(sum) || sum === 0) {
    return "0";
  }

  if (!type) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor(Math.log10(sum) / 3);
    let shortValue = sum / Math.pow(1000, suffixNum);

    if (sum < 1000) {
      return sum.toFixed(0);
    } else {
      shortValue = shortValue.toFixed(2);
      // Удаляем нули после запятой, если они есть
      shortValue = shortValue.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    }

    return `${shortValue}${suffixes[suffixNum]}`;
  } else {
    sum = sum.toFixed(1);
    return parseFloat(sum).toLocaleString("de-DE");
  }
}
