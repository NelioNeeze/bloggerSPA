"use strict";

const header = {
    render(allBlogs, currentBlog){
        console.log("Header: render von Header");

        let page = document.getElementById('header').cloneNode(true);
        page.removeAttribute('id');



        let ul = page.querySelector('ul');
        let liTemp = ul.firstElementChild;
        liTemp.remove();

        for(let b of allBlogs){
            let li = liTemp.cloneNode(true);
            ul.appendChild(li);
            setDataInfo(li, b);
        }



    }
}

const bloguebersicht = {
    render(data){

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