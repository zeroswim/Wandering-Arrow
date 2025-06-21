const euclideanDistance = (t, s) => Math.sqrt(t.reduce((t, e, i) => t + Math.pow(e - s[i], 2), 0));









class Calibrator {

static PRECISION_LIMIT = 50;

static PRECISION_STEP = 10;

static ACCEPTANCE_RADIUS = 500;









constructor(t = 1e3) {

this.X = [];

this.__tmp_X = [];

this.Y_y = [];

this.Y_x = [];

this.__tmp_Y_y = [];

this.__tmp_Y_x = [];

this.reg = null;

this.reg_x = null;

this.reg_y = null;

this.currentAlgorithm = "MLR";

this.fitted = false;

this.cvNotSet = true;

this.matrix = new CalibrationMatrix;

this.precisionLimit = Calibrator.PRECISION_LIMIT;

this.precisionStep = Calibrator.PRECISION_STEP;

this.acceptanceRadius = Math.floor(t / 2);

this.calibrationRadius = Math.floor(t);

}









add(t, e) {

t = [].concat(t.flat());

this.__tmp_X.push(t);

this.__tmp_Y_y.push([e[0]]);

this.__tmp_Y_x.push([e[1]]);

if (40 < this.__tmp_Y_y.length) {

this.__tmp_Y_y.shift();

this.__tmp_Y_x.shift();

this.__tmp_X.shift();

}

console.log(ML);

this.reg_x = new ML.MultivariateLinearRegression([].concat(this.__tmp_X, this.X), [].concat(this.__tmp_Y_y, this.Y_y));

this.reg_y = new ML.MultivariateLinearRegression([].concat(this.__tmp_X, this.X), [].concat(this.__tmp_Y_x, this.Y_x));

this.fitted = true;

}









predict(t) {

return this.fitted ? (t = [].concat(t.flat()), [this.reg_x.predict(t)[0], this.reg_y.predict(t)[0]]) : [0, 0];

}









movePoint() {

this.matrix.movePoint();

this.Y_y = this.Y_y.concat(this.__tmp_Y_y);

this.Y_x = this.Y_x.concat(this.__tmp_Y_x);

this.X = this.X.concat(this.__tmp_X);

this.__tmp_X = [];

this.__tmp_Y_y = [];

this.__tmp_Y_x = [];

}









getCurrentPoint(t = 1, e = 1) {

return this.matrix.getCurrentPoint(t, e);

}









updMatrix(t) {

return this.matrix.updMatrix(t);

}









unfit() {

this.acceptanceRadius = Calibrator.ACCEPTANCE_RADIUS;

this.calibrationRadius = this.calibrationRadius;

this.fitted = false;

this.Y_y = [];

this.Y_x = [];

this.X = [];

}

}









class CalibrationMatrix {

constructor() {

this.iterator = 0;

this.points = [[.25, .25], [.99, .75], [1, .5], [.75, .5], [0, .75], [.5, .5], [1, .25], [.75, 0], [.25, .5], [.5, 0], [0, .5], [1, 1], [.75, 1], [.25, 0], [1, 0], [0, 1], [.25, 1], [.75, .75], [.5, .25], [0, .25], [1, .5], [.75, .25], [.5, 1], [.25, .75], [0, 0]];

}









updMatrix(t) {

this.points = t;

this.iterator = 0;

}









movePoint() {

this.iterator = (this.iterator + 1) % this.points.length;

}









getCurrentPoint(t = 1, e = 1) {

var i = this.points[this.iterator];

return [i[0] * t, i[1] * e];

}

}









