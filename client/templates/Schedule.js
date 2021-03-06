Session.setDefault('ShowProjectDialog', false);
Session.setDefault('SelectedTech', null);
Session.setDefault('ShowDeleteBox', false);



Session.set('techInQ', false);
var d = new Date();
var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
var newTime = hours + ':' + min;
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var n = weekday[d.getDay()];
var today = n;

Template.Schedule.helpers({

  showProjectDialog: function showProjectDialog() {
    return Session.get('ShowProjectDialog');
  },
  ShowDeleteBox: function ShowDeleteBox() {
    return Session.get('ShowDeleteBox');

  },
  acheck: function acheck(){
    if (Meteor.user().profile.Role == "Admin") {
      return false
    }else {
      return true
    }
  }
});

Template.Schedule.events = {
  "click .addUser": function openForm(event, template) {
    event.preventDefault();
    Session.set('ShowProjectDialog', true);
  },
  "click .addAccount": function addAccount(){
    Router.go('/')
  }
};
//add User Form
Template.addUserForm.events = {
  "click .close": function closeForm(event, template) {
    event.preventDefault();
    Session.set('ShowProjectDialog', false);
    Session.set('SelectedTech', null);
  },
  'click .clockpicker': function() {
    $('.clockpicker').clockpicker();
  },
  'click .submit': function submitForm(event, template) {
    event.preventDefault();
    var name = template.find('.inputName').value;
    var Monday = template.find('.day1').checked;
    var Tuesday = template.find('.day2').checked;
    var Wednesday = template.find('.day3').checked;
    var Thursday = template.find('.day4').checked;
    var Friday = template.find('.day5').checked;
    var Saturday = template.find('.day6').checked;
    var Sunday = template.find('.day7').checked;
    var startT = template.find('.startT').value;
    var endT = template.find('.endT').value;
    var managerT = template.find('.manager').value;
    var shift = template.find('.slect-dropdown').value;
    var n00b = template.find('.n00b').checked;
    if (Session.get('SelectedTech')) {
      updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT,n00b);
    } else {
      addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT,n00b);
    }
    Meteor.call("updateCron");
    Session.set('ShowProjectDialog', false);
    Session.set('SelectedTech', null);
  }
};

Template.addUserForm.helpers({

  tech: function tech() {
    return _Techs.findOne({
      _id: Session.get('SelectedTech')
    });
  },
  checking: function checking(day) {
    var dayinfo = _Techs.findOne(Session.get('SelectedTech'))
    if (dayinfo[day]) {
      return {
        checked: ""
      };
    }
    return {};
},
n00b: function n00b(n00b) {
  var tech = _Techs.findOne(Session.get('SelectedTech'))
  if (tech[n00b]) {
    return {
      checked: ""
    };
  }
  return {};
},
firstCheck: function shiftCheck(shift) {
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '1st') {
  return {
    selected: ""
  }
}
},
secondCheck: function secondCheck(shift){
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '2nd') {
  return {
    selected: ""
  };
};
},
thirdCheck: function thirdCheck(shift){
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '3rd') {
  return {
    selected: ""
  };
};
}
});

function timeToStop(endT) {
    var h = parseInt(endT);
    var m30 = parseInt(endT.slice(3)) - 30;
    var m = parseInt(endT.slice(3));
    var h1 = parseInt(endT) - 1;
    if (m30 < 0) {
      var subm = m30 + 60;

    if (subm.toString().length == 1){
      var subm = ('0' + subm).toString()
    };
    return h1 + ":" + subm;
  }else {
    if (m30.toString().length == 1) {
      var m30 = ('0' + m30).toString()
      return h + ":" + m30;
    };
    return h + ":" + m30;
  }
};


var addUser = function addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT,n00b) {
  _Techs.insert({
    name: name,
    StartTime: startT,
    WorkQueueEnter: 0,
    EndTime: endT,
    WorkQueueExit: timeToStop(endT),
    Monday: Monday,
    Tuesday: Tuesday,
    Wednesday: Wednesday,
    Thursday: Thursday,
    Friday: Friday,
    Saturday: Saturday,
    Sunday: Sunday,
    queue: false,
    prequeue: false,
    status: "Working",
    weight: TimeSync.serverTime(),
    Shift: shift,
    lunch: false,
    meeting: false,
    training: false,
    timesincelastTicket: 0,
    preQueueEnterTime: "00:00",
    preQueueExit: "00:00",
    manager: managerT,
    skipRound: 0,
    n00b: n00b,
    qn00b: false
  });
  Meteor.call("updateCron");
};

var updateProject = function updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT,n00b) {
  _Techs.update(Session.get('SelectedTech'), {
    $set: {
      name: name,
      StartTime: startT,
      WorkQueueEnter: 0,
      EndTime: endT,
      WorkQueueExit: timeToStop(endT),
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday: Saturday,
      Sunday: Sunday,
      queue: false,
      prequeue: false,
      status: "Working",
      weight: TimeSync.serverTime(),
      Shift: shift,
      lunch: false,
      meeting: false,
      training: false,
      timesincelastTicket: 0,
      preQueueEnterTime: "00:00",
      preQueueExit: "00:00",
      manager: managerT,
      skipRound: 0,
      n00b: n00b,
      qn00b: false
    }
  });
  Meteor.call("updateCron");
};

Template.schedule.helpers({

  disabled: function disabled() {
    if (_Techs.findOne({
        _id: this._id,
        queue: true
      })) {
      return {disabled: ""};
    }
    return {};
  },
  checking: function checking(day) {
    if (this[day]) {
      return {
        checked: ""
      };
    }
    return {};
  },
   colorChecked: function colorChecked(day){
     if (this[day]) {
     return {style: "color:#0daecd;font-size:120%;font-weight:bold"};
   };
   return {};
 },
 queueButtonColorCheck: function queueButtonColorCheck(){
   if (this.queue || this.prequeue) {
     return {style: "background-color:#80FF95"};
   }else {
     return {style: "background-color:#FF8280"};
   }
 },
 queueCheck: function queueCheck(){
   if (this.queue) {
     return "Getting Pain ;)";
   }else if(this.prequeue){
     return "Waiting For Pain";
   }else {
     return "Send To Work"
   }
 },
 shiftColor: function shiftColor(shift){
   if (shift == "1st") {
     return "#EFEFEF"  //SkyBlue
   };
   if (shift == "2nd") {
     return "#DFDFDF"
 };
 if (shift == "3rd") {
   return "#CDCDCD" //Olive
 }
 }
});


Template.schedule.events({
  "click .sendToWork": function addTechToQ(event, template) {
    Now: function Now() {
      TimeSync.serverTime()
    };
    event.preventDefault();
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        queue: true,
        prequeue:false,
        totaltickets: 1,
        dispatched: false,
        status: "Working",
        WorkQueueEnter: TimeSync.serverTime(),
        weight: 0,
        qn00b: false
      }
    });
  },
  "dblclick .schedule": function editTech(event, tmpl) {
    event.preventDefault();
    Session.set('SelectedTech', this._id);
    Session.set('ShowProjectDialog', true);
  },
  "click .removetech": function removeFromQButton(event, tmpl) {
    event.preventDefault();
    if (this.queue || this.prequeue) {
      _Techs.update({
        _id: this._id
      }, {
        $set: {
          queue: false,
          prequeue: false
        }
      });

    } else if (_Techs.findOne({
        _id: this._id,
        queue: false
      })) {
      event.preventDefault();
      Session.set('SelectedTech', this._id);
      Session.set('ShowDeleteBox', true);
}
}
});

Template.techs.helpers({
  techs: function findTechs() {
    return _Techs.find({}, {
      sort: {
        Shift: 1,
        name: 1
      }
    });
  }
});


Template.techs.events({});

Template.registerHelper("prettifyDate", function timer(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});

function deleteTech(techId) {
  _Techs.remove({
    _id: techId._id
  });
}


Template.deleteUser.helpers({

  tech: function tech() {
    return _Techs.findOne({
      _id: Session.get('SelectedTech')
    });
  },
  checking: function checking(day) {
    var dayinfo = _Techs.findOne(Session.get('SelectedTech'))
    if (dayinfo[day]) {
      return {
        checked: ""
      };
    }
    return {};
  }
});

Template.deleteUser.events = {
  "click .closeddelete": function closeForm(event, template) {
    event.preventDefault();
    Session.set('SelectedTech', null);
    Session.set('ShowDeleteBox', false);
  },
  "click .submitdelete": function() {
    event.preventDefault();
    var techinfo = _Techs.findOne(Session.get('SelectedTech'));
    deleteTech(techinfo);
    Session.set('ShowDeleteBox', false);
  }
};
