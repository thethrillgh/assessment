( function()
{
    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ngRoute']);
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
    angular.module("assessment")
        .controller("mainController", mainController)
        .service("genService", genService)
        .config(['ngQuillConfigProvider', function(ngQuillConfigProvider){
            ngQuillConfigProvider.set(null, null, 'custom placeholder')
    
        }])
        .directive("sloDirective",sloDirective)
        .directive("toolDirective", toolDirective)
        .directive("goalDirective",goalDirective);
     
})
();