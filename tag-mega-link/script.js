function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

// fetches paramter from the url
function getUrlParam(parameter, defaultvalue){
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1){
      urlparameter = getUrlVars()[parameter];
      }
  return urlparameter;
}

// place data from the url params in the page
function setup() {
  var megalink = getUrlParam('mega','Empty');
  document.getElementById('megaLinkText').innerText = megalink;
  document.getElementById('megaLinkText').href = megalink;
  document.getElementById('megaInput').value = megalink;
  var server = getUrlParam('server', 'Empty');
  document.getElementById('serverInput').value = server;
  var msgid = getUrlParam('msgid', 'Empty');
  document.getElementById('msgidInput').value = msgid;
}

// sets background to a random image stored in the bgimages folder
function backgroundSetup(){
  var totalCount = 8;
  var num = Math.ceil( Math.random() * totalCount );
  document.body.style.backgroundImage = "url('bgimages/" + num + ".gif')"
  //document.body.style.backgroundImage = "url('https://i.imgur.com/2grnPtW.gif')";
}

// sends off everything to the bot to be constructed into a discord message and posted
function sendToDiscordBot(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var successContainer = document.createElement("div");
      successContainer.className = "animate-bottom"
      successContainer.style = "display:block;"
      successContainer.style.textAlign = "center"
      var successText = document.createElement("p");
      successText.innerHTML = JSON.parse(this.responseText).response + "<br>" + "&#10003";
      successText.style.fontSize = "300%"
      successText.style.color = "#4fffa0"
      successContainer.appendChild(successText)
      document.getElementById("container").innerHTML = "";
      document.getElementById('container').appendChild(successContainer)
    }
  }
  xhttp.onerror = function(e){
    alert("Unknown Error Occured. Server response not received.<br>(The server hosting the bot is probably down)");
  };
  xhttp.open("POST", "http://134.209.69.73:8080/post-tagged-mega", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  const postData = JSON.stringify({
    "artist": document.getElementsByName("artist")[0].value,
    "album": document.getElementsByName("album")[0].value,
    "filetype": document.getElementsByName("filetype")[0].value,
    "year": document.getElementsByName("year")[0].value,
    "genre": document.getElementsByName("genre")[0].value,
    "description": document.getElementsByName("description")[0].value,
    "mega": document.getElementsByName("mega")[0].value,
    "server": document.getElementsByName("server")[0].value,
    "msgid": document.getElementsByName("msgid")[0].value
  })
  document.getElementById("container").innerHTML = "";
  var loadElement = document.createElement("div");
  loadElement.className = "loader";
  document.getElementById("container").appendChild(loadElement);
  xhttp.send(postData);
  return false;
}

// reformats discogs url to discogs api url format
function formatDiscogsURL(url){
  var splitURL = url.split('/');
  const apiURL = "https://api.discogs.com/" + splitURL[splitURL.length-2] + "s/" + splitURL[splitURL.length-1];
  return apiURL;
}

// verfiys is a url is a discogs releases or master url
function verifyDiscogsURL(url){
  if (url.includes("discogs.com") && (url.includes("release") || url.includes("master"))) return true; else return false;
}

// disables the discogs tagging button and inserts a loading icon inside it
function disableDiscogsBtn(){
  document.getElementById("discogsTagBtn").innerText = "";
  var discogsLoader = document.createElement("div");
  discogsLoader.className = "discogsBtnLoader";
  document.getElementById("discogsTagBtn").appendChild(discogsLoader);
  document.getElementById("discogsTagBtn").disabled = true;
}

// enables the discogs tagging button
function enableDiscogsBtn(){
  document.getElementById("discogsTagBtn").innerText = "Tag Using ";
  var discogsLogo = document.createElement("img");
  discogsLogo.src = "./resources/discogs-primary-logo.png";
  document.getElementById("discogsTagBtn").appendChild(discogsLogo);
  document.getElementById("discogsTagBtn").disabled = false;
}

// fetch tags from a discogs link
function fetchDiscogsTags(){
  var link = prompt("Enter Discogs Link")
  if (link == null){
    return;
  }
  const goodLink = verifyDiscogsURL(link);
  if (goodLink == false){
    alert("Invalid Url")
    return;
  }
  disableDiscogsBtn();
  const apiURL = formatDiscogsURL(link)
  fetch(apiURL).then((response) => {
  response.json().then((data) => {
      //console.log(data);
      if (data.master_url != undefined){
        fetch(data.master_url).then((responseMaster) => {
        responseMaster.json().then((dataMaster) => {
          applyDiscogsTags(dataMaster);
        });
        });
      }
      else{
        applyDiscogsTags(data);
      }
  });
  });
}

// set inputs in form using fetched tags from discogs
function applyDiscogsTags(data){
  //console.log(data)
  var artists = "";
  for (var i = 0; i < data.artists.length; i++){
    if (i != 0){
      artists += ", ";
    }
    artists += data.artists[i].name;
  }
  if (data.artists != undefined) document.getElementsByName("artist")[0].value = artists;
  if (data.title != undefined) document.getElementsByName("album")[0].value = data.title;
  if (data.year != 0) document.getElementsByName("year")[0].value = data.year;
  if (data.styles != undefined) document.getElementsByName("genre")[0].value = data.styles.join(", ");
  enableDiscogsBtn()
}
</script>

</head>
<body class="backgroundStyle" >

<form action="#" accept-charset="UTF-8" onsubmit="sendToDiscordBot(); return false;">
  <div id="container" class="container">
    <p2 style="font-size: 150%;font-weight: bold">Please Add Tags for: </p2>
    <br> <a href="" id="megaLinkText"></a><br>
    <button id="discogsTagBtn" type="button" class="registerbtn" style="font-size: 20px" onclick="fetchDiscogsTags()">
      Tag Using
      <img src="./resources/discogs-primary-logo.png">
    </button>
    <hr>

    <label for="Artist"><b>Artist</b></label>
    <input type="text" placeholder="Enter Artist" name="artist" required>

    <label for="Album"><b>Album</b></label>
    <input type="text" placeholder="Enter Album Title" name="album" required>

    <label for="FileType"><b>File Type</b></label>
    <input type="text" placeholder="Enter File Type" name="filetype" required>

    <label for="Year"><b>Year (Optional)</b></label>
    <input type="number" placeholder="Enter Year Released" name="year" >

    <label for="Genre"><b>Genre (Optional)</b></label>
    <input type="text" placeholder="Enter Genre" name="genre" >

    <label for="Description"><b>Description (Optional)</b></label><br>
    <textarea name="description" placeholder="Enter Description"></textarea>

    <input id="megaInput" type="hidden" name="mega">

    <input id="serverInput" type="hidden" name="server">

    <input id="msgidInput" type="hidden" name="msgid">

    <hr>
    <button type="submit" class="registerbtn" style="font-size: 20px">Submit</button>
  </div>
</form>

</body>
<script type="text/javascript">
setup();
backgroundSetup();
// Adjust size of the container for mobile devices
if (window.innerWidth < 600){
  document.getElementById("container").style.width = "98%";
  document.getElementById("container").style.height = "98vh";
  document.getElementById("container").style.top = "0px";
  document.getElementById("container").style.left = "0px";
  document.getElementById("container").style.margin = "auto";
}
