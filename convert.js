const hexInput = document.getElementById("hex");
const rgbInput = document.getElementById("rgb");
const hslnput = document.getElementById("hsl");
const hex2rgb = document.getElementById("hex-to-rgb");
const hex2hsl = document.getElementById("hex-to-hsl");
const rgb2hex = document.getElementById("rgb-to-hex");
const rgb2hsl = document.getElementById("rgb-to-hsl");
const hsl2hex = document.getElementById("hsl-to-hex");
const hsl2rgb = document.getElementById("hsl-to-rgb");
const hexWarning = document.getElementById("hex-warning");
const rgbWarning = document.getElementById("rgb-warning");
const hslWarning = document.getElementById("hsl-warning");
const colorPreview = document.querySelector(".color-preview");
const hexConversion = document.getElementById("hex-conversion");
const rgbConversion = document.getElementById("rgb-conversion");
const shortRGBconversion = document.getElementById("short-rgb-conversion");
const hslConversion = document.getElementById("hsl-conversion");

// Hex conversion

	// hex to RGB:

function hexValidation(input) {
    const hexRegex = /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
    return hexRegex.test(input.trim());
}

hex2rgb.onclick = () => {
	var input = hexInput.value;
	if (input) {
		var validHex = hexValidation(input);
		if (validHex) {
			console.log("Entered hex value:", input);
			input.includes("#") ? colorPreview.style.background = input : colorPreview.style.background = `#${input}`;
			let hex;
			input.includes("#") ? hex = input.slice(1) : hex = input;
			const rgb = hexToRGB(hex);
			const shortenedRGB = hexToRGBsmall(hex);
			rgbConversion.style.display = "block";
			rgbConversion.innerText = rgb;
			shortRGBconversion.style.display = "block";
			shortRGBconversion.innerText = shortenedRGB;
			[ hexConversion, hslConversion ].forEach((text) => text.style.display = "none");
		} else {
			hexWarning.innerText = "Invalid hex value";
			setTimeout(() => { hexWarning.innerText = "" }, 2500 );
		}
	} else {
		hexWarning.innerText = "No input to convert";
		setTimeout(() => { hexWarning.innerText = "" }, 2500);
	}
}

function hexToRGB(hexVal) {
	// Expand shorthand form (#RGB → #RRGGBB)
	if (hexVal.length === 3) {
		hexVal = hexVal.split('').map(c => c + c).join('')
	}

	const r = parseInt(hexVal.substring(0, 2), 16);
	const g = parseInt(hexVal.substring(2, 4), 16);
	const b = parseInt(hexVal.substring(4, 6), 16);

	return `rgb(${r}, ${g}, ${b})`;
}

function hexToRGBsmall(hexVal) {
	// Expand shorthand form (#RGB → #RRGGBB)
	if (hexVal.length === 3) {
		hexVal = hexVal.split('').map(c => c + c).join('')
	}

	let r = parseInt(hexVal.substring(0, 2), 16);
	let g = parseInt(hexVal.substring(2, 4), 16);
	let b = parseInt(hexVal.substring(4, 6), 16);

	r = r / 255;
	g = g / 255;
	b = b / 255;
	
	r = Math.round(r * 20) / 20;
	g = Math.round(g * 20) / 20;
	b = Math.round(b * 20) / 20;

	return `rgb(${r}, ${g}, ${b})`;
}

    // Hex to HSL:

function hexToRGBObj(hexVal) {
    if (hexVal.length === 3) {
		hexVal = hexVal.split('').map(c => c + c).join('');
    }

    const r = parseInt(hexVal.slice(0, 2), 16);
    const g = parseInt(hexVal.slice(2, 4), 16);
    const b = parseInt(hexVal.slice(4, 6), 16);

    return { r, g, b };
}

function rgbToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
		h = s = 0; // achromatic (gray)
    } else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
		switch(max) {
		    case r:
				h = ((g - b) / d + (g < b ? 6 : 0));
			break;
		    case g:
				h = ((b - r) / d + 2);
			break;
		    case b:
				h = ((r - g) / d + 4);
			break;
		}

		h *= 60;
    }

  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function hexToHSL(hex) {
	const { r, g, b } = hexToRGBObj(hex);
	return rgbToHSL(r, g, b);
}

hex2hsl.onclick = () => {
	let input = hexInput.value.trim().replace(/^#/, '');
	
	if (input) {
		if (hexValidation(input)) {
			const hsl = hexToHSL(input);
			colorPreview.style.background = `#${input}`;
			hslConversion.style.display = "block";
			hslConversion.innerText = hsl;
			[ rgbConversion, shortRGBconversion ].forEach((text) => text.style.display = "none");
		} else {
			hexWarning.innerText = "Invalid hex value";
			setTimeout(() => hexWarning.innerText = "", 2500);
		} 
	} else {
		hexWarning.innerText = "No input to convert";
		setTimeout(() => { hexWarning.innerText = "" }, 2500);
	}
    
}

// RGB conversion

    // RGB to hex:

function parseRGB(input) {
    const rgbRegex = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)/i;
    const match = input.match(rgbRegex);

    if (!match) return null;

    return {
		r: parseInt(match[1]),
		g: parseInt(match[2]),
		b: parseInt(match[3])
    };
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

rgb2hex.onclick = () => {
    const input = rgbInput.value.trim();
    const parsed = parseRGB(input);

	if (input) {
		if (parsed) {
			const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
			colorPreview.style.background = hex;
			hexConversion.style.display = "block";
			hexConversion.innerText = hex;
			[ rgbConversion, shortRGBconversion, hslConversion ].forEach((text) => text.style.display = "none");
		} else {
			rgbWarning.innerText = "Invalid RGB(A) value";
			setTimeout(() => rgbWarning.innerText = "", 2500);
		}
	} else {
		rgbWarning.innerText = "No input to convert";
		setTimeout(() => { rgbWarning.innerText = "" }, 2500);
	}
};

    // RGB to HSL:

function rgbToHSL(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h, s, l;
	l = (max + min) / 2;

	if (delta === 0) {
		h = 0;
		s = 0;
	} else {
		s = delta / (1 - Math.abs(2 * l - 1));

		switch (max) {
		    case r:
				h = ((g - b) / delta) % 6;
			break;
		    case g:
				h = (b - r) / delta + 2;
			break;
		    case b:
				h = (r - g) / delta + 4;
			break;
	    }

		h *= 60;
		if (h < 0) h += 360;
    }
	
	h = Math.round(h);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

rgb2hsl.onclick = () => {
    const input = rgbInput.value.trim();
    const parsed = parseRGB(input);

	if (input) {
		if (parsed) {
			const hsl = rgbToHSL(parsed.r, parsed.g, parsed.b);
			colorPreview.style.background = hsl;
			hslConversion.style.display = "block";
			hslConversion.innerText = hsl;
			[ hexConversion, rgbConversion, shortRGBconversion ].forEach((text) => text.style.display = "none");
		} else {
			rgbWarning.innerText = "Invalid RGB(A) value";
			setTimeout(() => rgbWarning.innerText = "", 2500);
		}
	} else {
		rgbWarning.innerText = "No input to convert";
		setTimeout(() => { rgbWarning.innerText = "" }, 2500);
	}
};

// HSL conversion

	// HSL to hex:

function parseHSL(input) {
	const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
	const match = input.trim().match(hslRegex);
	if (!match) return null;
	return {
		h: Number(match[1]),
		s: Number(match[2]) / 100,
		l: Number(match[3]) / 100
	};
}


function hslToRGB(h, s, l) {
	// 1 - Compute chroma
	const c = (1 - Math.abs(2 * l - 1)) * s;
	// 2 - Find second largest component
	const x = c * (1 - Math.abs((h / 60) % 2 - 1));
	// 3 - Match to hue sector
	let [r1, g1, b1] = [0, 0, 0];
	if (h < 60)       [r1, g1, b1] = [c, x, 0];
	else if (h < 120) [r1, g1, b1] = [x, c, 0];
	else if (h < 180) [r1, g1, b1] = [0, c, x];
	else if (h < 240) [r1, g1, b1] = [0, x, c];
	else if (h < 300) [r1, g1, b1] = [x, 0, c];
	else              [r1, g1, b1] = [c, 0, x];
	// 4 - Add match lightness
	const m = l - c / 2;
	const r = Math.round((r1 + m) * 255) - 1;
	const g = Math.round((g1 + m) * 255) - 1;
	const b = Math.round((b1 + m) * 255) - 1;
	return { r, g, b };
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

hsl2hex.onclick = () => {
	const input = hslnput.value;    
	const parsed = parseHSL(input);

	if (input) {
		if (!parsed) {
			hslWarning.textContent = 'Invalid HSL format';
			setTimeout(() => hslWarning.textContent = '', 2500);
			return;
		}
	} else {
		hslWarning.innerText = "No input to convert";
		setTimeout(() => { hslWarning.innerText = "" }, 2500);
	}

	const { r, g, b } = hslToRGB(parsed.h, parsed.s, parsed.l);
	const hex = rgbToHex(r, g, b);
	colorPreview.style.background = hex;
	hexConversion.style.display = "block";
	hexConversion.innerText = hex;
	[ rgbConversion, shortRGBconversion, hslConversion ].forEach((text) => text.style.display = "none");
};

	// HSL to RGB:
	
function rgbToRGBsmall(r, g, b) {
	r = r / 255;
	g = g / 255;
	b = b / 255;
	
	r = Math.round(r * 20) / 20;
	g = Math.round(g * 20) / 20;
	b = Math.round(b * 20) / 20;
	
	return `rgb(${r}, ${g}, ${b})`;
}

hsl2rgb.onclick = () => {
	const input = hslnput.value.trim();
	const parsed = parseHSL(input);

	if (input) {
		if (!parsed) {
			hslWarning.textContent = 'Invalid HSL format';
			setTimeout(() => hslWarning.textContent = '', 2500);
			return;
		}
	} else {
		hslWarning.innerText = "No input to convert";
		setTimeout(() => { hslWarning.innerText = "" }, 2500);
	}

	const { r, g, b } = hslToRGB(parsed.h, parsed.s, parsed.l);
	const rgbStr = `rgb(${r}, ${g}, ${b})`;
	const shortenedRGB = rgbToRGBsmall(Number(r), Number(g), Number(b));
	colorPreview.style.background = rgbStr;
	rgbConversion.style.display = "block";
	rgbConversion.innerText = rgbStr;
	shortRGBconversion.style.display = "block";
	shortRGBconversion.innerText = shortenedRGB;
	[ hexConversion, hslConversion ].forEach((text) => text.style.display = "none");
};

// Copying

[ hexConversion, rgbConversion, shortRGBconversion, hslConversion ].forEach((text) => text.onclick = () => {
	navigator.clipboard.writeText(text.textContent)
		.then(() => { 
			console.log(`Copied ${text.textContent} to clipboard`);
			alert("Value copied to cilpboard");
		}).catch(err => { 
			console.error("Failed to copy text: ", err);
			alert("Failed to copy the value");
		});	
} );