class EyeGestures {

constructor(t, e) {

var i = document.createElement("div");

i.id = "cursor";

i.style.display = "None";

document.body.appendChild(i);

var s = document.createElement("div");

s.id = "calib_cursor";

s.style.display = "None";

var a = document.createElement("div");

a.style.width = "200px";

a.style.height = "60px";

a.style.position = "fixed";

a.style.bottom = "10px";

a.style.right = "10px";

a.style.zIndex = "9999";

a.style.background = "black";

a.style.borderRadius = "10px";

a.style.display = "none";

a.onclick = function () {

window.location.href = "https://eyegestures.com/";

};

var r = document.createElement("div");

r.style.margin = "10px";

s.appendChild(r);

var n = document.createElement("canvas");

n.id = "output_canvas";

n.width = "0";

n.height = "0";

n.style.margin = "0px";

n.style.borderRadius = "00px";

n.style.border = "none";

n.style.background = "none";

s.appendChild(n);

document.body.appendChild(s);

document.body.appendChild(i);

this.calibrator = new Calibrator;

this.screen_width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

this.screen_height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

this.prev_calib = [0, 0];

this.head_starting_pos = [0, 0];

this.calib_counter = 0;

this.calib_max = 25;

this.calibMessages = [

" ",

"While the internet",

"is open for anyone",

"to access",

"a vast repository of information,",

"the possibility of access",

"does not guarantee",

"diversity of exposure.",

"Algorithms repeatedly",

"reproduce a world",

"that coerces users",

"toward pinpoint accuracy,",

"intricately tuning",

"the lives of each individual.",

"An overly personalized information environment is",

"creating a predictable",

"and closed digital world.",

"Unexpected discoveries",

"serendipity",

"happen in uncertain drifting.",

"The wandering moment",

"nullifies",

"the structure of information",

"seeking dominated",

"by algorithms.",




];

this.counter = 0;

this.collected_points = 0;

this.buffor = [];

this.buffor_max = 22;

this.start_width = 0;

this.start_height = 0;

this.onGaze = e;

this.run = false;

this.__invisible = false;

window.isSecureContext ? this.init(t) : console.error("This application requires a secure context (HTTPS or localhost)");

}









showCalibrationInstructions(t) {

const e = document.createElement("div");

e.id = "calibrationOverlay";

e.style.position = "fixed";

e.style.top = "0";

e.style.left = "0";

e.style.width = "100vw";

e.style.height = "100vh";

e.style.backgroundColor = "rgba(0, 0, 0, 0.9)";

e.style.display = "flex";

e.style.justifyContent = "center";

e.style.alignItems = "center";

e.style.zIndex = "1000";

var i = document.createElement("div");

i.style.textAlign = "center";

i.style.color = "#fff";

i.style.fontFamily = "Arial, sans-serif";

var s = document.createElement("h3");

s.textContent = "EyeGestures Calibration:";

s.style.fontSize = "1.5rem";

s.style.marginBottom = "20px";

var a = document.createElement("p");

a.innerHTML = 'To calibrate properly you need to gaze on <span style="color: #ff5757; font-weight: bold;">25 red circles</span>.';

a.style.marginBottom = "20px";

var r = document.createElement("p");

r.innerHTML = 'The <span style="color: #5e17eb; font-weight: bold;">blue circle</span> is your estimated gaze. With every calibration point, the tracker will gradually listen more and more to your gaze.';

r.style.marginBottom = "20px";

var n = document.createElement("button");

n.textContent = "Continue";

n.style.padding = "10px 20px";

n.style.fontSize = "1rem";

n.style.border = "none";

n.style.borderRadius = "5px";

n.style.backgroundColor = "#5e17eb";

n.style.color = "#fff";

n.style.cursor = "pointer";

n.addEventListener("click", () => {

document.body.removeChild(e);

t();

});

i.appendChild(s);

i.appendChild(a);

i.appendChild(r);

i.appendChild(n);

e.appendChild(i);

document.body.appendChild(e);

setTimeout(() => {

document.body.removeChild(e);

t();

}, 1000);

}









updateStatus(t) {

document.getElementById("status").textContent = t;

}









showError(t) {

var e = document.getElementById("error");

e.textContent = t;

e.style.display = "block";

}









loadScript(s) {

return new Promise((t, e) => {

var i = document.createElement("script");

i.src = s;

i.onload = t;

i.onerror = e;

document.head.appendChild(i);

});

}









async init(t) {

try {

this.updateStatus("Loading MediaPipe library...");

await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js");

await this.loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js");

this.updateStatus("MediaPipe library loaded, initializing...");

if (typeof FaceMesh === "undefined") {

throw new Error("FaceMesh is not defined. Library not loaded correctly.");

}

await this.setupMediaPipe(t);

} catch (t) {

console.error("Initialization error:", t);

this.showError("Initialization error: " + t.message);

}

}









async setupMediaPipe(t) {

try {

const a = new FaceMesh({

locateFile: (t) => (console.log("Loading file:", t), "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/" + t)

});

a.setOptions({

maxNumFaces: 1,

refineLandmarks: true,

minDetectionConfidence: .5,

minTrackingConfidence: .5

});

await a.initialize();

this.updateStatus("FaceMesh initialized successfully");

a.onResults(this.onFaceMeshResults.bind(this));

var e = await navigator.mediaDevices.getUserMedia({

video: {}

});

const i = document.getElementById(t);









async function s() {

var t = document.getElementById("video");

if (t.readyState === t.HAVE_ENOUGH_DATA) {

var e = document.getElementById("output_canvas");

var i = e.getContext("2d");

try {

i.save();

i.scale(-1, 1);

i.translate(-e.width, 0);

a.send({

image: t

});

i.restore();

} catch (t) {

console.error("Error processing frame:", t);

showError("Error processing frame: " + t.message);

}

}

requestAnimationFrame(s);

}

i.srcObject = e;

i.onloadeddata = () => {

this.updateStatus("Video stream started");

i.play();

requestAnimationFrame(s);

};

} catch (t) {

console.error("Error initializing MediaPipe:", t);

showError("Error initializing MediaPipe: " + t.message);

}

}









onFaceMeshResults(t) {

var s = [33, 133, 160, 159, 158, 157, 173, 155, 154, 153, 144, 145, 153, 246, 468];

var a = [362, 263, 387, 386, 385, 384, 398, 382, 381, 380, 374, 373, 374, 466, 473];

let r = 0,

n = 0,

o, h, l = 0,

c = 0,

d = [],

p = [];

if (t.multiFaceLandmarks && this.run) {

const y = document.getElementById("output_canvas");

const g = y.getContext("2d");

g.clearRect(0, 0, y.width, y.height);

for (var u of t.multiFaceLandmarks) {

r = u[0].x;

n = u[1].y;

u.forEach(t => {

r = Math.min(r, t.x);

n = Math.min(n, t.y);

l = Math.max(l, t.x);

c = Math.max(c, t.y);

});

o = l - r;

h = c - n;

this.start_width * this.start_height == 0 && (this.start_width = o, this.start_height = h);

let e = o / this.start_width;

let i = h / this.start_height;

var _ = s.map(t => u[t]);

var m = a.map(t => u[t]);

g.fillStyle = "#ff5757";

_.forEach(t => {

d.push([(t.x - r) / o * e, (t.y - n) / h * i]);

g.beginPath();

g.arc(t.x * y.width, t.y * y.height, 3, 0, 2 * Math.PI);

g.fill();

});

g.fillStyle = "#5e17eb";

m.forEach(t => {

p.push([(t.x - r) / o * e, (t.y - n) / h * i]);

g.beginPath();

g.arc(t.x * y.width, t.y * y.height, 3, 0, 2 * Math.PI);

g.fill();

});

this.processKeyPoints(d, p, r * e, n * e, e, i, o, h);

}

}

}









processKeyPoints(t, e, i, s, a, r, n, o) {

let h = t;

h = (h = (h = h.concat(e)).concat([[a, r]])).concat([[n, o]]);

h = h.concat([[i - this.head_starting_pos[0], s - this.head_starting_pos[1]]]);


// 't'는 calib_counter < calib_max (캘리브레이션 진행 중) 여부를 나타냄

t = this.calib_counter < this.calib_max;


e = this.calibrator.predict(h);

this.buffor.push(e);

this.buffor_max < this.buffor.length && this.buffor.shift();

let l = [0, 0];

e = l = 0 < this.buffor.length ? this.buffor.reduce((t, e) => [t[0] + e[0], t[1] + e[1]], [0, 0]).map(t => t / this.buffor.length) : l;





if (t) { // 캘리브레이션 진행 중

a = this.calibrator.getCurrentPoint(this.screen_width, this.screen_height);

this.calibrator.add(h, a);


let shouldUpdateText = false;





if (euclideanDistance(e, a) < 0.1 * this.screen_width && 20 < this.counter) {

this.calibrator.movePoint();

this.counter = 0;

shouldUpdateText = true; // 포인트가 변경되면 텍스트 업데이트 필요

} else if (euclideanDistance(e, a) < 0.1 * this.screen_width) {

this.counter = this.counter + 1;

}





// prev_calib이 변경될 때만 calib_counter를 증가시키고 텍스트를 업데이트

if (this.prev_calib[0] !== a[0] || this.prev_calib[1] !== a[1]) {

this.prev_calib = a;

this.calib_counter = this.calib_counter + 1;

shouldUpdateText = true; // 카운터가 증가하면 텍스트 업데이트 필요

}





// 텍스트는 calib_counter가 증가하거나 새로운 포인트로 이동할 때만 업데이트

if (shouldUpdateText) {

const calibTextElement = document.getElementById("calib_text");

if (calibTextElement && this.calib_counter < this.calibMessages.length) { // 배열 범위 확인

calibTextElement.textContent = this.calibMessages[this.calib_counter];

} else if (calibTextElement && this.calib_counter === this.calibMessages.length) {

// 모든 캘리브레이션이 끝났을 때의 처리 (예: 완료 메시지)

calibTextElement.textContent = this.calibMessages[this.calibMessages.length - 1]; // 마지막 메시지 유지

}

}





} else { // 캘리브레이션 완료 시

document.getElementById("calib_cursor").style.display = "None";

const calibTextElement = document.getElementById("calib_text");

if (calibTextElement) {

calibTextElement.textContent = ""; // 텍스트도 비우기

}

}

r = document.getElementById("cursor");

n = Math.min(Math.max(e[0], 0), this.screen_width);

o = Math.min(Math.max(e[1], 0), this.screen_height);

r.style.left = "None"; // 'None' 대신 'auto'나 빈 문자열을 사용하는 것이 일반적입니다.

r.style.top = "None"; // 하지만 이 부분은 cursor 관련이므로 일단 유지합니다.


i = document.getElementById("calib_cursor");

// prev_calib은 이미 업데이트된 새 포인트이므로 그대로 사용

i.style.left = this.prev_calib[0] - 100 + "px";

i.style.top = this.prev_calib[1] - 100 + "px";

this.onGaze(e, t);

}





__run() {

this.run = true;

}









start() {

this.showCalibrationInstructions(this.__run.bind(this));

this.__invisible || (document.getElementById("cursor").style.display = "block");

document.getElementById("calib_cursor").style.display = "block";

}









invisible() {

this.__invisible = true;

document.getElementById("cursor").style.display = "none";

}









visible() {

this.__invisible = false;

document.getElementById("cursor").style.display = "none";

}









stop() {

this.run = false;

console.log("stop");

}









recalibrate() {

this.calibrator.unfit();

this.calib_counter = 0;

}

}