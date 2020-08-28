// find a data source
const dataSource =
  '::20200827\nBad Moves\nUntenable\n::20200827\nSank Into The Sun::20200101\nNew Year!::20190827\nNext year, listen to Bad Moves::20200827\nMade an additional commit to the repo.::20200824 this is a git note\nMade an initial commit to the repo.::202003\nThis one is wrong!\n::19991231\nY2k bugs! Yikes!\n::19991110\nKiernan Shipka\'s birthday::20150407\n"Ivy Tripp" is released, according to Bandcamp.com';

// parse out potential notes from that data
const dataDoubleColonCheck = (elem) => elem.includes("::");
// prepare for sending to HTML
const newlineToBreakTag = (string) => string.replace(/\n/g, "<br>");
const removeLeadingNewline = (string) => string.slice(1);

const potentialMatches = dataSource.split("::");
// TODO:: need to make a function to apply to the filters below

// strings that match the best case scenario
const stringsBestCase = potentialMatches.filter((elem) =>
  elem.match(/^[0-9]{8}\n/g)
);
// strings that match a pattern that indicates notes before the newline
const stringsSideNotes = potentialMatches.filter((elem) =>
  elem.match(/^[0-9]{8}[^0-9\n].*/)
);

// strings that do not match the date pattern, they don't have enough digits
const stringsErrorDateTooFewDigits = potentialMatches.filter((elem) =>
  elem.match(/^[0-9]{1,7}[^0-9]/)
);

// strings that do not match the date pattern, they have too many digits
const stringsErrorDateTooManyDigits = potentialMatches.filter((elem) =>
  elem.match(/^[0-9]{9,}/)
);

// strings that do not match the date pattern, no digits at all!
const stringsErrorDateNoDigits = potentialMatches.filter(
  (elem) => !elem.match(/\d/g)
);

// these are all strings that came back with dates correctly formatted
// const stringsCheckedCorrect = stringsBestCase.concat(stringsSideNotes);
// these are all strings that came back with date formatting errors
const stringsCheckedIncorrect = stringsErrorDateTooManyDigits.concat(
  stringsErrorDateTooFewDigits,
  stringsErrorDateNoDigits
);

// basic check to see if input string follows the timestamp convention at all
if (!dataDoubleColonCheck(dataSource))
  console.log("Input data does not seem to be formatted correctly.");

// logging note about possible incorrectly entered dates
if (stringsCheckedIncorrect)
  console.log("Input data has incorrectly entered dates.");

// create arrays of note objects from correct matches
const arrayNoteObjects = stringsBestCase
  .map((elem) => {
    return { date: elem.slice(0, 8), content: elem.slice(8) };
  })
  .concat(
    stringsSideNotes.map((elem) => {
      return {
        date: elem.slice(0, 8),
        sidenote: elem.slice(8, elem.indexOf("\n")),
        content: elem.slice(elem.indexOf("\n")),
      };
    })
  );
// an array of the Note Objects sorted by date ascending
const arrayNoteObjectsSorted = arrayNoteObjects.slice().sort((a, b) => {
  if (a.date < b.date) return -1;
  if (b.date < a.date) return 1;
  return 0;
});

// create array of date objects from an array of note objects
const noteToDate = (elem) => {
  return { date: elem.date, content: [elem] };
};

const combineSameDates = (arr) => {
  let newArr = [arr[0]];
  for (var n = 1; n < arr.length; n++) {
    if (arr[n].date !== arr[n - 1].date) {
      newArr.push(arr[n]);
    } else {
      newArr[newArr.length - 1].content.push(arr[n].content[0]);
    }
  }
  return newArr;
};

// take the sorted list of Note Objects and return a sorted list of Date Objects (sorted by date)
// dates with multiple note objects contain those note objects in the content array
const arrayDateObjects = combineSameDates(
  arrayNoteObjectsSorted.map(noteToDate)
);

// find first and last year in the sorted ascending array of Date Objects
const firstYear = arrayDateObjects[0].date.slice(0, 4);
const lastYear = arrayDateObjects[arrayDateObjects.length - 1].date.slice(0, 4);

const createArrayYears = () => {
  let array = [];
  for (var i = 0; i <= lastYear - firstYear; i++) {
    var yearString = (new Number(firstYear) + i).toString();
    var regex = new RegExp("^" + yearString);
    array.push(arrayDateObjects.filter((x) => x.date.match(regex)));
  }
  return array;
};

const populateYear = (arr) => {
  if (arr.length > 0) {
    var yearString = arr[0].date.slice(0, 4);
    document
      .getElementById("outputSpace")
      .insertAdjacentHTML(
        "beforeend",
        `<h2 id='header-${yearString}'>${yearString}</h2><div id='div-${yearString}'></div>`
      );
    arr.forEach((elem) => {
      var elemDate = elem.date;
      var elemContent = elem.content.map((n) => {
        return n.sidenote
          ? `<h4>${n.sidenote}</h4><p>${removeLeadingNewline(n.content)}</p>`
          : "<p>" + removeLeadingNewline(n.content) + "</p>";
      });
      document
        .getElementById("div-" + yearString)
        .insertAdjacentHTML(
          "beforeend",
          newlineToBreakTag(
            `<h3 id="header-${elemDate}">${elemDate}</h3>${elemContent.join(
              "<hr>"
            )}`
          )
        );
    });
  }
};

const arrayYears = createArrayYears();

document.body.onload = arrayYears.forEach((y) => {
  populateYear(y);
});

// interesting timeline facts
// const countTimelineNotes = stringsCheckedCorrect.length;
// const earliestEntry = arrayDateObjects[0];

// ask user about questionable areas

// const now = moment();
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("nowTime").innerHTML = now.format();
// });
