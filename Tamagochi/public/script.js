$(document).ready(function() {
    const $tamagotchiImg = $("#tamagotchi");
    const frames = ["../Mikey Frames/Mikey Frame 1.svg", "../Mikey Frames/Mikey Frame 2.svg", "../Mikey Frames/Mikey Frame 3.svg", "../Mikey Frames/Mikey Frame 4.svg", "../Mikey Frames/Mikey Frame 5.svg", "../Mikey Frames/Mikey Frame 6.svg"];
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
        feedBad: $('#vomitButton').text()
    };

    function shuffleButtonNames() {
        const names = Object.values(buttonNames);
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }
        return names;
    }

    // Function to shuffle button order
    function shuffleButtonOrder() {
        const buttonContainer = $("#buttonContainer");
        const buttons = buttonContainer.children();
        for (let i = buttons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            buttonContainer.append(buttons[j]);
        }
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

    // Function to post a feed action
    function postFeedAction(feedType) {
        $.post('/' + feedType, { feedType: feedType }, function(data) {
            console.log(data);
            fetchStatus();
            startAnimation();
            updateTamagotchiMood(data.mood);
             // Update Tamagotchi's mood visually
            // You might want to update other elements based on the response
        }, 'json');
    }
    

    // Modified event handlers to include feed type
    const feedHealthy = function() {
        const shuffledNames = shuffleButtonNames();
        shuffleButtonOrder();
        $('#feedButtonHealthy').text(shuffledNames[0]);
        $('#feedButtonEmpty').text(shuffledNames[1]);
        $('#vomitButton').text(shuffledNames[2]);
        $('#feedButtonReveal').text(shuffledNames[3]);

        postFeedAction('feedHealthy');
    };

    const feedEmpty = function() {
        // Shuffle both button names and button order
        const shuffledNames = shuffleButtonNames();
        shuffleButtonOrder();

        // Update button text
        $('#feedButtonHealthy').text(shuffledNames[0]);
        $('#feedButtonEmpty').text(shuffledNames[1]);
        $('#vomitButton').text(shuffledNames[2]);
        $('#feedButtonReveal').text(shuffledNames[3]);

        postFeedAction('feedEmpty');
    };

const feedReveal = function() {
    $('#feedButtonHealthy').text(originalButtonNames.feedHealthy);
    $('#feedButtonEmpty').text(originalButtonNames.feedEmpty);
    $('#feedButtonReveal').text(originalButtonNames.feedReveal);
    $('#vomitButton').text(originalButtonNames.feedBad);

    postFeedAction('feedReveal');
};

    const feedBad = function() {
        const shuffledNames = shuffleButtonNames();
        shuffleButtonOrder();
        $('#feedButtonHealthy').text(shuffledNames[0]);
        $('#feedButtonEmpty').text(shuffledNames[1]);
        $('#feedButtonReveal').text(shuffledNames[2]);
        $('#vomitButton').text(shuffledNames[3]);

        postFeedAction('feedBad');
    };

    // Function to update Tamagotchi's mood visually
    function updateTamagotchiMood(mood) {
        if (mood >= 0.6) {
            // Good mood - normal appearance
            $tamagotchiImg.removeClass('spinning upside-down').addClass('normal');
        } else if (mood >= 0.3) {
            // Middling mood - spinning
            $tamagotchiImg.removeClass('normal upside-down').addClass('spinning');
        } else {
            // Bad mood - upside down
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
    $('#vomitButton').on('click', feedBad);

    $('#feedButtonHealthy').text(buttonNames.feedHealthy);
    $('#feedButtonEmpty').text(buttonNames.feedEmpty);
    $('#feedButtonReveal').text(buttonNames.feedReveal);
    $('#vomitButton').text(buttonNames.feedBad);

    const updateTamagotchiSize = function(foodLevel) {
        const newSize = 100 + foodLevel * 10;
        $tamagotchiImg.css({
            'width': newSize + 'px',
            'height': newSize + 'px'
        });
    };

    $('#vomitButton').on('click', function() {
        $.post('/reset', function(data) {
            console.log(data);
            fetchStatus();
        }, 'json');
    });

    const fetchStatus = function() {
        $.get('/status', function(data) {
            $('#foodLevel').text(data.foodLevel);
            updateTamagotchiSize(data.foodLevel);
        }, 'json');
    };


    fetchStatus();
});
