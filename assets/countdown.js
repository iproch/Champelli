class bulletCountdown extends HTMLElement {

    constructor() {
        super();

        this.date = new Date(Date.parse(this.dataset.date)).getTime(); // mm-dd-yyyy
        this.message = this.dataset.message;

        if (isNaN(this.date)) {
            this.date = new Date(this.dataset.date.replace(/-/g, "/")).getTime();
            if (isNaN(this.date)) return
        }

        this.init();
    }

    init() { setInterval(this.timer.bind(this), 1000) }

    timer() {

        const   now = new Date(),
                countTo = new Date(this.date),
                timeDiff = (countTo - now);

        if (timeDiff > 0) {

                const   secsInDay = 60 * 60 * 1000 * 24,
                        secsInHour = 60 * 60 * 1000;

                const   days  = Math.floor(timeDiff / (secsInDay) * 1),
                        hours = Math.floor((timeDiff % (secsInDay)) / (secsInHour) * 1),
                        mins  = Math.floor(((timeDiff % (secsInDay)) % (secsInHour)) / (60 * 1000) * 1),
                        secs  = Math.floor((((timeDiff % (secsInDay)) % (secsInHour)) % (60 * 1000)) / 1000 * 1);

                // HTML
                const   dayX = days > 0 ? `<x-cell><span>${days == 1 ? dateStrings.day : dateStrings.days}</span> <span class="dates">${days}</span></x-cell>` : '',
                        hourX = `<x-cell><span>${hours == 1 ? dateStrings.hour : dateStrings.hours}</span> <span class="dates">${hours}</span></x-cell>`,
                        minX = `<x-cell><span>${mins == 1 ? dateStrings.minute : dateStrings.minutes}</span> <span class="dates">${mins}</span></x-cell>`,
                        secX = `<x-cell><span>${secs == 1 ? dateStrings.second : dateStrings.seconds}</span> <span class="dates">${secs}</span></x-cell>`;

                // Compose & append
                this.querySelector('x-grid').innerHTML = dayX + hourX + minX + secX;

        } else { this.innerHTML = `<h3 class="h3 endMessage">${this.message}</h3>` }

    }
}

customElements.define('bullet-countdown', bulletCountdown);