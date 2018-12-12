$(document).ready(function () {
    $("#notes").hide();
    scrapeAll();
});

const scrapeAll = () => {
    $.ajax("/api/scrape", {
        type: "Get"
    }).done(function (data) {
        console.log(data);
    });
}

$(document).on("click", "button", function () {
    $("#notes").empty();
    $("#notes").show();
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

let titleString;
let bodyString;

$(document).on("keyup", "#titleinput", function() {
    titleString = $("#titleinput").val();
});

$(document).on("keyup", "#bodyinput", function() {
    bodyString = $("#bodyinput").val();
});

$(document).on("click", "#savenote", function () {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: titleString,
            body: bodyString
        }
    })
        .then(function (data) {
            $("#notes").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
    titleString = '';
    bodyString = '';
    $("#notes").hide();
});