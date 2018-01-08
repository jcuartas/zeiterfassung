$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});

function ze_login() {
	var i_email = document.getElementById('email').value;
    var i_pass = document.getElementById('pass').value;
    $.ajax({
        //url : "http://localhost:8888/Zeiterfassung/www/php/main.php",
        url : "http://yarawixcommerce.esy.es/zeiterfassung/www/php/main.php",
        type : "POST",
        data : {email : i_email, pass : i_pass, fid : 'login', login : ''},
        dataType: 'json',
        
        success : function(result, rtype){
            // Correct response
            window.localStorage.setItem("loggedIn", 1);
            window.localStorage.setItem("u_session", result.u_session);
            if (result.success == 1) {
                window.location.href = "zeiterfassung.html?u_session="+result.u_session;   
            }
            else{
                window.location.href = "index.html";
                
                $("#suc_err").append(result.message);
                $("#suc_err").class("alert alert-danger");
            }
            
            //alert(JSON.stringify(result));
            //console.log(result.message);
        },
        
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": "+ + xhr.responseText);
            alert("error");
        }
    });
    
}

function logout() {
    //alert("Logout");
    window.localStorage.removeItem("loggedIn");
    window.localStorage.removeItem("u_session");
    window.location.href = "index.html";
    $("#suc_err").append("Successfully Logged Out!");
    $("#suc_err").class("alert alert-success");

}

function qry_benproj() {
    var in_session = window.localStorage.getItem("u_session");
    //alert("in_session = "+in_session);
    $.ajax({
        //url : "http://localhost:8888/Zeiterfassung/www/php/zeiterfassung.php",
        url : "http://yarawixcommerce.esy.es/zeiterfassung/www/php/zeiterfassung.php",
        type : "POST",
        data : { u_session : in_session, qry : 'benpro' },
        dataType : 'json',
        
        success : function(result, rtype){
            // Correct response
            // alert(JSON.stringify(result));
            //window.localStorage.SetItem("loggedIn", 1);
            //window.localStorage.setItem("u_session", result.u_session);
            if (result.success == 1) {
                //console.log(JSON.stringify(result));
                //alert(JSON.stringify(result));
                var allepd = result.allep;
                //console.log(JSON.stringify(allepd));
                //alert(JSON.stringify(allepd));
                
                $("#alleprojekte").empty();
                
                $("#alleprojekte").append(
                "<table id='alleproj' class='table table-hover'>"+
                                  "<tr>"+
                                      "<th style='text-align: center'>Nummer</th>"+
                                      "<th style='text-align: center'>Titel</th>"+
                                    "</tr>");
                $(allepd).each(function(index, allepd){
                    $("#alleproj").append(
                                    "<tr style='background-color:"+allepd.color+"' onClick='currentProject("+allepd.pkprojekt+");'>"+
                                        "<td>"+ allepd.nummer +"</td>"+
                                        "<td>"+ allepd.titel +"</td>"+"</tr>"
                    );
                });
                
                $("#alleprojekte").append("</table>");
                
            }
            else{
                alert("error");
            }
            
            //alert(JSON.stringify(result));
            //console.log(result.message);
        },
        
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": "+ + xhr.responseText);
            alert("error");
        }
    });
}

function ze_register(){
    var i_name = document.getElementById('name').value;
    var i_email = document.getElementById('email').value;
    var i_pass = document.getElementById('pass').value;
    var i_confirm_pass = document.getElementById('confirm_pass').value;

    $.ajax({
        //url : "http://localhost:8888/Zeiterfassung/www/php/main.php",
        url : "http://yarawixcommerce.esy.es/zeiterfassung/www/php/main.php",
        type : "POST",
        data : {name : i_name, email : i_email, pass : i_pass, confirm_pass : i_confirm_pass, fid : 'register', register : ''},
        dataType: 'json',
        
        success : function(result, rtype){
            // Correct response
            if (result.success == 1) {
                window.location.href = "index.html";   
            }
            else{
                window.location.href = "register.html";
                
                $("#suc_err").append(result.message);
                $("#suc_err").class("alert alert-danger");
            }
            
            alert(JSON.stringify(result));
            //console.log(result.message);
        },
        
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": "+ + xhr.responseText);
            alert("error");
        }
    });

}

