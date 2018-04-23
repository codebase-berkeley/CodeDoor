function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


function displayReviewForm() {
    console.log("displaying review form")
    var x = document.getElementById("hidden_review");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


document.getElementById("submit_button_review").addEventListener("click", function(e) {
  var error_exists = validate_review();
  var reviewtitle = document.getElementById("title1").value;
  var pk = document.getElementById("reviewcompany").value;
  var rating = document.getElementById("rating").value;
  var recommend = document.getElementsByName("recommend");
  var review = document.getElementById("review").value;

  if(recommend[0].checked) {
    recommend = "True";
  }
  else if(recommend[1].checked) {
    recommend = "False";
  }
  // document.getElementById("question").value = "";
  // document.getElementById("applicant_answer").value = "";
  // document.getElementById("company_answer").value = "";

  var formData = new FormData();

  formData.append("reviewtitle", reviewtitle);
  formData.append("pk", pk);
  formData.append("rating", rating);
  formData.append("recommend", recommend);
  formData.append("review", review);


  var headers = new Headers();
  var csrftoken = getCookie("csrftoken")  
  headers.append('X-CSRFToken', csrftoken);

  console.log(error_exists);
  if(!error_exists) {
  document.getElementById("title1").value = "";
  document.getElementById("rating").value = "";
  document.getElementsByName("recommend")[0].checked = false;
  document.getElementsByName("recommend")[1].checked = false;
  document.getElementById("review").value = "";
    displayReviewForm();
  fetch("/codedoor/createdreview", {
    method: "POST",
    body: formData,
    headers: headers,
    credentials: "include"
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    if (json.success) {
        document.getElementById("reviews").innerHTML =

      "<table> <tr>" +
      " {% if " + 
      json.companylogo +
      " %} <td rowspan='3' width='7%'> <img src='" + 
      json.companylogo + 
      "' width='100' height='100'> </td> {% else %} <td rowspan='3' width='7%'> <img src='/static/images/temp.png' width='100' height='100'> </td> {% endif %}" +
      " <td width='93%'> <a href='{% url 'codedoor:viewcompany' pk=" +
      json.companypk + " %}'> <h2 class='link-text'>  " +
      json.companyname + 
      " </h2></a> <span class='applicant-name'>  " +
      json.reviewername + " </span> </td> </tr> <tr> <td> {% if "
      json.companylogo + 
      "!= null %} <a class='button' id='reviewtitle' href='{% url 'codedoor:viewreview' pk=" +
      review.pk +
      " %}'> " +
      json.title +
      " </a> {% else %} <p></p> {% endif %} </td> </tr> <tr> <td> <p><span class='info colorful-boxy'> {% if " +
      json.recommend + 
      " %} <span> <svg width='15' height='15'> <rect x='0' y='0' rx='3' ry='3' width='15' height='15' style='fill:#01959b' /> </svg> Recommends </span> {% else %} <span> <svg width='15' height='15'> <rect x='0' y='0' rx='3' ry='3' width='15' height='15' style='fill:#ff4d4d' /> </svg> Doesn't Recommend </span> {% endif %} </span> <span class='info colorful-boxy'> {% if " + 
      json.rating + 
      " < 1 %} <span> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> </span> {% elif " +
      json.rating +
      " < 2 %} <span> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> </span> {% elif " +
      json.rating + 
      " < 3 %} <span> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> </span> {% elif " +
      json.rating +
      " < 4 %} <span> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> </span> {% elif " +
      json.rating +
      " < 5 %} <span> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/whitestar.png' height='20' width='20'> </span> {% else %} <span> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> <img src='/static/images/blackstar.png' height='20' width='20'> </span> {% endif %} </span></p> </td> </tr> <tr> <td></td> <td> <div> <h4>Description:</h4> <p class='description_small_text'>" +
      json.review +
      "</p> </div> </td> </tr> </table> <br>"+     
        document.getElementById("reviews").innerHTML;
        console.log("we made it");
    }
  })
}
});

function validate_review() {
  var error_exists = false;

    var title = document.getElementById('title1').value;
    var rating = document.getElementById('rating').value;
    var yes = document.getElementById('yes').checked;
    var no = document.getElementById('no').checked;
    var review = document.getElementById('review').value;

    var title_error = document.getElementById('title-error');
    var rating_error = document.getElementById('rating-error');
    var review_error = document.getElementById('review-error');
    var recommend_error = document.getElementById('recommend-error');
    var display_error = document.getElementById('display-error');
    display_error.innerHTML = '';

    if (!title || title.trim().length == 0 || title === 'None') {
      error_exists = true;
      display_error.innerHTML += 'You must provide a title <br>';
      title_error.innerHTML = 'You must provide a title';
      event.preventDefault();
    } else {
      title_error.innerHTML = '';
    }
    if (!rating || rating > 5 || rating < 0) {
      error_exists = true;
      display_error.innerHTML += 'You must provide a valid rating<br>';
      rating_error.innerHTML = 'You must provide a valid rating';
      event.preventDefault();
    } else {
      rating_error.innerHTML = '';
    }
    if (!review || review.trim().length == 0 || review === 'None') {
      error_exists = true;
      display_error.innerHTML += 'You must provide a review <br>';
      review_error.innerHTML = 'You must provide a review';
      event.preventDefault();
    } else {
      review_error.innerHTML = '';
    }
    if (!yes && !no) {
      error_exists = true;
      display_error.innerHTML += 'You must provide a recommendation <br>';
      recommend_error.innerHTML = 'You must provide a recommendation';
      event.preventDefault();
    } else {
      recommend_error.innerHTML = '';
    }
    return error_exists;
}