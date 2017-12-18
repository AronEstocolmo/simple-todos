import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Tasks = new Mongo.Collection('tasks');


if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('tasks', function tasksPublication() {  //Make sure that every dokument with the correct listID is published
    //listID = "volvo" //window.listID;
    //console.log("HEYAHEYAHEYAHEYAAA!");
    return Tasks.find({
      $and: [
        { private: { $ne: true } },
        { owner: this.userId },
        { rightList: { $ne: false } },
        //{ listID: listID },
      ],
    });
  });
}


/*
  Meteor.publish('tasks', function tasksPublication() {  
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}
*/


Meteor.methods({
  'tasks.insert'(text, listName) {
    check(text, String);

    console.log(listName);
    console.log(text);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      listID: listName, //Add name of list? <-------------------------------------
      listish: "", //Use to force update in selecta
    });

    console.log(Tasks.find({}));

  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
    'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

  //Remove all tasks from list
  'tasks.removeAll'(){
    console.log("Uyuyuyyyy!");
    Tasks.remove({});
  },

  'tasks.selecta'(listSelect){
    
    Tasks.find().forEach(function(lista) { 

      if(lista.listID == listSelect){
        //console.log(lista.listID);
        Tasks.update(lista, { $set: { rightList: true } });
      } else{
        //console.log("aint tha one");
        Tasks.update(lista, { $set: { rightList: false } });
      }

      })
    
  },


});