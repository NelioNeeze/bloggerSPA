"use strict";

/*
    Baut die Navigationsleiste
 */
const navigation = {
    render(allBlogs) {
        console.log("View: Füllen der Navigation");

        let page = document.getElementById("navigation").cloneNode(true);
        page.removeAttribute("id");
        let ul = page.firstElementChild.cloneNode(true);
        let li = ul.firstElementChild.cloneNode(true);
        page.firstElementChild.firstElementChild.remove();

        if (!allBlogs)
            return;
        for (let b of allBlogs) {
            let litemp = li.cloneNode(true);
            setDataInfo(litemp, b);
            page.firstElementChild.append(litemp);
        }

        return page;
    }
}

/*
    Baut die Anzeige des momentanen Blogs
 */
const currentBlog = {
    render(currentBlog){
        console.log("View: Füllen des momentanen Blogs (Header)");
        let page = document.getElementById("bloginfo").cloneNode(true);
        page.removeAttribute("id");

        let div = page.querySelector("div");
        let button = div.querySelector("button");
        button.setAttribute("data-url", currentBlog.url);
        setDataInfo(div, currentBlog);

        return page;
    }
}

/*
    Baut die Blogübersicht aus allen zu einem Blog gehörenden Posts
 */
const bloguebersicht = {
    render(allPosts){
        console.log("View: Füllen der Blogübersicht");

        let page = document.getElementById("bloguebersicht").cloneNode(true);
        page.removeAttribute("id");

        let nav = page.querySelector("nav");
        page.querySelector("nav").remove();
        setDataInfo(nav, allPosts[0]);
        page.append(nav);

        let post = page.querySelector("article");
        page.querySelector("article").remove();

        if(allPosts){
            for(let p of allPosts){
                let temp = post.cloneNode(true);
                setDataInfo(temp, p);

                page.append(temp);
            }
        }
        else{
            //TODO Nur Button für Post erstellen anzeigen lassen
        }

        return page;
    }
}

/*
    Baut die Detailansicht aus einem Post und allen dazugehörigen Kommentaren
 */
const detailansicht = {
    render(currentPost, comments){
        console.log("View: Füllen der Detailansicht");

        let page = document.getElementById("detailansicht").cloneNode(true);
        page.removeAttribute("id");

        let post = page.firstElementChild;
        page.firstElementChild.remove();
        setDataInfo(post, currentPost);

        let comment = page.firstElementChild;
        page.firstElementChild.remove();
        page.append(post);

        if(comments.length > 0){
            for(let c of comments){
                let temp = comment.cloneNode(true);
                setDataInfo(temp, c);

                page.append(temp);
            }
        }

        return page;
    }
}

/*
    Formular für das editieren eines Posts
*/
const editView = {
    render(blog, post) {
        let page = document.getElementById("editor").cloneNode(true);
        page.removeAttribute("id");

        if(post){
            setDataInfo(page, post);
        }

        let speichern = function(event) {
            event.preventDefault();

            let titleElem = page.querySelectorAll("p")[0];
            let title = titleElem.innerHTML;
            let content = page.querySelectorAll("p")[3].innerHTML;

            if (!(/[a-zA-Z0-9]/.test(title.charAt(0)))) {
                alert("Der erste Buchstabe des Titels muss alphanumerisch sein.");
                while(titleElem.hasChildNodes()){
                    titleElem.removeChild(titleElem.firstChild);
                }
                return false;
            }else if (titleElem.firstChild){
                let children = titleElem.children;
                for(let i = 0; i < children.length; i++){
                    let child = children[i];
                    if (child.tagName === "DIV"){
                        while(titleElem.hasChildNodes()){
                            titleElem.removeChild(titleElem.firstChild);
                        }
                        alert("Der Titel darf keine Umbrüche enthalten.");
                        return false;
                    }
                }
            }
            if(confirm("Änderungen speichern?")) {
                if(post) {
                    post.title = title;
                    post.content = content;
                    presenter.editPost(blog.blogid, post.postid, post.title, post.content);
                    window.history.back();

                } else {
                    presenter.addNewPost(blog.blogid, title, content);
                    window.history.back();
                }
            }
        };

        let zurueck = function(event) {
            if(confirm("Nicht speichern?"))
                window.history.back();
        };

        let speichernButton = page.querySelectorAll("button")[0];
        speichernButton.addEventListener("click", speichern);

        let zurueckButton = page.querySelectorAll("button")[1];
        zurueckButton.addEventListener("click", zurueck);

        return page;
    }
};


/*
    Formular für das Anlegen eines Posts
 */
const addPost = {
    render(blog){
        console.log(`View: Anlegen eines neuen Posts in Blog ${blog.blogname}`);

        let handleSave = function (event) {
            if (event.target.value === "save") {
                console.log(`View: handleSave: Speichern Button wurde gedrückt`);
                event.preventDefault();
                let form = document.getElementById("addPostForm");
                presenter.addPost(blog.blogid, form.title.value, form.content.value);
            }
        };

        let page = document.getElementById("addPost").cloneNode(true);
        page.removeAttribute('id');
        setDataInfo(page, blog);

        page.addEventListener("click", handleSave);
        return page;
    }
}

/*
    Ersetzt ein Element element mit dem Objekt object
 */
function setDataInfo(element, object){
    let cont = element.innerHTML;
    for (let key in object){
        let rexp = new RegExp("%" + key, "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
}