export const formatInputAmount = (amount: string) => {
    const formatted = amount
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.')
        .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
        .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

    return formatted;
}