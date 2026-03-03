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

// Google Apps Script URL
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbwCDD7_F5VRxEHj7_iciMkLziJMt6fctVkhvPJ-syoDqe6sXn_f79y_d8-f4uC3gaW/exec"

const yearSelect=document.getElementById("year")
const monthSelect=document.getElementById("month")

const daysRow=document.getElementById("daysRow")
const body=document.getElementById("habitBody")

// year dropdown
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

// current month auto select
const today=new Date()

yearSelect.value=today.getFullYear()
monthSelect.value=today.getMonth()

// send data to google sheet
function sendToSheet(habit,status){

fetch(SCRIPT_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
date:new Date().toISOString(),
habit:habit,
status:status
})
})
.then(res=>console.log("sent"))
.catch(err=>console.log(err))

}

// save data
function saveData(){

let data={}

habits.forEach((h,hi)=>{

for(let d=1;d<=31;d++){

let id=`h${hi}d${d}`

let status=document.getElementById(id).checked

data[id]=status

// send to google sheet
sendToSheet(h,status)

}

})

let key=`habit-${yearSelect.value}-${monthSelect.value}`

localStorage.setItem(key,JSON.stringify(data))

alert("Saved Successfully")

updateCharts()

}

// load data
function loadData(){

let key=`habit-${yearSelect.value}-${monthSelect.value}`

let data=JSON.parse(localStorage.getItem(key))

if(!data) return

Object.keys(data).forEach(id=>{

let el=document.getElementById(id)

if(el) el.checked=data[id]

})

updateCharts()

}

// previous month
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

loadData()

}

// next month
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

loadData()

}

// today
function goToday(){

const t=new Date()

yearSelect.value=t.getFullYear()
monthSelect.value=t.getMonth()

loadData()

}

let dailyChart
let weeklyChart
let overallChart

// update charts
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

calculateStreak()

habitStats()

}

// draw charts
function drawCharts(daily,weeks,done,total){

if(dailyChart) dailyChart.destroy()
if(weeklyChart) weeklyChart.destroy()
if(overallChart) overallChart.destroy()

dailyChart=new Chart(document.getElementById("dailyChart"),{
type:"bar",
data:{
labels:[...Array(31).keys()].map(i=>i+1),
datasets:[{
label:"Daily Habits",
data:daily
}]
}
})

weeklyChart=new Chart(document.getElementById("weeklyChart"),{
type:"bar",
data:{
labels:["Week1","Week2","Week3","Week4"],
datasets:[{
label:"Weekly Score",
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

// streak counter
function calculateStreak(){

let html=""

habits.forEach((habit,h)=>{

let streak=0

for(let d=31;d>=1;d--){

let cb=document.getElementById(`h${h}d${d}`)

if(cb && cb.checked){

streak++

}else{

break

}

}

html+=`<p>${habit} : ${streak} days</p>`

})

document.getElementById("streakBox").innerHTML=html

}

// habit success %
function habitStats(){

let tbody=document.querySelector("#habitStats tbody")

tbody.innerHTML=""

habits.forEach((habit,h)=>{

let total=0
let done=0

for(let d=1;d<=31;d++){

let cb=document.getElementById(`h${h}d${d}`)

if(cb){

total++

if(cb.checked) done++

}

}

let p=Math.round((done/total)*100)

tbody.innerHTML+=`
<tr>
<td>${habit}</td>
<td>${p}%</td>
</tr>
`

})

}

loadData()