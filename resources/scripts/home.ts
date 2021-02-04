import Vue from "vue";
import VueRouter from "vue-router";

/**
 * HomePage class
 */
export class HomePage {
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
        Vue.use(VueRouter);

        const router =
            // this.getRouter();
            new VueRouter({
                routes: [
                    {
                        path: "/",
                        component: () =>
                            import(
                                /* webpackChunkName: "components/home" */
                                "../scripts/components/home.vue"
                            ),
                    },
                    {
                        path: "/about",
                        component: () =>
                            import(
                                /* webpackChunkName: "components/about" */
                                "../scripts/components/about.vue"
                            ),
                    },
                ],
            });

        new Vue({
            el: "#app",

            router,
        });
    }

    /**
     * Get router
     */
    private getRouter(): VueRouter {
        return new VueRouter({
            routes: [
                {
                    path: "/",
                    component: {
                        template: `<div>Home C</div>`,
                    },
                },
                {
                    path: "/about",
                    component: {
                        template: `<div>About C</div>`,
                    },
                },
            ],
        });
    }
}

/* New instance */
export default new HomePage();
