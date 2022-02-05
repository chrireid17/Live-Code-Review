"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navNewStory(evt) {
  console.debug('navNewStory', evt);
  hidePageComponents();
  $newStoryForm.show();
}

$('#nav-new-story').on('click', navNewStory);

function navFavStories() {
  hidePageComponents();
  showFavList();
}

$('#nav-favs').on('click', navFavStories)

function navOwnStories() {
  hidePageComponents();
  showUserStories();
}

$('#nav-user-stories').on('click', navOwnStories)


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $('#nav-new-story').show();
  $('#nav-user-stories').show();
  $('#nav-favs').show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
