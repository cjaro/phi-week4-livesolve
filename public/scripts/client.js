var myApp=angular.module('TaskApp', []);

myApp.controller('TaskController', ['$http', function($http){
  console.log('yip taskController was created');
  var self=this;
  self.newTask={};
  self.someThing=7;
  self.taskList=[];

  getTasks();
  function getTasks(){
    $http({
      method: 'GET',
      url: '/tasks'
    }).then(function(response){
      console.log(response.data);
      self.taskList=response.data;
    });
  }

self.addTask = function addTask(){
    $http({
      method: 'POST',
      url: '/tasks',
      data: self.newTask
    }).then(function(response){
      console.log(response);
      getTasks();
    });
  }

}]);
