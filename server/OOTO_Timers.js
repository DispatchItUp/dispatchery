Meteor.methods({
updateLunch: function(tech) {
  _Techs.find({queue: true}).forEach(function(tech){
  if (tech.lunch && tech.status == "Lunch") {
    SyncedCron.add({
      name: tech.name + ' Lunch time ' + tech.LunchClockOut,
      schedule: function(parser) {
        return parser.recur().on(tech.LunchClockOut).time()
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working",
            lunch: false
          }
        });
        removeLunch(tech);
      }
    });
  } else if (tech.status == "Lunch") {
    var d = new Date();
    var hourPlusOne = d.getHours() + 1
    if (hourPlusOne == 24) {
      hourPlusOne = 00
    };
    var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
    SyncedCron.add({
      name: tech.name + ' Lunch time ' + hourPlusOne + ":" + min,
      schedule: function(parser) {
        return parser.recur().on(hourPlusOne + ":" + min).time()
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working",
            lunch: false
          }
        });
        removeLunch(tech);
      }
    });
    _Techs.update({_id: tech._id}, {$set: {LunchClockOut: hourPlusOne + ":" + min, lunch: true}});
    }
  })
},
  removeLunch: function(tech) {
    SyncedCron.remove(tech.name + ' Lunch time ' + tech.LunchClockOut);
    _Techs.update({_id: tech._id}, {$set: {LunchClockOut: "", lunch: false}});
  },
  updateMeeting: function(tech) {
    _Techs.find({queue: true}).forEach(function(tech){
    if (tech.meeting && tech.status == "Meeting") {
      SyncedCron.add({
        name: tech.name + ' Meeting time ' + tech.MeetingClockOut,
        schedule: function(parser) {
          return parser.recur().on(tech.MeetingClockOut).time()
        },
        job: function() {
          _Techs.update({
            _id: tech._id
          }, {
            $set: {
              status: "Working",
              meeting: false
            }
          });
          removeMeeting(tech);
        }
      });
    } else if (tech.status == "Meeting") {
      var d = new Date();
      var hourPlusOne = d.getHours() + 1
      if (hourPlusOne == 24) {
        hourPlusOne = 00
      };
      var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
      SyncedCron.add({
        name: tech.name + ' Meeting time ' + hourPlusOne + ":" + min,
        schedule: function(parser) {
          return parser.recur().on(hourPlusOne + ":" + min).time()
        },
        job: function() {
          _Techs.update({
            _id: tech._id
          }, {
            $set: {
              status: "Working",
              meeting: false
            }
          });
          removeMeeting(tech);
        }
      });
      _Techs.update({_id: tech._id}, {$set: {MeetingClockOut: hourPlusOne + ":" + min, meeting: true}});
      }
    })
  },
    removeMeeting: function(tech) {
      SyncedCron.remove(tech.name + ' Meeting time ' + tech.MeetingClockOut);
      _Techs.update({_id: tech._id}, {$set: {MeetingClockOut: "", meeting: false}});
    },
    updateTraining: function(tech) {
      _Techs.find({queue: true}).forEach(function(tech){
      if (tech.training && tech.status == "Training") {
        SyncedCron.add({
          name: tech.name + ' Training time ' + tech.TrainingClockOut,
          schedule: function(parser) {
            return parser.recur().on(tech.TrainingClockOut).time()
          },
          job: function() {
            _Techs.update({
              _id: tech._id
            }, {
              $set: {
                status: "Working",
                training: false
              }
            });
            removeTraining(tech);
          }
        });
      } else if (tech.status == "Training"){
        var d = new Date();
        var hourPlusOne = d.getHours() + 2
        if (hourPlusOne == 24) {
          hourPlusOne = 00
        };
        var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        SyncedCron.add({
          name: tech.name + ' Training time ' + hourPlusOne + ":" + min,
          schedule: function(parser) {
            return parser.recur().on(hourPlusOne + ":" + min).time()
          },
          job: function() {
            _Techs.update({
              _id: tech._id
            }, {
              $set: {
                status: "Working",
                training: false
              }
            });
            removeTraining(tech);
          }
        });
        _Techs.update({_id: tech._id}, {$set: {TrainingClockOut: hourPlusOne + ":" + min, training: true}});
        }
      })
    },
      removeTraining: function(tech) {
        SyncedCron.remove(tech.name + ' Training time ' + tech.TrainingClockOut);
        _Techs.update({_id: tech._id}, {$set: {TrainingClockOut: "", training: false}});
      },
      updateN00b: function() {
        _Techs.find({queue: true}).forEach(function(tech){
        if (tech.qn00b) {
          n00btimer: function n00btimer() {
              var end = new Date();
              var h = end.getHours();
              var m30 = end.getMinutes() + 29;
              var m = end.getMinutes();
              var h1 = end.getHours() + 1;
              if (m30 > 60) {
                var subm = m30 - 60;

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
          console.log(n00btimer());
          SyncedCron.add({
            name: tech.name + ' n00b ',
            schedule: function(parser) {
              return parser.recur().on(n00btimer()).time()
            },
            job: function() {
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  qn00btime: n00btimer(),
                  qnoob: false
                }
              });
              removeN00b(tech);
            }
          });
          _Techs.update({_id: tech._id}, {$set: {qn00btime: n00btimer(), qn00b: true}});
        }
        })
      },
        removeN00b: function(tech) {
          SyncedCron.remove(tech.name + ' n00b ');
          _Techs.update({_id: tech._id}, {$set: {qn00btime: "", qn00b: false}});
        },

});

Meteor.startup(function() {
  Meteor.call("updateTechFields");
  SyncedCron.start();
  Meteor.call("updateCron");
  Meteor.call("updateLunch");
  Meteor.call("updateMeeting");
  Meteor.call("updateTraining");
});
