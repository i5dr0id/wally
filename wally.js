#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const timer = parseInt(process.argv[2]);
const argPath = path.normalize(process.argv[3].toString() + '/'); //get and normalize path to photos

const picture_ext = ['.jpeg', '.jpg', '.png']; //filters, as much as you want
const period = 1000 * timer; // 60 seconds(1 min)
let arr = []; // container to hold image names
let next = 0;

//lets load file from directory and filter for images
fs.readdir(argPath,(err, files) => {
	if(err){return console.log(err);}

files.forEach((file) => {
	for(let ext of picture_ext) {
		if(path.extname(file) === ext) {
			if(file.includes(' ') != true) {arr.push(file);}
		}
		}
});

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 **/
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
shuffleArray(arr);

//function to set wallpaper
const main = () => {
	let current = arr[next++];

	// when array list max-Out
	if (current === undefined) {
		next = 0;
		current = arr[next++];
	}
	const puts = (error, stdout, stderr) => { /* sys.puts(stdout) */ }
	exec("gsettings set org.gnome.desktop.background picture-uri file://" + argPath + current, puts);
}

main();

//interval
setInterval(main, period);

});