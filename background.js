  chrome.action.disable();
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({background: 'RUN'}, () => {
      console.log("Background Service Worker started");
    });
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules( async() => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: 'mongodb.lightning.force.com'}
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: 'hub.corp.mongodb.com'}
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {urlContains: 'jira.mongodb.org/browse/HELP'}
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostSuffix: 'cloud.mongodb.com'}
          })
        ],
            actions: [
              new chrome.declarativeContent.SetIcon( {
                imageData: {
                  16: await loadImageData('icons/favicon-16x16.png'),
                  32: await loadImageData('icons/favicon-32x32.png')
                }
      }),
              chrome.declarativeContent.ShowAction
              ? new chrome.declarativeContent.ShowAction()
              : new chrome.declarativeContent.ShowPageAction(),
      
            ]
      }]);
    });
  });


  async function loadImageData(url) {
    const img = await createImageBitmap(await (await fetch(url)).blob());
    const {width: w, height: h} = img;
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }