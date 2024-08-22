export function getFontColorByBackgroundColor(hexColorValue) {
    if (!hexColorValue) {
        return '#606266';
    }

    const rgb = [
        parseInt('0x' + hexColorValue.slice(1, 3)),
        parseInt('0x' + hexColorValue.slice(3, 5)),
        parseInt('0x' + hexColorValue.slice(5, 7))
    ];
    const brightness = Math.round(((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000);
    return (brightness > 125) ? '#606266' : 'white';
}