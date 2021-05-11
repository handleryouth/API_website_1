//jshint esversion:6

const hamburgerIcon = document.querySelector('.hamburger-icon');
const crossIcon = document.querySelector('.cross-icon');
const additionalMenu = document.querySelector('.additional-menu');

hamburgerIcon.addEventListener('click', function(){
  additionalMenu.classList.remove("notshowed");
  hamburgerIcon.classList.add("notshowed");
  crossIcon.classList.remove("notshowed");
});

crossIcon.addEventListener('click', function(){
  additionalMenu.classList.add("notshowed");
  hamburgerIcon.classList.remove("notshowed");
  crossIcon.classList.add("notshowed");
});
