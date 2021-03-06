//Referral controller
app.controller('ReferralController', [
    "$scope",
    "$http",
    '$location',
    "referralService",
    function ($scope, $http, $location, referralService) {
        //Reference to original controller scope
        var that = this;

        /**
         * Private helper method for getting todays date in the correct format, yyyy-mm-dd
         */
        this.getTodaysDate = function() {
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            if(month.toString().length < 2) {
                month = "0" + month;
            }

            var day = today.getDate();
            if(day.toString().length < 2) {
                day = "0" + day;
            }

            return year + "-" + month + "-" + day
        };

        //Scope preperation
        $scope.referral = {};
        $scope.referral.client = {};
        $scope.referral.client.goals = {};
        $scope.refStatus = [
            {
                "status": "OPEN"
            },
            {
                status: "PROCESSING"
            },
            {
                status: "CLOSED"
            },
            {
                status: "CANCELLED"
            }
        ];

        $scope.referral.nextStepDate = this.getTodaysDate();

        $scope.referClientActive = true;

        //Adds existing client to referral in scope
        $scope.addClientToReferral = function (client) {
            $scope.referral.updateExistingClientFlag = true;
            $scope.referral.client = client;
            if (!$scope.referClientActive || $scope.referClientActive === true) {
                $scope.referClientActive = false;
            }
            $scope.referClientActive = true;
        };

        $scope.tabSelected = function (type) {
            $scope.referClientActive = (type !== 'search');
        };

        //Handles add view form submission
        $scope.addReferralFormSubmission = function (referral) {
            //Referral data adjustments based on views
            //Defaults add next step date date box to today
            referral.lastEditedDate = that.getTodaysDate();
            //Append time to nextStepDate
            referral.nextStepDate += " " + referral.nextStepTime;

            referralService.post(referral, function () {
                window.location = "/home";
            });
        };

        //Prepares the edit referral form view
        $scope.prepareEditReferralForm = function (refId) {
            referralService.get(refId, function (referral) {
                //Set edit view flag for service to use
                referral.updateExistingClientFlag = true;

                //View related business logic preparing the edit view
                $scope.referral = referral;
                $scope.referral.lastEditedDate = that.getTodaysDate();
                //Parse nextStepDate for the datepicker
                referral.date = referral.nextStepDate.split(" ")[0];
                referral.time = referral.nextStepDate.split(" ")[1];

                // If there's a provided "nextsteps" parameter in the URL, use that
                // as an override.
                if ($location.search()['nextsteps']) {
                    var nextSteps = moment(parseInt($location.search()['nextsteps']));
                    referral.date = nextSteps.format('YYYY-MM-DD');
                    referral.time = nextSteps.format("hh:mm A");
                }

                if (referral.apptKept === true) {
                    referral.apptKept = "true";
                } else if (referral.apptKept === false) {
                    referral.apptKept = "false";
                } else {
                    referral.apptKept = "";
                }

                //Set default status to OPEN
                for(var x = 0; x < $scope.refStatus.length; x++) {
                    if($scope.referral.status == $scope.refStatus[x].status) {
                        $scope.referral.status = $scope.refStatus[x];
                    }
                }
            });
        };

        //Handles view related edit referral view form submission
        $scope.editReferralFormSubmission = function (referral) {
            //Append time to date to remake nextStepDate
            referral.nextStepDate = referral.date + " " + referral.time;
            referralService.put(referral, function () {
                window.location.href = "/home";
            })
        };

        //Prepare scope for edit view if the url param refId is present in the url
        // FIXME - Use routing instead of regexp matching for the URL parameter...
        if(window.location.href.match(/\/editReferral\/\d+/)){
            var param = window.location.href.match(/\/editReferral\/\d+/)[0];
            param = param.slice(param.indexOf("Referral/") + 9);
            //Prepares edit form view related business logic
            $scope.prepareEditReferralForm(param);
        }
    }
]);