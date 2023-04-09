function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function int2hex(i: number) {
    let m = i % 1000000;
    return (
        '#' +
        componentToHex(Math.floor(i / 1000000)) +
        componentToHex(Math.floor(m / 1000)) +
        componentToHex(Math.floor(m % 1000))
    );
}

function hex2int(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? parseInt(result[1], 16) * 1000000 +
              parseInt(result[2], 16) * 1000 +
              parseInt(result[3], 16)
        : null;
}

export { componentToHex, int2hex, hex2int };
