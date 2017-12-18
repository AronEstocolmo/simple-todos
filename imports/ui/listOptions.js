import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import { Tasks } from '../api/tasks.js';

import './task.js'; 
import './body.html';
import './listOptions.html';

Template.listOptions.events({
  'click .clear-list'() {
    console.log("Ready to cleeeeear :D !");
    Meteor.call('tasks.removeAll');
  },

  'input .select-list'(event) {
    console.log("Boselectah!");
	listID = event.target.value;
    console.log(listID);
	Meteor.call('tasks.selecta', listID);
  },
});