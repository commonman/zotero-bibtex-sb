<!--


/* **********************************************************************
 * 
 *   Generic form validation
 *
 * **********************************************************************
*/ 

function isNotEmpty(form, fieldName) {
    var occupied = false;

    if ( form ) {
        var field = form.elements[fieldName];
        if ( field ) {
            var value = field.value;
            // alert("value for field " + fieldName + " is [" + value + "]");
            if ( value ) {
                value = trim(value);
                if ( value.length > 0 )
                    occupied = true;
            }
        }
    }

    // alert("isNotEmpty returning " + occupied);
    return occupied;
}

function atLeastOneCheckbox(form, checkboxName) {
var obj = form.elements[checkboxName];
if(obj.length == undefined) {
  // if there was only 1 checkbox
  if(form.elements[checkboxName].checked == true) {
    return true;
  }
} else {
	for (i=0; i<obj.length; i++) {
	  	if (obj[i].checked==true) {
    		  return true;
		   }
	   }
	   return false;  
	}
}

/* **********************************************************************
 *   P O P U P S
 * 
 * - Create popup windows for search tools and browsable fields
 * - popupLaunch brings up a popup window
 * - popupPopulate populates the search box in the popup window (if there
 *   is one) with the contents of the field that requested the popup,
 *   then submits the form. (Submit is currently commented out.)
 * - popupAddtoSearch adds selected items to the appropriate field
 *   in the appropriate search form
 * - popupClose closes the popup window when leaving a page from which
 *   popups could be launched. This includes: Basic Search, Advanced 
 *   Search, Publication Search, Results. Only these pages should call 
 *   this script using onUnLoad.
 * - functions called using href and the onUnLoad event handler
 *
 * **********************************************************************
 */ 

// GLOBAL variables
var popup = null; 	// All popups share the window named "popup"
var lastPopupPage; 	// Remember the last popup page the user was on
var form; 			// The search form the user came from, e.g. Basic, Advanced
var field; 			// The field that requested the popup, e.g. Author field
var URL_popup;		// URL of the popup window being requested, e.g. browse_naics.html
var mnemonic;		// Mnemonic used for the selected item, e.g. SO for publications
var popupText;		// What to paste back into the search form 
var undefined;      // NEVER set this variable. It must remain undefined.

/**
 * lunch a pop up window and store the target form name and the target
 * field name into cookie
 * @URL_string -- the URL of the popup window
 * @targetFormName -- The name of the form which contains the target field
 * @targetFieldName -- The name of the form input field which will hold the
 *  selected value(s) from the popup window.
 * 
 * Modified: Changhong Li
 */
function launchPopup(URL_string, targetFormName, targetFieldName, referFlag) {

	popup = window.popup;
	if (popup == null || popup.closed) {
		var tmpURL = URL_string;
		if (typeof referFlag != "undefined")
			tmpURL = "";
		popup = window.open(tmpURL,'popup','menubar=no,toolbar=yes,location=yes,status=no,scrollbars=yes,resizable=yes,height=400,width=540,left=150,top=0');
	}
	else {
		if(URL_string != lastPopupPage) {
			popup.location = URL_string;
		} // end if same page
	}
	// We always set focus to it
	popup.focus();
	lastPopupPage = URL_string;
	// store target form name and targetFieldName into cookie
	if (typeof targetFormName == "undefined") targetFormName = "";
	if (typeof targetFieldName == "undefined") targetFieldName = "";
	document.cookie="TargetForm=" + targetFormName;
	document.cookie="TargetField=" + targetFieldName;	
}

function launchAlertPopup(alertUrl) {
    parent.holdWindow=window.open(alertUrl, "AlertPopup", "menubar=no,toolbar=yes,location=no,status=no,scrollbars=yes,resizable=yes,height=400,width=480,left=150,top=0");
    parent.holdWindow.focus();
}

