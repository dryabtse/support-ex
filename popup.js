const nativeMessagingHost = 'com.villainsoftware.support_ex_caller';

const getTabURL = async ()=> {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0].url;
};


// This is the main method

getTabURL().then((link) => {
    const context = setContext(link);
    var funcToInject = function() {};
    var callback = function() {};

    switch(context) {
        case contextType.Help:
            funcToInject = funcToInjectJira;
            callback = callbackHelp;
            break;
        case contextType.Jira:
            funcToInject = funcToInjectJira;
            callback = callbackJira;
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
    };
    console.log("context: " + context);
    const jsCodeStr = ';(' + funcToInject + ')();';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true},
            func: funcToInject
        },
        callback
        );
    });
});

const contextType = {
    Help: "help",
    Jira: "jira",
    Hub: "hub",
    SalesForce: "sf",
    Atlas: "atlas",
    Default: "none"
};


const callbackSF = function(injectionResults) {
    // for (const frameResult of injectionResults)
        // console.log('Frame Title: ' + JSON.stringify(frameResult.result));
    const contactName = injectionResults[0].result["contactName"];
    const ticketNum = injectionResults[0].result["ticketNum"];
    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string') && (ticketNum != 'none found')) {
            ticket_found.innerHTML = ticketNum;
            showElement(ticket_found);
	    showElement(openInCustomerHub);
            openInCustomerHub.onclick = function() {
                const destinationURL = "https://hub.corp.mongodb.com/case/" + ticketNum;
                window.open(destinationURL, '_blank');
            };
	    
            showElement(ticketCopy);
            showElement(manageTicket);
        };
        if ((contactName.length > 0)) {
            if (contactName != "none found") {
                contact_name.innerHTML = contactName;
                showElement(contact_name);
                showElement(nameCopy);
            };
        };
        showElement(askHelp);
        askHelp.onclick = function() {
            const destinationURL = "https://jira.mongodb.org/plugins/servlet/desk/portal/13";
            window.open(destinationURL, '_blank');
        };
    }; // else
};

const callbackHelp = function(injectionResults) {
    const ticketNum = injectionResults[0].result["ticketNum"];

    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            showElement(ticket_found);
            showElement(ticketCopy);
            showElement(manageTicket);
        };
    }; // else
};

const callbackJira = function(injectionResults) {
    const ticketNum = injectionResults[0].result["ticketNum"];

    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            showElement(ticket_found);
            showElement(ticketCopy);
        };
    }; // else
};

const callbackHub = function(injectionResults) {
    const contactName = injectionResults[0].result["contactName"];
    const ticketNum = injectionResults[0].result["ticketNum"];
    const cloudLink = injectionResults[0].result["cloudLink"];
    const sfscLink = injectionResults[0].result["sfscLink"];
    console.log(cloudLink);
    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((ticketNum.length > 0) && (typeof(ticketNum[0]) === 'string')) {
            ticket_found.innerHTML = ticketNum;
            showElement(ticket_found);
            showElement(ticketCopy);
            showElement(manageTicket);
        };
        if (contactName.length > 0) {
            contact_name.innerHTML = contactName;
            showElement(contact_name);
            showElement(nameCopy);
        };
        if (cloudLink.length > 0) {
            try {
                new URL(cloudLink);
                showElement(atlasAdmin);
                atlasAdmin.innerText = "Atlas Project";
                atlasAdmin.onclick = function() {
                    window.open(cloudLink, '_blank');
                };
            } catch (e) {
                hideElement(atlasAdmin);
            };
        };
	if (sfscLink.length > 0) {
	   try {
                new URL(sfscLink);
                showElement(openInSFSC);
                openInSFSC.onclick = function() {
                    window.open(sfscLink, '_blank');
                };
            } catch (e) {
                hideElement(openInSFSC);
            };
	};
        showElement(askHelp);
        askHelp.onclick = function() {
            const destinationURL = "https://jira.mongodb.org/plugins/servlet/desk/portal/13";
            window.open(destinationURL, '_blank');
        };
    }; // else
};

