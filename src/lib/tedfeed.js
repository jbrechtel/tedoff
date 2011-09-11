enyo.kind({
  name: "WTFWare.TEDFeed",
  kind: enyo.VFlexBox,
  components: [
    {
      name : "fileDownload",
      kind : "PalmService",
      service : "palm://com.palm.downloadmanager/",
      method : "download",
      onSuccess : "downloadUpdate",
      onFailure : "downloadFail",
      onResponse: "gotResponse",
      subscribe : true
    },
    {name: "getFeed", kind: "WebService", onSuccess: "gotFeedSuccess", onFailure: "gotFeedFailure"},
    {kind: "PageHeader", content: "TED Talks -- Offline Viewer"},
    {kind: "Scroller", flex: 1, components: [
        {name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
            components: [
                {kind: "Item", layoutKind: "VFlexLayout",
                  components: [
                    {name: "title", kind: "Divider"},
                    {name: "description"},
                    {kind: enyo.HFlexBox, components: [
                      {name: "downloadButton", kind: "Button", caption: "Download", onclick: "downloadVideo"}
                    ]}
                ]}
            ]
        }
    ]}
  ],
  loadFeed: function() {
    var url = "http://query.yahooapis.com/v1/public/yql?q=select"
      + "%20enclosure%2C%20title%2C%20description%20from%20rss%20where%20url%3D%22"
      + "http://www.ted.com/talks/rss%22&format=json&callback=";
    this.$.getFeed.setUrl(url);
    this.$.getFeed.call();
  },
  gotFeedSuccess: function(inSender, inResponse) {
    this.videos = inResponse.query.results.item;
    for(var i = 0; i < this.videos.length; i++) {
      var feed = this.videos[i];
      this.feedsByFileName[this.fileNameFromUrl(feed.enclosure.url)] = feed;
    }
    this.$.list.render();
  },
  gotFeedFailure: function(inSender, inResponse) {
    enyo.log("Failed to get TED video list");
  },
  create: function() {
    this.inherited(arguments);
    this.videos = [];
    this.feedsByFileName = {};
    this.loadFeed();
  },
  getListItem: function(inSender, inIndex) {
    var item = this.videos[inIndex];
    if(!item) {
      return false;
    }
    this.$.title.setCaption(item.title);
    this.$.description.setContent(item.description);
    this.videos[inIndex].downloaded = false;
    return true;
  },
  downloadVideo: function(inSender, inEvent) {
    var feed = this.videos[this.$.list.fetchRowIndex()];
    enyo.windows.addBannerMessage("Downloading: " + feed.title, "{}", null, null, null, null);

    var result = this.$.fileDownload.call({
      target: feed.enclosure.url,
      targetDir: "/media/internal/downloads/ted",
      mime: feed.enclosure.type,
      keepFilenameOnRedirect: false,
      canHandlePause: true,
      subscribe: true
    });
  },
  downloadUpdate: function(inSender, inResponse) {
    enyo.log("response: " + JSON.stringify(inResponse));
    if(inResponse.completed) {
      enyo.log("response: " + JSON.stringify(this.feedsByFileName));
      var fileName = this.fileNameFromUrl(inResponse.url);
      var feed = this.feedsByFileName[fileName];
      enyo.windows.addBannerMessage("Finished: " + feed.title, "{}", null, null, null, null);
    }
  },
  downloadFailed: function() {
    enyo.windows.addBannerMessage("Download failed.  Please try again", "{}", null, null, null, null);
  },
  fileNameFromUrl: function(url) {
    var parts = url.split("/");
    return parts[parts.length - 1];
  },
  gotResponse: function() {}
});
