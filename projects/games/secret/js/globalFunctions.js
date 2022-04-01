function randomRange(min, max, signed = 0) {
    let random = Math.random() * (max - min) + min;
    if (signed) {
        let sRandom = Math.random() * 50;
        if (sRandom < 25) {
            random *= -1;
        }
    }
    return random;
}
function randomArrayIndex(array) {
    let max = array.length - 1;
    let index = randomRange(0, max);
    return Math.floor(index);
}