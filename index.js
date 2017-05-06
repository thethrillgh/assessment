( function()
{
    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ngRoute']); /* add fileUpload later */
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
                label: 'Animal',
                children: [
                  {
                    label: 'Dog',
                    data: {
                      description: "man's best friend"
                    }
                  }, {
                    label: 'Cat',
                    data: {
                      description: "Felis catus"
                    }
                  }, {
                    label: 'Hippopotamus',
                    data: {
                      description: "hungry, hungry"
                    }
                  }, {
                    label: 'Chicken',
                    children: ['White Leghorn', 'Rhode Island Red', 'Jersey Giant']
                  }
                ]
            }, 
            {
                label: 'Vegetable',
                data: {
                  definition: "A plant or part of a plant used as food, typically as accompaniment to meat or fish, such as a cabbage, potato, carrot, or bean.",
                  data_can_contain_anything: true
                },
                onSelect: function(branch) {
                  return $scope.output = "Vegetable: " + branch.data.definition;
                },
                children: [
                  {
                    label: 'Oranges'
                  }, {
                    label: 'Apples',
                    children: [
                      {
                        label: 'Granny Smith',
                        onSelect: $scope.tree_handler
                      }, {
                        label: 'Red Delicous',
                        onSelect: $scope.tree_handler
                      }, {
                        label: 'Fuji',
                        onSelect: $scope.tree_handler
                      }
                    ]
                  }
                ]
          }, 
          {
                label: 'Mineral',
                children: [
                  {
                    label: 'Rock',
                    children: ['Igneous', 'Sedimentary', 'Metamorphic']
                  }, {
                    label: 'Metal',
                    children: ['Aluminum', 'Steel', 'Copper']
                  }, {
                    label: 'Plastic',
                    children: [
                      {
                        label: 'Thermoplastic',
                        children: ['polyethylene', 'polypropylene', 'polystyrene', ' polyvinyl chloride']
                      }, {
                        label: 'Thermosetting Polymer',
                        children: ['polyester', 'polyurethane', 'vulcanized rubber', 'bakelite', 'urea-formaldehyde']
                      }
                    ]
                  }
                ]
         },
         {
          label: 'Languages',
          children: ['Jade','Less','Coffeescript']
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
            ngQuillConfigProvider.set(null, null, 'custom placeholder')
    
        }])
        .directive("apDirective",apDirective)
        .directive("resultsDirective",resultsDirective)
        .directive("sloDirective",sloDirective)
        .directive("assessmentDirective",assessmentDirective)
        .directive("toolDirective", toolDirective)
        .directive("goalDirective",goalDirective);

     
})
();