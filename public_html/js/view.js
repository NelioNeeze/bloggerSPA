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

const editView = {
    render(blog, post) {
        console.log(`View: Editieren eines Posts`)

        //Eventhandler fürs Speichern
        let handleSave = function (event) {
            if (event.target.value === "save") {
                event.preventDefault();
                //TODO
            }
        };

        //Befüllen des Formulars mit vorhandenen Daten
        let fillForm = function(){
            form.title.value = post.title;
            form.content.value = post.content;
        }

        //Wenn Post vorhanden, dann edit, sonst neuen Post anlegen
        let edit;
        if (post)
            edit = true;
            console.log(`View: Post ${post.title} wird bearbeitet`);
        else
            edit = false;
            console.log(`View: Neuer Post in Blog ${blog.name} wird angelegt.`);

        let page = document.getElementById("editPost").cloneNode(true);
        page.removeAttribute('id');
        let form = page.querySelector("form");

        //Wenn edit, fülle Formular mit Daten
        if (edit) {
            fillForm();
            let path = `detailansicht/${post.blogid}/${post.postid}`;
            let buttons = form.querySelectorAll("button");
            for (let b of buttons){
                b.dataset.path = path;
            }
        }
        page.addEventListener("click", handleSave);
        return page;
    }
}
*/

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

                //TODO remove this once done testing
                console.log("Blog ID: " + blog.blogid);
                console.log("Titel: " + form.title.value);
                console.log("Content: " + form.content.value);

                presenter.addPost(blog.blogid, form.title.value, form.content.value);
            }
        };

        let page = document.getElementById("addPost").cloneNode(true);
        page.removeAttribute('id');
        let form = page.querySelector("form");

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