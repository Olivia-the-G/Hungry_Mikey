$(document).ready(function() {
    const $tamagotchiImg = $("#tamagotchi");
    const frames = ["../Mikey Frames/Mikey Frame 1.svg", "../Mikey Frames/Mikey Frame 2.svg", "../Mikey Frames/Mikey Frame 3.svg", "../Mikey Frames/Mikey Frame 4.svg", "../Mikey Frames/Mikey Frame 5.svg", "../Mikey Frames/Mikey Frame 6.svg"];
    const healthyFrames = ["../Mikey Happy Frames/Mikey - happy - 1.svg", "../Mikey Happy Frames/Mikey - happy - 2.svg", "../Mikey Happy Frames/Mikey - happy - 3.svg"];
    const notLikeFrames = ["../Mikey Not Like Frames/Mikey - scared - 1.svg", "../Mikey Not Like Frames/Mikey - scared - 2.svg", "../Mikey Not Like Frames/Mikey - scared - 3.svg", "../Mikey Not Like Frames/Mikey - scared - 4.svg"];

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

    // functions to play sounds from arrays
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

    // function to update button images
    function updateButtonImages() {
        $.get('/getImageUrls', function(data) {
            // added a timestamp to prevent caching
            $('#feedButtonHealthy').html('<img class="feed-image" src="' + data.healthy + '?v=' + Date.now() + '" alt="Feed Healthy">');
            $('#feedButtonEmpty').html('<img class="feed-image" src="' + data.empty + '?v=' + Date.now() + '" alt="Feed Empty">');
            $('#feedButtonBad').html('<img class="feed-image" src="' + data.bad + '?v=' + Date.now() + '" alt="Feed Bad">');
            $('#feedButtonReveal').html('<img class="feed-image" src="' + data.reveal + '?v=' + Date.now() + '" alt="Feed Reveal">');
        });
    }

    updateButtonImages();

    // function to shuffle buttons and names
    function shuffleButtonsAndNames() {
        const buttonContainer = $("#buttonContainer");
        const buttons = buttonContainer.children();
        const names = Object.values(buttonNames);

        // shuffle the order of buttons in array
        for (let i = buttons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            buttonContainer.append(buttons[j]);
        }
    }

    // function to start Mikey's feeding animation
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

    // function to stop Mikey's feeding animation
    function stopAnimation() {
        clearInterval(animationInterval);
        animationEnabled = true;
        frameIndex = 5;
        repeatCount = 0;
    }


//Mikey's happy animation
function feedMikeyHealthy() {
    if (!animationEnabled) return;

    $tamagotchiImg.attr('src', healthyFrames[frameIndex]);

    let frameCount = 0; 
    let reverse = false; 

    animationInterval = setInterval(function() {
        if (!reverse) {
            if (frameIndex < 3) {
                $tamagotchiImg.attr('src', healthyFrames[frameIndex++]);
            } else {
                reverse = true; 
                frameIndex = 2; 
            }
        } else {
            if (frameIndex > 0) {
                $tamagotchiImg.attr('src', healthyFrames[frameIndex--]);
            } else {
                reverse = false; 
                frameIndex = 0; 
                frameCount++;
                if (frameCount === 2) { 
                    stopAnimation();
                    $tamagotchiImg.attr('src', healthyFrames[0]); // reset to frame 1
                    return;
                }
            }
        }

        if (frameIndex === healthyFrames.length) {
            frameIndex = 0;
        }
    }, repeatCount === 0 ? 200 : 133);
    animationEnabled = false;

    // stop the animation after a certain time (adjust the time as needed)
    setTimeout(function () {
        stopAnimation();
        $tamagotchiImg.attr('src', healthyFrames[0]); // then reset to frame 1
    }, 3000); // 3 sec
}



// Mikey's sad animation
function feedMikeySad() {
    if (!animationEnabled) return;

    $tamagotchiImg.attr('src', notLikeFrames[frameIndex]);

    let frameCount = 0; 
    let reverse = false; 

    animationInterval = setInterval(function() {
        if (!reverse) {
            if (frameIndex < 4) {
                $tamagotchiImg.attr('src', notLikeFrames[frameIndex++]);
            } else {
                reverse = true; 
                frameIndex = 3; 
            }
        } else {
            if (frameIndex > 0) {
                $tamagotchiImg.attr('src', notLikeFrames[frameIndex--]);
            } else {
                reverse = false; 
                frameIndex = 0; 
                frameCount++;
                if (frameCount === 3) { 
                    stopAnimation();
                    $tamagotchiImg.attr('src', notLikeFrames[0]); // reset to frame 1
                    return;
                }
            }
        }

        if (frameIndex === notLikeFrames.length) {
            frameIndex = 0;
        }
    }, repeatCount === 0 ? 200 : 133);
    animationEnabled = false;

    // stop the animation after a certain time
    setTimeout(function () {
        stopAnimation();
        $tamagotchiImg.attr('src', notLikeFrames[0]); // reset to frame 1
    }, 3000); // 3 sec
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
            

            // triggers the happy or sad animations after the feeding action
            if (feedType === 'feedHealthy') {
                feedMikeyHealthy();
            } else if (feedType === 'feedBad') {
                feedMikeySad();
            }

            fetchStatus();
            startAnimation();
            updateTamagotchiMood(mood);
        }, 'json');
    }

    const feedHealthy = function() {
        shuffleButtonsAndNames();
        postFeedAction('feedHealthy');
        playHealthySound();
        updateButtonImages();
    };

    const feedEmpty = function() {
        const shuffledNames = shuffleButtonsAndNames();
        postFeedAction('feedEmpty');
        playEmptySound();
        updateButtonImages();
    };

    const feedReveal = function() {
        // ensure there are not multiple instances of tooltips
        $('.tooltip').remove();

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
        updateButtonImages();
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

    // cheat code to eat healthy
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
