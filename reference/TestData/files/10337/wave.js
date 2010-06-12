var animDelay = 20;
var animFileName = "/images/common/srchanim.gif";
var oContainer = null;

/*
 * Needed by the accounting/tax popup to stop the animation
 *  after the main page has been submitted.
 */
function stopFeedback()
{
	if (oContainer) {
		oContainer.style.visibility = "hidden";
	}	
}

/*
 * This is the main public function to start the search animation.
 * Due to an IE bug/feature, all animations are stopped when a page is submitted.
 * To get around the geniuses at MS, we need to start the animation AFTER
 * the form has submitted with a setTimeout. However, Opera ignores this. So
 * we also need to start the animation right away for Opera.
 *
 */
function searchFeedback()
{
	setTimeout("realFeedback()", animDelay);
	realFeedback();
}

/*
 * The whereIsButton element is located where we want the animation to display.
 */
function realFeedback()
{
	var oButton = document.getElementById("whereIsButton");
	if (oButton == null) {
		return;
	}
	
	var iLeft = DL_GetElementLeft(oButton);
	var iTop = DL_GetElementTop(oButton);
	
	if (oContainer == null) {
		oContainer = document.createElement("SPAN");
		document.body.appendChild(oContainer);
	}
	
	oContainer.style.position = "absolute";
	oContainer.style.top = iTop + "px";
	oContainer.style.left = iLeft + "px";
	oContainer.style.visibility = "visible";
	oContainer.innerHTML = "<img src='"+animFileName+"'>";
	
	// The container must be visibile BEFORE the image src is set or IE will
	// not show the animation. This is why the image src is not set when the page first
	// loads and just hidden until needed.
//	oButton.style.visibility = "visible";
//	oButton.style.display = "";	// setting display to "" will allow for both <span> and <div> containers
//	oButton.innerHTML = "<img src='"+animFileName+"'>";

	// get rid of annoying focus rect on buttons
	if (typeof window.focus != "undefined")
		window.focus();	
	return;
}

// the following scripts were found on 
// http://www.webreference.com/dhtml/diner/realpos4/
function DL_GetElementLeft(eElement)
{
   if (!eElement && this)                    
   {                                         
      eElement = this;                       
   }                                         

   var DL_bIE = document.all ? true : false; 

   var nLeftPos = eElement.offsetLeft;       
   var eParElement = eElement.offsetParent;  

   while (eParElement != null)
   {                                         

      if(DL_bIE)                             
      {
         if( (eParElement.tagName != "TABLE") && (eParElement.tagName != "BODY") )
         {                                   
            nLeftPos += eParElement.clientLeft; 
         }
      }
      else                                   
      {
         if(eParElement.tagName == "TABLE")  
         {                                   
            var nParBorder = parseInt(eParElement.border);
            if(isNaN(nParBorder))            
            {                                
               var nParFrame = eParElement.getAttribute('frame');
               if(nParFrame != null)         
               {
                  nLeftPos += 1;             
               }
            }
            else if(nParBorder > 0)          
            {
               nLeftPos += nParBorder;       
            }
         }
      }
      nLeftPos += eParElement.offsetLeft;    
      eParElement = eParElement.offsetParent; 
   }                                         
   return nLeftPos;                          
}

function DL_GetElementTop(eElement)
{
   if (!eElement && this)                    
   {                                         
      eElement = this;                       
   }                                         

   var DL_bIE = document.all ? true : false; 

   var nTopPos = eElement.offsetTop;         
   var eParElement = eElement.offsetParent;  

   while (eParElement != null)
   {                                         
      if(DL_bIE)                             
      {
         if( (eParElement.tagName != "TABLE") && (eParElement.tagName != "BODY") )
         {                                   
            nTopPos += eParElement.clientTop; 
         }
      }
      else                                   
      {
         if(eParElement.tagName == "TABLE")  
         {                                   
            var nParBorder = parseInt(eParElement.border);
            if(isNaN(nParBorder))            
            {                                
               var nParFrame = eParElement.getAttribute('frame');
               if(nParFrame != null)         
               {
                  nTopPos += 1;              
               }
            }
            else if(nParBorder > 0)          
            {
               nTopPos += nParBorder;        
            }
         }
      }

      nTopPos += eParElement.offsetTop;      
      eParElement = eParElement.offsetParent; 
   }                                         
   return nTopPos;                           
}

