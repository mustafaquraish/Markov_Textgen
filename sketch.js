var drop;
var btn;
var seed;
var filename;
var text;
var markov;


var ordersl;
var sizein;
var order;
var size;

function setup() {
  noCanvas(0);

  ordsl = select('#ordsl');
  ordsl.input(() => {
    ord = ordsl.value();

    if (ord >= 10) select('#ordval').html(ord);
    else select('#ordval').html("0"+ord)
  });

  sizein = select('#size');
  sizein.input(() => {
    size = floor(sizein.value());
  });

  order = 10;
  size = 200;

  drop = select('#drop');
  drop.dragOver(highlight);
  drop.dragLeave(unhighlight);
  drop.drop(gotFile, unhighlight);

  let bd = select('body');
  bd.drop(() => {});

  filename = select("#filename");

  seed = select("#seed");

  btn = createButton('Generate');
  btn.style('height','24pt');
  btn.style('width','');
  btn.mousePressed(generate);

  text = createP("");

}

function createMarkov(file) {
  markov = {};

  for (let i = 0; i < file.length; i++) {
    if (file[i] == '\n') file = file.substring(0,i) + " " + file.substring(i+1);
  }

  for (let i = 0; i < file.length - order; i++) {
    let v = file.substring(i,i+order);
    if (!markov[v]) markov[v] = [];
    markov[v].push(file[i+order]);
  }
}

function generate() {

  if (!markov) {
    text.html("Load a file first!");
    return;
  }

  let start = "";
  if (seed.value() == "") start = Object.keys(markov)[0];
  else if (!markov[seed.value()]) text.html("Invalid Seed." +
      "\n Leave blank to use default");
  else start = seed.value();

  for (let i = 0; i < size - order; i++) {
      x = start.substring(start.length-order);
      let nl = markov[x];
      if (!nl) return start;
      let next = nl[Math.floor(Math.random() * nl.length)];
      if (!next) return start;
      start = start+next;
  }
  text.html(start);
}

function gotFile(file) {
  let spl = file.name.split('.');
  let ext = spl[spl.length -1];
  if (ext == 'txt' || ext == 'js') createMarkov(""+file.data);
  filename.html(file.name + " loaded with order "+order);
}

function highlight() {
  drop.style('background-color','#ccc');
}

function unhighlight() {
  drop.style('background-color','#fff');
}
