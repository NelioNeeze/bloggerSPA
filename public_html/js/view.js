"use strict";

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

const currentBlog = {
    render(allBlogs){
        let page = document.getElementById("bloginfo").cloneNode(true);
        page.removeAttribute("id");

        let div = page.querySelector("div");
        let a = div.querySelector("a");
        a.setAttribute("href", allBlogs[0].url);
        setDataInfo(div, allBlogs[0]);

        return page;
    }
}

const bloguebersicht = {
    render(allPosts){
        let page = document.getElementById("bloguebersicht").cloneNode(true);
        page.removeAttribute("id");
        let post = page.querySelector("article");


        if (!posts)
            return;
        for(let p of allPosts){
            let temp = post.cloneNode(true);
            setDataInfo(temp, p);

            return page;
        }
    }
}

const detailansicht = {
    render(data){

    }
}

function setDataInfo(element, object){
    let cont = element.innerHTML;
    for (let key in object){
        let rexp = new RegExp("%" + key, "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
}