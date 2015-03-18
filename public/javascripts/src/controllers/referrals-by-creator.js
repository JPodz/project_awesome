//Referrals By Creator Controller
app.controller('ReferralsByCreatorController', ["$scope", "$http", "ngTableParams", "$filter", function ($scope, $http, ngTableParams, $filter){
	$scope.referrals = [];
	$scope.recentRefTypes = [{'title': 'No Filter', 'id': ''}];
	$scope.arr=[];

	//Helper function
	var inArray = Array.prototype.indexOf ?
		function (val, arr) {
			return arr.indexOf(val)
		} :
		function (val, arr) {
			var i = arr.length;
			while (i--) {
				if (arr[i] === val) return i;
			}
			return -1;
		};

	this.init = function () {
		//Setup ng-table
		$scope.refByCreator = new ngTableParams({
			page: 1,            // show first page
			count: 10,
			sorting: {
				lastEditedDate: 'desc'
			}
		}, {
			counts: [10, 15, 25, 50],
			getData: function($defer, params) {
				$http({"method": "GET", "url": "/json/referrals/creator/" + app.data.currentUserId}).success(function (data){
					//Filter
					var filteredData = params.filter() ?
						$filter('filter')(data.data, params.filter()) :
						data.data;
					//Then sort
					var orderedData = params.sorting() ?
						$filter('orderBy')(filteredData, params.orderBy()) :
						filteredData;

					//Pass out total to larger scope
					$scope.total = orderedData.length;
					params.total(orderedData.length);

					//Create scope for RefType filter
					angular.forEach(orderedData, function(item){
						if (inArray(item.refType, $scope.arr) === -1) {
							$scope.arr.push(item.refType);
							$scope.recentRefTypes.push({
								'id': item.refType,
								'title': item.refType
							});
						}
					});

					//Resolve data gathering
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				});
			}
		});
	};

	$scope.deleteReferral = function (refId) {
		$http({"method": "DELETE", "url": "/json/referral/" + refId}).success(function (data){
			for(var y = 0; y < $scope.refByCreator.data.length; y++) {
				if($scope.refByCreator.data[y].id === refId) {
					$scope.refByCreator.data.splice(y, 1);
				}
			}
		});
	}
}]);