// find a data source
// const dataSource = "";

// parse out potential notes from that data
const dataDoubleColonCheck = elem => elem.includes('::');

const potentialMatches = dataSource.split('::');
// TODO:: need to make a function to apply to the filters below

// strings that match the best case scenario
const stringsBestCase = potentialMatches.filter(elem => elem.match(/^[0-9]{8}\n/g));
// strings that match a pattern that indicates notes before the newline
const stringsSideNotes = potentialMatches.filter(elem => elem.match(/^[0-9]{8}[^0-9\n].*/));

const stringsErrorDateTooFewDigits = potentialMatches.filter(elem => elem.match(/^[0-9]{1,7}[^0-9]/));
const stringsErrorDateTooManyDigits = potentialMatches.filter(elem => elem.match(/^[0-9]{9,}/));
const stringsErrorDateNoDigits = potentialMatches.filter(elem => !elem.match(/\d/g));

const stringsCheckedCorrect = stringsBestCase.concat(stringsSideNotes);
const stringsCheckedIncorrect = stringsErrorDateTooManyDigits.concat(stringsErrorDateTooFewDigits, stringsErrorDateNoDigits);

// basic check to see if input string follows the timestamp convention at all
if (!dataDoubleColonCheck(dataSource)) console.log("Input data does not seem to be formatted correctly.");

if (stringsCheckedIncorrect) console.log("Input data has incorrectly entered dates.");

// create arrays of note objects from correct matches
const arrayNoteObjects = stringsCheckedCorrect.map(elem => {		
		return {date: elem.slice(0,8), content: elem.slice(8,)};
	});

const arrayNoteObjectsSorted = arrayNoteObjects.slice().sort((a, b) => {
	if (a < b) return -1;
	if (b < a) return 1;
	return 0;
});

// create array of date objects for timeline
const noteToDate = elem => {return {date: elem.date, content: [elem]};};

const arrayDateObjectsToCombine = arrayNoteObjectsSorted.map(noteToDate);

let arrayDateObjects = [arrayDateObjectsToCombine[0],];

for (let i = 1; i < arrayDateObjectsToCombine.length; i++) {	
	if (arrayDateObjectsToCombine[i].date === arrayDateObjectsToCombine[i-1].date) {
		arrayDateObjectsToCombine[i-1].content.push(arrayDateObjectsToCombine[i]);
	} else {
		arrayDateObjects.push(arrayDateObjectsToCombine[i]);
	}
}



// interesting timeline facts
const countTimelineNotes = stringsCheckedCorrect.length;
const earliestEntry = arrayDateObjects[0];


// ask user about questionable areas

