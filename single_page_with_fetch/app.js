/*
 * CSCI2720 Building Web Applications
 *
 * --- Declaration ---
 *
 * I declare that the assignment here submitted is original except
 * for source material explicitly acknowledged. I also acknowledge
 * that I am aware of University policy and regulations on honesty
 * in academic work, and of the disciplinary guidelines and procedures
 * applicable to breaches of such policy and regulations, as contained
 * in the website: https//www.cuhk.edu.hk/policy/academichonesty/
 *
 * Assignment 1
 * Name        : CHOI, Ka Hou
 * Student ID  : 1155135747
 * Email Addr  : 1155135747@link.cuhk.edu.hk
 */

const header = document.querySelector(".header-container");
const card = document.querySelector(".card-body");
const align_button = document.querySelector("#align-button");
const new_hobby_button = document.querySelector("#new-hobby-button");
const comments_ol = document.querySelector("#comments-ol");
const form_section = document.querySelector("#form-section");
const comment_button = document.querySelector("#comment-submit-button");

var aligns = ["left", "center", "right"];
var align_clicks = 0;
var former_id = 1000;
var loaded_comments = "";

window.addEventListener("load", async () => {
  await load_comments();
  console.log(loaded_comments.length);
  comments_ol.innerHTML = loaded_comments;
});

document.addEventListener("scroll", () => {
  var scroll_position = window.scrollY;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (scroll_position / height) * 100;
  document.querySelector("#scrollProgressBar").style.width = scrolled + "%";

  if (scroll_position > 200) {
    header.style.backgroundColor = "#29323c";
  } else {
    header.style.backgroundColor = "transparent";
  }
});

align_button.addEventListener("click", () => {
  align_clicks = align_clicks % 3;
  align_clicks += 1;
  document.querySelectorAll(".align-able").forEach((el) => {
    el.style.textAlign = aligns[align_clicks % 3];
  });
});

new_hobby_button.addEventListener("click", () => {
  var new_hobby = prompt("Please enter the new hobby you want to add");
  if (new_hobby.trim() !== "") {
    var ul = document.querySelector("#hobby-ul");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(new_hobby));
    ul.appendChild(li);
    ul.lastChild.classList.add("translate");
    setTimeout(() => {
      ul.lastChild.classList.remove("translate");
    }, 1000);
  }
});

comment_button.addEventListener("click", async () => {
  const new_email = document.querySelector("#new-email");
  const new_comment = document.querySelector("#new-comment");
  const new_color = document.querySelector(
    'input[name="new-color"]:checked'
  ).value;

  var email = new_email.value;
  var comment = new_comment.value;

  if (email.trim() === "" || !email.trim().match(/^\S+@\S+$/g)) {
    new_email.classList.add("is-invalid");
    return;
  } else {
    new_email.classList.remove("is-invalid");
  }

  if (comment.trim() === "") {
    new_comment.classList.add("is-invalid");
    return;
  } else {
    new_comment.classList.remove("is-invalid");
  }

  former_id += 1;

  const comment_template = `
    <div id="c${former_id}">
      <div class="d-flex">
        <svg height="50" width="50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="${new_color}"
          ></circle>
        </svg>
        <h5>${email}</h5>
      </div>
      <div>
        <div class="comments-text">
          <p>
          ${comment}
          </p>
        </div>
      </div>
      <hr class="rounded"/>
    </div>`;

  comments_ol.innerHTML += comment_template;

  save_comments();

  comments_ol.lastChild.classList.add("translate");

  document.querySelector("form").reset();

  setTimeout(() => {
    comments_ol.lastChild.classList.remove("translate");
  }, 2000);
});

async function load_comments() {
  await fetch("./data/comments.dat")
    .then((res) => res.text())
    .then((txt) => {
      loaded_comments = txt;
      former_id += (loaded_comments.match(/<hr class="rounded">/g) || [])
        .length;
    });
}

function save_comments() {
  fetch("./data/comments.dat", {
    method: "PUT",
    body: comments_ol.innerHTML + "\n",
  });
}
