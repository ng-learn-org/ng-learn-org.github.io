function getParam ( name ) {
    var params = location.search.substr(location.search.indexOf("?")+1).split("&");
    var val = "";
    for (var i=0; i<params.length; i++)
       {
         temp = params[i].split("=");
         if ( [temp[0]] == name ) { val = temp[1]; }
       }
    return val;
}

function appendDocument( document ) {
    var content = $("<div/>").html(document.body).text();
    if ( content.length > 300 ) {
        content = content.substring(0,300)+'...';
    }
    $('#search-results')
        .append('<article><header class="post-meta">'+
                '<h3><a href="'+ document.url + '" rel="bookmark permalink">'+
                document.title+'</a></h3></header>'+
                '<div class="content">'+content+'</div>'+
                '<footer>'
                +'<a href="'+document.url+'" class="btn btn-custom read-more-align">Read More</a>'
                +'</footer>' +
                '<hr>');
}

$(document).ready(function() {
    var searchTerm = getParam("query");
    var results = index.search(searchTerm);
    $('#search-results').empty();

    if ( results.length > 0 ) {
        results.forEach(function(result) {
            var document = documents[result.ref];
            appendDocument(document);
        });
    }

    else {
        $('#search-results')
            .append('<div class="alert alert-danger">'+
                    'No results found for <b>'+searchTerm+'</b></div>');

        documents.forEach(function(document) {
            appendDocument(document);
        });
    }

});
