let button = document.querySelector('button');
let ganttChart = document.getElementById('ganttChart');

document.addEventListener('DOMContentLoaded', function () {
    button.addEventListener('click', validate);
});

function validate() {
    const processName = document.getElementById('process').value.split(' ');
    const arrivalTime = document.getElementById('at').value.split(' ').map(Number);
    const burstTime = document.getElementById('bt').value.split(' ').map(Number);
    const priority = document.getElementById('priority').value.split(' ').map(Number);
    console.log(processName);
    // Validate input
    if (!(processName.length === arrivalTime.length && arrivalTime.length === burstTime.length && burstTime.length === priority.length)) {
        alert('Input lengths do not match.');
        //return;
    }
    else {
        run();
    }
}


function run() {
    const processName = document.getElementById('process').value.split(' ');
    const arrivalTime = document.getElementById('at').value.split(' ').map(Number);
    const burstTime = document.getElementById('bt').value.split(' ').map(Number);
    const priority = document.getElementById('priority').value.split(' ').map(Number);

    // Create an array of objects representing processes
    const processes = processName.map((name, index) => ({
        name: name,
        arrivalTime: arrivalTime[index],
        oriBurst: burstTime[index],
        burstTime: burstTime[index],
        priority: priority[index],
        end: 0,
        turnaround: 0,
        waiting: 0,
    }));


    // Sort processes based on arrival time
    processes.sort((a, b) => {
        if (a.arrivalTime !== b.arrivalTime) {
            return a.arrivalTime - b.arrivalTime;
        }
        if (a.burstTime !== b.burstTime) {
            return a.burstTime - b.burstTime;
        }
        return a.priority - b.priority;
    });

    // check input in array
    // for (let i = 0; i < processes.length; i++) {
    //     console.log("Process " + processes[i].name);
    //     console.log("Arrival Time: " + processes[i].arrivalTime);
    //     console.log("Burst Time: " + processes[i].burstTime);
    //     console.log("Priority: " + processes[i].priority);
    //     console.log("\n"); // Add a new line for better readability
    // }

    // console.log(processes);

    // Initialize variables
    let currentTime = processes[0].arrivalTime;
    let empty = true;
    let currentProcess = [];
    ganttChart.innerHTML = '';
    let currentName = '';

    // Iterate through processes
    while (processes.some((process) => process.burstTime > 0)) {
        let currentProcess = [];
        let prevName = currentName;
        currentName = '';

        //create current processes
        processes.forEach((process) => {
            if (currentTime >= process.arrivalTime && process.burstTime > 0) {
                currentProcess.push(process);
            };
        });

        currentProcess.sort((a, b) => a.burstTime - b.burstTime);

        // console.log("currentTime=");
        // console.log(currentTime);
        // console.log("currentProcessbfore=");
        // console.log(currentProcess);
        // console.log("currentProcessbfore[0]=");
        // console.log(currentProcess[0]);
        // console.log(currentProcess[1]);
        // console.log(currentProcess[2]);

        if (currentProcess[0]) {
            currentName = currentProcess[0].name;
            // console.log("currentProcess[0].burstTime=");
            // console.log(currentProcess[0].burstTime);
            currentProcess.sort((a, b) => a.burstTime - b.burstTime);
            //create grid let process enter
            if (!(currentName === prevName && prevName.length >= 1)) {
                var container = document.createElement('div');
                var gridItem = document.createElement('div');
                gridItem.className = 'gridItem';
                gridItem.textContent = currentName;
                container.appendChild(gridItem);

                var labelItem = document.createElement('label');
                labelItem.className = 'labelItem';
                labelItem.textContent = currentTime;
                container.appendChild(labelItem);

                ganttChart.appendChild(container);
            }
            // console.log("processesafter="+processes);
            // console.log("currentProcessafter[0]="+currentProcess[0]);
            //remove burst time
            let match = processes.find(process => process.name === currentProcess[0].name);
            if (match) {
                match.burstTime -= 1;
                if (match.burstTime === 0) {
                    //add a variable named end, with value of currentTime+1
                    match.end = currentTime + 1;
                    match.turnaround = match.end - match.arrivalTime;
                    match.waiting = match.turnaround - match.oriBurst;
                }
            }
        }

        // consider previous process all finished run, but still have process that hvnt enter chart
        else if (processes.some((process) => process.arrivalTime > currentTime)) {
            currentName = '-';
            if (!(currentName === prevName && prevName.length >= 1)) {
                var container = document.createElement('div');
                var gridItem = document.createElement('div');
                gridItem.className = 'gridItem';
                gridItem.textContent = '-';
                container.appendChild(gridItem);

                var labelItem = document.createElement('label');
                labelItem.className = 'labelItem';
                labelItem.textContent = currentTime;
                container.appendChild(labelItem);
                ganttChart.appendChild(container);
            }
            // else {
            //     //return empty grid;
            //     currentTime++;
            //     continue;
            // }
        }
        currentTime++;
        match = '';
    }
    for (let i = 0; i < processes.length; i++) {
        console.log("Process " + processes[i].name);
        console.log("Arrival Time: " + processes[i].arrivalTime);
        console.log("Original Burst Time: " + processes[i].oriBurst);
        console.log("Reducing Burst Time: " + processes[i].burstTime);
        console.log("Priority: " + processes[i].priority);
        console.log("End: " + processes[i].end);
        console.log("Turnaround: " + processes[i].turnaround);
        console.log("Waiting: " + processes[i].waiting);
        console.log("\n"); // Add a new line for better readability
    }

    var container = document.createElement('div');
    var gridItem = document.createElement('div');
    gridItem.className = 'transparent';
    container.appendChild(gridItem);

    var labelItem = document.createElement('label');
    labelItem.className = 'labelItem';
    labelItem.textContent = currentTime;
    container.appendChild(labelItem);
    ganttChart.appendChild(container);

    tableCreation(processes);
}


