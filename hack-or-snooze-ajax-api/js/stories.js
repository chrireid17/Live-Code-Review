"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showHeart = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteButton ? makeDeleteButton() : ""}
      ${showHeart ? makeHeart(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function makeDeleteButton() {
  return `
  <span class="delete-button">
    <i class="fas fa-backspace"></i>
  </span>`;
}

function makeHeart(story, user) {
  const isFavorite = user.isFavorite(story);
  const heartState = isFavorite ? 'fas' : 'far';
  return `
  <span class="heart">
    <i class="${heartState} fa-heart"></i>
  </span>`;
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function sumbitNewStoryForm(e) {
  e.preventDefault();

  const title = $('#title').val();
  const author = $('#author').val();
  const url = $('#url').val();
  const data = { title, author, url };

  const story = await storyList.addStory(currentUser, data);

  const storyHTML = generateStoryMarkup(story);
  $allStoriesList.prepend(storyHTML);

  $newStoryForm.hide();
  putStoriesOnPage();
}

$('#new-story').on('submit', sumbitNewStoryForm);

async function deleteStory(e) {

  const $story = $(e.target).closest('li');
  const storyId = $story.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await showUserStories();
}

$ownStories.on('click', '.delete-button', deleteStory);

function showUserStories() {
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append('<h5>You have not added any stories</h5>');
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

function showFavList() {
  $favStories.empty();

  if (currentUser.favorites.length === 0) {
    $favStories.append('<h5>You have not added any favorite stories</h5>')
  } else {
    for (let story of currentUser.favorites) {
      let $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }
  $favStories.show();
}

async function toggleFav(e) {
  const $targ = $(e.target);
  const $targLi = $targ.closest('li');
  const storyId = $targLi.attr('id');
  const story = storyList.stories.find(story => story.storyId === storyId);

  if ($targ.hasClass('fas')) {
    await currentUser.removeFav(story);
    $targ.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFav(story);
    $targ.closest('i').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.heart', toggleFav);