$(document).ready(function(){
    $('#accordion').on('shown.bs.collapse', function (e) {
        //alert('Event fired on #' + e.target.id);
        if (e.target.id == "collapseOne"){
            qry_benproj();
        }
        else if(e.target.id == "collapseTwo") {
            //alert("2");
            qry_benlaufproj();
        }
        else if(e.target.id == "collapseThree") {
            alert("3");
        }
        else if (e.target.id == "collapseFour") {
            //alert("4");
            qry_pause();
        }
    });
});

function qry_benlaufproj() {
    var in_session = window.localStorage.getItem("u_session");
    //alert("in_session = "+in_session);
    $.ajax({
        //url : "http://localhost:8888/Zeiterfassung/www/php/zeiterfassung.php",
        url : "http://yarawixcommerce.esy.es/zeiterfassung/www/php/zeiterfassung.php",
        type : "POST",
        data : { u_session : in_session, qry : 'benlaufpro' },
        dataType : 'json',
        
        success : function(result, rtype){
            // Correct response
            // alert(JSON.stringify(result));
            //window.localStorage.SetItem("loggedIn", 1);
            //window.localStorage.setItem("u_session", result.u_session);
            if (result.success == 1) {
                //console.log(JSON.stringify(result));
                var laufpd = result.laufproj;
                //console.log(JSON.stringify(laufd));
                
                $("#laufprojekte").empty();
                
                $("#laufprojekte").append(
                "<table id='laufende' class='table table-hover'>"+
                                  "<tr>"+
                                      "<th style='text-align: center'>Nummer</th>"+
                                      "<th style='text-align: center'>Titel</th>"+
                                      "<th style='text-align: center'>Start Zeit</th>"+
                                    "</tr>");
                $(laufpd).each(function(index, laufpd){
                     
                    
                     $("#laufende").append(
                                        "<tr onClick='currentProject("+laufpd.pkprojekt+");'>"+
                                        "<td>"+ laufpd.nummer +"</td>"+
                                        "<td>"+ laufpd.titel +"</td>"+
                                        "<td>"+ laufpd.startzeit +"</td>"+"</tr>"
                    );
                });
                
                $("#laufprojekte").append("</table>");
                
            }
            else{
                alert("error");
            }
            
            //alert(JSON.stringify(result));
            //console.log(result.message);
        },
        
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": "+ + xhr.responseText);
            alert("error");
        }
    });
}

function qry_pause() {
    var in_session = window.localStorage.getItem("u_session");
    //alert("in_session = "+in_session);
    $.ajax({
        //url : "http://localhost:8888/Zeiterfassung/www/php/zeiterfassung.php",
        url : "http://yarawixcommerce.esy.es/zeiterfassung/www/php/zeiterfassung.php",
        type : "POST",
        data : { u_session : in_session, qry : 'pause' },
        dataType : 'json',
        
        success : function(result, rtype){
            // Correct response
            // alert(JSON.stringify(result));
            //window.localStorage.SetItem("loggedIn", 1);
            //window.localStorage.setItem("u_session", result.u_session);
            if (result.success == 1) {
                //console.log(JSON.stringify(result));
                var pause = result.pause;
                //console.log(JSON.stringify(laufd));
                
                $("#pause").empty();
                
                $("#pause").append(
                "<table id='tblpause' class='table table-hover'>"+
                                  "<tr>"+
                                      "<th style='text-align: center'>Start Zeit</th>"+
                                      "<th style='text-align: center'>End Zeit</th>"+
                                      "<th style='text-align: center'>Status</th>"+
                                    "</tr>");
                $(pause).each(function(index, pause){
                    $("#tblpause").append(
                                    "<tr>"+
                                        "<td>"+ pause.startzeit +"</td>"+
                                        "<td>"+ pause.endzeit +"</td>"+
                                        "<td>"+ pause.status +"</td>"+"</tr>"
                    );
                });
                
                $("#pause").append("</table>");
                
            }
            else{
                alert("error");
            }
            
            //alert(JSON.stringify(result));
            //console.log(result.message);
        },
        
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": "+ + xhr.responseText);
            alert("error");
        }
    });
}

function ze_bodyload(){
    if (window.localStorage.getItem("projpk") == 1) {
        var pk = window.localStorage.getItem("projpk");
        currentProject(pk);
    }
}