// Special function for handling the browse accounting and tax (BAC) popup.
//
// The requirement is to NOT close the BAC popup when the user clicks on
// a document link. Instead, the document view page should be displayed
// in the main window and the BAC popup should be left open. Then, on the 
// document view page, the Back link should just bring the BAC popup to the
// front. If the BAC popup was closed by the user, the Back link should just
// redisplay the BAC popup.
// Sounds simple but it isn't. The problem is that in order to determine if
// BAC popup is still open, the document view page needs the popup window handle.
// But the document view page doesn't have it. The popup was not opened from 
// the document view page. It was opened from a different 
// page (Basic/Advanced Search, or NPC browse).
// To get the popup window handle to the top frame of the document view page,
// the BAC popup will pass it's handle to the setAccTaxPopupHandle function in the parent 
// frameset (retrieveframeset.vtpl), which in turn passes it along to the 
// top frame (retrievebanner.vtpl). The top frame then sets the global variable
// accTaxPopup to the passed in popup window handle. The following function will examine that
// accTaxPopup global to determine if the popup is still open.
//
// This mess is further complicated by the fact that the BAC popup can't be opened
// via javascript. The BAC popup needs to know the referring URL. However IE doesn't
// pass the referring URL if the window was opened via javascript. But we also need
// to open the window with a specific size and without a menu bar. That can only be
// done with javascript. To get around those Redmond geniuses, we need to open a 
// blank window with the correct size using the name 'acctax'. We then return true to
// the onclick handler so it will execute the href in it's target window (acctax).
// Bottom line; call this function like this:
// <a href='http://BASpopupURL' target='acctax' onclick='return launchACCTAXPopup();'>BAS Popup</a>
function launchACCTAXPopup() {
//debugger;
	var ret = false;
	accTaxPopup = window.accTaxPopup;
	if (accTaxPopup == null || accTaxPopup.closed) {
		// the BAC popup was never opened or was closed
		// we need to open a blank window with the desired attributes
		accTaxPopup = window.top.open("",'acctax','menubar=no,toolbar=yes,location=yes,status=no,scrollbars=yes,resizable=yes,height=400,width=540,left=150,top=0');
		// and return true so the href in the <a> tag is executed by the browser
		ret = true;
	}
	// We always set focus to it
	accTaxPopup.focus();
	return ret;
}

function popupLaunch(input) {
	var inputArray = input.split(",");
	
	var form = inputArray[0];
	var field = inputArray[1];
	var URL_popup = inputArray[2];
	
	// If the popup doesn't exist/was closed, create it
	if (popup == null || popup.closed) {
		popup = window.open(URL_popup,'popup','menubar=no,toolbar=yes,location=no,status=no,scrollbars=yes,resizable=yes,height=400,width=480,left=150,top=0'); 
	} // end if popup doesn't exist
	
	// Else the popup exists/is still open in the background
	else {
		/* Is the user returning to the same page? 
		 * e.g. They drilled down several levels in Browse Topics and
		 * want to return to this same page to continue adding items.
		 * Or do they want a different popup page?
		 */
		if(URL_popup != lastPopupPage) {
			popup.location = URL_popup;
			lastPopupPage = URL_popup;
		} // end if same page
	} // end else popup exists
	
	popup.focus();
	
	// Populate the hidden form fields: inputPopupForm and inputPopupField
	// BUT only if they exist, which they won't for Search Tips
	// Or should this be done with popupPopulate()?
	
} // end popupLaunch


function popupPopulate() {
	// If the popup has a search box, populate it 
	if(document.formPopup.inputPopupSearchBox) {
		document.formPopup.inputPopupSearchBox.value = opener.document.formBasic.inputBasicSearchBox.value;
		// popup.formPopup.submit(); // Still need to submit the form and run the search
	}
}


function popupAddtoSearch(input) {
	var inputArray = input.split(",");
	
	form = opener.document.formvarPopup.inputPopupForm.value;
	field = opener.document.formPopup.inputPopupField.value;
	mnemonic = inputArray[0];
	popupText = inputArray[1];
	
	//mnemonic = input2Array[0];
	//popupText = input2Array[1];
	
	/* if(More options open) {
	 * 		if(Basic) {
	 * 		}
	 * 		if(Adv) {
	 * 		}
	 * }
	 *
	 * if(More options closed) {
	 * 		if(Basic) {
	 * 		}
	 * 		if(Adv) {
	 * 		}
	 * }
	 */
	
	// If the field is not empty (already populated) 
	if((opener.document.form.field.value != "")&&(popupText != "")) {
		opener.document.form.field.value = opener.document.form.field.value + " AND " + mnemonic + "(" + popupText + ")";
	}
	else {
		opener.document.form.field.value = mnemonic + "(" + popupText + ")";
	}
} // end popupAddtoSearch


