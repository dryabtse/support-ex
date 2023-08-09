const nativeMessagingHost = 'com.villainsoftware.support_ex_caller';

const contextType = {
    Help: "help",
    Hub: "hub",
    SalesForce: "sf",
    Atlas: "atlas",
    Default: "none"
};


async function getTabURL() {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0].url;
};

getTabURL().then((link) => {
    console.log(link);
    const context = setContext(link);
    console.log(context);
    var funcToInject = null;
    var callback = function() {};

    switch(context) {
        case contextType.Help:
            funcToInject = funcToInjectHelp;
            callback = callbackHelp;
            break;
        case contextType.Hub:
            funcToInject = funcToInjectHub;
            callback = callbackHub;
            break;
        case contextType.SalesForce:
            funcToInject = funcToInjectSF;
            callback = callbackSF;
            break;
        case contextType.Atlas:
            funcToInject = funcToInjectAtlas;
            callback = callbackAtlas;
            break;
        default:
            funcToInject = function() {};
            callback = function() {};
    };

    var jsCodeStr = ';(' + funcToInject + ')();';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true},
            func: funcToInject 
        }, 
        callback
        );
    });
});

function callbackSF(injectionResults) {
    // for (const frameResult of injectionResults)
        // console.log('Frame Title: ' + JSON.stringify(frameResult.result));
    const contactName = injectionResults[0].result["contactName"];
    const ticketNum = injectionResults[0].result["ticketNum"];
    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            ticket_found.removeAttribute("hidden");
            ticketCopy.removeAttribute("hidden");
            manageTicket.removeAttribute("hidden");
        };
        if ((contactName.length > 0)) {
            if (contactName != "none found") {
                contact_name.innerHTML = contactName;
                contact_name.removeAttribute("hidden");
                nameCopy.removeAttribute("hidden");
            };
        };
    }; // else
};

function callbackHelp(injectionResults) {
    const ticketNum = injectionResults[0].result["ticketNum"];

    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            ticket_found.removeAttribute("hidden");
            ticketCopy.removeAttribute("hidden");
            manageTicket.removeAttribute("hidden");
        };
    }; // else
};

function callbackHub(injectionResults) {
    for (const frameResult of injectionResults)
            console.log('Frame Title: ' + JSON.stringify(frameResult.result));

    const contactName = injectionResults[0].result["contactName"];
    const ticketNum = injectionResults[0].result["ticketNum"];
    const cloudLink = injectionResults[0].result["cloudLink"];
    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            ticket_found.removeAttribute("hidden");
            ticketCopy.removeAttribute("hidden");
            manageTicket.removeAttribute("hidden");
        };
        if ((contactName.length > 0)) {
            contact_name.innerHTML = contactName;
            contact_name.removeAttribute("hidden");
            nameCopy.removeAttribute("hidden");
        };
        if ((cloudLink.length > 0)) {
            try {
                new URL(cloudLink);
                atlasAdmin.removeAttribute("hidden");
                atlasAdmin.onclick = function() {
                    window.open(cloudLink, '_blank');
                };
            } catch (e) {
                atlasAdmin.style.display = "none";
            };
        };
    }; // else
};

function callbackAtlas(injectionResults) {
    const project = injectionResults[0].result["project"];
    const baseURL = "https://cloud.mongodb.com/v2";
    var destinationURL = baseURL + "/admin#/atlas/search";

    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((project.length > 0) && (typeof(project[0]) === 'string')) {
            if (project === 'admin' || project === 'none') {
                ticket_found.style.display = "none";
                atlasAdmin.style.display = "none";
            } else  {
                ticket_found.innerHTML = project;
                // ticket_found.style.display = "none";
                ticketCopy.innerText = "Project To Clipboard";
                ticketCopy.removeAttribute("hidden");

                atlasAdmin.removeAttribute("hidden");
                atlasAdmin.onclick = function() {
                    if (project != "null") {
                        destinationURL = destinationURL + "?search=" + project + "&operator=AND";

                    }
                    window.open(destinationURL,'_blank');
                };
                
                getTabURL().then((link) => {
                    const parsedURL = new URL(link);
                    if (parsedURL.hash.split('/')[2] != "logRequestHistory")
                        atlasLogs.removeAttribute("hidden");
                });

                atlasLogs.onclick = function() {
                    if (project != "null") {
                        destinationURL = baseURL + '/' + project + "#/deployment/logRequestHistory";
                        window.open(destinationURL,'_blank');
                    };
                }
        
            };
        };
    }; // else
};

    
function setContext(url) {
        if (url.includes("jira.mongodb.org/browse/HELP")) {
            c = contextType.Help;
        } else if (url.includes("mongodb.lightning.force.com")) {
            c = contextType.SalesForce;
        } else if (url.includes("hub.corp.mongodb.com")) {
            c = contextType.Hub;
        } else if (url.includes("cloud.mongodb.com")) {
            c = contextType.Atlas;
        } else 
            c = contextType.Default;
        
        return c;
};

const funcToInjectHelp = function() {
        var ticketNum = "";
        var element = null;
        const getCurrentURL = function() {
            return window.location.href
        };
        url = getCurrentURL();
        var link = new URL(url);

        ticketNum = link.pathname.split("/")[2];
        console.log("Ticket found: " + ticketNum);
        return { 'ticketNum': ticketNum };
};

const funcToInjectSF = function() {
    var ticketNum = "";
    
    var contactName = "";
    var element = null;

    element = window.document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs.slds-no-print > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a > span.title.slds-truncate");
    if (element) {
        ticketNum = element.innerHTML.split(":")[0].split('|')[0].trim();
    } else ticketNum = "none found";
    
    element = window.document.querySelector("#brandBand_2 > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li:nth-child(4) > div:nth-child(2) > a");

    if (element) {
        contactName = element.innerHTML;
    } else contactName = "none found";

    return { 'ticketNum': ticketNum, 'contactName': contactName };

};

const funcToInjectAtlas = function() {
    var project = "none";
    const getCurrentURL = function() {
        return window.location.href
      };
      
    // To get the current URL
    const url = getCurrentURL(); 

    var link = new URL(url);
    const pathSplit = link.pathname.split("/");
    if (pathSplit.length >= 3 )
        project = pathSplit[2];

    return { 'project': project };
}

const funcToInjectHub = function() {
    var ticketNum = "";
    var element = null;
    var contactName = "";

    const getCurrentURL = function() {
        return window.location.href
    };
    url = getCurrentURL();
    var link = new URL(url);

    ticketNum = link.pathname.split("/")[2];
    console.log("Ticket found: " + ticketNum);
    element = window.document.querySelector("#case-header > div > div > div.case-header-bottom-div > div.case-header-fields-section > div:nth-child(2) > div > div:nth-child(3) > a > span");
    
    if (element) {
        contactName = element.innerHTML;
    } else contactName = "none found";

    element = window.document.querySelector("#__next > div > section.main-section > section > div > div.page-overview-container.case-body > div.page-overview-sidebar > div:nth-child(4) > div > div.tip-card-content-container > div > div > div:nth-child(2) > a");
    if (element) {
        cloudLink = element.href;
    } else cloudLink = "none";

    return { 'ticketNum': ticketNum, 'contactName': contactName, 'cloudLink': cloudLink };

}


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
    const ticketNum = ticket_found.innerHTML;
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
