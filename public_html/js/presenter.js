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
        Initialisiert die allgemeinen Teile der Seite
     */
    function initPage() {
        console.log("Presenter: Aufruf von initPage()");
        document.getElementById("main-content").addEventListener("click", handleClicks);
        document.getElementById("header").addEventListener("click", handleClicks);

        model.getAllBlogs((blogs) => {
            if(blogs){
                console.log("Presenter: Füllen der Navigation");
                let nav = navigation.render(blogs);
                replace("navmenu", nav.firstElementChild);

                console.log("Presenter: Füllen des aktuellsten Blogs (Header)");
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
        Zentraler Eventhandler
     */
    function handleClicks(event){
        console.log(`Presenter: Aufruf von handleClicks()`);
        let source = null;

        switch(event.target.tagName){
            case "BUTTON":
                console.log(`Presenter: Button ${event.target.innerHTML} wurde geklickt.`);
                source = event.target;
                break;
            case "A":
                console.log(`Presenter: Link ${event.target.innerHTML} wurde geklickt.`);
                router.handleNavigationEvent(event);
                break;
        }

        if(source){
            let action = source.dataset.action;
            if(action) {
                console.log(`Presenter: Button ${event.target.innerHTML} besitzt eine data-action: ${action}`);
                switch (action) {
                    case "deletePost":
                        deletePost(source.dataset.blogid, source.id);
                        break;
                    case "deleteComment":
                        deleteComment(source.dataset.blogid, source.dataset.postid, source.id);
                        break;
                    case "GoogleView":
                        let url = source.dataset.url;
                        googleView(url);
                }
            }

            let path = source.dataset.path;
            if (path)
                console.log(`Presenter: Button ${event.target.innerHTML} bestitzt einen data-path: ${path}`);
                router.navigateToPage(path);
        }
    }

    /*
        Erstellen eines neuen Posts
     */
    function addNewPost(bid, title, content){
        console.log(`Presenter: Aufruf von addNewPost() mit BlogID ${bid}`);

        if(bid){
            model.addNewPost(bid, title, content, (success) => {
                //TODO checken ob erfolgreich oder nicht

                //Header aktualisieren
                model.getAllBlogs((blogs) => {
                    replace("navmenu", navigation.render(blogs));
                    let current = model.getBlog(bid, (current) =>{
                        replace("currentBlog", currentBlog.render(current));
                    })
                })
            })
        }
    }

    /*
        Öffnet die Google View in einem neuen Browserfenster
     */
    function googleView(url){
        window.open(url, "_blank");
        console.log("Presenter: Vieweransicht von Google mit URL " + url + " wurde aufgerufen");
    }

    /*
        Bearbeiten eines Posts
     */
    function updatePost(bid, pid, title, content){
        console.log(`Presenter: Aufruf von updatePost() mit BlogID ${bid} und PostID ${pid}`);

        if(bid && pid){
            model.updatePost(bid, pid, title, content, (success) => {
                //TODO checken ob erfolgreich oder nicht
            })
        }
    }

    /*
        Löschen eines Posts
     */
    function deletePost(bid, pid){
        console.log(`Presenter: Aufruf von deletePost() mit BlogID ${bid} und PostID ${pid}`);

        if(bid && pid){
            model.deletePost(bid, pid, (success) => {
                //TODO checken ob erfolgreich oder nicht

                //Header aktualisieren
                model.getAllBlogs((blogs) => {
                    replace("navmenu", navigation.render(blogs));
                    let current = model.getBlog(bid, (current) =>{
                        replace("currentBlog", currentBlog.render(current));
                    })
                })
            })
        }
    }

    /*
        Löschen eines Kommentars
     */
    function deleteComment(bid, pid, cid){
        console.log(`Presenter: Aufruf von deleteComment() mit BlogID ${bid}, PostID ${pid} und CommentID ${cid}`);

        if(bid && pid && cid){
            model.deleteComment(bid, pid, cid, (success) => {
                //TODO checken ob erfolgreich oder nicht
            })
        }
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
            if(!init){
                initPage();
            }

            //Teste ob Blog mindestens einen Post besitzt
            model.getBlog(bid, (current) => {
                // Aktuellen Blog im Header aktualisieren
                let activeBlog = currentBlog.render(current);
                replace("currentBlog", activeBlog);

                if(current.postcount > 0){
                    //Wenn ja, nehme alle Blogposts
                    model.getAllPostsOfBlog(bid, (posts) => {
                        //Und übergebe sie an die View
                        let blogOverview = bloguebersicht.render(posts);
                        replace("content", blogOverview);
                    });
                }
                else{
                    //Wenn nein, ...
                }
            })
        },

        /*
            Wird vom Router augerufen, wenn eine Blog-Detailansicht angezeigt werden soll
         */
        showDetailView(bid, pid) {
            console.log(`Presenter: Aufruf von showDetailView(${bid}, ${pid})`);
            if(!init){
                initPage();
            }

            model.getPost(bid, pid, (post) => {
                model.getAllCommentsOfPost(bid, pid, (comments) => {
                    let detailView = detailansicht.render(post, comments);
                    replace("content", detailView);
                })
            })
        },

        /*
            Wird vom Router aufgerufen, wenn ein Post editiert werden soll

        showEdit(bid, pid){
            if(!init){
                initPage();
            }
        },
        */

        showAddPost(bid) {
            console.log(`Presenter: Aufruf von showAddPost für Blog ID ${bid}`);

            model.getBlog(bid, (blog) => {
                let addView = addPost.render(blog);
                replace("content", addView);
            })
        },

         addPost(bid, title, content){
            console.log(`Presenter: Aufruf von addPost() für neuen Post ${title}`);
            addNewPost(bid, title, content);
        }
    }
})();