function popupClose() {
	if (popup && (popup.closed !== undefined) && ! popup.closed) // If popup window exists and is open, close it
		popup.close(); 
}

hWindow = null;
function holdingsWindow(targetURL) {

	// If the popup doesn't exist/was closed, create it
	if (hWindow == null || hWindow.closed) {
		hWindow = window.open(targetURL,'ProQuest','menubar=no,toolbar=yes,location=no,status=no,scrollbars=yes,resizable=yes,height=400,width=480,left=150,top=0');
		}
    else {
        hWindow.location = targetURL;
    }
    hWindow.focus();
}

gaWindow = null;
function genAccWindow(targetURL) {

	// If the popup doesn't exist/was closed, create it
	if (gaWindow == null || gaWindow.closed) {
		gaWindow = window.open(targetURL,'ProQuest','menubar=yes,toolbar=yes,location=yes,status=yes,scrollbars=yes,resizable=yes');
		}
    else {
        gaWindow.location = targetURL;
    }
    gaWindow.focus();
}





/* **********************************************************************
 *   A L E R T S
 * 
 * - Alert users when:
 * 		Classic products:
 *			- logging out
 * 			- changing databases from Recent Searches
 * 		TPDs:
 * 			- clearing recent searches
 * 			- clearing saved searches
 * 			- saving a recent search ( DESIRABLE )
 * - alertMessage brings up an alert message
 * - alertCloseRedirect closes the alert window and refreshes the 
 *   popup window
 * - alertCloseCloseRedirect closes the alert window and the popup
 *   window and refreshes the main window
 * - functions called using href, BUT should use form submit
 *
 * **********************************************************************
 */

function alertMessage(URL_string) {
	var message = window.message; // All alerts share the window named "message"
	
	message = window.open(URL_string,'message','menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,height=200,width=400,left=300,top=200');

	message.focus();
} // end alertMessage


function alertCloseRedirect(URL_string) {
	opener.location = URL_string;
	window.close();
} // end alertCloseRedirect


function alertCloseCloseRedirect(URL_string) {
	opener.alertCloseRedirect(URL_string);
	window.close();
} // end alertCloseCloseRedirect






/* **********************************************************************
 *   P R O T O T Y P E   S C R I P T S   O N L Y   !!!
 * 
 * - These functions are ONLY used to demonstrate/prototype behaviors
 * - They MUST be changed for production
 * - changeDatabase changes the databases using the databases dropdown
 * - reDirect simulates the animated Q
 * - whichCitationStyle outputs which citation style is selected
 * - citationURL redirects users to the appropriate citation style page
 * - functions called using href and the onChange event handler
 *
 * **********************************************************************
 */ 

function changeDatabase(URL_string) {
	var URLArray = URL_string.split(",");

	if (URLArray[1] == "_blank") // if blank, target="_blank"
		window.open(URLArray[0]);
	else // else, load in the same window
		document.location = URLArray[0];
}


function reDirect(URL_string) {
	// Pause 3 seconds then redirect the page to the target URL
	setTimeout("top.location.href = '" + URL_string + "'",3000);
}


function whichCitationStyle() {
	var index;
	document.SbwBasic.citationStyle.value = "";
	for (index = 0; index < document.SbwBasic.citationStyle.length; index++)
		if (document.SbwBasic.citationStyle[index].checked)
	return document.SbwBasic.citationStyle[index].value;
}


function citationURL(citationStyle) {
	window.location = "../Classic/marked_citations_" + citationStyle + ".html";
}






/* **********************************************************************
 *   D A T E S
 * 
 * - Create dates strings, e.g. "May 19, 2003", for use in 
 *   Marked Lists: My Research Summary, Citation Styles
 * - writeDate    creates "1-15-2003"
 * - writeDateAPA creates "January 1, 2003"
 * - writeDateCAD creates "1 January 2003"
 * - writeDateMLA creates "1 Jan. 2003"
 * - functions called using JavaScript calls
 *
 * **********************************************************************
 */
 
// GLOBAL variables
var thetime = new Date();

var nmonth = thetime.getMonth();
	nmonth += 1;
	if (nmonth == 1)
		nmonth = "January";
	if (nmonth == 2)
		nmonth = "February";
	if (nmonth == 3)
		nmonth = "March";
	if (nmonth == 4)
		nmonth = "April";
	if (nmonth == 5)
		nmonth = "May";
	if (nmonth == 6)
		nmonth = "June";
	if (nmonth == 7)
		nmonth = "July";
	if (nmonth == 8)
		nmonth = "August";
	if (nmonth == 9)
		nmonth = "September";
	if (nmonth == 10)
		nmonth = "October";
	if (nmonth == 11)
		nmonth = "November";
	if (nmonth == 12)
		nmonth = "December";
		
var abbrmonth;	// Abbreviated month
	if (nmonth.length == 3)
		abbrmonth = nmonth.substr(0,3);
	else
		abbrmonth = nmonth.substr(0,3) + ".";
	
var ntoday = thetime.getDate();

var nyear = thetime.getYear();
	if (nyear <= 99)
		nyear = "19" + nyear;
		
	if ((nyear > 99) && (nyear < 2000))
		nyear += 1900;

		
function writeDate() {
	document.write(nmonth + "-" + ntoday + "-" + nyear);
}

function writeDateAPA() {
	document.write(nmonth + " " + ntoday + ", " + nyear);
}

function writeDateCAD() {
	document.write(ntoday + " " + nmonth + " " + nyear);
}

function writeDateMLA() {
	document.write(ntoday + " " + abbrmonth + " " + nyear);
}






/* **********************************************************************
 *   S H O W  /  H I D E   B E H A V I O R
 * 
 * - Show or hide div layers for:
 * 		- Hiding "Back to..." links on printer-friendly pages
 * 		- Nested list behavior, e.g. Classification codes, NAICS/SIC
 * 		- Dynamic links on Advanced Search page
 * 		- Dates dropdown, e.g. Custom date range...
 * 		- Updates dropdown in CINAHL, PsycINFO More Search Options
 * 		- More Search Options
 * 		- Reviews, e.g. More review options...
 * - printPage			controls printing
 * - IsChild, IsImmChild, OpenCloseParent, and expantIt	
 * 						control nested list behavior
 * - changeLink 		controls dynamic links on Advanced Search page
 * - functions called using href, onChange and onLoad event handlers
 *
 * **********************************************************************
 */

// GLOBAL variables


function printPage() {
    if (typeof window.print != "undefined")
        window.print();

} // end printPage



// Nested list behavior

/* IsChild - PADD! 23-Aug-02
 * finds if the nNum is child of nTitle or not
 * according to this logic 112230 would be child of 11, 112, 1122 so on
 */
function  IsChild(nTitle, nNum) {
	while(nNum > 0) {
		if(nNum == nTitle)
			return true;
		nNum = Math.floor(nNum/10);
	} // end while

	return false;
} // end IsChild



/* IsImmChild - PADD! 23-Aug-02
 * finds if the nNum is immediate child of nTitle or not
 * according to this logic 112230 would be imm child of 11223 only 
 */
function IsImmChild(nTitle, nNum) {
	if(nTitle == Math.floor(nNum/10))
		return true;
	else
		return false;
} // end IsImmChild





/* expandIt - PADD! 23-Aug-02
 * following expands or collapse the <div> related to the
 * passed number. it opens only the immediate childs but 
 * collapses all the children
 * each <div> has id with the form d111 (d + number)
 */
function expandIt(el_no) {
	var elm;
	var img;
	var expanding;
	//var msg;
	//msg = "";

	for(var i=  document.getElementById('d' + el_no); i != null; i = i.nextSibling) {
		elm =i;

		if(elm.nodeType == 1 && elm.nodeName == "DIV") {
			//msg += elm.nodeName + ' ' + elm.id + '\n';
			var eno = elm.id.substr(1);
			
			if(el_no != eno && IsChild(el_no, eno) == true) {
				if(elm.style.visibility == "visible") {
					elm.style.visibility = "hidden";
					elm.style.display = "none";
					OpenCloseParent(eno, false);
				}
				else if(IsImmChild(el_no, eno) == true) {
					elm.style.visibility = "visible";
					elm.style.display = "block";
					OpenCloseParent(eno, true);
				}
			} // if el_no
		} // if div
	} // for

	// alert(msg);
} // end expandIt



