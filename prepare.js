let copyfiles = require("copyfiles");

copyfiles([
	"node_modules/font-awesome/css/font-awesome.css",
	"node_modules/font-awesome/css/font-awesome.css.map",
	"node_modules/font-awesome/css/font-awesome.min.css",
	"public/themes/pluto/vendors/css"
], true, () => {
	console.log("Skopiowano arkusze stylów.");
});

copyfiles([
	"node_modules/font-awesome/fonts/FontAwesome.otf",
	"node_modules/font-awesome/fonts/fontawesome-webfont.eot",
	"node_modules/font-awesome/fonts/fontawesome-webfont.svg",
	"node_modules/font-awesome/fonts/fontawesome-webfont.ttf",
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff",
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff2",
	"public/themes/pluto/vendors/fonts"
], true, () => {
	console.log("Skopiowano czcionki.");
});

copyfiles([
	"public/themes/pluto/vendors/js"
], true, () => {
	console.log("Skopiowano skrytpy.");
});
