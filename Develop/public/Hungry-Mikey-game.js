$(document).ready(function () {
    // event listener for the dynamic buttons
    $('.food-button').on('click', function() {
        const foodType = $(this).data('food');
        feedMikey(foodType);
    });

    //status fetch function
    fetchStatus();

});

function feedMikey(foodType) {
    // send selected food type to the server
    $.post('/feed' , { foodType: foodType }, function(data) {
        console.log('Fed Mikey:', foodType);
        fetchStatus();
        startAnimation();
        playAudio(feedSound); //some sound cue
    }, 'json');


}

function fetchStatus() {
    // current status of Mikey from the server
    $.get('/status', function(data) {
        console.log('Mikey status:', data);
        updateUI(data);
        // placeholder for UI updates like an EXP bar or animations or something    
    }, 'json');
}

function updateUI(data) {
    // update food buttons based on the new status & previous selections;
    // update other elements like EXP bar, animations, etc.
}

function updateFoodButtonUI(statusData) {
    // dynamically update the food buttons based on feedback from the server
     $('#food1 img').attr('src', statusData.food1Image);
    $('#food2 img').attr('src', statusData.food2Image);
    $('#food3 img').attr('src', statusData.food3Image);
}



function startAnimation() {
    // start the animation for Mikey after feeding
}

function playAudio(audioCue)
{
    // play a sound cue
}