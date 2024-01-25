$(document).ready(function() {
    const $tamagotchiImg = $("#tamagotchi");
    const frames = ["../Mikey Frames/Mikey Frame 1.svg", "../Mikey Frames/Mikey Frame 2.svg", "../Mikey Frames/Mikey Frame 3.svg", "../Mikey Frames/Mikey Frame 4.svg", "../Mikey Frames/Mikey Frame 5.svg", "../Mikey Frames/Mikey Frame 6.svg"];
    const healthySounds = [
    "20181112_Quest Ding 01 ｜ Heroes of the Storm",
    "20181112_Quest Ding 02 ｜ Heroes of the Storm",
    "20160531_Cartoon Chomp Sound Effect"
];
const badSounds = [
    "20210506_Windows Error (Sound effect)",
    "20140323_Spongebob bleh SFX",
    "20240115_WOMP WOMP (sound effect)"
];
const emptySounds = [
    "20200426_Can sound effect",
    "20230404_Empty bag crunching sound effect"
];
const revealSounds = [
    "20230424_Dramatic Reveal Sound Effect",
    "20211003_Appear Sound Effect",
    "20230216_Magic Reveal Sound Effect"
];

let currentBadSoundIndex = 0;
let currentHealthySoundIndex = 0;
let currentEmptySoundIndex = 0;
let currentRevealSoundIndex = 0;
    let frameIndex = 5;
    let repeatCount = 0;
    let animationInterval;
    let animationEnabled = true;
    let buttonNames = {
        feedHealthy: "Feed Healthy",
        feedEmpty: "Feed Empty",
        feedReveal: "Feed Reveal",
        feedBad: "Feed Bad"
    };
    let originalButtonNames = {
        feedHealthy: $('#feedButtonHealthy').text(),
        feedEmpty: $('#feedButtonEmpty').text(),
        feedReveal: $('#feedButtonReveal').text(),
        feedBad: $('#feedButtonBad').text()
    };
function playBadSound() {
    const soundName = badSounds[currentBadSoundIndex];
    currentBadSoundIndex = (currentBadSoundIndex + 1) % badSounds.length;
    const soundPath = `/sounds/badSounds/${soundName}.webm`;
    new Audio(soundPath).play();
}

function playEmptySound() {
    const soundName = emptySounds[currentEmptySoundIndex];
    currentEmptySoundIndex = (currentEmptySoundIndex + 1) % emptySounds.length;
    const soundPath = `/sounds/emptySounds/${soundName}.webm`;
    new Audio(soundPath).play();
}

function playRevealSound() {
    const soundName = revealSounds[currentRevealSoundIndex];
    currentRevealSoundIndex = (currentRevealSoundIndex + 1) % revealSounds.length;
    const soundPath = `/sounds/revealSounds/${soundName}.webm`;
    new Audio(soundPath).play();
}



function playHealthySound() {
    const soundName = healthySounds[currentHealthySoundIndex];
    currentHealthySoundIndex = (currentHealthySoundIndex + 1) % healthySounds.length;
    const soundPath = `/sounds/healthySounds/${soundName}.webm`;
    new Audio(soundPath).play();
}
    function updateButtonImages() {
        $.get('/getImageUrls', function(data) {
            $('#feedButtonHealthy').html('<img src="' + data.healthy + '" alt="Feed Healthy">');
            $('#feedButtonEmpty').html('<img src="' + data.empty + '" alt="Feed Empty">');
            $('#feedButtonBad').html('<img src="' + data.bad + '" alt="Feed Bad">');
            $('#feedButtonReveal').html('<img src="' + data.reveal + '" alt="Feed Reveal">');
        });
    }

    //update button images
    updateButtonImages();

function shuffleButtonsAndNames() {
    const buttonContainer = $("#buttonContainer");
    const buttons = buttonContainer.children();
    const names = Object.values(buttonNames);

    // Shuffle the order of buttons
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        buttonContainer.append(buttons[j]);
    }

    // not the best way to accomplish this but will do for now
    // setTimeout(function () {
    //     location.reload();
    // }, 3100); //

    
}


    function startAnimation() {
        if (!animationEnabled) return;

        $tamagotchiImg.attr('src', frames[frameIndex]);

        animationInterval = setInterval(function() {
            if (frameIndex < 3) {
                $tamagotchiImg.attr('src', frames[frameIndex++]);
            } else {
                if (repeatCount < 12) {
                    $tamagotchiImg.attr('src', frames[3 + (repeatCount % 3)]);
                    repeatCount++;
                } else {
                    stopAnimation();
                    $tamagotchiImg.attr('src', frames[0]);
                    return;
                }
            }

            if (frameIndex === frames.length) {
                frameIndex = 0;
            }
        }, repeatCount === 0 ? 200 : 133);
        animationEnabled = false;
    }

    function stopAnimation() {
        clearInterval(animationInterval);
        animationEnabled = true;
        frameIndex = 5;
        repeatCount = 0;
    }

function postFeedAction(feedType) {
    $.post('/' + feedType, function(data) {
       
        const { message, foodLevel, size, mood } = data;

    
        console.log('Message:', message);
        if (foodLevel !== undefined) {
            console.log('Food Level:', foodLevel);
        }
        if (size !== undefined) {
            console.log('Size:', size);
        }
        console.log('Mood:', mood);

      
        fetchStatus();
        startAnimation();
        updateTamagotchiMood(mood);
    }, 'json');
}



    const feedHealthy = function() {
        shuffleButtonsAndNames();
        postFeedAction('feedHealthy');
        playHealthySound();
        
    };

    const feedEmpty = function() {
        const shuffledNames = shuffleButtonsAndNames();
        postFeedAction('feedEmpty');
        playEmptySound();
    
    };

const feedReveal = function() {
  // ensure there are not multiple instances of tooltips
    $('.tooltip').remove();

    let originalNames = {
        feedHealthy: $('#feedButtonHealthy .button-label').text(),
        feedEmpty: $('#feedButtonEmpty .button-label').text(),
        feedReveal: $('#feedButtonReveal .button-label').text(),
        feedBad: $('#feedButtonBad .button-label').text()
    };

    // tooltips for revealFoods function
    $('.button').each(function() {
        const tooltipText = $(this).attr('data-title');
        const $tooltip = $('<span class="tooltip" style="display: none;">' + tooltipText + '</span>');
        $(this).append($tooltip);
        $tooltip.fadeIn();
    });

    console.log('Tooltips added');

    // delay, hide and remove tooltips
    setTimeout(() => {
        $('.tooltip').fadeOut(function() {
            $(this).remove();
        });

    
        console.log('Tooltips removed');
    }, 5000); // 5 seconds

    postFeedAction('feedReveal');
    playRevealSound();
};





    const feedBad = function() {
        const shuffledNames = shuffleButtonsAndNames();
        postFeedAction('feedBad');
        playBadSound();

    };

    function updateTamagotchiMood(mood) {
        if (mood >= 0.6) {
            $tamagotchiImg.removeClass('spinning upside-down').addClass('normal');
        } else if (mood >= 0.3) {
            $tamagotchiImg.removeClass('normal upside-down').addClass('spinning');
        } else {
            $tamagotchiImg.removeClass('normal spinning').addClass('upside-down');
        }
    }


    $(document).on('keydown', function(event) {
        if (event.key === 'f' || event.key === 'F') {
            feedHealthy();
        }
    });

    $('#feedButtonHealthy').on('click', feedHealthy);
    $('#feedButtonEmpty').on('click', feedEmpty);
    $('#feedButtonReveal').on('click', feedReveal);
    $('#feedButtonBad').on('click', feedBad);


    function updateTamagotchiSize(foodLevel) {
        const newSize = 100 + foodLevel * 10;
        $tamagotchiImg.css({
            'width': newSize + 'px',
            'height': newSize + 'px'
        });
    }

    function fetchStatus() {
        $.get('/status', function(data) {
            $('#foodLevel').text(data.foodLevel);
            updateTamagotchiSize(data.foodLevel);
        }, 'json');
    }

    fetchStatus();

});