function tableCreation(processes) {
    var totalTurnaround = 0, aveTurnaround = 0, totalWaiting = 0, aveWaiting = 0;
    const totalTurn = document.getElementById('totalTurn');
    const aveTurn = document.getElementById('aveTurn');
    const totalWait = document.getElementById('totalWait');
    const aveWait = document.getElementById('aveWait');
    const gt = document.getElementById('gt');
    const tableForm = document.getElementById('tableForm');
    totalTurn.innerHTML = '';
    aveTurn.innerHTML = '';
    totalWait.innerHTML = '';
    aveWait.innerHTML = '';

    const table = document.querySelector('table');
    table.style.visibility = 'visible';

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    processes.forEach((process) => {
        var tr = document.createElement('tr');

        ['name', 'arrivalTime', 'oriBurst', 'end', 'turnaround', 'waiting'].forEach((prop) => {
            var td = document.createElement('td');

            td.textContent = process[prop];
            tr.appendChild(td);

            if (prop === 'turnaround') {
                totalTurnaround += parseInt(process[prop], 10) || 0;
            }

            if (prop === 'waiting') {
                totalWaiting += parseInt(process[prop], 10) || 0;
            }

        });

        tbody.appendChild(tr);
        totalTurn.textContent = "Total Turnaround Time: " + totalTurnaround;
        aveTurnaround = totalTurnaround / processes.length;
        if (Number.isInteger(aveTurnaround)) {
            aveTurnaround = aveTurnaround.toFixed(0);
        }
        else {
            aveTurnaround = aveTurnaround.toFixed(6).replace(/\.?0+$/, '');
        }
        aveTurn.textContent = "Average Turnaround Time: " + aveTurnaround;
        totalWait.textContent = "Total Waiting Time: " + totalWaiting;
        aveWaiting = totalWaiting / processes.length;
        if (Number.isInteger(aveWaiting)) {
            aveWaiting = aveWaiting.toFixed(0);
        }
        else {
            aveWaiting = aveWaiting.toFixed(6).replace(/\.?0+$/, '');
        }
        aveWait.textContent = "Average Waiting Time: " + aveWaiting;
    });
}
