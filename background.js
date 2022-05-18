  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({background: 'RUN'}, function() {
      console.log("Background Service Worker started");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'mongodb.lightning.force.com'}
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });