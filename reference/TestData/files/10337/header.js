function parseStylesheets() {}

function AttachEvent(elementObj, eventName, eventHandlerFunctionName){  
	if (elementObj.addEventListener)   { // Non-IE browsers    
		elementObj.addEventListener(eventName, eventHandlerFunctionName, false);		  
	}   
	else if (elementObj.attachEvent)   { // IE 6+    
		elementObj.attachEvent('on' + eventName, eventHandlerFunctionName);  
	}   else   { // Older browsers     
		var currentEventHandler = elementObj['on' + eventName];    
		if (currentEventHandler == null)     {      
			elementObj['on' + eventName] = eventHandlerFunctionName;    
		}     else     {      
			elementObj['on' + eventName] = function(e) { currentEventHandler(e); eventHandlerFunctionName(e); }    
		}  
	}
}


// Global vars
var nTimerID;
var nStdDelay = 10;


function timerClear()
{
  clearTimeout(nTimerID);
}

function timerOff(szObj, nMs)
{
  var szTmp="toggleVis('" + szObj + "',0)";
  //alert(szTmp);
  if (nMs)
    nTimerID = setTimeout(szTmp, nMs);
  else
    nTimerID = setTimeout(szTmp, 50);
}

function helpWindow(helpUrl)
{
  // alert("helpUrl ["+helpUrl+"]");
  var handle = window.open(helpUrl, "pqhelp", "resizable=yes,height=520,width=500,top=0,left=75,scrollbars=yes,location=yes,menubar=no,toolbar=yes");
  handle.focus();  
}

function profileExternalWindow(extUrl) {
  // alert("extUrl [" + extUrl + "]");
  var handle = window.open(extUrl, "PQprofileExt", "location,scrollbars,resizable,width=550,height=450");
  handle.focus();  
}

function getw()
{ 
  var w;
  if((navigator.appName == "Netscape")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    w = window.innerWidth;
  } 
  else if((navigator.appName== "Microsoft Internet Explorer")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    w = document.body.clientWidth;
  }
  else
  { 
    w=1 ;
  }
  return w;
}

function geth()
{ 
  var h;
  if((navigator.appName == "Netscape")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    h  = window.innerHeight;
  } 
  else if ((navigator.appName== "Microsoft Internet Explorer")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    h = document.body.clientHeight;
  }
  else
  { 
    h=1;
  }
  return h;
}

function getx()
{
  var xMax;
  if((navigator.appName == "Netscape")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    xMax=screen.width;
  }
  else if((navigator.appName== "Microsoft Internet Explorer")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    xMax=screen.width;
  }
  else
  { 
    xMax=1;
  }
  return xMax;
}

function gety()
{ 
  var yMax;
  if((navigator.appName == "Netscape")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    yMax=screen.height;
  }
  else if((navigator.appName== "Microsoft Internet Explorer")&&(navigator.userAgent.indexOf("4.") != -1))
  { 
    yMax=screen.height;
  }
  else 
  { 
    yMax=1;
  }
  return yMax;
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}


