//Fresh Referral Controller
app.controller('UpcomingApptsController', ["$scope", "$http", "ngTableParams", "$filter", function ($scope, $http, ngTableParams, $filter){
	$scope.referrals = [];
	
	this.init = function () {
		$scope.upcomingApptsTable = new ngTableParams({
			page: 1,            // show first page
			count: 10,
			sorting: {
				nextStepDate: 'asc'
			}
		}, {
			getData: function($defer, params) {
				$http({"method": "GET", "url": "/json/appts/upcoming/" + app.data.currentUserId}).success(function (data){
					//Filter
					var filteredData = params.filter() ?
						$filter('filter')(data.data, params.filter()) :
						data.data;
					//Then sort
					var orderedData = params.sorting() ?
						$filter('orderBy')(filteredData, params.orderBy()) :
						filteredData;

					//Pass out total to larger scope
					$scope.upcomingApptsTotal = orderedData.length;
					params.total(orderedData.length);

					//Resolve data gathering
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			}
		});

	};

	$scope.deleteReferral = function (refId) {
		$http({"method": "DELETE", "url": "/json/referral/" + refId}).success(function (data){
			for(var y = 0; y < $scope.upcomingApptsTable.data.length; y++) {
				if($scope.upcomingApptsTable.data[y].id === refId) {
					$scope.upcomingApptsTable.data.splice(y, 1);
				}
			}
		});
	}
}]);