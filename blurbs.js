Snippets = new Mongo.Collection("snippets");
Reports = new Mongo.Collection("reports");

if (Meteor.isClient) {
  Session.set("snippets", true); //default value
  Session.set("reports", false); //default value

  Template.home.helpers({
    snippetMode: function(){return Session.get("snippets")},
    reportMode: function(){return Session.get("reports")}
  });

  Template.home.events({
    "click #snippets-button": function (event, template){
      Session.set("snippets", true);
      Session.set("reports", false);
    },
    "click #reports-button": function (event, template){
      Session.set("snippets", false);
      Session.set("reports", true);
    }
  });

  Template.snippets.created = function() {
  }

  Template.snippets.helpers({
    snippetsList: function(){
      return Snippets.find({user: Meteor.userId()});
    },
    selectedSnippet: function(){
      return Snippets.findOne( Session.get("selectedSnippet") );
    }
  })

  Template.snippets.events({
    "click .snippet-item": function (event, template){
      Session.set("selectedSnippet", $(event.target).attr("id"));
      $("p.selected").removeClass("selected");
      $(event.target).addClass("selected");
    },
    "change #snippet-content": function (event, template){
      console.log("change fired");
      content = $("#snippet-content").html();
      Snippets.update(Session.get("selectedSnippet"), {content: content, user: Meteor.userId()});
    }
  });

  $(document).on('paste', function(e){
    if ( Session.get("snippets") && !$("#edit-div").is(":focus") ){
      var content = (e.originalEvent || e).clipboardData.getData('text/plain') || window.clipboardData.getData('Text');
      //$("#paste-div").append("<div class='paste-entry'>"+text+"</div>");
      //add it to the collection it should auto add to the list
      Snippets.insert({
	content: content,
	createdAt: new Date(),
	user: Meteor.userId()
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.route('/', function () {
  if ( !Meteor.user() ){
    this.layout('mainLayout');
    this.render('landing');
  }
  else {
    this.layout('mainLayout');
    this.render('home');
  }
});

Router.route('/about', function () {
  this.layout('mainLayout');
  this.render('about');
});
