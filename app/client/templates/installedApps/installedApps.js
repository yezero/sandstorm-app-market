function firstVisit() {
  return FlowRouter.current().firstVisit;
}

Template.InstalledApps.helpers({

  firstVisit: firstVisit,

  updates: function() {
    return Genres.findIn('Updates Available').count();
  }

});

Template.InstalledApps.events({

  'click [data-action="update-all-apps"]': function() {

    Meteor.call('user/updateAllApps', function(err) {
      if (err) console.log(err);
    });

  }

});

Template.InstalledApps.onCreated(function() {
  this.subscribe('installed apps', amplify.store('sandstormInstalledApps'));
});

Template.updateSelector.helpers({

  automatic: function() {

    var user = Meteor.users.findOne(Meteor.userId());
    return user && user.autoupdateApps;

  },

  firstVisit: firstVisit

});

Template.updateSelector.events({

  'click [data-action="toggle-autoupdate"]': function() {

    Meteor.call('user/toggleAutoupdate', function(err) {
      if (err) console.log(err);
    });

  }

});

Template.updateSelector.onCreated(function() {

  if (FlowRouter.current().firstVisit)
    Meteor.call('user/toggleAutoupdate', function(err) {
      if (err) console.log(err);
    });

});

Template.uninstallApp.events({

  'click [data-action="close-modal"]': function() {

    AntiModals.dismissAll();

  },

  'click [data-action="uninstall-app"]': function() {

    var _this = this;
    Meteor.call('user/uninstallApp', _this._id, App.redirectOrErrorCallback(null, function() {
      AntiModals.dismissAll();
      var installedLocally = amplify.store('sandstormInstalledApps');
      if (installedLocally && installedLocally.indexOf(_this._id) > -1) {
        amplify.store('sandstormInstalledApps', _.without(installedLocally, _this._id));
        App.historyDep.changed();
      }
    }));

  }

});
