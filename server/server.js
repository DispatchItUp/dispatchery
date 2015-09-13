Meteor.methods({
  updateStatus: function(tech, status) {
    _Statuses.update(tech._id, {
      "status": status
    });
  },
  addTask: function(text) {
    // Make sure the user is logged in before inserting a task
    _Tasks.insert({
      text: text,
      createdAt: new Date()
    });
  },
  deleteTask: function(taskId) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    _Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = _Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  },
  removeChat: function(id) {
    _Chat.remove({
      owner: id
    });
  },
  updateStatus: function(id, status) {
    _Techs.update({
      _id: id
    }, {
      $set: {
        status: status
      }
    });
  },
  updateTechFields: function(){
  _Techs.find({}).forEach(function(tech){
    console.log(tech.name);
    updateProject(tech.name, tech.StartTime, tech.EndTime, tech.Monday, tech.Tuesday, tech.Wednesday, tech.Thursday, tech.Friday, tech.Saturday, tech.Sunday, tech.Shift, tech.manager);
    //subtract 30 min from tech schedule for case time
    timeToStop: function timeToStop(endT) {
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
    updateProject: function updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT) {
      _Techs.update({_id: tech._id}, {
        $set: {
          name: name,
          StartTime: startT,
          WorkQueueEnter: 0,
          EndTime: endT,
          WorkQueueExit: timeToStop(tech.EndTime),
          Monday: Monday,
          Tuesday: Tuesday,
          Wednesday: Wednesday,
          Thursday: Thursday,
          Friday: Friday,
          Saturday: Saturday,
          Sunday: Sunday,
          prequeue: false,
          status: "Working",
          weight: 0,
          Shift: shift,
          lunch: false,
          meeting: false,
          training: false,
          timesincelastTicket: 0,
          preQueueEnterTime: "00:00",
          preQueueExit: "00:00",
          manager: managerT
        }
      });
  }
});
}
});

Meteor.startup(function() {
});
