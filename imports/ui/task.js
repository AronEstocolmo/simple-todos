import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';


Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});
 
Template.task.events({
  'click .toggle-checked'() {
    console.log("BUCHIIIIEZ!");
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    console.log("BUCHIIIIEZ2222");
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    console.log("BUCHIIIIEZ33333");
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
  
});