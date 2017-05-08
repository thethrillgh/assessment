( function()
{
    angular.module("assessment", ['angularBootstrapNavTree', 'ngRoute', 'ngAnimate', 'ngQuill', 'ngRoute']); /* add fileUpload later */
    var genService = function(){
        return ["pizza", "pasta", "potatoes", "carrots"]
    };
    var mainController = function($scope, genService, $sce){
        var tree = $scope.my_tree = {};
        $scope.tree_handler = function(branch){
            console.log(branch.label)
            $scope.selected = branch.label;
        }
        $scope.message = $sce.trustAsHtml($scope.message);
        $scope.treedata_avm = [
            {
                label: 'Goal 1',
                children: [
                  {
                    label: 'Student Learning Objective 1',
                    data: {
                      description: "man's best friend"
                    }
                  }, {
                    label: 'Student Learning Objective 2',
                    data: {
                      description: "Felis catus"
                    }
                  }, {
                    label: 'Student Learning Objective 3',
                    data: {
                      description: "hungry, hungry"
                    }
                  }, {
                    label: 'Student Learning Objective 4',
                    children: ['Process 1', 'Process 2', 'Process 3']
                  }
                ]
            }, 
            {
                label: 'Goal 2',
                data: {
                  definition: "A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.",
                  data_can_contain_anything: true
                },
                onSelect: function(branch) {
                  return $scope.output = "Vegetable: " + branch.data.definition;
                },
                children: [
                  {
                    label: 'Student Learning Objective 4'
                  }, {
                    label: 'Student Learning Objective 5',
                    children: [
                      {
                        label: 'Process 4',
                        onSelect: $scope.tree_handler
                      }, {
                        label: 'Process 5',
                        onSelect: $scope.tree_handler
                      }, {
                        label: 'Process 6',
                        onSelect: $scope.tree_handler
                      }
                    ]
                  }
                ]
          }, 
          {
                label: 'Goal 3',
                children: [
                  {
                    label: 'Student Learning Objective 6',
                    children: ['Process 7', 'Process 8', 'Process 9']
                  }, {
                    label: 'Student Learning Objective 7',
                    children: ['Process 10', 'Process 11', 'Process 12']
                  }, {
                    label: 'Student Learning Objective 8',
                    children: [
                      {
                        label: 'Process 13',
                        children: ['Results 1', 'Results 2', 'Results 3', ' Results 4']
                      }, {
                        label: 'Process 13',
                        children: ['Results 5', 'Results 6', 'Results 7', 'Results 8']
                      }
                    ]
                  }
                ]
         },
         {
          label: 'Goal 4',
          children: ['Student Learning Objective 9','Student Learning Objective 10','Student Learning Objective 11']
         }
        ];
        $scope.add_branch = function() {
          var b;
          b = tree.get_selected_branch();
          return tree.add_branch(b, {
            label: 'New Branch',
            data: {
              something: 42,
              "else": 43
            }
          });
        };
    }
   
     //created with the help of a tutrioal from https:ciphertrick.com/2015/12/07/file-upload-with-angularjs-and-nodejs/ 
   /* var fileUploadController = function ($scope, Upload, $window) {
    var controllerInstance = this;
     controllerInstance.submit = function () {
             controllerInstance.upload(controllerInstance.file);
         }
     }
     controllerInstance.upload() = function (file) {
         Upload.upload({
             url: 'IN HERE WILL BE OUR SERVER', //change the url to the one that we implement
             data: {
                 file: file
             } //pass file as data, should be user ng-model
         }).then(function (resp) { //upload function returns a promise
             if (resp.data.error_code === 0) { //validate success
                 $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
             } else {
                 $window.alert('an error occured');
             }
         }, function (resp) { //catch error
             console.log('Error status: ' + resp.status);
             $window.alert('Error status: ' + resp.status);
         }, function (evt) {
             console.log(evt);
             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
             controllerInstance.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
         });
     };
     */

var routingConfig = function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'templates/login.html',
			controller: 'loginController'
		});
	};

    var sloDirective = function () {
		return {
			templateUrl: 'directives/sloDirective.html'
		};
	};
    var goalDirective = function () {
		return {
			templateUrl: 'directives/goalDirective.html'
		};
	};
    var toolDirective = function () {
		return {
			templateUrl: 'directives/toolDir.html'
		};
	};  
    var assessmentDirective = function () {
		return {
			templateUrl: 'directives/assessmentDir.html'
		};
	};
    var resultsDirective = function () {
		return {
			templateUrl: 'directives/resultsDirective.html'
		};
	};
     var apDirective = function () {
		return {
			templateUrl: 'directives/actionplanDirective.html'
		};
	};
    
    angular
        .module("assessment")
        .controller("mainController", mainController)
        
        .service("genService", genService)
        .config(['ngQuillConfigProvider', function(ngQuillConfigProvider){
            ngQuillConfigProvider.set(null, null, 'custom placeholder');
    
        }])
        .directive("apDirective",apDirective)
        .directive("resultsDirective",resultsDirective)
        .directive("sloDirective",sloDirective)
        .directive("assessmentDirective",assessmentDirective)
        .directive("toolDirective", toolDirective)
        .directive("goalDirective",goalDirective);

     
})
();