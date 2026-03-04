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

// YEAR DROPDOWN
for(let y=2024;y<=2035;y++){
let op=document.createElement("option")
op.value=y
op.text=y
yearSelect.appendChild(op)
}

// BUILD TABLE
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

cb.addEventListener("change",()=>{
updateCharts()
})

cell.appendChild(cb)
tr.appendChild(cell)

}

body.appendChild(tr)

})

}

buildTable()

// CURRENT MONTH
const today=new Date()
yearSelect.value=today.getFullYear()
monthSelect.value=today.getMonth()

// SAVE DATA
function saveData(){

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
updateCharts()

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

updateCharts()

})

}

// CHART VARIABLES
let dailyChart
let weeklyChart
let overallChart

// UPDATE CHARTS
function updateCharts(){

let daily=[]
let weeks=[0,0,0,0]

let total=0
let done=0

for(let d=1;d<=31;d++){

let count=0

habits.forEach((h,hi)=>{

let cb=document.getElementById(`h${hi}d${d}`)

if(cb && cb.checked){

count++
done++

}

total++

})

daily.push(count)

let w=Math.floor((d-1)/7)

if(w<4) weeks[w]+=count

}

drawCharts(daily,weeks,done,total)

}

// DRAW CHARTS
function drawCharts(daily,weeks,done,total){

if(dailyChart) dailyChart.destroy()
if(weeklyChart) weeklyChart.destroy()
if(overallChart) overallChart.destroy()

dailyChart=new Chart(document.getElementById("dailyChart"),{
type:"bar",
data:{
labels:[...Array(31).keys()].map(i=>i+1),
datasets:[{
label:"Daily Progress",
data:daily
}]
}
})

weeklyChart=new Chart(document.getElementById("weeklyChart"),{
type:"bar",
data:{
labels:["Week1","Week2","Week3","Week4"],
datasets:[{
label:"Weekly Progress",
data:weeks
}]
}
})

overallChart=new Chart(document.getElementById("overallChart"),{
type:"doughnut",
data:{
labels:["Done","Miss"],
datasets:[{
data:[done,total-done]
}]
}
})

}

// MONTH NAVIGATION
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

function goToday(){

const t=new Date()

yearSelect.value=t.getFullYear()
monthSelect.value=t.getMonth()

}

// PAGE LOAD
window.addEventListener("load",()=>{

loadFirebase()

})

// GLOBAL FUNCTIONS FOR HTML
window.saveData=saveData
window.prevMonth=prevMonth
window.nextMonth=nextMonth
window.goToday=goToday