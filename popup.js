let clipCopy = document.getElementById('clipCopy');
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
    // var ticketNumLink = window.document.querySelector("#brandBand_1 > div > div > one-record-home-flexipage2 > forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___cases_lwc___case___view > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li.slds-page-header__detail-block.slds-p-right_small.slds-p-top_medium > div > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > a");
    // var ticketNum = window.document.querySelector("#\\31 033\\:0 > div > div > div > div > ul.tabBarItems.slds-tabs--default__nav > li.oneConsoleTabItem.tabItem.slds-tabs--default__item.slds-sub-tabs__item.slds-grid.slds-grid--vertical-align-center.slds-tabs__item--overflow.slds-active.active.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate").innerHTML.split(" ")[0];
    //var ticketNumLink = window.document.querySelector("#oneHeader > div.bBottom > div > div.slds-context-bar__secondary.navCenter > div > div > ul.tabBarItems.slds-grid > li.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.oneConsoleTabItem > a > span.title.slds-truncate");
    var ticketNum = window.document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate").innerHTML.split(" ")[0];
    //console.log("Ticket found: " + ticketNumLink.innerHTML);
    console.log("Ticket found: " + ticketNum);
    //return ticketNumLink.innerHTML.substr(0,8);
    return ticketNum;
};
/* This line converts the above function to string
 * (and makes sure it will be called instantly) */
var jsCodeStr = ';(' + funcToInject + ')();';

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
            {code: jsCodeStr}, function(ticketNum) {
            if (chrome.runtime.lastError) {
            /* Report any error */
                alert('ERROR:\n' + chrome.runtime.lastError.message);
            } else if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
                document.getElementById("ticket_found").innerHTML = ticketNum;
            };
    });
});

clipCopy.onclick = function(element) {
    var ticketNum = document.getElementById('ticket_found');

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(ticketNum);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(ticketNum);
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