const callbackAtlas = function(injectionResults) {
    // for (const frameResult of injectionResults)
    //     console.log('Frame Title: ' + JSON.stringify(frameResult.result));
    const project = injectionResults[0].result["project"];
    const isAdmin = injectionResults[0].result["isAdmin"];
    const baseURL = "https://cloud.mongodb.com/v2";
    var destinationURL = baseURL + "/admin#/atlas/search";

    if (chrome.runtime.lastError) {
        /* Report any error */
        alert('ERROR:\n' + chrome.runtime.lastError.message);
    } else {
        if ((project.length > 0) && (typeof(project[0]) === 'string')) {
            if (isAdmin === false && project != 'none') {
                ticket_found.innerHTML = project;
                ticketCopy.innerText = "Project To Clipboard";
                showElement(ticketCopy);
                ticketCopy.onclick = function() {
                    navigator.clipboard.writeText(project);
                    toggleTicketPulse();
                };
                showElement(atlasAdmin);
                atlasAdmin.onclick = function() {
                    if (project != "null") {
                        destinationURL = destinationURL + "?search=" + project + "&operator=AND";
                    }
                    window.open(destinationURL,'_blank');
                };

                getTabURL().then((link) => {
                    const parsedURL = new URL(link);
                    if (parsedURL.hash.split('/')[2] != "logRequestHistory")
                        showElement(atlasLogs);
                });

                atlasLogs.onclick = function() {
                    if (project != "null") {
                        destinationURL = baseURL + '/' + project + "#/deployment/logRequestHistory";
                        window.open(destinationURL,'_blank');
                    };
                }

                showElement(searchProactive);
                searchProactive.onclick = function() {
                    destinationURL = "https://jira.mongodb.org/issues/?jql=text%20~%20%22" + project + "%22%20and%20project%20%3D%20PROACTIVE%20order%20by%20created"
                    window.open(destinationURL,'_blank');
                };

            } else if (isAdmin === true) {
                showElement(atlasAdmin);
                atlasAdmin.innerText = "Back to Atlas Project";
                atlasAdmin.onclick = function() {
                    if (project != "null") {
                        destinationURL = baseURL + '/' + project + "#/deployment";
                        window.open(destinationURL,'_blank');
                    };
                };
            };

            chrome.storage.sync.get('homeProject', function(data) {
                const HOME_PROJECT = data.homeProject;
                console.log("Project retrieved from storage: " + HOME_PROJECT);
                if (HOME_PROJECT) {
                    atlasHome.onclick = function() {
                        const destinationURL = "https://cloud.mongodb.com/v2/" + HOME_PROJECT + "#/clusters";
                        window.open(destinationURL,'_blank');
                    };
                    if(project != HOME_PROJECT) {
                        showElement(atlasHome);
                    };
                };
            });
        };
        showElement(askHelp);
        askHelp.onclick = function() {
            const destinationURL = "https://jira.mongodb.org/plugins/servlet/desk/portal/13/create/77";
            window.open(destinationURL, '_blank');
        };
    }; // else
};


const setContext = function(url) {
    const contextMapping = {
        "jira.mongodb.org/browse/HELP": contextType.Help,
        "jira.mongodb.org/browse/": contextType.Jira,
        "mongodb.lightning.force.com": contextType.SalesForce,
        "hub.corp.mongodb.com": contextType.Hub,
        "cloud.mongodb.com": contextType.Atlas
    };

    for (let key in contextMapping) {
        if (url.includes(key)) {
            return contextMapping[key];
        }
    };

    return contextType.Default;
};

const funcToInjectJira = function() {
    const getCurrentURL = function() {
        return window.location.href
    };
    const url = getCurrentURL();
    const link = new URL(url);

    const ticketNum = link.pathname.split("/")[2];
    console.log("Ticket found: " + ticketNum);
    return { 'ticketNum': ticketNum };
};

const funcToInjectSF = function() {
    var ticketNum = "";

    var contactName = "";
    var element = null;

    element = window.document.querySelector("#brandBand_2 > div > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w___-l-m-t___1712090528000 > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-desktop-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li.slds-page-header__detail-block.slds-p-right_small.slds-p-top_medium > div > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > a");
    if (element) {
        ticketNum = element.innerHTML.split(":")[0].split('|')[0].trim();
    } else ticketNum = "none found";

    element = window.document.querySelector("#brandBand_2 > div > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-cases_-l-w-c___-case___-v-i-e-w___-l-m-t___1712090528000 > forcegenerated-flexipage_cases_lwc_case__view_js > record_flexipage-desktop-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-template-desktop2 > div > div.slds-col.slds-size_1-of-1.row.region-header > slot > flexipage-component2:nth-child(2) > slot > c-cc-highlights-panel > div.header-pin-wrapper > div > div.slds-page-header__row.slds-page-header__row_gutters > div > ul > li:nth-child(4) > div:nth-child(2) > a");

    if (element) {
        contactName = element.innerHTML;
    } else contactName = "none found";

    return { 'ticketNum': ticketNum, 'contactName': contactName };

};

