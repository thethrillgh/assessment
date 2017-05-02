( function()
{
    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ngRoute']);
    var genService = function(){
        return {
            department: "Computer Science",
            user: "",
            changedGoal: false,
            changedSLO: false,
            report: [
                {
                    label: "Mission Statement",
                    data: {
                        info: "The Computer Science Program seeks to produce graduates who are able to research and analyze complex problems and then to design and implement appropriate computational solutions for them. The program aims to produce liberally educated graduates with the communication skills and broad technical and social understanding appropriate to a discipline that relates to nearly every aspect of modern life. The program seeks to provide opportunities for students to gain practical experience in applying what they have learned to real-world situations and to prepare students for graduate school or computer science-related positions in industry."
                    },
                    children: [
                        {
                            label: "Goal 1",
                            data: {
                                info: ""
                            },
                            children: [
                                {
                                    label: "SLO1",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO2",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO3",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: "Goal 2",
                            data: {
                                info: ""
                            },
                            children: [
                                {
                                    label: "SLO1",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO2",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO3",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: "Goal 3",
                            data: {
                                info: ""
                            },
                            children: [
                                {
                                    label: "SLO1",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO2",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result 1",
                                                    data: {
                                                        info: ""
                                                    }
                                                },
                                                {
                                                    label: "Result 2",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result 1",
                                                    data: {
                                                        info: ""
                                                    }
                                                },
                                                {
                                                    label: "Result 2",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: "SLO3",
                                    data: {
                                        info: ""
                                    },
                                    children: [
                                        {
                                            label: "Process 1",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Process 2",
                                            data: {
                                                info: ""
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: ""
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    var mainController = function($scope, genService, $sce, $location){
        var tree = $scope.my_tree = {};
        $scope.tree_handler = function(branch){
            console.log(branch.label)
            $scope.selected = branch.label;
        }
        $scope.message = $sce.trustAsHtml($scope.message);
        $scope.treedata_avm = genService.report;
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
        var routingConfig = function($routeProvider){
            $routeProvider
            .when("/", {
                templateUrl: ""
            })
            .when("/bad", {
                template: "Trying to access bad link"
            })
        };
         $scope.goto = function(){
            $location.path("")
         }
    }

    var loginController = function ($scope) {
        $scope.departments = ['Computer Science', 'Economics'];
    }

    angular.module("assessment")
        .controller("mainController", mainController)
        .controller("loginController", loginController)
        .service("genService", genService)
        .config(['ngQuillConfigProvider', function(ngQuillConfigProvider){
            ngQuillConfigProvider.set(null, null, 'custom placeholder')
        }])
        .config(["$routeProvider", routingConfig])
})();