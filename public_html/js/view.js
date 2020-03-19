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
        console.log("View: Füllen des momentanen Blogs ");
        let page = document.getElementById("bloginfo").cloneNode(true);
        page.removeAttribute("id");

        let div = page.querySelector("div");
        let a = div.querySelector("a");
        a.setAttribute("href", allBlogs[0].url);
        setDataInfo(div, allBlogs[0]);

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
        let post = page.querySelector("article");
        page.lastElementChild.remove();

        if (!allPosts)
            return;
        for(let p of allPosts){
            let temp = post.cloneNode(true);
            setDataInfo(temp, p);
            page.append(temp);
        }
        return page;
    }
}

/*
    Baut die Detailansicht aus einem Post und allen dazugehörigen Kommentaren
 */
const detailansicht = {
    render(currentPost, allCommentsOfPost){
        console.log("View: Füllen der Detailansicht");

        let page = document.getElementById("detailansicht").cloneNode(true);
        page.removeAttribute("id");

        let post = page.firstElementChild;
        page.firstElementChild.remove();
        setDataInfo(post, currentPost);

        let comment = page.firstElementChild;
        page.firstElementChild.remove();

        page.append(post);


        for(let c of allCommentsOfPost){
            let temp = comment.cloneNode(true);
            setDataInfo(temp, c);

            page.append(temp);
        }


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