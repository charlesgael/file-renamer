const fs = require("fs");
const yargs = require("yargs");
const package = require("../package.json");
const svg2png = require("svg2img");
const toIco = require("to-ico");
const { convert: toIcns } = require("@fiahfy/icns-convert");

const args = yargs
    .option("icon", {
        alias: "i",
        description: "Input icon",
        type: "string",
        default: "icon.svg"
    })
    .help()
    .alias("help", "h").argv;

if (!fs.existsSync(args.icon)) {
    console.error(`No such file '${args.icon}'`);
    process.exit(1);
}

function mkdirp(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
}

const resDir =
    (package && package.build && package.build.directories && package.build.directories.buildResources) || "build";
mkdirp(resDir);

// PNG icons
const iconsDir = `${resDir}/icons`;
mkdirp(iconsDir);

function convertPng(svgString, size, filename) {
    return new Promise((resolve, reject) => {
        const outputBuffer = svg2png(svgString, { width: size, height: size }, function(err, buffer) {
            if (err) reject(err);
            else {
                fs.writeFileSync(filename, buffer);
                resolve(buffer);
            }
        });
    });
}

const svg = fs.readFileSync(args.icon);

Promise.all(
    [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024].map(it => convertPng(svg, it, `${iconsDir}/${it}x${it}.png`))
).then(all => {
    const icons = {
        16: all.shift(),
        24: all.shift(),
        32: all.shift(),
        48: all.shift(),
        64: all.shift(),
        96: all.shift(),
        128: all.shift(),
        256: all.shift(),
        512: all.shift(),
        1024: all.shift()
    };
    fs.writeFileSync(`${resDir}/icon.png`, icons[256]);

    // ICO icon
    toIco([icons[16], icons[24], icons[32], icons[48], icons[64], icons[128], icons[256]]).then(buf => {
        fs.writeFileSync(`${resDir}/icon.ico`, buf);
    });

    // ICNS icon
    toIcns([icons[16], icons[32], icons[48], icons[64], icons[128], icons[256], icons[512], icons[1024]]).then(buf => {
        fs.writeFileSync(`${resDir}/icon.icns`, buf);
    });
});