const funcToInjectAtlas = function() {
    var project = "none";
    var isAdmin = false;

    const validateProject = function(project) {
        if(typeof(project) === 'string' && project.length == 24) {
            return true;
        } else
            return false;
    };

    const getCurrentURL = function() {
        return window.location.href
      };

    const url = getCurrentURL();

    const link = new URL(url);
    const pathSplit = link.pathname.split("/");
    if (pathSplit.length >= 3 )
        project = pathSplit[2];

    if (project === "admin") {
        const hashSplit = link.hash.split('/');
        if (hashSplit.length >= 3) {
            project = hashSplit[2].split('=')[1].split('&')[0];
            if (validateProject(project))
                isAdmin = true;
        };
    };

    console.log("project: " + project);
    return { 'project': project, 'isAdmin': isAdmin };
};

const funcToInjectHub = function() {
    var ticketNum = "";
    var element = null;
    var cloudLink = "";
    var sfscLink = "";
    var contactName = "";

    const getCurrentURL = function() {
        return window.location.href
    };
    const url = getCurrentURL();
    const link = new URL(url);

    ticketNum = link.pathname.split("/")[2];
    console.log("Ticket found: " + ticketNum);

    element = window.document.querySelector("#case-header > div > div > div.case-header-bottom-div > div.case-header-fields-section > div:nth-child(2) > div > div:nth-child(3) > p > a");
    if (element) {
        contactName = element.innerHTML;
    } else contactName = "none found";

    element = window.document.querySelector("#__next > div > section.main-section > section > div > div.page-overview-container.case-body > div.page-overview-sidebar > div:nth-child(4) > div > div.tip-card-content-container > div > div > div:nth-child(2) > p:nth-child(2) > a")
    if (element) {
        cloudLink = element.href;
    } else {
        element = window.document.querySelector("#__next > div > section.main-section > section > div > div.page-overview-container.case-body > div.page-overview-sidebar > div:nth-child(5) > div > div.tip-card-content-container > div > div > div:nth-child(2) > a");
        if (element) 
            cloudLink = element.href;
    };

    element = window.document.querySelector("#case-header > div > div > div.page-title > div.view-sfsc-config-btn-case > a");
    if (element) 
        sfscLink = element.href;

    return { 'ticketNum': ticketNum, 'contactName': contactName, 'cloudLink': cloudLink, 'sfscLink': sfscLink };
};

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
    toggleTicketPulse();
};

nameCopy.onclick = function(element) {
    clipCopy('contact_name');
    toggleContactPulse();
};

knowledgeSearch.onclick = function() {
    const destinationURL = "https://knowledge.corp.mongodb.com/";
    window.open(destinationURL, '_blank');
};

manageTicket.onclick = function(element) {
    const ticketNum = ticket_found.innerHTML;
    chrome.runtime.sendNativeMessage(nativeMessagingHost,
        { "ticketNum": ticketNum },
        function(response) {
	    if (chrome.runtime.lastError) {
                console.error("Error: " + chrome.runtime.lastError.message);
                return;
            };
            console.log("Received " + JSON.stringify(response));
            // var resEl = document.createElement("p");
            // resEl.innerHTML = JSON.stringify(response);
            // document.body.appendChild(resEl);
        });
    hideElement(manageTicket);
};

clearSides.onclick = function(element) {
    chrome.runtime.sendNativeMessage(nativeMessagingHost,
        { "clearSides": 1 },
        function(response) {
            console.log("Received " + JSON.stringify(response));
            // const resEl = document.createElement("p");
            // resEl.innerHTML = JSON.stringify(response);
            // document.body.appendChild(resEl);
        });
    hideElement(clearSides);
};

const showElement = function(element) {
    element.classList.remove("hidden");
}

const hideElement = function(element) {
    // element.classList.add("fade-out");
    // element.classList.add("hidden");
    element.classList.add('collapse-out');
}

// This function toggles the "show" class for the ticket_found element
const toggleTicketPulse = function() {
    const ticketElement = document.getElementById("ticket_found");
    ticketElement.classList.toggle("show");
}

// This function toggles the "show" class for the contact_name element
const toggleContactPulse = function() {
    const contactElement = document.getElementById("contact_name");
    contactElement.classList.toggle("show");
}
