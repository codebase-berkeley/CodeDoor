function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function displayCompanyForm() {
    var x = document.getElementById("company_form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

document.getElementById("submit").addEventListener("click", function(e) {
	
  var errors_exist = validate();
	var logo = document.getElementById("logo1").files[0];
	var name = document.getElementById("name").value;
	var industry = document.getElementById("industry").value;
	var website = document.getElementById("website").value;
	var types = document.getElementsByClassName("type");

	var type;
	for(var i = 0; i < types.length; i++) {
		if (types[i].type === 'radio' && types[i].checked) {
        	// get value, set checked flag or do whatever you need to
        	type = types[i].value; 
        }      
    }

	var formData = new FormData();

	formData.append("logo", logo);
	formData.append("name", name);
	formData.append("industry", industry);
	formData.append("website", website);
	formData.append("structure", type);

	var headers = new Headers();
	var csrftoken = getCookie("csrftoken")  
	headers.append('X-CSRFToken', csrftoken);
  if(!errors_exist) {
    displayCompanyForm();
    document.getElementById("logo1").value = null;
    document.getElementById("name").value = "";
    document.getElementById("industry").value = "";
    document.getElementById("website").value = "";
    fetch("/codedoor/createcompany", {
      method: "POST",
      body: formData,
      headers: headers,
      credentials: "include"
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      if (json.success) {
          console.log("success in creating a company");
      }
    })
  }
});

  function validate() {
    var name = document.getElementById('name').value;
    var industry = document.getElementById('industry').value;
    var website = document.getElementById('website').value;
    var startup = document.getElementById('startup').checked;
    var boutique = document.getElementById('boutique').checked;
    var small = document.getElementById('small').checked;
    var medium = document.getElementById('medium').checked;
    var large = document.getElementById('large').checked;

    var name_error = document.getElementById('name-error');
    var industry_error = document.getElementById('industry-error');
    var website_error = document.getElementById('website-error');
    var type_error = document.getElementById('type-error');
    var display_error = document.getElementById('display-error');
    display_error.innerHTML = '';

    var errors_exist = false;

    if (!name || name === 'None' || name.trim().length == 0) {
      errors_exist = true;
      console.log("erroring 1");
      display_error.innerHTML += 'You must provide a company name <br>';
      name_error.innerHTML = 'You must provide a company name';
    } else {
      name_error.innerHTML = '';
    }
    if (!industry || industry === 'None' || industry.trim().length == 0) {
      errors_exist = true;
      console.log("erroring 2");
      display_error.innerHTML += 'You must provide an industry name <br>';
      industry_error.innerHTML = 'You must provide an industry name';
    } else {
      industry_error.innerHTML = '';
    }
    if (!website) {
      errors_exist = true;
      console.log("erroring 3");
      display_error.innerHTML += 'You must provide a company website <br>';
      website_error.innerHTML = 'You must provide a company website';
    } else {
      website_error.innerHTML = '';
    }
    if (!startup && !boutique && !small && !medium && !large) {
      errors_exist = true;
    	console.log("erroring 4");
      display_error.innerHTML += 'You must provide a company type <br>';
      type_error.innerHTML = 'You must provide a company type';
    } else {
      type_error.innerHTML = '';
    }
    return errors_exist;
  // });
  }