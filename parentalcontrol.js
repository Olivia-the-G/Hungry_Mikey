var slideBtn = document.getElementById("parentalBtn")
var counter = 0 

const playerObj = {
    playerName: "Timmy",
    playerCode: "fff12",
    hoursSpent: "24:30:20"
}


slideBtn.addEventListener("click", ()=>{
    counter++
    if (counter%2!=0){
        console.log("the button is on")
        

    }
    else if(counter%2==0){
        console.log("the button is off")
    }

})