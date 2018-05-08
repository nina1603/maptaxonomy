var down = document.getElementById("downTriangle");
var up = document.getElementById("upTriangle");
var wind = document.getElementById("leftWindow");
var hidden = document.getElementById("hidden");

down.onclick = openExtraField;
up.onclick = closeExtraField;

function openExtraField(event)
{
  up.style.display = 'block';
  down.style.display = 'none';
  hidden.style.display = 'block';
  }
  
  function closeExtraField(event)
{
  down.style.display = 'block';
  up.style.display = 'none';
  hidden.style.display = 'none';
  }
