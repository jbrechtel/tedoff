enyo.kind({
  name: "WTFWare.TEDFeed",
  kind: enyo.VFlexBox,
  components: [
    {name: "getFeed", kind: "WebService", onSuccess: "gotFeedSuccess", onFailure: "gotFeedFailure"},
    {kind: "PageHeader", content: "TED Talks -- Offline Viewer"},
    {kind: "RowGroup", caption: "Feed URL", components: [
          {kind: "InputBox", components: [
              {name: "feedUrl", kind: "Input", flex: 1},
              {kind: "Button", caption: "Get Feed", onclick: "btnClick"}
          ]}
    ]}
  ],
  btnClick: function() {
    this.$.getFeed.setUrl("http://www.ted.com/talks/rss");
    this.$.getFeed.call();
  },
  gotFeedSuccess: function() {
    this.$.button.setCaption("success");
  },
  gotFeedFailure: function() {
    this.$.button.setCaption("failed");
  }
});
