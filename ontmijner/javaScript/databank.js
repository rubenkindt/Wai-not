var httpObject=null;
function getHTTPObject(){
	if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
    else if (window.XMLHttpRequest) return new XMLHttpRequest();
    else {
        alert('Your browser does not support AJAX.');
        return null;
    }
}
function databank(){
	httpObject =getHTTPObject();
	if(httpObject!=null){
		httpObject.open("GET","databankOntmijner.php?user="+document.getElementById('user').innerHTML+"&score="+document.getElementById('score').innerHTML,true);
		httpObject.send(null);
	}
}
