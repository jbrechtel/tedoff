enyo.kind({
  name: "WTFWare.TEDFeed",
  kind: enyo.VFlexBox,
  components: [
    {
      name : "fileDownload",
      kind : "PalmService",
      service : "palm://com.palm.downloadmanager/",
      method : "download",
      onSuccess : "downloadFinished",
      onFailure : "downloadFail",
      subscribe : false
    },
    {
        name: "db",
        kind: "onecrayon.Database",
        database: 'ext:TEDOff',
        version: "1",
        debug: true
    },
    {name: "getFeed", kind: "WebService", onSuccess: "gotFeedSuccess", onFailure: "gotFeedFailure"},
    {kind: "PageHeader", content: "TED Talks -- Offline Viewer"},
    {kind: "RowGroup", caption: "Feed URL", components: [
          {kind: "InputBox", components: [
              {name: "feedUrl", kind: "Input", flex: 1},
              {kind: "Button", caption: "Get Feed", onclick: "btnClick"}
          ]}
    ]},
    {kind: "Scroller", flex: 1, components: [
        {name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
            components: [
                {kind: "Item", layoutKind: "VFlexLayout", onclick: "videoClick",
                  components: [
                    {name: "title", kind: "Divider"},
                    {name: "description"}
                ]}
            ]
        }
    ]}
  ],
  btnClick: function() {
    var url = "http://query.yahooapis.com/v1/public/yql?q=select"
      + "%20enclosure%2C%20title%2C%20description%20from%20rss%20where%20url%3D%22"
      + "http://www.ted.com/talks/rss%22&format=json&callback=";
    this.$.getFeed.setUrl(url);
    this.$.getFeed.call();
  },
  gotFeedSuccess: function(inSender, inResponse) {
    this.videos = inResponse.query.results.item;
    this.$.list.render();
  },
  gotFeedFailure: function(inSender, inResponse) {
    enyo.log("Failed to get TED video list");
  },
  create: function() {
    this.inherited(arguments);
    this.videos = [];
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
  videoClick: function(inSender, inEvent) {
    var feed = this.videos[inEvent.rowIndex];
    var result = this.$.fileDownload.call({
      target: feed.enclosure.url,
      targetDir: "/media/internal/downloads/ted",
      mime: feed.enclosure.type,
      keepFilenameOnRedirect: false,
      canHandlePause: true,
      subscribe: true
    });
  },
  downloadFinished: function(inSender, inResponse) {
    var fullPath = inResponse.destPath;
    var fileName = inResponse.destFile;
    enyo.log("downloaded: " + fullPath);
    enyo.windows.addBannerMessage("OK! Yeah!", {}, null, null, null, null);
  },
  downloadFailed: function() {
    enyo.log("failed...");
  }
});
