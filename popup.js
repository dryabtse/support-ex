let ticketCopy = document.getElementById('ticketCopy');
let nameCopy = document.getElementById('nameCopy');
let manageTicket = document.getElementById('manageTicket');
const nativeMessagingHost = 'com.villainsoftware.support_ex_caller';



chrome.runtime.sendNativeMessage(nativeMessagingHost,
    { text: 'Hello'},
    function(response) {
        console.log("Received " + response);
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(response);
        };
    })

  /* The function that finds and returns the selected text */
var funcToInject = function() {
    var ticketNum = "";
    var contactName = "";
    var element = null;

    const getCurrentURL = function() {
        return window.location.href
      };
      
    // To get the current URL
    const url = getCurrentURL();

    if (url.includes("hub.corp.mongodb.com")) {
        const link = new URL(url);
        ticketNum = link.pathname.split("/")[2];
    } else {
        element = window.document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs.slds-no-print > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate");
        if (element) {
            ticketNum = element.innerHTML.split(":")[0];
        } else ticketNum = "none found";
    }

    console.log("Ticket found: " + ticketNum);

    if (url.includes("hub.corp.mongodb.com")) {
        element = window.document.querySelector("#case-header > div > div > div.case-header-bottom-div > div.case-header-fields-section > div:nth-child(2) > div > div:nth-child(3) > a > span");
    } else {
    // Contact name retrieval is currently broken       
        element = window.document.querySelector("#brandBand_2 > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li:nth-child(4) > div:nth-child(2) > a");
    }

    if (element) {
        contactName = element.innerHTML;
    } else contactName = "none found";

    // contactName = url;

    return { 'ticketNum': ticketNum, 'contactName': contactName };
};
/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
var jsCodeStr = ';(' + funcToInject + ')();';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true},
        func: funcToInject 
    }, 
    function(injectionResults) {
        for (const frameResult of injectionResults)
            console.log('Frame Title: ' + JSON.stringify(frameResult.result));
        const contactName = injectionResults[0].result["contactName"];
        const ticketNum = injectionResults[0].result["ticketNum"];
        if (chrome.runtime.lastError) {
        /* Report any error */
            alert('ERROR:\n' + chrome.runtime.lastError.message);
        } else {
            if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            document.getElementById("ticket_found").innerHTML = ticketNum;
            };
            if ((contactName.length > 0)) {
                document.getElementById("contact_name").innerHTML = contactName;
            };
    } // else
    });
});

const clipCopy = function(elementId) {
    const el = document.getElementById(elementId);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
    if (document.execCommand('copy')) {
        result = true;
        window.getSelection().empty();
    } else {
        console.error('failed to get clipboard content');
    }
};


ticketCopy.onclick = function(element) {
    clipCopy('ticket_found');
};

nameCopy.onclick = function(element) {
    clipCopy('contact_name');
};

manageTicket.onclick = function(element) {
    const ticketNum = document.getElementById('ticket_found').innerHTML;
    chrome.runtime.sendNativeMessage(nativeMessagingHost,
        { "ticketNum": ticketNum },
        function(response) {
            console.log("Received " + JSON.stringify(response));
            var resEl = document.createElement("p");
            resEl.innerHTML = JSON.stringify(response);
            document.body.appendChild(resEl);
        });
};

clearSides.onclick = function(element) {
    chrome.runtime.sendNativeMessage(nativeMessagingHost,
        { "clearSides": 1 },
        function(response) {
            console.log("Received " + JSON.stringify(response));
            const resEl = document.createElement("p");
            resEl.innerHTML = JSON.stringify(response);
            document.body.appendChild(resEl);
        });
}; 
