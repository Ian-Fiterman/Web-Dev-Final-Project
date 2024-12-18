document.addEventListener("DOMContentLoaded", () => {
    const adObjects = new Map();
    const adElements = document.querySelectorAll('.ad');
    adElements.forEach(element => {
        adObjects.set(element.id, new Ad(element));
    });
    Object.defineProperty(window, "adObjects", {
        get: function () {
            return adObjects;
        },
    });
    if (window.location.href.includes("games.html")) {
        adObjects.values().forEach(ad => ad.restyleAd());
    } else {
        const revealButton = document.getElementById("reveal-button");
        const timeTravelButton = document.getElementById("time-travel-button");
        const timelineContainer = document.getElementById("timeline-container");
        let timeTravelButtonClickedBefore = false;
        document.addEventListener("click", (event) => {
            const clickedElement = event.target;
            if (clickedElement.id === "reveal-button") {
                fetch("timeline.json")
                    .then((response) => response.json())
                    .then((jsonDatabase) => {
                        for (let i = 0; i < jsonDatabase.length; i++) {
                            createTimelineEvent(jsonDatabase[i]);
                        }
                        gsap.to(revealButton, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                revealButton.style.display = "none";
                                timelineContainer.classList.remove("hidden");
                                animateTimelineEvents();
                            },
                        });
                    })
                    .catch((error) =>
                        console.error("Error fetching timeline data:", error)
                    );
            } else if (clickedElement.id === "time-travel-button") {
                if (!timeTravelButtonClickedBefore) {
                    adObjects.values().forEach(ad => ad.revealAd());
                    timeTravelButtonClickedBefore = true;
                    timeTravelButton.textContent =
                        "It did say the past, didn't it? Just kidding! Click to go to the Games page, 4 realz th1s t1me!";
                } else {
                    window.location.href = "games.html";
                }
            }
        });
    }
});

class Ad {
    constructor(element) {
        this.element = element;
        this.xshift = this.element.dataset.xshift;
        this.adText = this.element.querySelector("p");
    }

    randomColorCode() {
        return `rgb(${this.rand255()}, ${this.rand255()}, ${this.rand255()})`;
    }

    rand255() {
        return Math.floor(Math.random() * 256);
    }

    restyleAd() {
        const ads = [
            "Buy 1 for the price of 2, get 1 free! (Limited Time Offer)",
            "Your computer has a virus... Oh wait, that's just us!",
            "Exclusive offer: 50% off on items priced at 150%!",
            "Pretend there's an ad here... Isn't that nostalgic?",
            "Hurry, only 1,000,000 items left in stock!",
            "Oh look, a fancy ad for [insert last Google search]!",
            "Get a free trip to Mars... just kidding, you're stuck here.",
            "Warning: Clicking this ad will change nothing... except your life choices.",
            "Introducing the product that doesn't exist... Send $€¥ to make it real!",
            "Congrats! You’ve just wasted 30 seconds of your life on this ad!",
        ];
        const bgColor = this.randomColorCode();
        this.element.style.backgroundColor = bgColor;
        this.element.style.boxShadow = `0 0 20px ${bgColor}`;
        this.element.style.color = this.randomColorCode();
        this.adText.textContent = ads[Math.floor(Math.random() * ads.length)];
    }

    revealAd() {
        this.element.classList.remove("hidden");
        gsap.fromTo(
            this.element,
            { x: this.xshift, opacity: 0 },
            { x: "0%", opacity: 1, duration: 1, ease: "power3.out" }
        );
        this.restyleAd();
    }

    hideAd() {
        gsap.fromTo(
            this.element,
            { x: "0%", opacity: 1 },
            {
                x: this.xshift,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                onComplete: () => {
                    this.element.classList.add("hidden");
                },
            }
        );
    }

    closeButtonClicked() {
        this.hideAd();
        setTimeout(() => {
            this.revealAd();
        }, 3000);
    }
}

function handleClick(buttonElement) {
    adObjects.get(buttonElement.parentElement.id).closeButtonClicked();
}

function createTimelineEvent(eventData) {
    const timelineContainer = document.getElementById("timeline-container");
    let eventElement = document.createElement("div");
    eventElement.classList.add("timeline-event");
    let dateElement = document.createElement("div");
    dateElement.classList.add("timeline-date");
    dateElement.innerText = eventData.date;
    eventElement.appendChild(dateElement);
    let contentContainer = document.createElement("div");
    contentContainer.classList.add("timeline-content");
    let titleElement = document.createElement("h2");
    titleElement.innerText = eventData.title;
    contentContainer.appendChild(titleElement);
    let descriptionElement = document.createElement("p");
    descriptionElement.innerText = eventData.description;
    contentContainer.appendChild(descriptionElement);
    eventElement.appendChild(contentContainer);
    timelineContainer.appendChild(eventElement);
}

function animateTimelineEvents() {
    const timelineEvents = document.querySelectorAll(".timeline-event");
    const timeTravelButton = document.getElementById("time-travel-button");
    gsap.fromTo(
        timelineEvents,
        {
            opacity: 0,
            y: 50,
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power3.out",
            onComplete: () => {
                timeTravelButton.classList.remove("hidden");
                gsap.fromTo(
                    timeTravelButton,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            },
        }
    );
}

function loadGame(url) {
    document.getElementById("gameFrame").src = url;
}