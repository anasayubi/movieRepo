angular.module('app')
.controller('editMovieCtrl', ['$scope', '$http', '$state', '$timeout', 'storeService', 'urlService',
function($scope, $http, $state, $timeout, storeService, urlService){
  // reroute back to view if no edit ID is stored
  // true if 'getEditId' returns empty string (no edit ID set)
  if(!storeService.getEditId()){
    $state.go('viewMovies');
    return;
  }

  var self = this;
  // indicates whether the form has been submitted or not
  self.submitted = false;
  // reveals success message
  self.success = false;
  // reveals save server error
  self.saveServerError = false;
  // reveals retrieve server error
  self.retrieveServerError = false;
  
  // retrieve all fields to be edited:
  // compose URL 
  var requestURL = urlService.backendUrl('/api/movie/' + storeService.getEditId()); 
  $http.get(requestURL).then(
    function success(resp){
      self.title = resp.data.title,
      // convert date representation to year
      self.releaseYear = (new Date(resp.data.releaseYear)).getFullYear(),
      self.rating = resp.data.rating
    }, 
    function err(resp){
      self.retrieveServerError = true;
      // remove server error message after 3s
      $timeout(function(){
        self.saveServerErroror = false;
      }, 3000);
    });

  // Checkers:
  //   Remove validation messages
  self.checkTitle = function(){
    // Only remove validation checks when at least submitted once
    if(self.submitted){
      if(!self.addMovieForm.title.$error.required){
        self.titleRequiredError = false;
      }
    }
  }

  self.checkReleaseYear = function(){
    // Only remove validation checks when at least submitted once
    if(self.submitted){
      if(!self.addMovieForm.releaseYear.$error.number){
        self.releaseYearNumberError = false;
      }
      if(!self.addMovieForm.releaseYear.$error.min){
        self.releaseYearMinError = false;
      }
      if(!self.addMovieForm.releaseYear.$error.max){
        self.releaseYearMaxError = false;
      }
      if(!self.addMovieForm.releaseYear.$error.step){
        self.releaseYearStepError = false;
      }
      if(!self.addMovieForm.releaseYear.$error.number && !self.addMovieForm.releaseYear.$error.min 
      && !self.addMovieForm.releaseYear.$error.max && !self.addMovieForm.releaseYear.$error.step){
        self.releaseYearError = false;
      }
    }
  }

  self.checkRating =  function(){
    // Only remove validation checks when at least submitted once
    if(self.submitted){
      if(!self.addMovieForm.rating.$error.number){
        self.ratingNumberError = false;
      }
      if(!self.addMovieForm.rating.$error.min){
        self.ratingMinError = false;
      }
      if(!self.addMovieForm.rating.$error.max){
        self.ratingMaxError = false;
      }
      if(!self.addMovieForm.rating.$error.step){
        self.ratingStepError = false;
      }
      if(!self.addMovieForm.rating.$error.number && !self.addMovieForm.rating.$error.min 
      && !self.addMovieForm.rating.$error.max && !self.addMovieForm.rating.$error.step){
        self.ratingError = false;
      }
    }
  }

  self.submit = function(){
    // form has been submitted hence true 
    self.submitted = true;
    // remove success message
    self.success = false;
    // remove server error message
    self.saveServerError = false;

    // refresh all errors before setting them
    self.titleRequiredError = false;
    self.releaseYearNumberError = false;
    self.releaseYearMinError = false;
    self.releaseYearMaxError = false;
    self.releaseYearStepError = false;
    self.releaseYearStepError = false;
    self.ratingMinError = false;
    self.ratingMaxError = false;
    self.ratingStepError = false;

    // ERRORS
    // title:
    if(self.addMovieForm.title.$error.required){
      self.titleRequiredError = true;
    }
    // releaseYear:
    if(self.addMovieForm.releaseYear.$error.number){
      self.releaseYearNumberError = true;
      self.releaseYearError = true;
    }
    if(self.addMovieForm.releaseYear.$error.min){
      self.releaseYearMinError = true;
      self.releaseYearError = true;
    }
    if(self.addMovieForm.releaseYear.$error.max){
      self.releaseYearMaxError = true;
      self.releaseYearError = true;
    }
    if(self.addMovieForm.releaseYear.$error.step){
      self.releaseYearStepError = true;
      self.releaseYearError = true;
    }
    // rating:
    if(self.addMovieForm.rating.$error.number){
      self.ratingNumberError = true;
      self.ratingError = true;
    }
    if(self.addMovieForm.rating.$error.min){
      self.ratingMinError = true;
      self.ratingError = true;
    }
    if(self.addMovieForm.rating.$error.max){
      self.ratingMaxError = true;
      self.ratingError = true;
    }
    if(self.addMovieForm.rating.$error.step){
      self.ratingStepError = true;
      self.ratingError = true;
    }

    // If no errors are present
    if(!self.ratingError && !self.releaseYearError && !self.titleRequiredError){
      // create backend URL with path
      var requestURL = urlService.backendUrl('/api/editMovie');

      var data = {
        id: storeService.getEditId(),
        title: self.title,
        // if 'self.releaseYear' is a valid number then convert number to string
        //  otherwise insert an empty string
        releaseYear: (self.releaseYear) ? String(self.releaseYear) : '',
        rating: self.rating 
      };

      $http.post(requestURL, data).then(function success(resp){
        // console.log('resp: ', resp);
        // show success message
        self.success = true;
        // remove success message after 3s
        $timeout(function(){
          self.success = false;
        }, 3000);
        self.title = '';
        self.releaseYear = '';
        self.rating = '';
        $state.go('viewMovies');
      }, function err(resp){
        // console.log('err: ', resp);
        self.saveServerError = true;
        // remove server error message after 3s
        $timeout(function(){
          self.saveServerErroror = false;
        }, 3000);
      })
    }
  }
}]);