// Show/Hide dynamic links on Advanced Search page

function changeLink(URL_String,whichDiv,whichLink) {
	var URLArray = URL_String.split(",");
	
	if (document.layers) {
		if (URL_String == "")
			tmpFolderString = "&nbsp;";
		else
			tmpFolderString = '<a href=\"javascript:popupLaunch(\'form,field,browse_' + URLArray[1] + '.html\')\;">Browse ' + URLArray[0] + '</a>';
		WriteToLayer(whichDiv,tmpFolderString);
	} // end if
	
	else if (!(GetBrowserName() == "explorer" && GetBrowserVersion() == "4")) {
		var countElement = document.getElementById(whichDiv);
			
		if (countElement) {
			if (URL_String == "")
				countElement.innerHTML = "&nbsp;";
			else
				countElement.innerHTML = '<a href=\"javascript:popupLaunch(\'form,field,browse_' + URLArray[1] + '.html\')\;">Browse ' + URLArray[0] + '</a>';
		} // end if countElement
	} // end else if
} // end changeLink


function findSelIndex(sel, val) {
    var ret = -1;

    if ( sel && val ) {
        options = sel.options;
        if ( options ) {
            for ( i = 0; i < options.length; i++ ) {
                if ( options[i].value == val ) {
                    ret = i;
                    break;
                }
            }
        }
    }
    return ret;
}

var ftDefValue = "";
var ftDefIndex = -1;
function clearMoreOpts() 
{
   var formName = "";
   if(document.frmBasicSrch)
   {
     formName = document.frmBasicSrch;
   }
   else
   {
     formName = document.frmAdvancedSrch;
   }

// here we cycle through all of the possible moreOpts and clear them if they exist
   if(formName.pubtitle)
   {
      formName.pubtitle.value ="";
   }   
   
   if(formName.author)
   {
      formName.author.value ="";
   }
   
   if(formName.Opauthor)
   {
      formName.Opauthor.selectedIndex = 0;
   }
   
   if(formName.OpSTYPE)
   {
      formName.OpSTYPE.selectedIndex = 0;
   }
     
   if(formName.FT)
   {
      if ( ftDefIndex < 0 ) {
         ftDefIndex = findSelIndex(formName.FT, ftDefValue);
         if ( ftDefIndex < 0 ) {
            ftDefIndex = 0;
         }
      }
      formName.FT.selectedIndex = ftDefIndex;
   }
   
   if(formName.AT)
   {
      formName.AT.selectedIndex = 0;
   }
   
   if(formName.STYPE)
   {
      formName.STYPE.selectedIndex = 0;
   }

   if(formName.sortby)
   {
     // Per John law, we will NOT reset this option
     // formName.sortby.selectedIndex = 0;
   }   
   
   if(formName.subject)
   {
      formName.subject.value = "";
   }   
   
   if(formName.geo)
   {
      formName.geo.value = "";
   }   
   
   if(formName.name)
   {
      formName.name.value = "";
   }   
   
   if(formName.company)
   {
      formName.company.value = "";
   }   
   
   if(formName.cc)
   {
      formName.cc.value = "";
   }   
   
   if(formName.sic)
   {
      formName.sic.value = "";
   }   
   
   if(formName.Opsic)
   {
      formName.Opsic.selectedIndex = 0;
   }   
   
   if(formName.cc)
   {
      formName.Opcc.selectedIndex = 0;
   }   
   
   if(formName.Opcompany)
   {
      formName.Opcompany.selectedIndex = 0;
   }   
   
   if(formName.Opname)
   {
      formName.Opname.selectedIndex = 0;
   }   
   
   if(formName.Opgeo)
   {
      formName.Opgeo.selectedIndex = 0;
   }   
   
   if(formName.Opsubject)
   {
      formName.Opsubject.selectedIndex = 0;
   }   
   
   if(formName.Oppubtitle)
   {
      formName.Oppubtitle.selectedIndex = 0;
   }   
   
   
}

