/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";
const presenter = (function () {
    // Private Variablen und Funktionen
    let init = false;
    let blogId = -1;
    let postId = -1;
    let owner = undefined;

    /*
        Zentraler Eventhandler
     */
    function handleClicks(event){
        let source = null;

        switch(event.target.tagName){
            case "BUTTON":
                source = event.target;
                break;
            case "A":
                router.handleNavigationEvent(event);
                break;
            default:

                break;
        }
        if(source){
            let action = source.dataset.action;
            if(action)
                presenter[action](source.id);
            let path = source.dataset.path;
            if (path)
                router.navigateToPage(path);
        }
    }

    /*
        Erstellen eines neuen Posts
     */
    function addNewPost(){

    }

    /*
        Bearbeiten eines Posts
     */
    function updatePost(){

    }

    /*
        Löschen eines Posts
     */
    function deletePost(){

    }

    /*
        Löschen eines Kommentars
     */
    function deleteComment(){

    }

    /*
        Initialisiert die allgemeinen Teile der Seite
     */
    function initPage() {
        console.log("Presenter: Aufruf von initPage()");
        document.addEventListener("click", handleClicks);

        model.getAllBlogs((blogs) => {
            if(blogs){
                console.log("Presenter: Füllen der Navigation");
                let nav = navigation.render(blogs);
                replace("navmenu", nav.firstElementChild);

                console.log("Presenter: Füllen des momentanen Blogs (Header)");
                let current = currentBlog.render(blogs[0]);
                replace("currentBlog", current);

            }
        });

        model.getSelf((result) => {
            owner = result.displayName;
            console.log(`Presenter: Nutzer*in ${owner} hat sich angemeldet.`);
            document.getElementById("greeting").innerHTML = "Greetings, " + owner;
        });

        // Das muss später an geeigneter Stelle in Ihren Code hinein.
        init = true;
        //Falls auf Startseite, navigieren zu Uebersicht
        if (window.location.pathname === "/")
            router.navigateToPage('/blogOverview/' + blogId);
    }

    /*
        Sorgt dafür, dass bei einem nicht-angemeldeten Nutzer nur noch der Name der Anwendung
        und der Login-Button angezeigt wird.
     */
    function loginPage() {
        console.log("Presenter: Aufruf von loginPage()");
        if (owner !== undefined) console.log(`Presenter: Nutzer*in ${owner} hat sich abgemeldet.`);
        init = false;
        blogId = -1;
        postId = -1;
        owner = undefined;

        document.getElementById("greeting").innerHTML = "";
        document.getElementById("navmenu").innerHTML = "";
        document.getElementById("currentBlog").innerHTML = "";
    }

    /*
        Ersetzt ein Element durch ein anderes
     */
    function replace(id, element) {
        let main = document.getElementById(id);
        let content = main.firstElementChild;
        if (content)
            content.remove();
        if (element)
            main.append(element);
    }

    /*
        Oeffentliche Methoden
     */
    return {
        /*
            Wird vom Router aufgerufen, wenn die Startseite betreten wird
         */
        showStartPage() {
            console.log("Presenter: Aufruf von showStartPage()");
            // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
            if (model.isLoggedIn()) { // Wenn der Nutzer eingeloggt ist
                initPage();
            }
            if (!model.isLoggedIn()) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
                //Hier wird die Seite ohne Inhalt angezeigt
                loginPage();
            }
        },

        /*
            Wird vom Router aufgerufen, wenn eine Blog-Übersicht angezeigt werden soll
         */
        showBlogOverview(bid) {
            console.log(`Presenter: Aufruf von showBlogOverview(${bid})`);

            //Teste ob Blog mindestens einen Post besitzt
            model.getBlog(bid, (current) => {
                if(current.postcount > 0){
                    //Wenn ja, nehme alle Blogposts
                    model.getAllPostsOfBlog(bid, (posts) => {
                        //Und übergebe sie an die View
                        let blogOverview = bloguebersicht.render(posts);
                        replace("content", blogOverview);
                    });
                }
                else{
                    //Wenn nein, übergebe null
                    let blogOverview = bloguebersicht.render(null);
                }
            })
        },

        /*
         Wird vom Router augerufen, wenn eine Blog-Detailansicht angezeigt werden soll
         */
        showDetailView(bid, pid) {
            console.log(`Presenter: Aufruf von showDetailView(${bid}, ${pid})`);

            model.getPost(bid, pid, (post) => {
                model.getAllCommentsOfPost(bid, pid, (comments) => {
                    let detailView = detailansicht.render(post, comments);
                    replace("content", detailView);
                })
            })
        }
    }
})();