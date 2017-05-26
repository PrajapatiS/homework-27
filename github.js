
const app = angular.module('GitHubApp', []);

app.component('user', {
    templateUrl: 'templates/user.html',
    controller: 'GitHubUserController',

});



app.controller('GitHubUserController', function ($scope, UserService) {
    $scope.user_name = '';
    $scope.users = UserService.getUsers();
    //$scope.events = UserService.getEvents();

    $scope.add = function () {
        UserService.addUser($scope.user_name);
        //UserService.getEvents($scope.user_name);
        $scope.user_name = '';
    };
});

// app.controller('UserDetailsController', function($scope, UserService){
//     $scope.user={
//         user_name:'necolus',
//     }
// });

app.factory('UserService', function ($http) {
    const users = [];
    const events = [];

    return {

        addUser(u_name) {
            const user = {
                user_name: u_name,
                pic: null,
                monthly: 0,
                weekly: 0,
            };
            users.push(user);

            $http.get('https://api.github.com/users/' + u_name).then(function (response) {
                console.log(response.data);
                user.pic = response.data.avatar_url;
            });

            $http.get('https://api.github.com/users/' + u_name + '/events').then(function (response) {
                console.log('events');
                //console.log(response.data);
                let x = new Date();
                let y = x.getMonth();
                let z = x.getDate();
                let high=false;
                // let count = 0;
                //let y = new Date('2017-05-30');
                for (let i = 0; i < response.data.length; i++) {
                    
                    if (new Date(response.data[i].created_at).getDate() >= z - 7) {
                        user.weekly= user.weekly +1;
                        
                     }
                   //console.log(response.data[i].created_at);
                    if (new Date(response.data[i].created_at).getMonth() >= y - 1) {
                        
                        user.monthly = user.monthly + 1;
                        if(user.monthly>=30){
                            high =true;

                        }
                        //&& new Date(response.data[i].created_at)<= y){
                        console.log(response.data[i].created_at);
                    }
                    
                }
                console.log('helloweek' +user.weekly);
                console.log('helloweek' +user.monthly);
                 console.log(high);
              
            });

        },

        getUsers() {
            return users;
        },
    }
});