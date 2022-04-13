let ticketCopy = document.getElementById('ticketCopy');
let nameCopy = document.getElementById('nameCopy');
let manageTicket = document.getElementById('manageTicket');
var nativeMessagingHost = 'com.villainsoftware.support_ex_caller';

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
    //const ticketNum = window.document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate").innerHTML.split(" ")[0];
    const ticketNum = window.document.querySelector("#brandBand_2 > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li.slds-page-header__detail-block.slds-p-right_small.slds-p-top_medium > div > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > a").innerHTML;
    console.log("Ticket found: " + ticketNum);
   // const contactName = window.document.querySelector("#brandBand_2 > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li:nth-child(4) > div:nth-child(2) > a").innerHTML;
    const contactName = window.document.querySelector("#brandBand_2 > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li:nth-child(4) > div:nth-child(2) > a").innerHTML;
    return { 'ticketNum': ticketNum, 'contactName': contactName };
};
/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
var jsCodeStr = ';(' + funcToInject + ')();';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
            {code: jsCodeStr}, function(arg) {
            var ticketNum = arg[0]["ticketNum"];
            var contactName = arg[0]["contactName"]
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

var clipCopy = function(elementId) {
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
}

manageTicket.onclick = function(element) {
    var ticketNum = document.getElementById('ticket_found').innerHTML;
    chrome.runtime.sendNativeMessage(nativeMessagingHost,
        { "ticketNum": ticketNum },
        function(response) {
            console.log("Received " + JSON.stringify(response));
            var resEl = document.createElement("p");
            resEl.innerHTML = JSON.stringify(response);
            document.body.appendChild(resEl);
        });
};
