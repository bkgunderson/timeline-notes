// find a data source
const dataSource =
  "::20200827\nBad Moves\nUntenable\n::20200827\nSank Into The Sun::20200101\nNew Year!::20190827\nNext year, listen to Bad Moves::20200827\nMade an additional commit to the repo.::20200824\nMade an initial commit to the repo.::202003\nThis one is wrong!";

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
const stringsCheckedCorrect = stringsBestCase.concat(stringsSideNotes);
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
const arrayNoteObjects = stringsCheckedCorrect.map((elem) => {
  return { date: elem.slice(0, 8), content: elem.slice(8) };
});
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

// make an array of Year Objects to replace all this
const dates2011 = arrayDateObjects.filter((x) => x.date.match(/^2011/));
const dates2012 = arrayDateObjects.filter((x) => x.date.match(/^2012/));
const dates2013 = arrayDateObjects.filter((x) => x.date.match(/^2013/));
const dates2014 = arrayDateObjects.filter((x) => x.date.match(/^2014/));
const dates2015 = arrayDateObjects.filter((x) => x.date.match(/^2015/));
const dates2016 = arrayDateObjects.filter((x) => x.date.match(/^2016/));
const dates2017 = arrayDateObjects.filter((x) => x.date.match(/^2017/));
const dates2018 = arrayDateObjects.filter((x) => x.date.match(/^2018/));
const dates2019 = arrayDateObjects.filter((x) => x.date.match(/^2019/));
const dates2020 = arrayDateObjects.filter((x) => x.date.match(/^2020/));

const arrayYears = [
  dates2011,
  dates2012,
  dates2013,
  dates2014,
  dates2015,
  dates2016,
  dates2017,
  dates2018,
  dates2019,
  dates2020,
];

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
      var elemContent = elem.content.map(
        (n) => "<p>" + removeLeadingNewline(n.content) + "</p>"
      );
      document
        .getElementById("div-" + yearString)
        .insertAdjacentHTML(
          "beforeend",
          newlineToBreakTag(`<h3>${elemDate}</h3>${elemContent.join("<hr>")}`)
        );
    });
  }
};

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
