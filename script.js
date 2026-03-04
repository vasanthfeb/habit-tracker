const habits=[
"Wake Early",
"Eat 1 Banana",
"Meditation 20m",
"Workout",
"Drink 3L Water",
"Face Ice Clean",
"Learning New Thing",
"No Porn",
"No Fap",
"Sleep Before 11",
"7 Hours Sleep",
"Cold Shower",
"Reading",
"Healthy Food"
]

const yearSelect=document.getElementById("year")
const monthSelect=document.getElementById("month")

const daysRow=document.getElementById("daysRow")
const body=document.getElementById("habitBody")

// create year dropdown
for(let y=2024;y<=2035;y++){

let op=document.createElement("option")
op.value=y
op.text=y
yearSelect.appendChild(op)

}

// build habit table
function buildTable(){

daysRow.innerHTML="<th>Habit</th>"
body.innerHTML=""

for(let i=1;i<=31;i++){

let th=document.createElement("th")
th.innerText=i
daysRow.appendChild(th)

}

habits.forEach((habit,h)=>{

let tr=document.createElement("tr")

let td=document.createElement("td")
td.innerText=habit
tr.appendChild(td)

for(let d=1;d<=31;d++){

let cell=document.createElement("td")

let cb=document.createElement("input")
cb.type="checkbox"
cb.id=`h${h}d${d}`

cell.appendChild(cb)
tr.appendChild(cell)

}

body.appendChild(tr)

})

}

buildTable()

// current month
const today=new Date()
yearSelect.value=today.getFullYear()
monthSelect.value=today.getMonth()

// SAVE DATA
function saveData(){

console.log("Saving habits to Firebase")

habits.forEach((habit,h)=>{

for(let d=1;d<=31;d++){

let id=`h${h}d${d}`
let status=document.getElementById(id).checked

if(window.firebaseDB){

window.firebaseSet(
window.firebaseRef(window.firebaseDB,"habits/"+habit+"/"+d),
status
)

}

}

})

alert("Saved Successfully")

}

// LOAD DATA FROM FIREBASE
function loadFirebase(){

if(!window.firebaseDB) return

window.firebaseOnValue(
window.firebaseRef(window.firebaseDB,"habits"),
(snapshot)=>{

let data=snapshot.val()

if(!data) return

Object.keys(data).forEach(habit=>{

let days=data[habit]

Object.keys(days).forEach(day=>{

if(days[day]){

let index=habits.indexOf(habit)
let id=`h${index}d${day}`

let cb=document.getElementById(id)
if(cb) cb.checked=true

}

})

})

})

}

// PREVIOUS MONTH
function prevMonth(){

let m=parseInt(monthSelect.value)
let y=parseInt(yearSelect.value)

m--

if(m<0){

m=11
y--

}

monthSelect.value=m
yearSelect.value=y

}

// NEXT MONTH
function nextMonth(){

let m=parseInt(monthSelect.value)
let y=parseInt(yearSelect.value)

m++

if(m>11){

m=0
y++

}

monthSelect.value=m
yearSelect.value=y

}

// TODAY
function goToday(){

const t=new Date()

yearSelect.value=t.getFullYear()
monthSelect.value=t.getMonth()

}

// LOAD FIREBASE AFTER PAGE LOAD
window.addEventListener("load",()=>{

loadFirebase()

})

// EXPOSE FUNCTIONS FOR HTML BUTTONS
window.saveData=saveData
window.prevMonth=prevMonth
window.nextMonth=nextMonth
window.goToday=goToday