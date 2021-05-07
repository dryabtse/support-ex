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
    var ticketNum = window.document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate").innerHTML.split(" ")[0];
    console.log("Ticket found: " + ticketNum);
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
