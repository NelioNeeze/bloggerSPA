/*
    Adresse über die man auf die Webschnittstelle meines Blogs zugreifen kann:
*/
"use strict";
const model = (function () {
    // Private Variablen
    let loggedIn = false;
    let pathGetBlogs = 'blogger/v3/users/self/blogs';
    let pathBlogs = 'blogger/v3/blogs';

    // Private Funktionen
    /*
        Formatiert den Datum-String in date in zwei mögliche Datum-Strings:
        long = false: 24.10.2018
        long = true: Mittwoch, 24. Oktober 2018, 12:21
     */
    function formatDate(date, long) {
        var date1 = new Date(date);
        // Kurzes Format
        if(!long){
            let newDate = date1.getDate() + "." + (date1.getMonth() + 1) + "." + date1.getFullYear();
            return newDate;
        }
        // Langes Format
        else{
            let weekdays =
                ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
            let months =
                ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

            return weekdays[date1.getDay()] + ", " + date1.getDate() + "." + months[date1.getMonth() - 1] + " " + date1.getFullYear()+ ", " + date1.getHours() + ":" + date1.getMinutes()
        }
    }

    /*
        Konstruktoren für Daten-Objekte
     */
    function Blog(blog){
        console.log(`Model: Erstellen eines Blogobjekts über den Konstruktor: ${blog.name}`);

        this.blogid = blog.id;
        this.blogname = blog.name;
        this.postcount = blog.posts.totalItems;
        this.blogcreate = blog.published;
        this.blogedit = blog.updated, true;
        this.url = blog.url;
        this.longCreateDate = formatDate(blog.published, true);
        this.shortCreateDate = formatDate(blog.published, false);
        this.longEditDate = formatDate(blog.updated, true);
        this.shortEditDate = formatDate(blog.updated, false);
    }

    function Post(post){
        console.log(`Model: Erstellen eines Postobjekts über den Konstruktor: ${post.title}`);

        this.postid = post.id;
        this.blogid = post.blog.id;
        this.title = post.title;
        this.content = post.content;
        this.createDate = post.published;
        this.editDate = post.updated;
        this.comments = post.replies.totalItems;
        this.longCreateDate = formatDate(post.published, true);
        this.shortCreateDate = formatDate(post.published, false);
        this.longEditDate = formatDate(post.updated, true);
        this.shortEditDate = formatDate(post.updated, false);
    }

    function Comment(comment){
        console.log(`Model: Erstellen eines Commentobjekts über den Konstruktor.: ${comment.id} by ${comment.author.displayName}`);

        this.commentid = comment.id;
        this.blogid = comment.blog.id;
        this.postid = comment.post.id;
        this.author = comment.author.displayName;
        this.commentcreate = comment.published;
        this.commentedit = comment.updated;
        this.content = comment.content;
        this.longCreateDate = formatDate(comment.published, true);
        this.shortCreateDate = formatDate(comment.published, false);
        this.longEditDate = formatDate(comment.updated, true);
        this.shortEditDate = formatDate(comment.updated, false);
    }

    // Oeffentliche Methoden
    return {
        setLoggedIn(b){
            loggedIn = b;
        },

        isLoggedIn(){
            return loggedIn;
        },

        /*
            Liefert den angemeldeten Nutzer mit allen Infos
         */
        getSelf(callback) {
            console.log("Model: Aufruf von getSelf()");
            var request = gapi.client.request({
                'method': 'GET',
                'path': 'blogger/v3/users/self'
            });
            // Execute the API request.
            request.execute((result) => {
                callback(result);
            });
        },

        /*
            Liefert alle Blogs des angemeldeten Nutzers
         */
        getAllBlogs(callback) {
            console.log("Model: Aufruf von getAllBlogs()");
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathGetBlogs
            });
            // Execute the API request.
            request.execute((result) => {
                let blogs = [];
                if(result.items){
                    for (let b of result.items) {
                        blogs.push(new Blog(b));
                    }
                }
                callback(blogs);
            });
        },

        /*
            Liefert den Blog mit der Blog-Id bid
         */
        getBlog(bid, callback) {
            console.log(`Model: Aufruf von getBlog(${bid})`);
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid
            });
            // Execute the API request.
            request.execute((result) => {
                if(result)
                    callback(new Blog(result));
                else callback();
            });
        },


        /*
            Liefert alle Posts zu der  Blog-Id bid
         */
        getAllPostsOfBlog(bid, callback) {
            console.log(`Model: Aufruf von getAllPostsOfBlog(${bid})`);
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts'
            });
            // Execute the API request.
            request.execute((result) => {
                let posts = [];
                if(result.items){
                    for (let p of result.items) {
                        posts.push(new Post(p));
                    }
                }
                callback(posts);
            });
        },

        /*
            Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
         */
        getPost(bid, pid, callback) {
            console.log(`Model: Aufruf von getPost(${bid}, ${pid})`);
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts/' + pid
            });
            // Execute the API request.
            request.execute((result) => {
                if(result)
                    callback(new Post(result));
            });
        },

        /*
            Liefert alle Kommentare zu dem Post mit der Post-Id pid
            im Blog mit der Blog-Id bid
         */
        getAllCommentsOfPost(bid, pid, callback) {
            console.log(`Model: Aufruf von getAllCommentsOfPost(${bid}, ${pid})`);
            var request = gapi.client.request({
                'method': 'GET',
                'path': pathBlogs + "/" + bid + '/posts/' + pid + "/comments"
            });
            // Execute the API request.
            request.execute((result) => {
                let comments = [];
                if(result.items){
                    for (let c of result.items) {
                        comments.push(new Comment(c));
                    }
                    console.log(`Model: ${comments.length} Kommentare gefunden.`)
                }
                callback(comments);
            });
        },

        /*
            Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid
            im Blog mit der Blog-Id bid
            Callback wird ohne result aufgerufen
        */
        deleteComment(bid, pid, cid, callback) {
            console.log(`Model: Aufruf von deleteComment(${bid}, ${pid}, ${cid})`);
            var path = pathBlogs + "/" + bid + '/posts/' + pid + "/comments/" + cid;
            console.log(path);
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': path
            });
            // Execute the API request.
            request.execute(callback);
        },

        /*
            Fügt dem Blog mit der Blog-Id bid einen neuen Post
            mit title und content hinzu, Callback wird mit neuem Post aufgerufen
         */
        addNewPost(bid, title, content, callback) {
            console.log(`Model: Aufruf von addNewPost(${bid}, ${title}, ${content})`);
            var body = {
                kind: "blogger#post",
                title: title,
                blog: {
                    id: bid
                },
                content: content
            };

            var request = gapi.client.request({
                'method': 'POST',
                'path': pathBlogs + "/" + bid + '/posts',
                'body': body
            });
            // Execute the API request.
            request.execute(callback);
        },

        /*
            Aktualisiert title und content im geänderten Post
            mit der Post-Id pid im Blog mit der Blog-Id bid
         */
        updatePost(bid, pid, title, content, callback) {
            console.log(`Model: Aufruf von updatePost(${bid}, ${pid}, ${title}, ${content})`);
            var body = {
                kind: "blogger#post",
                title: title,
                id: pid,
                blog: {
                    id: bid
                },
                content: content
            };

            var request = gapi.client.request({
                'method': 'PUT',
                'path': pathBlogs + "/" + bid + '/posts/' + pid,
                'body': body
            });
            // Execute the API request.
            request.execute(callback);
        },

        /*
            Löscht den Post mit der Post-Id pid im Blog mit der Blog-Id bid,
            Callback wird ohne result aufgerufen
         */
        deletePost(bid, pid, callback) {
            console.log(`Model: Aufruf von deletePost(${bid}, ${pid})`);
            var path = pathBlogs + "/" + bid + '/posts/' + pid;
            console.log(path);
            var request = gapi.client.request({
                'method': 'DELETE',
                'path': path
            });
            // Execute the API request.
            request.execute(callback);
        }
    };
})();