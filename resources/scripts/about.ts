import Vue from "vue";

/**
 * AboutPage class
 */
export class AboutPage {
    /**
     * Ctr
     */
    constructor() {
        this.init();
    }

    /**
     * Init
     */
    private async init() {
        new Vue({
            el: "#app",

            data: () => ({
                title: "About page",
            }),
        });
    }
}

/* New instance */
export default new AboutPage();
