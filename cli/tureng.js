var Tureng = require("../main.js");
var Table = require('cli-table2');
var readline = require('readline');
var colors = require('colors');
var word = "";
var lang = "";
var container = [];
var onetime = false
for(let i=2; i<process.argv.length; i++) {
    if (i==2) {
        lang = process.argv[i]
    } else {
        word += process.argv[i] + " "
    }
}
word = word.substring(0, word.length-1)
if (word.length > 1) {
  onetime = true
	translate(word, lang)
} else {
	process.stdout.write("> ")
	var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});
	rl.on('line', function(str) {
		if(str == ".exit") {
			process.exit();
		} else if (str.indexOf(".lang ") > -1) {
			lang = str.replace(".lang ", "")
			console.log("Language is " + (lang == "entr" ? "English-Turkish." : (lang == "ende" ? "English-German." : "not defined. Please change it 'entr' or 'ende'.")))
			process.stdout.write("> ");
    } else if (str.indexOf(".") == 0 && Number(str.substring(1, str.length)) !== NaN && container.length > 0 && str.substring(1, str.length) > 0 && str.substring(1, str.length) <= container.length) {
      translate(container[str.substring(1, str.length)-1], lang);
		} else {
			translate(str, lang);
		}

	});
}
function translate(word, lang) {
  let kelime = new Tureng(word, lang);
  kelime.Translate(function(data) {

      if (lang == "entr") {
          if (data.Situation.IsFound == true) {
              var tableENTR = new Table({head: (data.IsEn2Tr == 1 ? ["English", "Turkish"] : ["Turkish", "English"])})
              data.Translations.forEach((datax) => {
                  tableENTR.push([datax[Object.keys(datax)[0]], datax[Object.keys(datax)[1]]]);
              });
              console.log(tableENTR.toString());
              if (onetime == false) {process.stdout.write("> ");}
           } else {
               if (data.Situation.Suggestion == true) {
                  console.log("No match found but suggestions found.".red);
                  console.log('Suggestions:'.green);
                  for (let i=0; i < data.Suggestions.length; i++) {
                    console.log(colors.inverse(i+1) + " " + data.Suggestions[i]);
                  }
                  container = data.Suggestions
  				        if (onetime == false) {process.stdout.write("> ");}
               } else {
                  console.log("No match found unfortunately no suggestions found to.".red)
  				        if (onetime == false) {process.stdout.write("> ");}
               }
           }
      } else if (lang == "ende"){
          if (data.Situation.IsFound == true) {
              if (data.Language==="English" || data.Language==="Both") {
                  var tableEn2De = new Table({head: ["English", "German"]})
                  data.Translations.En2De.forEach(function(datax) {
                      if(datax.IsSlang==true) {
                        tableEn2De.push([colors.yellow(datax.TermENG), colors.yellow(datax.TermDE)]);
                      } else {
                        tableEn2De.push([datax.TermENG, datax.TermDE]);
                      }
                  });
                  console.log(tableEn2De.toString());
          				if (onetime == false) {process.stdout.write("> ");}
              }
              if (data.Language==="German" || data.Language==="Both") {
                  var tableDe2En = new Table({head: ["German", "English"]})
                  data.Translations.De2En.forEach(function(datax) {
                    if(datax.IsSlang==true) {
                      tableDe2En.push([colors.yellow(datax.TermDE), colors.yellow(datax.TermENG)]);
                    } else {
                      tableDe2En.push([datax.TermDE, datax.TermENG]);
                    }
                  });
                  console.log(tableDe2En.toString());
  				        if (onetime == false) {process.stdout.write("> ");}
              }
          } else {
              if (data.Situation.Suggestion == true) {
                  console.log("No match found but suggestions found.".red);
                  console.log('Suggestions:'.green);
                  for (let i=0; i < data.Suggestions.length; i++) {
                    console.log(colors.inverse(i+1) + " " + data.Suggestions[i]);
                  }
                  container = data.Suggestions
                  if (onetime == false) {process.stdout.write("> ");}
              } else {
                  console.log("No match found unfortunately no suggestions found to.")
  				        if (onetime == false) {process.stdout.write("> ");}
              }
          }
      } else {
          console.log("Language is not defined. Please change it 'entr' or 'ende'.")
      		if (onetime == false) {process.stdout.write("> ");}
  	}
  });
}