function setMoreOpt() {
     var formName = "";
     if (document.frmBasicSrch) {
       formName = document.frmBasicSrch;
     } else {
       formName = document.frmAdvancedSrch;
     }

     var elem = document.getElementById("moreOpt");
     if (elem && (elem.style.display == "block")) {
         formName.moreOptState.value = "OPEN";
     } else {
         formName.moreOptState.value = "CLOSED";
     }
}
   


// This holds the values that should be assigned to all form elements when it is cleared.
// Think of it as a Map keyed by input element name. E. g., for "<input name='SSM' ...>",
// clearedValues["SSM"] (if it exists) will hold its cleared value. Be sure to have a
// default cleared value for when the Map doesn't hold a given key.
var clearedValues = new Object();

/**
 * Clear all the fields in a form
 *    1) Text Box -- set value to empty
 *    2) Radio button -- unselect
 *    3) Check box -- unselect
 *    4) Single selection drop down list -- unselect any selection and show the first option in the drop down
 *    5) Multiple selection drop down list -- unselect any selection and show the first option in the drop down
 * Author: Changhong Li
 */
function clearForm(form) {
	var elements = form.elements;
	var element;
	for (var i=0; i<elements.length; i++) {
		element = form.elements[i];
		if (element.type == "text") {
			element.value="";
		} else if (element.type == "radio") {
			element.checked = false;
		} else if (element.type == "checkbox") {
			element.checked = false;
		} else if (element.type == "select-one") {
			if(element.name == "DBId"){}
			else
			element.selectedIndex = 0;
			
		} else if (element.type == "select-multiple") {
			
			// move the focus to first option
			element.selectedIndex = 1;
			// clear all the selection
			element.selectedIndex = -1;
		} 
		
	}
}

/* **********************************************************************
 *  COOKIE
 * 
 * **********************************************************************/

/**
 * Get cookie value by name
 * @param cookieName -- the name of the cookie
 * @return The value of the cookie as a string
 */
function getCookie(cookieName) {
	var allcookies = document.cookie;
	var pos = allcookies.indexOf(cookieName+"=");
	if(pos == -1)
		return null;

	var start = pos+cookieName.length+1;
	var end = allcookies.indexOf(";", start);
	if(end == -1)
		end=allcookies.length;
	var value = allcookies.substring(start, end);
	value = unescape(value);
	return value;
}

/* **********************************************************************
 *  JAVASCRIPT UNITLITY FUNCTION  
 * 
 *  Generic utility javascript functions
 * **********************************************************************/
 
function ltrim ( s )
{
	return s.replace( /^\s*/, "" );
}

function rtrim ( s )
{
	return s.replace( /\s*$/, "" );
}

function trim ( s )
{
	return rtrim(ltrim(s));
}

function getWindowWidth()
{
  var myWidth = 600;
  if( typeof( window.innerWidth ) == 'number' ) {
    myWidth = window.innerWidth;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    myWidth = document.documentElement.clientWidth;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    myWidth = document.body.clientWidth;
  }
  return myWidth;
}
			
function getWindowHeight() {
  var myHeight = 400;
  if( typeof( window.innerWidth ) == 'number' ) {
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}

function getScrollY() {
  var scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    scrOfY = window.pageYOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    scrOfY = document.body.scrollTop;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    scrOfY = document.documentElement.scrollTop;
  }
  return scrOfY;
}

//Set a temp expando to store the current selectedIndex
function SelectOnFocusIn()
{
	try
	{
		var eSrc = window.event.srcElement;
		if (eSrc) 
			eSrc.tmpIndex = eSrc.selectedIndex;
	}
	catch (e)
	{
	// ignore errors
	}
}
//restore the selectedIndex
function SelectOnFocus()
{
	try
	{
		var eSrc = window.event.srcElement;
		if (eSrc) 
			eSrc.selectedIndex = eSrc.tmpIndex;
	}
	catch (e)
	{
	// ignore errors
	}
}

function reviseYourSearch() {
	var oDiv = document.getElementById("moreOpt");
	if (oDiv) {
		oDiv.style.display="none";
	}
	toggleMoreOptVis();
}

function logDOI(sDOI) {
	var reqImage = new Image();
	reqImage.src = sDOI;	// use pre-ajax method to send the request
}

//-->