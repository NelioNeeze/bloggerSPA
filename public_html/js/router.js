"use strict";

const router = (function () {
    // Private Variable
    let mapRouteToHandler = new Map();

    /*
        Oeffentliche Methoden
    */
    return {
        // Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu
        addRoute: function (route, handler) {
            mapRouteToHandler.set(route, handler);
        },

        // Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll
        navigateToPage(url) {
            history.pushState(null, "", url);
            this.handleRouting();
        },

        // Wird als Eventhandler an ein <a>-Element gebunden
        handleNavigationEvent: function (event) {
            event.preventDefault();
            let url = event.target.href;
            console.log(`Router: Aufruf von handleNavigationEvent() mit URL ${url}`);
            this.navigateToPage(url);
        },

        // Wird als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt werden
        handleRouting: function () {
            console.log("Aufruf von router.handleRouting(): Navigation zu: " + window.location.pathname);
            const currentPage = window.location.pathname.split('/')[1];
            let routeHandler = mapRouteToHandler.get(currentPage);
            if (routeHandler === undefined)
                routeHandler = mapRouteToHandler.get(''); //Startseite
            routeHandler(window.location.pathname);
        }
    };
})();

// Selbsaufrufende Funktionsdeklaration: (function name(){..})();
(function initRouter() {
    // The "Startpage".
    router.addRoute('', function () {
        presenter.showStartPage();
    });

    router.addRoute('bloguebersicht', function (url) {
        // Get the index of which blog we want to show and call the appropriate function.
        var blogId = url.split('bloguebersicht/')[1].trim();
        //viewModel.blogId = id;
        presenter.showBlogOverview(blogId);
    });

    router.addRoute('detailansicht', function (url) {
        let temp = url.split('detailansicht/')[1].trim();
        var blogId = temp.split('/')[0];
        var postId = temp.split('/')[1];
        presenter.showDetailView(blogId, postId);
    });

    router.addRoute('addPost', function (url) {
        var blogId = url.split('addPost/')[1].trim();
        presenter.showAddPost(blogId);
    });

    router.addRoute('edit', function (url) {
        let temp = url.split('edit/')[1].trim();
        var blogId = temp.split('/')[0];
        var postId = temp.split('/')[1];
        presenter.showEditView(blogId, postId);
    })

    if (window) {
        window.addEventListener('popstate', (event) => {
            router.handleRouting();
        });
    }
})();


