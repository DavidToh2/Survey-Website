var currentCardArray;

    // The indices of currentCardArray start at 0

function incrementCard(increment, containerNo) {
    currentCardArray[containerNo] += increment;
    var cardContainer = [containerNo];
    displayCards(cardContainer);
}

async function displayCards(containerArray) {

    var cardContainers = $(".card__container--grid-3");
    cardContainers.each(function(index, element) {

        if (containerArray.includes(index)) {

            // Display the cards for those card-containers specified in containerArray
            // The indices of containerArray start at 0

            let noOfCards = parseInt($(element).children(".card__noOfCards").html());

                // First, remove all position identifiers
            var cards = cardContainers.children(".card");
            cards.each(function(index, element) {
                $(this).removeClass("card--left card--middle card--right");
            })

                // Then, add up to three position classes based on noOfCards.
            let currentCard = currentCardArray[index];

            let a = modulo(currentCard, noOfCards);
            $(cards[a]).addClass("card--middle");

            if (noOfCards > 1) {
                let b = modulo(currentCard + 1, noOfCards);
                $(cards[b]).addClass("card--right");

                if (noOfCards > 2) {
                    let c = modulo(currentCard - 1, noOfCards);
                    $(cards[c]).addClass("card--left");
                }
            }

        }
    })

    console.log("Card displaying finished!");

}

async function initCardDisplay(maxContainerNo) {
    var containerArray = [];
    for (let i=0; i<=maxContainerNo; i++) {
        containerArray.push(i);
    }

    // Waits for displayCards to finish running before setting the height
    // This has to be done because Javascript is asynchronous
    // Another way to do so is to use promises. To learn in the future

    await displayCards(containerArray);

    // A final, noob way is just to ask the browser to wait 300 miliseconds
    // I had to do this because the grid height was still being set too quickly

    setTimeout(function() {
        $(".card__container--grid-3").each(function(index, element) {
            let fixedHeight = $(this).height();
            console.log(fixedHeight);
            // $(this).css('height', fixedHeight + 10);
        })
    }, 300);
}

function modulo(a, n) {
    while (a >= n) {
        a -= n;
    }
    while (a < 0) {
        a += n;
    }
    return a;       /* Returns a value between 0 and n-1 */
}