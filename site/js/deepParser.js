var down = document.getElementById("downTriangle");
var up = document.getElementById("upTriangle");

down.onclick = openExtraField;
up.onclick = closeExtraField;

function openExtraField(event)
{
  up.style.display = 'block';
  down.style.display = 'none';
  }
  
  function closeExtraField(event)
{
  down.style.display = 'block';
  up.style.display = 'none';
  }
